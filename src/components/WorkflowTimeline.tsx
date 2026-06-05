import type { AgentMessage } from '@/types/workflow';

const agents: string[] = ['Product Manager', 'Architect', 'Engineer', 'QA', 'Release Manager'];

export function WorkflowTimeline({ messages }: { messages: AgentMessage[] }) {
  return (
    <div className="mt-6 space-y-4">
      {agents.map((agent, index) => {
        const message = messages.find((item) => item.agent === agent);
        const status = message?.status ?? 'pending';

        return (
          <div key={agent} className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-sm font-semibold text-slate-200">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1 rounded-3xl border border-slate-800 bg-slate-900/95 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-white">{agent}</p>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{status}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {message ? 'Result available with structured payload and execution details.' : 'Waiting for this agent to run.'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
