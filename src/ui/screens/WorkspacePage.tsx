"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectInput } from '@/ui/components/ProjectInput';
import { WorkflowTimeline } from '@/ui/components/WorkflowTimeline';
import { NextStepsSection } from '@/ui/components/NextStepsSection';
import { ChatAssistant } from '@/ui/components/ChatAssistant';
import { AgentActivityStream } from '@/ui/components/AgentActivityStream';
import { AgentCard } from '@/ui/components/AgentCard';
import type { AgentMessage, AgentName } from '@/types/workflow';

const defaultPrompt = 'Build a Student Task Manager';

export function WorkspacePage() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<AgentMessage[]>([]);
  const [runningAgent, setRunningAgent] = useState<AgentName | null>(null);
  const [status, setStatus] = useState('Workspace Ready');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [logs, setLogs] = useState<{timestamp: string, message: string, type: 'info' | 'error'}[]>([]);
  const router = useRouter();

  const addLog = (message: string, type: 'info' | 'error' = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, type }]);
  };

  const progressLabel = useMemo(() => {
    if (isLoading) return 'Synthesis active';
    if (displayedMessages.length === 0) return 'Operator input pending';
    return `${displayedMessages.length} nodes integrated`;
  }, [isLoading, displayedMessages.length]);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    setStatus('Initializing simulation...');
    setMessages([]);
    setDisplayedMessages([]);
    setShowNextSteps(false);
    setLogs([]);
    addLog('System: Initializing workflow orchestration...', 'info');

    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`Workflow failed with status ${response.status}`);
      }

      const data = await response.json();
      const allMessages: AgentMessage[] = data.messages || [];
      setMessages(allMessages);

      const agentsList: AgentName[] = ['Product Manager', 'Architect', 'Engineer', 'QA', 'Release Manager'];
      
      for (let i = 0; i < agentsList.length; i++) {
        const agent = agentsList[i];
        setRunningAgent(agent);
        setStatus(`Active Node: ${agent}`);
        addLog(`Agent: ${agent} has started synthesis...`, 'info');
        
        // Simulation delay for "thinking" state
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const msg = allMessages.find(m => m.agent === agent);
        if (msg) {
          setDisplayedMessages(prev => [...prev, msg]);
          addLog(`Agent: ${agent} completed output generation.`, 'info');
        } else {
          addLog(`Agent: ${agent} failed to produce output. Using fallback.`, 'error');
          // In a real app, we'd have a fallback message here
        }
      }

      setRunningAgent(null);
      setStatus('Synthesis Complete');
      setShowNextSteps(true);
      addLog('System: Workflow execution successfully completed.', 'info');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unexpected error';
      setError(message);
      setStatus('Synthesis Aborted');
      setRunningAgent(null);
      addLog(`System Error: ${message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: string) => {
    addLog(`Action: Initiating ${action}...`, 'info');
    // Simulated action
    setTimeout(() => {
      addLog(`Action: ${action} complete. Assets generated in memory.`, 'info');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black/5 grid-bg">
      {/* Top navigation */}
      <nav className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 stroke-black stroke-[1.2] fill-none" viewBox="0 0 24 24">
              <path d="M12 2 L22 7.5 L22 16.5 L12 22 L2 16.5 L2 7.5 Z" />
              <path d="M12 2 L12 22" />
              <path d="M2 7.5 L12 12 L22 7.5" />
            </svg>
            <div>
              <h1 className="text-xs font-semibold tracking-widest uppercase">CodeForge OS</h1>
              <p className="text-[9px] text-neutral-400 uppercase tracking-wider font-mono">Workspace://v0.1.0-alpha</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 hover:text-black transition-colors"
            >
              {isConsoleOpen ? 'Hide Console' : 'Show Console'}
            </button>
            <button 
              onClick={() => router.push('/')}
              className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 hover:text-black transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* 2 Column workspace (Logs moved to collapsible console) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] max-w-7xl w-full mx-auto">
        
        {/* Left Column: Timeline Progress */}
        <div className="border-r border-neutral-200 p-8 bg-white/50 backdrop-blur-sm lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">PIPELINE TRACKER</h3>
            <WorkflowTimeline
              messages={displayedMessages}
              runningAgent={runningAgent}
              isLoading={isLoading}
              error={error}
              status={progressLabel}
            />
          </div>
        </div>

        {/* Right Column: Project Input & Readable Outputs */}
        <div className="p-8 lg:p-12 overflow-y-auto relative">
          <div className="space-y-12 max-w-4xl mx-auto">
            
            {/* Input Section */}
            <div className="space-y-6 bg-white border border-neutral-200 p-8">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">PROJECT SPECIFIER</span>
                <h2 className="text-xl font-light text-black tracking-tight mt-1">Initialize Specifications</h2>
                <p className="text-xs text-neutral-500 font-light mt-1">
                  Input your application constraints and product brief below to initiate the synthesis process.
                </p>
              </div>
              <ProjectInput
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleSubmit}
                disabled={isLoading}
              />
            </div>

            {/* progressive insights list */}
            {(displayedMessages.length > 0 || runningAgent) && (
              <div className="space-y-8">
                <div className="border-b border-neutral-200 pb-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">SYNTHESIS DELIVERABLES</h3>
                </div>
                
                <div className="space-y-6">
                  {displayedMessages.map((msg) => (
                    <AgentCard key={`${msg.agent}-${msg.timestamp}`} message={msg} />
                  ))}

                  {/* Active running agent visual placeholder */}
                  {runningAgent && (
                    <div className="border border-black p-12 text-center bg-white space-y-4 animate-pulse">
                      <div className="flex justify-center items-center gap-3">
                        <div className="w-2 h-2 bg-black animate-ping"></div>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-black">Active Node: {runningAgent}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono max-w-xs mx-auto">
                        Synthesizing deep project specifications, architectural tradeoffs, and implementation roadmaps...
                      </p>
                      <div className="flex justify-center gap-1">
                        <div className="w-8 h-0.5 bg-black/10"></div>
                        <div className="w-8 h-0.5 bg-black"></div>
                        <div className="w-8 h-0.5 bg-black/10"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons Section */}
            {showNextSteps && (
              <div className="space-y-6 animate-slide-up">
                <div className="border-b border-neutral-200 pb-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">ACTION CENTER</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    'Generate Frontend',
                    'Generate Backend',
                    'Generate Database Schema',
                    'Generate API Endpoints',
                    'Generate Deployment Plan'
                  ].map(action => (
                    <button
                      key={action}
                      onClick={() => handleAction(action)}
                      className="px-3 py-3 border border-black text-[9px] uppercase tracking-tighter font-bold hover:bg-black hover:text-white transition-all bg-white"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {showNextSteps && displayedMessages.length > 0 && (
              <NextStepsSection messages={displayedMessages} />
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Developer Console */}
      {isConsoleOpen && (
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-black text-[#00ff00] font-mono text-[10px] z-50 border-t border-neutral-800 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900">
            <span className="uppercase tracking-widest font-bold">Developer Console // System Logs</span>
            <button onClick={() => setIsConsoleOpen(false)} className="text-neutral-500 hover:text-white">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {logs.length === 0 && <div className="opacity-40">System idle. Awaiting command...</div>}
            {logs.map((log, i) => (
              <div key={i} className={log.type === 'error' ? 'text-red-500' : ''}>
                <span className="opacity-40">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Persistent context-aware chat assistant */}
      <ChatAssistant messages={displayedMessages} />
    </div>
  );
}
