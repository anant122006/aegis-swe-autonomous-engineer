import React from 'react';
import { TestCase } from '../types';
import { CheckCircle2, XCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface TestRunnerViewProps {
  tests: TestCase[];
}

export const TestRunnerView: React.FC<TestRunnerViewProps> = ({ tests }) => {
  if (!tests || tests.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium">No test cases executed yet.</p>
        <p className="text-xs text-slate-500 mt-1">Agent will generate TDD unit, edge, and integration tests automatically.</p>
      </div>
    );
  }

  const passedCount = tests.filter(t => t.status === 'passed').length;
  const passRate = Math.round((passedCount / tests.length) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
      {/* Test Suite Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-white">Autonomous TDD & Regression Test Suite</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
            {passedCount}/{tests.length} Passed ({passRate}%)
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            Self-Healed: Verified
          </span>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="divide-y divide-slate-850 p-2 max-h-[460px] overflow-y-auto">
        {tests.map(test => (
          <div key={test.id} className="p-3 hover:bg-slate-850/50 rounded-lg transition flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              {test.status === 'passed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-label="Passed" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-label="Failed" />
              )}
              <div>
                <p className="text-xs font-medium text-slate-200">
                  {test.name}
                </p>
                <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-400">
                    {test.suite}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{test.type} test</span>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
              {test.durationMs}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
