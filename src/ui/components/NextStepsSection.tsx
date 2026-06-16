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

  const pmData = pmMsg?.payload || {};
  const archData = archMsg?.payload || {};
  const engData = engMsg?.payload || {};
  const qaData = qaMsg?.payload || {};
  const releaseData = releaseMsg?.payload || {};

  const stepsDetails: Record<string, { title: string; desc: string; icon: string; render: () => React.ReactNode }> = {
    immediate: {
      title: 'Actionable Features',
      desc: 'Specific features grounded in your request',
      icon: '🎯',
      render: () => {
        const features = (pmData.featureList as string[]) || [];
        return (
          <div className="space-y-3 pt-3 border-t border-neutral-100 font-mono text-[11px] text-neutral-600">
            {features.map((feature: string, i: number) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="inline-block w-1.5 h-1.5 bg-black"></span>
                <span className="font-bold text-black">{feature}</span>
              </div>
            ))}
          </div>
        );
      }
    },
    roadmap: {
      title: 'Implementation Plan',
      desc: 'Step-by-step development roadmap',
      icon: '🗺️',
      render: () => {
        const steps = (engData.implementationRoadmap as string[]) || [];
        return (
          <div className="space-y-4 pt-3 border-t border-neutral-100 font-mono text-[11px] text-neutral-600">
            {steps.map((step: string, i: number) => (
              <div key={i} className="space-y-1">
                <div className="text-black font-bold">STEP {i+1}</div>
                <p className="opacity-70">{step}</p>
              </div>
            ))}
          </div>
        );
      }
    },
    testing: {
      title: 'Success Criteria',
      desc: 'Conditions for project completion',
      icon: '✅',
      render: () => {
        const criteria = (pmData.successCriteria as string[]) || [];
        return (
          <div className="space-y-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-600">
            {criteria.map((c, i) => (
              <div key={i} className="flex gap-2 items-start border-l border-neutral-200 pl-3">
                <span className="font-bold text-black min-w-fit">[{i+1}]</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        );
      }
    },
    deployment: {
      title: 'Practical Deployment',
      desc: 'Production rollout strategy',
      icon: '🚀',
      render: () => {
        const plan = (releaseData.deploymentPlan as string) || '';
        return (
          <div className="space-y-4 pt-3 border-t border-neutral-100 font-mono text-[11px] text-neutral-600">
            <div className="bg-neutral-50 p-3 border border-neutral-100">
              <p className="leading-relaxed">{plan}</p>
            </div>
          </div>
        );
      }
    },
    enhancements: {
      title: 'Future Enhancements',
      desc: 'Logical next steps post-launch',
      icon: '📈',
      render: () => {
        const enhancements = (releaseData.futureEnhancements as string) || '';
        return (
          <div className="space-y-3 pt-3 border-t border-neutral-100 font-mono text-[11px] text-neutral-600">
            <p className="leading-relaxed">{enhancements}</p>
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
