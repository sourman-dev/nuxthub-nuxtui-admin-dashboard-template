export type ChatMessage = {
	role: 'system' | 'user' | 'assistant' | 'tool' | 'function';
	content: string;
	name?: string;
	reasoning_content?: string;
};

export type ChatCompletionParams = {
	model: string;
	messages: ChatMessage[];
	stream?: boolean;
	temperature?: number;
	top_p?: number;
	presence_penalty?: number;
	frequency_penalty?: number;
	max_tokens?: number;
	stop?: string | string[];
	response_format?: { type: 'text' | 'json_object' };
	[key: string]: unknown;
};

export type ChatCompletionResponse = {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: { role: 'assistant'; content: string; reasoning_content?: string };
		finish_reason: string | null;
	}>;
	usage?: unknown;
};

type LlmProvider = {
	name: string;
	apiKey: string | undefined;
	baseUrl: string;
	headers: Record<string, string | undefined>;
	defaultModelId: string;
};

export type AiModelMessage = {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string;
	name?: string;
};

export type AiModelRequestOptions = {
	model: string;
	messages: AiModelMessage[];
	temperature?: number;
	maxTokens?: number;
	[key: string]: unknown;
};

export type AiModelRequestOptionsWithSignal = AiModelRequestOptions & {
	signal?: AbortSignal;
	cancellationKey?: string;
};

export type AiServiceResponse = {
	role: 'assistant';
	content: string;
	reasoning_content?: string;
	timestamp: string;
};

export type AiStreamingChunk = {
	current_message: AiServiceResponse;
	is_finished: boolean;
	error?: string;
};