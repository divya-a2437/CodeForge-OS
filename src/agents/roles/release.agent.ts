import {
  publishMessage,
  getLatestMessage
} from '@/lib/band';
import { getOpenAiResponse } from '@/lib/ai';

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

  const aiAnalysis = await getOpenAiResponse(
    `You are a release manager. Create a short approval briefing for the project request: ${request.prompt}.\n\nInclude the collaboration summaries from the Product Manager, Architect, Engineer, and QA outputs.\n\nProduct Manager:\n${JSON.stringify(pmOutput?.payload, null, 2)}\n\nArchitect:\n${JSON.stringify(architectOutput?.payload, null, 2)}\n\nEngineer:\n${JSON.stringify(engineerOutput?.payload, null, 2)}\n\nQA:\n${JSON.stringify(qaOutput?.payload, null, 2)}`
  );

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
    },
    aiAnalysis
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