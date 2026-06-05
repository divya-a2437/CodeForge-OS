import { publishMessage } from '@/lib/band';
import { buildRequirements, buildUserStories } from './prompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Product Manager' as const;

export async function runPmAgent(request: ProjectRequest) {
  const payload = {
    requirements: buildRequirements(request.prompt),
    userStories: buildUserStories(request.prompt)
  };

  const message: AgentMessage = {
    projectId: request.projectId,
    agent: agentName,
    status: 'completed',
    timestamp: new Date().toISOString(),
    payload
  };

  publishMessage(message);
}
