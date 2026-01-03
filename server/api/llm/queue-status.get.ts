import { getAiService } from '~~/server/utils/ai-service-singleton';

export default defineEventHandler(() => {
	const aiService = getAiService();
	return aiService.getQueueStatus();
});
