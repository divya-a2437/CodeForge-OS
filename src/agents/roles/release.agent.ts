import {
  publishMessage,
  getLatestMessage
} from '@/lib/band';

import type {
  ProjectRequest,
  AgentMessage
} from '@/types/workflow';

const agentName = 'Release Manager' as const;

export async function runReleaseAgent(
  request: ProjectRequest
) {
  const pmOutput =
    getLatestMessage('Product Manager');

  const architectOutput =
    getLatestMessage('Architect');

  const engineerOutput =
    getLatestMessage('Engineer');

  const qaOutput =
    getLatestMessage('QA');

  const payload = {
    approvalReport: {
      summary: `Final approval granted for project execution based on the Band workflow for request: ${request.prompt}`,
      releaseReadiness: 'Approved',
      nextSteps: [
        'Deploy production artifact',
        'Monitor launch metrics',
        'Prepare support documentation'
      ]
    },

    collaborationSummary: {
      requirements:
        pmOutput?.payload,

      architecture:
        architectOutput?.payload,

      implementation:
        engineerOutput?.payload,

      qaReview:
        qaOutput?.payload
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