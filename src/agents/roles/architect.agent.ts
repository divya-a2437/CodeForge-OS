import { publishMessage, getLatestMessage } from '@/lib/band';
import { getOpenAiResponse } from '@/lib/ai';
import { ARCHITECT_SYSTEM_PROMPT } from '../prompts/systemPrompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'Architect' as const;

export async function runArchitectAgent(request: ProjectRequest) {
  const pmMessage = getLatestMessage('Product Manager');
  const pmData = pmMessage?.payload;

  const context = `
Product Requirements:
${JSON.stringify(pmData, null, 2)}

Original Project Request:
${request.prompt}
`;

  const aiOutput = await getOpenAiResponse(
    context,
    ARCHITECT_SYSTEM_PROMPT
  );

  let payload: any;
  try {
    payload = JSON.parse(aiOutput);
  } catch (e) {
    payload = {
      architectureOverview: aiOutput,
      error: "AI failed to return valid JSON"
    };
  }

  const message: AgentMessage = {
    projectId: request.projectId,
    agent: agentName,
    status: 'completed',
    timestamp: new Date().toISOString(),
    payload
  };

  await publishMessage(message);
}