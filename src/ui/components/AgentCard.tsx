import type { AgentMessage } from '@/types/workflow';

const badgeStyles: Record<string, string> = {
  completed: 'bg-emerald-500/15 text-emerald-300',
  running: 'bg-sky-500/15 text-sky-300',
  pending: 'bg-amber-500/15 text-amber-300',
  failed: 'bg-rose-500/15 text-rose-300'
};

export function AgentCard({ message }: { message: AgentMessage }) {
  return (
    <article className="glass-surface rounded-3xl border border-slate-800 p-6 shadow-xl shadow-slate-950/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{message.agent}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{message.agent} Output</h3>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${badgeStyles[message.status] || badgeStyles.pending}`}
        >
          {message.status}
        </span>
      </div>

      <div className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
        <p className="text-slate-500">Timestamp: {new Date(message.timestamp).toLocaleString()}</p>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-950/80 p-4 text-slate-200">
          {JSON.stringify(message.payload, null, 2)}
        </pre>
      </div>
    </article>
  );
}
