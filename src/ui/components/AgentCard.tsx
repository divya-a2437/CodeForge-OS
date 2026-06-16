"use client";
import { useState } from 'react';
import type { AgentMessage } from '@/types/workflow';

function safeParse(val: any) {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try {
    // Clean code block ticks if LLM wrapped JSON in ```json ... ```
    let cleaned = val.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    return JSON.parse(cleaned.trim());
  } catch (e) {
    return null;
  }
}

export function AgentCard({ message }: { message: AgentMessage }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const payload = (message.payload ?? {}) as Record<string, any>;

  if (message.status === 'failed') {
    return (
      <article className="border border-red-200 bg-white p-8 space-y-4 animate-scale-in">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500"></div>
          <h3 className="text-base font-semibold text-black uppercase tracking-widest">{message.agent} // Failed</h3>
        </div>
        <p className="text-xs text-neutral-500 font-mono">The agent encountered a technical error during synthesis. Please review system logs in the console for details.</p>
      </article>
    );
  }

  return (
    <article
      className="border border-neutral-200 bg-white p-8 space-y-6 transition-all animate-scale-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">AGENT NODE OUTPUT</span>
          <h3 className="text-base font-semibold text-black mt-0.5">{message.agent}</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs uppercase tracking-wider text-neutral-500 hover:text-black font-mono border-b border-transparent hover:border-black transition-all"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-8 text-xs text-neutral-700 leading-relaxed font-sans">

          {/* PRODUCT MANAGER DETAILS */}
          {message.agent === 'Product Manager' && (
            <div className="space-y-6">
              {payload.projectSummary && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Project Summary</h4>
                  <p className="text-black font-light text-sm leading-relaxed">{payload.projectSummary as string}</p>
                </div>
              )}
              {Array.isArray(payload.featureList) && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Key Features</h4>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-500 font-light">
                    {payload.featureList.map((feature: string, i: number) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(payload.functionalRequirements) && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Functional Requirements</h4>
                  <div className="space-y-4">
                    {payload.functionalRequirements.map((req: any, i: number) => (
                      <div key={i} className="border-l border-black pl-4 py-1 space-y-1">
                        <span className="font-bold text-black text-[11px]">{req.requirement}</span>
                        {req.justification && <p className="text-[10px] text-neutral-400 italic">Justification: {req.justification}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ARCHITECT DETAILS */}
          {message.agent === 'Architect' && (
            <div className="space-y-6">
              {payload.systemDesign && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">System Design</h4>
                  <p className="text-black font-light text-sm leading-relaxed">{payload.systemDesign as string}</p>
                </div>
              )}
              {payload.recommendedTechStack && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Recommended Tech Stack</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {Object.entries(payload.recommendedTechStack as any).map(([layer, details]: [string, any]) => (
                      details.tool ? (
                        <div key={layer} className="p-4 border border-neutral-100 bg-white shadow-sm">
                          <span className="text-[9px] font-bold uppercase text-neutral-400 block mb-1">{layer}</span>
                          <span className="font-bold text-black border-b border-black/10 pb-1 mb-2 block">{details.tool}</span>
                          <p className="text-[10px] text-neutral-500 leading-normal">{details.reason}</p>
                          {details.alternative && <p className="text-[9px] text-neutral-400 mt-2 font-mono">Alt: {details.alternative}</p>}
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}
              {payload.databaseDesign && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Database Design</h4>
                  <p className="text-neutral-600 font-light">{payload.databaseDesign as string}</p>
                </div>
              )}
            </div>
          )}

          {/* ENGINEER DETAILS */}
          {message.agent === 'Engineer' && (
            <div className="space-y-6">
              {Array.isArray(payload.implementationRoadmap) && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Implementation Roadmap</h4>
                  <div className="space-y-2">
                    {payload.implementationRoadmap.map((step: string, i: number) => (
                      <div key={i} className="flex gap-3 text-[11px] items-center">
                        <span className="font-mono text-black font-bold">0{i + 1}</span>
                        <p className="text-neutral-600 font-light">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(payload.componentBreakdown) && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Component Breakdown</h4>
                  <div className="flex flex-wrap gap-2">
                    {payload.componentBreakdown.map((comp: string, i: number) => (
                      <span key={i} className="px-2 py-1 border border-neutral-200 text-[10px] font-mono text-neutral-600 bg-neutral-50">{comp}</span>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(payload.codeSnippets) && payload.codeSnippets.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Key Code Snippets</h4>
                  {payload.codeSnippets.map((snippet: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <p className="text-[10px] text-neutral-400 font-mono">{snippet.description}</p>
                      <pre className="p-4 bg-neutral-900 text-white rounded-none text-[10px] font-mono overflow-x-auto">
                        {snippet.code}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QA DETAILS */}
          {message.agent === 'QA' && (
            <div className="space-y-6">
              {Array.isArray(payload.testCases) && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Test Cases</h4>
                  <div className="space-y-3">
                    {payload.testCases.map((tc: any, i: number) => (
                      <div key={i} className="p-4 border border-neutral-100 bg-neutral-50 space-y-1">
                        <span className="font-bold text-black text-[11px] block">{tc.scenario}</span>
                        <p className="text-[10px] text-neutral-600"><span className="font-bold text-black">Expected:</span> {tc.expectedResult}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {payload.securityTesting && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Security Testing</h4>
                  <p className="text-neutral-600 font-light">{payload.securityTesting as string}</p>
                </div>
              )}
            </div>
          )}

          {/* RELEASE MANAGER DETAILS */}
          {message.agent === 'Release Manager' && (
            <div className="space-y-6">
              {payload.deploymentPlan && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Deployment Plan</h4>
                  <p className="text-black font-light text-sm leading-relaxed">{payload.deploymentPlan as string}</p>
                </div>
              )}
              {Array.isArray(payload.launchChecklist) && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono underline decoration-neutral-200 underline-offset-4">Launch Checklist</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {payload.launchChecklist.map((item: string, i: number) => (
                      <div key={i} className="flex gap-2 items-center text-xs font-light text-neutral-600">
                        <div className="w-1.5 h-1.5 border border-black"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {payload.riskAssessment && (
                <div className="bg-neutral-50 p-6 border border-neutral-200 space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-black font-mono">Risk Assessment</h4>
                  <p className="text-neutral-600 font-light leading-relaxed">{payload.riskAssessment as string}</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </article>
  );
}
