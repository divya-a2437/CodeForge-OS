import { resetMessages, getMessages } from '@/lib/band';
import { runPmAgent } from '@/agents/roles/pm.agent';
import { runArchitectAgent } from '@/agents/roles/architect.agent';
import { runEngineerAgent } from '@/agents/roles/engineer.agent';
import { runQaAgent } from '@/agents/roles/qa.agent';
import { runReleaseAgent } from '@/agents/roles/release.agent';
import type { ProjectRequest } from '@/types/workflow';

export async function runWorkflow(prompt: string) {
  resetMessages();

  const projectRequest: ProjectRequest = {
    prompt,
    projectId: `codeforge-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  await runPmAgent(projectRequest);
  await runArchitectAgent(projectRequest);
  await runEngineerAgent(projectRequest);
  await runQaAgent(projectRequest);
  await runReleaseAgent(projectRequest);

  return getMessages();
}
