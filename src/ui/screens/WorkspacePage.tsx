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
  const router = useRouter();

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
    setRunningAgent('Product Manager');
    setShowNextSteps(false);

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

      // Progressive playback to make agents feel alive
      const agentsList: AgentName[] = ['Product Manager', 'Architect', 'Engineer', 'QA', 'Release Manager'];
      
      for (let i = 0; i < agentsList.length; i++) {
        const agent = agentsList[i];
        setRunningAgent(agent);
        setStatus(`Active Node: ${agent}`);
        
        // Simulation delay of 2 seconds per agent run
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const msg = allMessages.find(m => m.agent === agent);
        if (msg) {
          setDisplayedMessages(prev => [...prev, msg]);
        }
      }

      setRunningAgent(null);
      setStatus('Synthesis Complete');
      setShowNextSteps(true);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unexpected error';
      setError(message);
      setStatus('Synthesis Aborted');
      setRunningAgent(null);
    } finally {
      setIsLoading(false);
    }
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
          <button 
            onClick={() => router.push('/')}
            className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 hover:text-black transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* 3 Column workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] max-w-7xl w-full mx-auto">
        
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

        {/* Center Column: Project Input & Readable Outputs */}
        <div className="border-r border-neutral-200 p-8 lg:p-12 overflow-y-auto">
          <div className="space-y-12">
            
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
                    <div className="border border-dashed border-neutral-300 p-8 text-center bg-white/50 animate-pulse space-y-2">
                      <div className="flex justify-center items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-black animate-ping"></span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-black">{runningAgent} Running</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Synthesizing blueprint parameters and validation parameters...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps (revealed post release manager) */}
            {showNextSteps && displayedMessages.length > 0 && (
              <NextStepsSection messages={displayedMessages} />
            )}
          </div>
        </div>

        {/* Right Column: Live Activity stream logs */}
        <div className="p-8 bg-white/50 backdrop-blur-sm lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar">
          <AgentActivityStream 
            messages={displayedMessages} 
            isLoading={isLoading} 
            runningAgent={runningAgent} 
          />
        </div>
      </div>

      {/* Persistent context-aware chat assistant */}
      <ChatAssistant messages={displayedMessages} />
    </div>
  );
}
