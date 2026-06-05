import { publishMessage, getLatestMessage } from '@/lib/band';
import { buildArchitecture } from './prompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Architect' as const;

export async function runArchitectAgent(request: ProjectRequest) {
  const pmMessage = getLatestMessage('Product Manager');

  const requirements =
    pmMessage?.payload?.requirements;

  const payload = {
    ...buildArchitecture(request.prompt),
    derivedFromRequirements: requirements
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