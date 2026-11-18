import React from 'react';
import { AgentPhase } from '../types';
import { CheckCircle2, CircleDashed, FileCode2, Shield, Wrench, GitPullRequest, Search, Terminal } from 'lucide-react';

interface WorkflowTimelineProps {
  currentPhase: AgentPhase;
}

const PHASES = [
  { id: 'INGESTION', label: 'Ticket Ingest', icon: Search },
  { id: 'AST_INDEXING', label: 'AST Symbol Index', icon: FileCode2 },
  { id: 'ARCHITECT_PLAN', label: 'Architect Plan', icon: Terminal },
  { id: 'TDD_TEST_GEN', label: 'TDD Spec Gen', icon: CheckCircle2 },
  { id: 'SYNTHESIS_CODE', label: 'Code Synthesis', icon: Wrench },
  { id: 'SANDBOX_EXECUTION', label: 'Sandbox Test & Heal', icon: Terminal },
  { id: 'SAST_SECURITY_AUDIT', label: 'SAST Audit', icon: Shield },
  { id: 'PULL_REQUEST', label: 'PR Assembly', icon: GitPullRequest },
];

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ currentPhase }) => {
  const getPhaseIndex = (phase: AgentPhase) => {
    if (phase === 'COMPLETED') return PHASES.length;
    if (phase === 'IDLE') return -1;
    if (phase === 'SELF_HEALING') return 5;
    return PHASES.findIndex(p => p.id === phase);
  };

  const currentIndex = getPhaseIndex(currentPhase);

  return (
    <nav aria-label="Autonomous Engineering Workflow Progress" className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-sm overflow-x-auto">
      <ol className="flex items-center min-w-[720px] justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-800 -z-0" />
        <div
          className="absolute left-6 top-4 h-0.5 bg-brand-500 transition-all duration-500 -z-0"
          style={{
            width: currentIndex >= 0 ? `${(Math.min(currentIndex, PHASES.length - 1) / (PHASES.length - 1)) * 95}%` : '0%'
          }}
        />

        {PHASES.map((p, idx) => {
          const isDone = idx < currentIndex || currentPhase === 'COMPLETED';
          const isCurrent = idx === currentIndex && currentPhase !== 'COMPLETED';
          const IconComponent = p.icon;

          return (
            <li
              key={p.id}
              className="flex flex-col items-center relative z-10 group"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition shadow-md ${
                  isDone
                    ? 'bg-brand-500 text-white ring-4 ring-brand-500/20'
                    : isCurrent
                    ? 'bg-slate-900 border-2 border-brand-400 text-brand-300 animate-pulse ring-4 ring-brand-500/20'
                    : 'bg-slate-800 border border-slate-700 text-slate-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                ) : isCurrent ? (
                  <CircleDashed className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium mt-1.5 whitespace-nowrap ${
                  isDone
                    ? 'text-brand-300'
                    : isCurrent
                    ? 'text-brand-400 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                {p.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
