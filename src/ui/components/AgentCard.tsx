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
  const [isExpanded, setIsExpanded] = useState(true); // default to expanded for readable scrolling stream

  const payload = message.payload || {};
  const aiOutput = payload.aiOutput as string | undefined;
  const requirements = payload.requirements as { summary?: string; highlights?: string[] } | undefined;
  const userStories = payload.userStories as string[] | undefined;
  const stack = payload.stack as string[] | undefined;
  const coreSystems = payload.coreSystems as string[] | undefined;
  const implementationPlan = payload.implementationPlan as string | undefined;
  const review = payload.review as { reviewNotes?: string; issues?: string[] } | undefined;
  const approvalReport = payload.approvalReport as { summary?: string; releaseReadiness?: string; nextSteps?: string[] } | undefined;
  const parsedAiAnalysis = safeParse(payload.aiAnalysis || payload.aiOutput);

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
        <div className="space-y-6 text-xs text-neutral-700 leading-relaxed font-sans">
          
          {/* PRODUCT MANAGER DETAILS */}
          {message.agent === 'Product Manager' && (
            <div className="space-y-5">
              {aiOutput && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Product Synthesis</h4>
                  <p className="text-black font-light text-sm">{aiOutput.replace(/^Product Description:\s*/, '')}</p>
                </div>
              )}
              {requirements?.highlights && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Functional Benchmarks</h4>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-500 font-light">
                    {requirements.highlights.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              {userStories && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">User Scenarios</h4>
                  <ul className="list-decimal pl-4 space-y-1 text-neutral-500 font-light">
                    {userStories.map((story, i) => (
                      <li key={i}>{story}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ARCHITECT DETAILS */}
          {message.agent === 'Architect' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {stack && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Target Frameworks</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 border border-neutral-200 text-[10px] font-mono text-neutral-600 bg-neutral-50">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
                {coreSystems && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Modular Layers</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {coreSystems.map((system, i) => (
                        <span key={i} className="px-2 py-0.5 border border-neutral-200 text-[10px] text-neutral-600">{system}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {parsedAiAnalysis && (
                <div className="space-y-4 pt-2 border-t border-neutral-100">
                  {parsedAiAnalysis.architectureDecisions && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Architecture Standards</h4>
                      <ul className="list-disc pl-4 space-y-1 text-neutral-500 font-light">
                        {parsedAiAnalysis.architectureDecisions.map((decision: string, i: number) => (
                          <li key={i}>{decision}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {parsedAiAnalysis.apiEndpoints && parsedAiAnalysis.apiEndpoints.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Route Specifications</h4>
                      <div className="border border-neutral-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200 text-[9px] uppercase tracking-wider font-mono text-neutral-500">
                              <th className="p-2 border-r border-neutral-200">Method</th>
                              <th className="p-2 border-r border-neutral-200">Route</th>
                              <th className="p-2">Intent</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 text-[11px] font-mono">
                            {parsedAiAnalysis.apiEndpoints.map((ep: any, i: number) => (
                              <tr key={i} className="hover:bg-neutral-50/50">
                                <td className="p-2 border-r border-neutral-200 font-bold text-black">{ep.method}</td>
                                <td className="p-2 border-r border-neutral-200 text-neutral-600">{ep.path}</td>
                                <td className="p-2 text-neutral-500 font-sans">{ep.purpose}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ENGINEER DETAILS */}
          {message.agent === 'Engineer' && (
            <div className="space-y-5">
              {implementationPlan && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Technical Blueprint</h4>
                  <p className="text-black font-light text-sm">{implementationPlan}</p>
                </div>
              )}

              {parsedAiAnalysis && (
                <div className="space-y-4 pt-2 border-t border-neutral-100">
                  {parsedAiAnalysis.folderStructure && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Folder Architecture</h4>
                      <pre className="p-3 border border-neutral-200 bg-neutral-50 text-[10px] font-mono text-neutral-600 block whitespace-pre overflow-x-auto leading-relaxed">
                        {parsedAiAnalysis.folderStructure.map((path: string) => `└── ${path}`).join('\n')}
                      </pre>
                    </div>
                  )}

                  {parsedAiAnalysis.databaseSchema && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Database Schema Mapping</h4>
                      <div className="border border-neutral-200 p-3 bg-neutral-50 space-y-2">
                        {Object.entries(parsedAiAnalysis.databaseSchema).map(([table, cols]: [string, any]) => (
                          <div key={table} className="text-[11px] font-mono">
                            <span className="font-bold text-black uppercase">{table}</span>
                            <span className="text-neutral-400"> ( {Array.isArray(cols) ? cols.join(', ') : JSON.stringify(cols)} )</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsedAiAnalysis.implementationSteps && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Implementation Phases</h4>
                      <ol className="list-decimal pl-4 space-y-1 text-neutral-500 font-light">
                        {parsedAiAnalysis.implementationSteps.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* QA DETAILS */}
          {message.agent === 'QA' && (
            <div className="space-y-5">
              {review?.reviewNotes && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">QA Scope Audit</h4>
                  <p className="text-black font-light">{review.reviewNotes}</p>
                </div>
              )}

              {parsedAiAnalysis && (
                <div className="space-y-4 pt-2 border-t border-neutral-100">
                  <div className="grid grid-cols-2 gap-4">
                    {parsedAiAnalysis.testCases && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Integration Scenarios</h4>
                        <ul className="list-disc pl-4 space-y-1 text-neutral-500 font-light">
                          {parsedAiAnalysis.testCases.map((tc: string, i: number) => (
                            <li key={i}>{tc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {parsedAiAnalysis.securityChecks && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Security Checkpoints</h4>
                        <ul className="list-disc pl-4 space-y-1 text-neutral-500 font-light">
                          {parsedAiAnalysis.securityChecks.map((sc: string, i: number) => (
                            <li key={i}>{sc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {parsedAiAnalysis.releaseRecommendation && (
                    <div className="p-3 border border-neutral-200 bg-neutral-50 text-xs font-mono space-y-1">
                      <span className="font-semibold text-black uppercase text-[10px] tracking-wider block">RECOMMENDATION</span>
                      <span className="text-neutral-600">{parsedAiAnalysis.releaseRecommendation}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* RELEASE MANAGER DETAILS */}
          {message.agent === 'Release Manager' && (
            <div className="space-y-5">
              {approvalReport && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Operator Certification</h4>
                    <span className="px-2 py-0.5 border border-black text-[9px] uppercase tracking-wider font-mono font-bold bg-black text-white">
                      {approvalReport.releaseReadiness || 'APPROVED'}
                    </span>
                  </div>
                  <p className="text-black font-light text-sm">{approvalReport.summary}</p>
                </div>
              )}

              {approvalReport?.nextSteps && (
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">Deployment Instructions</h4>
                  <ul className="list-decimal pl-4 space-y-1 text-neutral-500 font-light">
                    {approvalReport.nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </article>
  );
}
