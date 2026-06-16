import type { AgentMessage, AgentName } from '@/types/workflow';

const agents: AgentName[] = ['Product Manager', 'Architect', 'Engineer', 'QA', 'Release Manager'];

export function WorkflowTimeline({ 
  messages, 
  runningAgent,
  isLoading,
  error,
  status 
}: { 
  messages: AgentMessage[]
  runningAgent: AgentName | null
  isLoading: boolean
  error: string | null
  status: string
}) {
  return (
    <div className="space-y-6">
      {/* Header info */}
      <div>
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
          OPERATING STATE
        </h2>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-black animate-pulse' : 'bg-neutral-300'}`}></span>
          <p className="text-xs text-black font-semibold uppercase tracking-wider">{status}</p>
        </div>
        {error && (
          <div className="text-xs text-red-600 font-medium mt-2 p-2 border border-red-200 bg-red-50 font-mono">
            ERR: {error}
          </div>
        )}
      </div>

      {/* Timeline nodes */}
      <div className="relative pl-6 py-2">
        {/* Background vertical line */}
        <div className="absolute left-1.5 top-0 bottom-0 w-px bg-neutral-200 z-0"></div>

        {/* Animated active flow line overlay */}
        {isLoading && (
          <div 
            className="absolute left-1.5 top-2 w-px bg-black transition-all duration-1000 z-10" 
            style={{
              height: `${
                runningAgent 
                  ? (agents.indexOf(runningAgent) * 64) 
                  : (messages.length * 64)
              }px`
            }}
          />
        )}

        <div className="space-y-10 relative z-20">
          {agents.map((agent, index) => {
            const isCompleted = messages.some((item) => item.agent === agent);
            const isRunning = runningAgent === agent;
            const isPending = !isCompleted && !isRunning;

            return (
              <div key={agent} className="flex items-start gap-4">
                {/* Timeline node indicator */}
                <div className="relative flex items-center justify-center pt-1 -ml-6">
                  <div className={`w-3.5 h-3.5 rounded-full border bg-white flex items-center justify-center transition-all ${
                    isCompleted ? 'border-black bg-black' :
                    isRunning ? 'border-black bg-white scale-110 glow-line-pulse' :
                    'border-neutral-300 bg-white'
                  }`}>
                    {isCompleted && (
                      <svg className="h-2 w-2 text-white" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 11-1.06-1.06L12.72 4.22a.75.75 0 011.06 0z" />
                      </svg>
                    )}
                    {isRunning && (
                      <div className="h-1.5 w-1.5 rounded-full bg-black animate-ping"></div>
                    )}
                  </div>
                </div>

                {/* Node details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isCompleted ? 'text-black' :
                      isRunning ? 'text-black' :
                      'text-neutral-400'
                    }`}>
                      {agent}
                    </span>
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border font-mono ${
                      isCompleted ? 'border-neutral-200 bg-neutral-50 text-neutral-600' :
                      isRunning ? 'border-black bg-black text-white' :
                      'border-neutral-200 bg-transparent text-neutral-400'
                    }`}>
                      {isCompleted ? 'RESOLVED' : isRunning ? 'WORKING' : 'QUEUED'}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 font-mono uppercase">
                    {isRunning ? 'Synthesizing blueprint parameters...' : isCompleted ? 'Blueprint outputs generated' : 'Waiting for context...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress percentage */}
      {messages.length > 0 && (
        <div className="pt-4 border-t border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase">
            <span>Synthesis Completion</span>
            <span>{Math.round((messages.length / agents.length) * 100)}%</span>
          </div>
          <div className="h-0.5 bg-neutral-200 w-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${(messages.length / agents.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
