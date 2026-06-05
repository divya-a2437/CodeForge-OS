"use client";

import { useMemo, useState } from 'react';
import { AgentCard } from '@/components/AgentCard';
import { ProjectInput } from '@/components/ProjectInput';
import { WorkflowTimeline } from '@/components/WorkflowTimeline';
import type { AgentMessage } from '@/types/workflow';

const defaultPrompt = 'Build a Student Task Manager';

export default function HomePage() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [status, setStatus] = useState('Ready to run the workflow');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progressLabel = useMemo(() => {
    if (isLoading) return 'Running workflow...';
    if (messages.length === 0) return 'Submit a request to start the Band.';
    return `${messages.length} messages generated.`;
  }, [isLoading, messages.length]);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    setStatus('Starting workflow');
    setMessages([]);

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
      setMessages(data.messages || []);
      setStatus('Workflow completed successfully');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unexpected error';
      setError(message);
      setStatus('Workflow failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-3xl border border-slate-800 bg-slate-950/90 p-10 shadow-2xl shadow-slate-950/20">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">CodeForge OS</p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">AI-powered delivery for software teams</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Coordinate a multi-agent delivery Band that plans, designs, implements, reviews, tests, and releases software projects.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <ProjectInput
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleSubmit}
                disabled={isLoading}
              />

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm text-slate-400">Workflow status</p>
                <p className="mt-2 text-base font-medium text-white">{progressLabel}</p>
                <p className="mt-1 text-sm text-slate-500">{status}</p>
                {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-lg font-semibold text-white">Workflow overview</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Each agent in the Band contributes a structured output that moves the project from concept to launch.
              </p>
              <WorkflowTimeline messages={messages} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {messages.map((message) => (
            <AgentCard key={`${message.agent}-${message.timestamp}`} message={message} />
          ))}
        </div>
      </section>
    </main>
  );
}
