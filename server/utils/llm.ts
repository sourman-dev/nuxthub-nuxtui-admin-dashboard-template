import { AiModelRequestOptions, AiModelRequestOptionsWithSignal, AiServiceResponse, AiStreamingChunk, LlmProvider } from '#shared/types/llm';

type StreamResponse = {
	setHeader: (n: string, v: string) => void;
	write: (c: string) => void;
	end: () => void;
	writableEnded?: boolean;
	headersSent?: boolean;
	on?: (e: string, cb: (...a: any[]) => void) => void;
	off?: (e: string, cb: (...a: any[]) => void) => void;
};

type RequestType = 'call' | 'stream' | 'streamToResponse';

type QueuedAiRequest = {
	id: string;
	options: AiModelRequestOptionsWithSignal;
	type: RequestType;
	streamOptions?: { res?: StreamResponse; onChunk?: (chunk: AiStreamingChunk) => void; signal?: AbortSignal };
	resolve: (value: any) => void;
	reject: (reason?: any) => void;
	queuedAt: Date;
};

type GeminiPart = { text: string };
type GeminiContent = { role: 'user' | 'model'; parts: GeminiPart[] };

export class GeminiClient {
	private apiKey: string;
	private baseUrl: string;
    private modelId: string;

	constructor(options?: { apiKey?: string; baseUrl?: string; modelId?: string }) {
		this.apiKey = options?.apiKey || process.env.GEMINI_API_KEY || '';
		this.baseUrl = (options?.baseUrl || process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
		this.modelId = options?.modelId || process.env.GEMINI_MODEL_ID || '';
		if (!this.apiKey) {
			throw new Error('GEMINI_API_KEY is not set. Provide it via env or constructor.');
		}
	}

	private toGeminiContents(messages: ChatCompletionParams['messages']): GeminiContent[] {
		const contents: GeminiContent[] = [];
		for (const m of messages) {
			let role: 'user' | 'model' = 'user';
			if (m.role === 'assistant') role = 'model';
			const text = m.content || '';
			contents.push({ role, parts: [{ text }] });
		}
		return contents;
	}

	async createChatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse> {
		const isStreamingModel = params.model.includes('-streaming') || params.model.includes(':thinking');
		const baseModel = params.model.replace('-streaming', '').replace(':thinking', '');
		const url = `${this.baseUrl}/models/${encodeURIComponent(baseModel)}:generateContent`;
		
		const generationConfig: Record<string, unknown> = {};
		if (typeof params.temperature === 'number') generationConfig.temperature = params.temperature;
		if (typeof params.top_p === 'number') generationConfig.topP = params.top_p;
		if (typeof params.max_tokens === 'number') generationConfig.maxOutputTokens = params.max_tokens;
		if (typeof params.stop === 'string') generationConfig.stopSequences = [params.stop];
		if (Array.isArray(params.stop)) generationConfig.stopSequences = params.stop;

		const payload: Record<string, unknown> = {
			contents: this.toGeminiContents(params.messages),
		};

		if (params.model.includes(':thinking')) {
			generationConfig.thinkingConfig = {
				includeThoughts: true
			};
		}

		if (Object.keys(generationConfig).length > 0) {
			payload.generationConfig = generationConfig;
		}

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-goog-api-key': this.apiKey,
			},
			body: JSON.stringify(payload),
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Gemini error ${res.status}: ${text}`);
		}
		const data = await res.json() as any;
		const candidates: any[] = Array.isArray(data?.candidates) ? data.candidates : [];
		const created = Math.floor(Date.now() / 1000);
		const choices: ChatCompletionResponse['choices'] = candidates.map((c, idx) => {
			const parts: any[] = c?.content?.parts || [];
			let text = '';
			let reasoningContent = '';
			for (const p of parts) {
				const partText = typeof p?.text === 'string' ? p.text : '';
				const isThought = (p as any)?.thought === true || (p as any)?.inlineThought === true || (p as any)?.role === 'thought';
				if (isThought) {
					reasoningContent += partText;
				} else {
					text += partText;
				}
			}
			if (!reasoningContent && typeof c?.reasoning_content === 'string') {
				reasoningContent = c.reasoning_content as string;
			}
			let finish: string | null = null;
			const fr = c?.finishReason;
			if (typeof fr === 'string') finish = fr.toLowerCase();
			const message: any = { role: 'assistant' as const, content: text };
			if (reasoningContent) message.reasoning_content = reasoningContent;
			return { index: idx, message, finish_reason: finish };
		});
		return {
			id: `gen-${Date.now()}`,
			object: 'chat.completion',
			created,
			model: params.model,
			choices,
		};
	}

	async fetchChatCompletionStream(params: ChatCompletionParams, abortSignal?: AbortSignal) {
		const isStreamingModel = params.model.includes('-streaming') || params.model.includes(':thinking');
		const baseModel = params.model.replace('-streaming', '').replace(':thinking', '');
		// Try different streaming endpoints
		let url = `${this.baseUrl}/models/${encodeURIComponent(baseModel)}:streamGenerateContent`;
		
		// For thinking models, we might need a different endpoint
		if (params.model.includes(':thinking')) {
			url = `${this.baseUrl}/models/${encodeURIComponent(baseModel)}:streamGenerateContent`;
		}
		
		const generationConfig: Record<string, unknown> = {};
		if (typeof params.temperature === 'number') generationConfig.temperature = params.temperature;
		if (typeof params.top_p === 'number') generationConfig.topP = params.top_p;
		if (typeof params.max_tokens === 'number') generationConfig.maxOutputTokens = params.max_tokens;
		if (typeof params.stop === 'string') generationConfig.stopSequences = [params.stop];
		if (Array.isArray(params.stop)) generationConfig.stopSequences = params.stop;

		const payload: Record<string, unknown> = {
			contents: this.toGeminiContents(params.messages),
		};

		if (params.model.includes(':thinking')) {
			generationConfig.thinkingConfig = {
				includeThoughts: true
			};
		}

		if (Object.keys(generationConfig).length > 0) {
			payload.generationConfig = generationConfig;
		}

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-goog-api-key': this.apiKey,
			},
			body: JSON.stringify(payload),
			signal: abortSignal,
		} as RequestInit);
		return res;
	}
}

export class AiService {
	private client: LlmClient;
	private queue: AiRequestQueueService;

	constructor(options?: { apiKey?: string; baseUrl?: string; queue?: { concurrencyLimit?: number; minIntervalMs?: number; peakHoursIntervalMs?: number; offPeakHoursIntervalMs?: number; maxIntervalMs?: number } }) {
		this.client = new LlmClient({ apiKey: options?.apiKey, baseUrl: options?.baseUrl });
		this.queue = new AiRequestQueueService(
			this,
			options?.queue?.concurrencyLimit ?? 1,
			options?.queue?.minIntervalMs ?? 200,
			options?.queue?.peakHoursIntervalMs ?? 2000,
			options?.queue?.offPeakHoursIntervalMs ?? 500,
			options?.queue?.maxIntervalMs ?? 60000
		);
	}

	public async callModel(options: AiModelRequestOptions): Promise<AiServiceResponse> {
		return this.queue.submitRequest('call', options);
	}

	public async streamModel(options: AiModelRequestOptionsWithSignal, onChunk: (chunk: AiStreamingChunk) => void): Promise<AiServiceResponse> {
		return this.queue.submitRequest('stream', options, { onChunk, signal: options.signal });
	}

	public async streamToResponse(res: { setHeader: (n: string, v: string) => void; write: (c: string) => void; end: () => void; writableEnded?: boolean; headersSent?: boolean; on?: (e: string, cb: (...a: any[]) => void) => void; off?: (e: string, cb: (...a: any[]) => void) => void }, options: AiModelRequestOptions): Promise<void> {
		return this.queue.submitRequest('streamToResponse', options, { res });
	}

	public async performDirectCallModel(options: AiModelRequestOptions): Promise<AiServiceResponse> {
		const params: ChatCompletionParams = {
			model: options.model,
			messages: options.messages.map(m => ({ role: m.role as any, content: m.content, name: (m as any).name })),
			stream: false,
			temperature: options.temperature,
			max_tokens: options.maxTokens,
		};
		const data = await this.client.createChatCompletion(params);
		const msg = data.choices?.[0]?.message;
		return { role: 'assistant', content: msg?.content ?? '', reasoning_content: '', timestamp: new Date().toISOString() };
	}

	public async performDirectStreamModel(options: AiModelRequestOptionsWithSignal, onChunk: (chunk: AiStreamingChunk) => void): Promise<AiServiceResponse> {
		const params: ChatCompletionParams = {
			model: options.model,
			messages: options.messages.map(m => ({ role: m.role as any, content: m.content, name: (m as any).name })),
			stream: true,
			temperature: options.temperature,
			max_tokens: options.maxTokens,
		};
		const aggregated: AiServiceResponse = { role: 'assistant', content: '', reasoning_content: '', timestamp: new Date().toISOString() };
		try {
			const stream = this.client.streamChatCompletion(params, options.signal);
			for await (const chunk of stream) {
				let parsed: any = chunk;
				if (typeof chunk === 'string') {
					try { parsed = JSON.parse(chunk); } catch { parsed = {}; }
				}
				if (parsed && typeof parsed.reasoning === 'string') {
					aggregated.reasoning_content = (aggregated.reasoning_content || '') + parsed.reasoning;
				} else if (parsed && typeof parsed.content === 'string') {
					aggregated.content += parsed.content;
				} else if (typeof chunk === 'string') {
					// Fallback for old behavior
					aggregated.content += chunk;
				}
				aggregated.timestamp = new Date().toISOString();
				onChunk({ current_message: { ...aggregated }, is_finished: false });
			}
			onChunk({ current_message: { ...aggregated }, is_finished: true });
			return aggregated;
		} catch (e: any) {
			if (e?.name === 'AbortError') {
				onChunk({ current_message: { ...aggregated }, is_finished: true, error: e.message });
			} else {
				onChunk({ current_message: { ...aggregated }, is_finished: true, error: e?.message || 'stream error' });
			}
			throw e;
		}
	}

	public async performDirectStreamToResponse(res: { setHeader: (n: string, v: string) => void; write: (c: string) => void; end: () => void; writableEnded?: boolean; headersSent?: boolean; on?: (e: string, cb: (...a: any[]) => void) => void; off?: (e: string, cb: (...a: any[]) => void) => void }, options: AiModelRequestOptions): Promise<void> {
		const params: ChatCompletionParams = {
			model: options.model,
			messages: options.messages.map(m => ({ role: m.role as any, content: m.content, name: (m as any).name })),
			stream: true,
			temperature: options.temperature,
			max_tokens: options.maxTokens,
		};
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		try {
			const upstream = await this.client.fetchChatCompletionStream(params);
			if (!upstream.ok || !upstream.body) {
				const text = await upstream.text().catch(() => '');
				if (!(res as any).headersSent) {
					res.write(`: error ${text}\n\n`);
				}
				res.end();
				return;
			}
			const reader = upstream.body.getReader();
			const decoder = new TextDecoder();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				if (value) res.write(decoder.decode(value, { stream: true }));
			}
			res.end();
		} catch (e: any) {
			try {
				res.write(`: error ${(e?.message as string) || 'stream error'}\n\n`);
			} catch {}
			res.end();
		}
	}

	public getQueueStatus() {
		return this.queue.getQueueStatus();
	}

	public setQueueConcurrency(limit: number) {
		this.queue.setConcurrency(limit);
	}

	public setQueueActivityLevel(isActive: boolean) {
		this.queue.setActivityLevel(isActive);
	}

	public updateQueueIntervalSettings(settings: { minIntervalMs?: number; peakHoursIntervalMs?: number; offPeakHoursIntervalMs?: number; maxIntervalMs?: number }) {
		this.queue.updateIntervalSettings(settings);
	}

	public getAiRequestQueueService() {
		return this.queue;
	}
}

class AiRequestQueueService {
	private queue: QueuedAiRequest[] = [];
	private activeProcessors = 0;
	private concurrencyLimit = 1;
	private currentIntervalMs = 1000;
	private minIntervalMs = 200;
	private peakHoursIntervalMs = 2000;
	private offPeakHoursIntervalMs = 500;
	private maxIntervalMs = 60000;
	private ai: AiService;
	private timeCheckIntervalId?: NodeJS.Timeout;

	constructor(ai: AiService, concurrency = 1, minInterval = 200, peak = 2000, offPeak = 500, max = 60000) {
		this.ai = ai;
		this.concurrencyLimit = Math.max(1, concurrency);
		this.minIntervalMs = minInterval;
		this.peakHoursIntervalMs = peak;
		this.offPeakHoursIntervalMs = offPeak;
		this.maxIntervalMs = max;
		this.adjustIntervalForTimeOfDay();
		this.timeCheckIntervalId = setInterval(() => this.adjustIntervalForTimeOfDay(), 15 * 60 * 1000);
	}

	public submitRequest<T extends AiServiceResponse | void>(type: RequestType, options: AiModelRequestOptions, streamOptions?: { res?: StreamResponse; onChunk?: (chunk: AiStreamingChunk) => void; signal?: AbortSignal }): Promise<T> {
		const cancellationKey = (options as any).cancellationKey as string | undefined;
		if (cancellationKey) {
			const idx = this.queue.findIndex(q => (q.options as any).cancellationKey === cancellationKey);
			if (idx > -1) {
				const [removed] = this.queue.splice(idx, 1);
				removed.reject(new Error(`Request ${removed.id} was cancelled and replaced.`));
			}
		}
		return new Promise<T>((resolve, reject) => {
			const withSignal: AiModelRequestOptionsWithSignal = { ...options, signal: streamOptions?.signal || (options as AiModelRequestOptionsWithSignal).signal };
			const req: QueuedAiRequest = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, options: withSignal, type, streamOptions, resolve, reject, queuedAt: new Date() };
			this.queue.push(req);
			this.processQueue();
		});
	}

	private async processQueue(): Promise<void> {
		while (this.activeProcessors < this.concurrencyLimit && this.queue.length > 0) {
			this.activeProcessors++;
			const task = this.queue.shift()!;
			this.executeSingleRequest(task);
			if (this.activeProcessors < this.concurrencyLimit && this.queue.length > 0) {
				await new Promise(r => setTimeout(r, this.currentIntervalMs));
			}
		}
	}

	private async executeSingleRequest(request: QueuedAiRequest): Promise<void> {
		const start = Date.now();
		try {
			let result: AiServiceResponse | void;
			if (request.options.signal?.aborted) {
				throw Object.assign(new Error('Request aborted before start'), { name: 'AbortError' });
			}
			switch (request.type) {
				case 'call':
					result = await this.ai.performDirectCallModel(request.options);
					break;
				case 'stream':
					if (!request.streamOptions?.onChunk) throw new Error('Missing onChunk');
					result = await this.ai.performDirectStreamModel(request.options, request.streamOptions.onChunk);
					break;
				case 'streamToResponse':
					if (!request.streamOptions?.res) throw new Error('Missing response');
					await this.ai.performDirectStreamToResponse(request.streamOptions.res, request.options);
					result = undefined;
					break;
			}
			request.resolve(result as any);
		} catch (e) {
			request.reject(e);
		} finally {
			this.activeProcessors--;
			void start; // keep for future metrics
			this.processQueue();
		}
	}

	private adjustIntervalForTimeOfDay(): void {
		const now = new Date();
		const hourBj = (now.getUTCHours() + 8) % 24;
		const min = now.getUTCMinutes();
		let target = this.peakHoursIntervalMs;
		const offPeak = (hourBj === 0 && min >= 30) || (hourBj >= 1 && hourBj <= 7) || (hourBj === 8 && min <= 30);
		if (offPeak) target = this.offPeakHoursIntervalMs;
		this.currentIntervalMs = Math.max(this.minIntervalMs, Math.min(this.maxIntervalMs, target));
	}

	public setActivityLevel(isActive: boolean): void {
		const base = isActive ? this.currentIntervalMs * 0.66 : this.currentIntervalMs * 1.5;
		this.currentIntervalMs = Math.max(this.minIntervalMs, Math.min(this.maxIntervalMs, base));
	}

	public setConcurrency(limit: number): void {
		const v = Math.max(1, limit);
		if (this.concurrencyLimit !== v) {
			this.concurrencyLimit = v;
			if (v > this.activeProcessors && this.queue.length > 0) this.processQueue();
		}
	}

	public updateIntervalSettings(settings: { minIntervalMs?: number; peakHoursIntervalMs?: number; offPeakHoursIntervalMs?: number; maxIntervalMs?: number }): void {
		if (settings.minIntervalMs !== undefined) this.minIntervalMs = Math.max(10, settings.minIntervalMs);
		if (settings.peakHoursIntervalMs !== undefined) this.peakHoursIntervalMs = settings.peakHoursIntervalMs;
		if (settings.offPeakHoursIntervalMs !== undefined) this.offPeakHoursIntervalMs = settings.offPeakHoursIntervalMs;
		if (settings.maxIntervalMs !== undefined) this.maxIntervalMs = settings.maxIntervalMs;
		this.adjustIntervalForTimeOfDay();
	}

	public getQueueStatus() {
		return {
			queueSize: this.queue.length,
			activeProcessors: this.activeProcessors,
			concurrencyLimit: this.concurrencyLimit,
			currentIntervalMs: this.currentIntervalMs,
			intervalSettings: { min: this.minIntervalMs, peak: this.peakHoursIntervalMs, offPeak: this.offPeakHoursIntervalMs, max: this.maxIntervalMs },
			queuedRequestsSummary: this.queue.slice(0, 20).map(r => ({ id: r.id, type: r.type, queuedAt: r.queuedAt.toISOString(), model: r.options.model || 'default', userMessageSnippet: r.options.messages.find((msg: any) => msg.role === 'user')?.content?.slice(0, 50) ?? 'N/A' })),
		};
	}

	public destroy(): void {
		if (this.timeCheckIntervalId) clearInterval(this.timeCheckIntervalId);
		if (this.queue.length > 0) {
			this.queue.forEach(q => q.reject(new Error('AiRequestQueueService destroyed')));
			this.queue = [];
		}
	}
}

export class LlmClient {
	private apiKey: string;
	private baseUrl: string;
    private modelId: string;
	private headers: Record<string, string>;

	constructor(options?: { apiKey?: string; baseUrl?: string; modelId?: string }) {
		this.headers = { 'Content-Type': 'application/json' };

		// Priority: Explicit options > Environment Variables
		if (options?.apiKey) {
			this.apiKey = options.apiKey;
			// Default to OpenAI URL if baseUrl is not provided, maintaining compatibility
			this.baseUrl = (options.baseUrl || 'https://api.openai.com').replace(/\/$/, '');
			this.headers['Authorization'] = `Bearer ${this.apiKey}`;
            this.modelId = options.modelId || '';
			return;
		}
        const runtimeConfig = useRuntimeConfig();
        const llmConfig = runtimeConfig.llm;
		// Environment-based provider configuration (Priority: OpenRouter > DeepSeek > OpenAI)
		const providers: LlmProvider[] = [
			{
				name: llmConfig.text.provider,
				apiKey: llmConfig.text.apiKey,
				baseUrl: llmConfig.text.baseUrl,
                defaultModelId: llmConfig.text.model,
                headers: {}
			},
			
		];

		const activeProvider = providers.find(p => p.apiKey);

		if (activeProvider) {
			this.apiKey = activeProvider.apiKey!;
			this.baseUrl = activeProvider.baseUrl.replace(/\/$/, '');
			this.headers['Authorization'] = `Bearer ${this.apiKey}`;
			this.modelId = activeProvider.defaultModelId;
			for (const key in activeProvider.headers) {
				const value = activeProvider.headers[key];
				if (value) {
					this.headers[key] = value;
				}
			}
		} else {
			throw new Error('API key not set. Please set OPENROUTER_API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY.');
		}
	}

	private getChatCompletionsUrl() {
		return this.baseUrl.endsWith('/v1') ? `${this.baseUrl}/chat/completions` : `${this.baseUrl}/v1/chat/completions`;
	}

	async createChatCompletion(params: ChatCompletionParams) {
		const url = this.getChatCompletionsUrl();
		const res = await fetch(url, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({ ...params, stream: false }),
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`LLM provider error ${res.status}: ${text}`);
		}
		return (await res.json()) as ChatCompletionResponse;
	}

	async fetchChatCompletionStream(params: ChatCompletionParams, abortSignal?: AbortSignal) {
		const url = this.getChatCompletionsUrl();
		const res = await fetch(url, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({ ...params, stream: true }),
			signal: abortSignal,
		} as RequestInit);
		return res;
	}

	async *streamChatCompletion(params: ChatCompletionParams, abortSignal?: AbortSignal): AsyncGenerator<string, void, unknown> {
		const url = this.getChatCompletionsUrl();
		const res = await fetch(url, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({ ...params, stream: true }),
			signal: abortSignal,
		} as RequestInit);
		if (!res.ok || !res.body) {
			const text = await res.text().catch(() => '');
			throw new Error(`LLM provider stream error ${res.status}: ${text}`);
		}
		const decoder = new TextDecoder();
		const reader = (res.body as ReadableStream<Uint8Array>).getReader();
		let buffer = '';
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				if (value) {
					buffer += decoder.decode(value, { stream: true });
					let eolIndex: number;
					while ((eolIndex = buffer.indexOf('\n')) >= 0) {
						const line = buffer.slice(0, eolIndex).trim();
						buffer = buffer.slice(eolIndex + 1);
						if (!line) continue;
						if (line.startsWith('data:')) {
							const data = line.slice('data:'.length).trim();
							if (data === '[DONE]') return;
							try {
								const json = JSON.parse(data);
								const reasoning = json?.choices?.[0]?.delta?.reasoning_content;
								if (typeof reasoning === 'string' && reasoning.length > 0) yield JSON.stringify({ reasoning });
								const content = json?.choices?.[0]?.delta?.content;
								if (typeof content === 'string' && content.length > 0) yield JSON.stringify({ content });
							} catch {}
						}
					}
				}
			}
		} finally {
			reader.releaseLock();
		}
		buffer = buffer.trim();
		if (buffer.startsWith('data:')) {
			const data = buffer.slice('data:'.length).trim();
			if (data !== '[DONE]') {
				try {
					const json = JSON.parse(data);
					const reasoning = json?.choices?.[0]?.delta?.reasoning_content;
					if (typeof reasoning === 'string' && reasoning.length > 0) yield JSON.stringify({ reasoning });
					const content = json?.choices?.[0]?.delta?.content;
					if (typeof content === 'string' && content.length > 0) yield JSON.stringify({ content });
				} catch {}
			}
		}
	}
}
