import { publishMessage, getLatestMessage } from '@/lib/band';
import { buildImplementation } from '../prompts/prompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Engineer' as const;

export async function runEngineerAgent(request: ProjectRequest) {
  const architectMessage = getLatestMessage('Architect');

  const architecture =
    architectMessage?.payload;

  const payload = {
    implementationPlan: `Implement the platform using a component-driven Next.js app powered by a structured workflow API for ${request.prompt}.`,
    architectureReference: architecture,
    ...buildImplementation(request.prompt)
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