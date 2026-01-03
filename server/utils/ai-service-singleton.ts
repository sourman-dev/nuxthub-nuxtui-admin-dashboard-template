import { AiService } from './llm';

// Singleton instance for AiService with queue management
let aiServiceInstance: AiService | null = null;

export function getAiService(): AiService {
	if (!aiServiceInstance) {
		const runtimeConfig = useRuntimeConfig();
		const { apiKey, baseUrl } = runtimeConfig.llm.text;

		aiServiceInstance = new AiService({
			apiKey,
			baseUrl,
			queue: {
				concurrencyLimit: 3,
				minIntervalMs: 100,
				peakHoursIntervalMs: 1000,
				offPeakHoursIntervalMs: 300,
				maxIntervalMs: 30000,
			},
		});
	}
	return aiServiceInstance;
}
