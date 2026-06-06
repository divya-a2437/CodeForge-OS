import { publishMessage, getLatestMessage } from '@/lib/band';
import { buildQaReport } from '../prompts/prompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'QA' as const;

export async function runQaAgent(request: ProjectRequest) {
  const engineerMessage = getLatestMessage('Engineer');

  const implementation = engineerMessage?.payload;

  const payload = {
    review: buildQaReport(request.prompt),
    implementationReviewed: implementation,
    audit: {
      coverage:
        'Functional review of the Band workflow, UI surface, and API contract.',
      recommendations: [
        'Confirm event consistency between agents',
        'Ensure user feedback is visible during workflow execution',
        'Validate final approval criteria before release'
      ]
    }
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