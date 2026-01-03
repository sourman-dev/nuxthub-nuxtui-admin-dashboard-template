import { z } from 'zod';
import { getAiService } from '~~/server/utils/ai-service-singleton';
import type { AiModelRequestOptions } from '#shared/types/llm';

// Zod schema - messages required, other fields optional
const ChatMessageSchema = z.object({
	role: z.enum(['system', 'user', 'assistant', 'tool']),
	content: z.string(),
	name: z.string().optional(),
});

const QueueChatParamsSchema = z.object({
	messages: z.array(ChatMessageSchema).min(1, 'At least one message is required'),
	stream: z.boolean().optional().default(false),
	model: z.string().optional(),
	temperature: z.number().min(0).max(2).optional(),
	maxTokens: z.number().int().positive().optional(),
	cancellationKey: z.string().optional(), // For request deduplication/cancellation
}).passthrough();

export default defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, QueueChatParamsSchema.parse);
	const runtimeConfig = useRuntimeConfig(event);
	const { model: defaultModel } = runtimeConfig.llm.text;

	const effectiveModel = body.model || defaultModel;
	const aiService = getAiService();

	const options: AiModelRequestOptions & { cancellationKey?: string } = {
		model: effectiveModel,
		messages: body.messages,
		temperature: body.temperature,
		maxTokens: body.maxTokens,
		cancellationKey: body.cancellationKey,
	};

	if (body.stream) {
		// SSE streaming with queue
		setResponseHeaders(event, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
		});

		const node = event.node;
		const abortController = new AbortController();

		node.req.on('close', () => {
			abortController.abort();
		});

		try {
			await aiService.streamToResponse(node.res, { ...options, signal: abortController.signal } as any);
		} catch (err: any) {
			if (!node.res.writableEnded) {
				node.res.write(`: error ${err?.message || 'Stream error'}\n\n`);
				node.res.end();
			}
		}
		return;
	}

	// Non-streaming with queue
	try {
		const result = await aiService.callModel(options);
		return result;
	} catch (err: any) {
		throw createError({
			statusCode: 500,
			message: err?.message || 'Queue request failed',
		});
	}
});
