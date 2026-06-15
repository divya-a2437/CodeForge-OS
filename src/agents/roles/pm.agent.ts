import { publishMessage } from '@/lib/band';
import { getOpenAiResponse } from '@/lib/ai';
import { buildRequirements, buildUserStories } from '../prompts/prompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Product Manager' as const;

export async function runPmAgent(request: ProjectRequest) {
  const aiOutput = await getOpenAiResponse(
    `You are a product manager. Create a concise product description for the following project request and describe the main requirements and user stories in plain text.\n\nProject request:\n${request.prompt}`
  );

  const payload = {
    requirements: buildRequirements(request.prompt),
    userStories: buildUserStories(request.prompt),
    aiOutput
  };

  const message: AgentMessage = {
    projectId: request.projectId,
    agent: agentName,
    status: 'completed',
    timestamp: new Date().toISOString(),
    payload
  };

  await publishMessage(message);
}
