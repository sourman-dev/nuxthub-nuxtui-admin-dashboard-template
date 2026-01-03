import { z } from "zod";
import { LlmClient } from "~~/server/utils/llm";
import type { ChatCompletionParams } from "#shared/types/llm";

// Zod schema - only messages required, model uses runtimeConfig default
const ChatMessageSchema = z.object({
	role: z.enum(['system', 'user', 'assistant', 'tool', 'function']),
	content: z.string(),
	name: z.string().optional(),
	reasoning_content: z.string().optional(),
});

const ChatCompletionParamsSchema = z.object({
	messages: z.array(ChatMessageSchema).min(1, "At least one message is required"),
	stream: z.boolean().optional().default(false),
	model: z.string().optional(), // Optional - uses runtimeConfig.llm.text.model if not provided
	temperature: z.number().min(0).max(2).optional(),
	top_p: z.number().min(0).max(1).optional(),
	presence_penalty: z.number().min(-2).max(2).optional(),
	frequency_penalty: z.number().min(-2).max(2).optional(),
	max_tokens: z.number().int().positive().optional(),
	stop: z.union([z.string(), z.array(z.string())]).optional(),
	response_format: z.object({
		type: z.enum(['text', 'json_object']),
	}).optional(),
}).passthrough();

// Helper to write SSE data and handle backpressure
async function writeSSE(event: any, data: string): Promise<void> {
	const node = event.node;
	if (node.res.writableEnded) return;
	
	return new Promise((resolve) => {
		const canContinue = node.res.write(data);
		if (canContinue) {
			resolve();
		} else {
			node.res.once('drain', () => resolve());
		}
	});
}

