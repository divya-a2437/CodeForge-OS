import { useState } from 'react';
import type { AgentMessage } from '@/types/workflow';

function safeParse(val: any) {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try {
    let cleaned = val.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
    if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
    return JSON.parse(cleaned.trim());
  } catch (e) {
    return null;
  }
}

export function NextStepsSection({ messages }: { messages: AgentMessage[] }) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  // Extract real content from agent run
  const pmMsg = messages.find(m => m.agent === 'Product Manager');
  const archMsg = messages.find(m => m.agent === 'Architect');
  const engMsg = messages.find(m => m.agent === 'Engineer');
  const qaMsg = messages.find(m => m.agent === 'QA');
  const releaseMsg = messages.find(m => m.agent === 'Release Manager');

  const archData = safeParse(archMsg?.payload?.aiAnalysis);
  const engData = safeParse(engMsg?.payload?.aiAnalysis);
  const qaData = safeParse(qaMsg?.payload?.aiAnalysis);

  const stepsDetails: Record<string, { title: string; desc: string; icon: string; render: () => React.ReactNode }> = {
    roadmap: {
      title: 'Implementation Roadmap',
      desc: 'Phase-based development plan with estimated timelines',
      icon: '📋',
      render: () => {
        const phases = engData?.implementationSteps || [
          "Phase 1: Environment Provisioning & System Scaffolding (1-2 weeks)",
          "Phase 2: Database Layer Mapping & Core Service Integration (2-3 weeks)",
          "Phase 3: Front-end Interface Layout & Component Implementation (2-3 weeks)",
          "Phase 4: Integration Testing & Security Verification (1 week)"
        ];
        return (
          <div className="space-y-3 pt-3 border-t border-neutral-100 font-mono text-[11px] text-neutral-600">
            {phases.map((phase: string, i: number) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-black font-semibold">[{i+1}]</span>
                <span>{phase}</span>
              </div>
            ))}
          </div>
        );
      }
    },
    checklist: {
      title: 'Development Checklist',
      desc: 'Task breakdown for your engineering team',
      icon: '✓',
      render: () => {
        const stories = pmMsg?.payload?.userStories as string[] || [
          "As an operator, I want to input my project prompt to synthesize configurations.",
          "As an engineer, I want clean JSON route parameters to develop endpoints.",
          "As a QA specialist, I want integration tests to verify database parameters."
        ];
        return (
          <div className="space-y-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-600 font-sans">
            <div className="font-semibold text-black uppercase tracking-wider text-[9px] font-mono mb-1">Scope Checklists</div>
            {stories.map((story: string, i: number) => (
              <div key={i} className="flex gap-2.5 items-start">
                <input type="checkbox" readOnly checked className="mt-0.5 accent-black h-3.5 w-3.5" />
                <span>{story}</span>
              </div>
            ))}
          </div>
        );
      }
    },
    stack: {
      title: 'Technology Stack',
      desc: 'Recommended frameworks, libraries, and tools',
      icon: '⚙️',
      render: () => {
        const stack = (archMsg?.payload?.stack as string[]) || ['Next.js', 'TypeScript', 'Tailwind CSS', 'REST API'];
        const principles = (archMsg?.payload?.designPrinciples as string[]) || ['modular components', 'clean separation of concerns'];
        return (
          <div className="space-y-4 pt-3 border-t border-neutral-100 font-mono text-[11px] text-neutral-600">
            <div>
              <div className="font-semibold text-black uppercase tracking-wider text-[9px] mb-1.5">Runtime Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {stack.map((item, i) => (
                  <span key={i} className="px-2 py-0.5 border border-neutral-200 text-black">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-black uppercase tracking-wider text-[9px] mb-1">System Principles</div>
              <ul className="list-disc pl-4 space-y-1">
                {principles.map((pr, i) => (
                  <li key={i}>{pr}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      }
    },
    milestones: {
      title: 'Project Milestones',
      desc: 'Key deliverables and completion criteria',
      icon: '🎯',
      render: () => {
        const nextActions = (releaseMsg?.payload?.approvalReport as any)?.nextSteps || [
          'Deploy production container instances',
          'Establish monitoring configurations',
          'Export API schemas to engineering repo'
        ];
        return (
          <div className="space-y-3 pt-3 border-t border-neutral-100 font-mono text-[11px] text-neutral-600">
            <div className="font-semibold text-black uppercase tracking-wider text-[9px] mb-1">Post-Approval Run List</div>
            {nextActions.map((action: string, i: number) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="inline-block w-1.5 h-1.5 bg-black rounded-none"></span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        );
      }
    },
    schema: {
      title: 'Database Schema',
      desc: 'Entity relationships and data models',
      icon: '🗄️',
      render: () => {
        const schema = engData?.databaseSchema || {
          projects: ['id', 'prompt', 'status', 'createdAt'],
          messages: ['id', 'projectId', 'agent', 'payload']
        };
        return (
          <div className="space-y-3 pt-3 border-t border-neutral-100 font-mono text-[11px] text-neutral-600">
            {Object.entries(schema).map(([table, cols]: [string, any]) => (
              <div key={table} className="border border-neutral-200 p-2">
                <div className="font-bold text-black uppercase mb-1">{table}</div>
                <div className="flex flex-wrap gap-1.5">
                  {cols.map((col: string, i: number) => (
                    <span key={i} className="bg-neutral-50 px-1 py-0.5 border border-neutral-100 text-[10px]">{col}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }
    },
    endpoints: {
      title: 'API Endpoints',
      desc: 'RESTful interfaces for your application',
      icon: '🔌',
      render: () => {
        const endpoints = engData?.apiEndpoints || [
          { path: '/api/projects', method: 'POST', purpose: 'Create project' },
          { path: '/api/workflow', method: 'POST', purpose: 'Trigger workflow run' }
        ];
        return (
          <div className="space-y-3 pt-3 border-t border-neutral-100 font-mono text-[11px]">
            {endpoints.map((ep: any, i: number) => (
              <div key={i} className="flex justify-between items-center border border-neutral-200 p-2">
                <div>
                  <span className="font-bold text-black border border-neutral-300 px-1.5 py-0.5 mr-2 text-[9px] uppercase">{ep.method}</span>
                  <span className="text-neutral-600 font-semibold">{ep.path}</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-sans">{ep.purpose}</span>
              </div>
            ))}
          </div>
        );
      }
    }
  };

  return (
    <section className="py-12 border-t border-neutral-200 mt-12 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-left">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">SYNTHESIS CONCLUSION</span>
          <h2 className="text-2xl font-light tracking-tight text-black mt-1">
            Next Steps
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Your system architecture has been verified. Select any deliverable below to inspect generated specifications.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(stepsDetails).map(([key, step]) => {
            const isSelected = selectedStep === key;
            return (
              <div
                key={key}
                onClick={() => setSelectedStep(isSelected ? null : key)}
                className={`border p-6 transition-all cursor-pointer text-left space-y-4 hover:border-black ${
                  isSelected ? 'border-black bg-white ring-1 ring-black' : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-lg flex-shrink-0 pt-0.5">{step.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-black uppercase tracking-wider">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-light mt-1 leading-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="animate-slide-in" onClick={(e) => e.stopPropagation()}>
                    {step.render()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="mt-8 p-6 border border-neutral-200 bg-white flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h3 className="text-xs font-semibold text-black uppercase tracking-wider">Interface Audit Complete</h3>
            <p className="text-[11px] text-neutral-500 font-light mt-1">Have questions about the technical choices? Open the persistent assistant below.</p>
          </div>
          <button 
            onClick={() => {
              // Trigger click on chat button
              const chatBtn = document.getElementById('chat-toggle-btn');
              if (chatBtn) chatBtn.click();
            }}
            className="text-xs font-semibold uppercase tracking-wider text-white bg-black px-4 py-2 border border-black hover:bg-neutral-800 transition-colors"
          >
            Audit Assistant
          </button>
        </div>
      </div>
    </section>
  );
}
