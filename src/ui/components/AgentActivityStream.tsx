import { useEffect, useRef } from 'react';
import type { AgentMessage, AgentName } from '@/types/workflow';

export function AgentActivityStream({ 
  messages, 
  isLoading,
  runningAgent
}: { 
  messages: AgentMessage[]; 
  isLoading: boolean;
  runningAgent: AgentName | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll terminal stream to bottom on new logs
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, runningAgent]);

  // Construct a list of running/completed events
  const events: { time: string; type: 'info' | 'success' | 'process'; text: string; agent: string }[] = [];

  // Generate logs based on messages state
  messages.forEach((msg) => {
    const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    if (msg.agent === 'Product Manager') {
      events.push({ time: timeStr, type: 'info', agent: 'PM', text: 'Operator project brief received. Commencing requirement deconstruction.' });
      events.push({ time: timeStr, type: 'success', agent: 'PM', text: 'Product criteria and user scenarios compiled. Pushing context to Architect.' });
    } else if (msg.agent === 'Architect') {
      events.push({ time: timeStr, type: 'info', agent: 'ARC', text: 'Architecture context loaded. Synthesizing system layer definitions.' });
      events.push({ time: timeStr, type: 'success', agent: 'ARC', text: 'Target stack selected: Next.js + Tailwind. Routing map locked. Transferring specifications to Engineer.' });
    } else if (msg.agent === 'Engineer') {
      events.push({ time: timeStr, type: 'info', agent: 'ENG', text: 'Technical specification received. Scaffolding directory tree nodes.' });
      events.push({ time: timeStr, type: 'success', agent: 'ENG', text: 'Database entities mapped. REST API routes written. Emitting execution roadmap to QA.' });
    } else if (msg.agent === 'QA') {
      events.push({ time: timeStr, type: 'info', agent: 'QA', text: 'Engineering branch received. Commencing integration validation cycles.' });
      events.push({ time: timeStr, type: 'success', agent: 'QA', text: 'Coverage checks and edge-case criteria satisfied. Deploy release recommendation dispatched.' });
    } else if (msg.agent === 'Release Manager') {
      events.push({ time: timeStr, type: 'info', agent: 'REL', text: 'Final verification initiated. Compiling documentation checklist.' });
      events.push({ time: timeStr, type: 'success', agent: 'REL', text: 'Readiness evaluation: APPROVED. Blueprint roadmap finalized and unlocked.' });
    }
  });

  // Append currently running agent status
  if (isLoading && runningAgent) {
    const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (runningAgent === 'Product Manager') {
      events.push({ time: timeStr, type: 'process', agent: 'PM', text: 'Product Manager is analyzing project features and user segments...' });
    } else if (runningAgent === 'Architect') {
      events.push({ time: timeStr, type: 'process', agent: 'ARC', text: 'Architect is mapping component layers and stack dependencies...' });
    } else if (runningAgent === 'Engineer') {
      events.push({ time: timeStr, type: 'process', agent: 'ENG', text: 'Engineer is compiling route files and schema configurations...' });
    } else if (runningAgent === 'QA') {
      events.push({ time: timeStr, type: 'process', agent: 'QA', text: 'QA is drafting edge cases and evaluating security checkpoints...' });
    } else if (runningAgent === 'Release Manager') {
      events.push({ time: timeStr, type: 'process', agent: 'REL', text: 'Release Manager is compiling deployment runbook and checklist...' });
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          SYSTEM STREAM LOGS
        </h3>
        <p className="text-[9px] text-neutral-400 font-mono mt-0.5">CF-OS://CORE-ENGINE.LOG</p>
      </div>

      {/* Terminal box */}
      <div 
        ref={containerRef}
        className="flex-1 bg-black text-white p-5 font-mono text-[10px] space-y-3.5 overflow-y-auto border border-neutral-800 custom-scrollbar leading-relaxed"
        style={{ minHeight: '300px', maxHeight: '550px' }}
      >
        {events.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center text-neutral-600 space-y-2 py-10">
            <svg className="w-6 h-6 stroke-neutral-700 stroke-[1] fill-none animate-pulse" viewBox="0 0 24 24">
              <path d="M12 2 L12 22" />
              <path d="M2 12 L22 12" />
            </svg>
            <p className="uppercase text-[9px] tracking-widest">Awaiting Project Initialization</p>
          </div>
        ) : (
          events.map((ev, i) => (
            <div key={i} className="space-y-0.5 border-l border-neutral-900 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">[{ev.time}]</span>
                <span className={`px-1 text-[9px] font-bold ${
                  ev.type === 'success' ? 'bg-white text-black' :
                  ev.type === 'process' ? 'bg-neutral-800 text-neutral-300 animate-pulse' :
                  'bg-neutral-800 text-neutral-400'
                }`}>
                  {ev.agent}
                </span>
                <span className="text-neutral-500 font-semibold">
                  {ev.type === 'success' ? '✓ OK' : ev.type === 'process' ? '● RUN' : 'i INF'}
                </span>
              </div>
              <p className={ev.type === 'process' ? 'text-neutral-300' : 'text-neutral-400'}>{ev.text}</p>
            </div>
          ))
        )}

        {/* Live cursor line when running */}
        {isLoading && (
          <div className="flex items-center gap-1.5 text-neutral-500">
            <span>$</span>
            <span className="w-1.5 h-3 bg-neutral-500 animate-pulse"></span>
          </div>
        )}
      </div>

      {/* Sub-system diagnostics */}
      {messages.length > 0 && (
        <div className="pt-2 border-t border-neutral-200">
          <div className="flex justify-between items-center text-[9px] font-mono text-neutral-400 uppercase">
            <span>NODES LINKED:</span>
            <span className="text-black font-semibold">{messages.length} / 5 ONLINE</span>
          </div>
        </div>
      )}
    </div>
  );
}