export default defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, ChatCompletionParamsSchema.parse);
	const runtimeConfig = useRuntimeConfig(event);
	const { provider, model: defaultModel, apiKey, baseUrl } = runtimeConfig.llm.text;
	const query = getQuery(event);
	const reasoningToContent = query?.reasoning_to_content === '1' || query?.reasoning_to_content === 'true';

	// Use body.model if provided, otherwise use default from config
	const effectiveModel = body.model || defaultModel;
	const params: ChatCompletionParams = { ...body, model: effectiveModel };

	// Gemini provider with custom streaming
	if (provider === 'gemini') {
		const { GeminiClient } = await import('~~/server/utils/llm');
		const gemini = new GeminiClient({ apiKey, baseUrl, modelId: effectiveModel });

		if (params.stream) {
			// Set SSE headers
			setResponseHeaders(event, {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
			});

			const abortController = new AbortController();
			const node = event.node;

			// Handle client disconnect
			node.req.on('close', () => {
				abortController.abort();
			});

			try {
				const upstreamRes = await gemini.fetchChatCompletionStream(params, abortController.signal);
				
				if (!upstreamRes.ok || !upstreamRes.body) {
					const text = await upstreamRes.text().catch(() => '');
					setResponseStatus(event, upstreamRes.status);
					await writeSSE(event, `: upstream error ${text}\n\n`);
					node.res.end();
					return;
				}

				const reader = upstreamRes.body.getReader();
				const decoder = new TextDecoder();
				const messageId = `gen-${Date.now()}`;
				const created = Math.floor(Date.now() / 1000);
				let buffer = '';

				// Gemini streaming parser: JSON array chunks with bracket matching
				while (true) {
					const { value, done } = await reader.read();
					if (done) break;
					if (!value) continue;

					const chunk = decoder.decode(value, { stream: true });
					buffer += chunk;

					// Parse JSON objects using bracket matching
					let lastPos = 0;
					for (let i = 0; i < buffer.length; i++) {
						if (buffer[i] === '{') {
							let braceCount = 1;
							for (let j = i + 1; j < buffer.length; j++) {
								if (buffer[j] === '{') {
									braceCount++;
								} else if (buffer[j] === '}') {
									braceCount--;
								}
								if (braceCount === 0) {
									const jsonString = buffer.substring(i, j + 1);
									try {
										const geminiData = JSON.parse(jsonString);
										const candidates = geminiData?.candidates || [];
										
										for (const candidate of candidates) {
											// Extract text and reasoning from parts
											let text = '';
											let candidateReasoning = '';
											const parts = candidate?.content?.parts || [];
											
											for (const part of parts) {
												const partText = typeof part?.text === 'string' ? part.text : '';
												const isThought = (part as any)?.thought === true || 
													(part as any)?.inlineThought === true || 
													(part as any)?.role === 'thought';
												
												if (isThought) {
													candidateReasoning += partText;
												} else {
													text += partText;
												}
											}

											// Aggregate reasoning from multiple sources
											let aggregatedReasoning = '';
											if (typeof (geminiData as any)?.thinking === 'string' && (geminiData as any).thinking) {
												aggregatedReasoning = (geminiData as any).thinking;
											}
											if (candidateReasoning) {
												aggregatedReasoning = candidateReasoning;
											}
											if (!aggregatedReasoning && typeof candidate?.reasoning_content === 'string' && candidate.reasoning_content) {
												aggregatedReasoning = candidate.reasoning_content;
											}

											// Build delta based on reasoning_to_content flag
											const delta: { content?: string; reasoning_content?: string } = {};
											if (reasoningToContent) {
												if (aggregatedReasoning) {
													delta.content = aggregatedReasoning;
												} else if (text) {
													delta.content = text;
												}
											} else {
												if (text) {
													delta.content = text;
												}
												if (aggregatedReasoning) {
													delta.reasoning_content = aggregatedReasoning;
												}
											}

											// Write SSE chunk
											const sseChunk = {
												id: messageId,
												object: 'chat.completion.chunk',
												created,
												model: params.model,
												choices: [{
													index: 0,
													delta,
													finish_reason: candidate?.finishReason ? candidate.finishReason.toLowerCase() : null
												}]
											};
											await writeSSE(event, `data: ${JSON.stringify(sseChunk)}\n\n`);
										}
									} catch (e) {
										// Incomplete JSON, wait for more data
									}
									i = j;
									lastPos = j + 1;
									break;
								}
							}
						}
					}
					if (lastPos > 0) {
						buffer = buffer.slice(lastPos);
					}
				}

				await writeSSE(event, 'data: [DONE]\n\n');
				node.res.end();
			} catch (err: any) {
				try {
					const message = typeof err?.message === 'string' ? err.message : 'Upstream error';
					await writeSSE(event, `: error ${message}\n\n`);
				} catch {}
				node.res.end();
			}
			return;
		} else {
			// Non-streaming Gemini
			try {
				const result = await gemini.createChatCompletion({ ...params, stream: false });
				return result;
			} catch (err: any) {
				const text = typeof err?.message === 'string' ? err.message : 'Upstream error';
				throw createError({ statusCode: 500, message: text });
			}
		}
	}

	// OpenAI-compatible providers (OpenAI, DeepSeek, OpenRouter, etc.)
	const llmClient = new LlmClient({ apiKey, baseUrl, modelId: effectiveModel });

	if (params.stream) {
		// Set SSE headers
		setResponseHeaders(event, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
		});

		const abortController = new AbortController();
		const node = event.node;

		// Handle client disconnect
		node.req.on('close', () => {
			abortController.abort();
		});

		try {
			const upstreamRes = await llmClient.fetchChatCompletionStream(params, abortController.signal);
			
			if (!upstreamRes.ok || !upstreamRes.body) {
				const text = await upstreamRes.text().catch(() => '');
				setResponseStatus(event, upstreamRes.status);
				await writeSSE(event, `: upstream error ${text}\n\n`);
				node.res.end();
				return;
			}

			// Handle reasoning_to_content transformation for DeepSeek
			if (reasoningToContent && provider === 'deepseek') {
				const reader = upstreamRes.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';

				while (true) {
					const { value, done } = await reader.read();
					if (done) break;
					if (!value) continue;

					buffer += decoder.decode(value, { stream: true });
					let eolIndex: number;

					while ((eolIndex = buffer.indexOf('\n')) >= 0) {
						const line = buffer.slice(0, eolIndex).trim();
						buffer = buffer.slice(eolIndex + 1);

						if (!line) {
							await writeSSE(event, '\n');
							continue;
						}

						if (line.startsWith('data:')) {
							const data = line.slice('data:'.length).trim();
							if (data === '[DONE]') {
								await writeSSE(event, 'data: [DONE]\n\n');
								continue;
							}

							try {
								const json = JSON.parse(data);
								const choice = json?.choices?.[0];
								
								// Transform reasoning_content to content
								if (choice?.delta?.reasoning_content && !choice?.delta?.content) {
									choice.delta.content = choice.delta.reasoning_content;
								}
								if (choice?.delta?.reasoning_content) {
									delete choice.delta.reasoning_content;
								}

								await writeSSE(event, `data: ${JSON.stringify(json)}\n\n`);
							} catch {
								await writeSSE(event, `data: ${data}\n\n`);
							}
						} else {
							await writeSSE(event, line + '\n');
						}
					}
				}
			} else {
				// Pass-through streaming for standard OpenAI-compatible providers
				const reader = upstreamRes.body.getReader();
				const decoder = new TextDecoder();

				while (true) {
					const { value, done } = await reader.read();
					if (done) break;
					if (value) {
						await writeSSE(event, decoder.decode(value, { stream: true }));
					}
				}
			}

			node.res.end();
		} catch (err: any) {
			try {
				const message = typeof err?.message === 'string' ? err.message : 'Upstream error';
				await writeSSE(event, `: error ${message}\n\n`);
			} catch {}
			node.res.end();
		}
		return;
	}

	// Non-streaming response
	try {
		const result = await llmClient.createChatCompletion({ ...params, stream: false });
		return result;
	} catch (err: any) {
		const text = typeof err?.message === 'string' ? err.message : 'Upstream error';
		throw createError({ statusCode: 500, message: text });
	}
});