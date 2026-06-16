import { publishMessage, getLatestMessage } from '@/lib/band';
import { getOpenAiResponse } from '@/lib/ai';
import { QA_SYSTEM_PROMPT } from '../prompts/systemPrompts';
import type { ProjectRequest, AgentMessage } from '@/types/workflow';

const agentName = 'QA' as const;

export async function runQaAgent(request: ProjectRequest) {
  const engineerMessage = getLatestMessage('Engineer');

  const context = `
Implementation Plan:
${JSON.stringify(engineerMessage?.payload, null, 2)}

Original Project Request:
${request.prompt}
`;

  const aiOutput = await getOpenAiResponse(
    context,
    QA_SYSTEM_PROMPT
  );

  let payload: any;
  try {
    payload = JSON.parse(aiOutput);
  } catch (e) {
    payload = {
      testStrategy: aiOutput,
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