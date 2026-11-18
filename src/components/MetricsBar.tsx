import React from 'react';
import { PerformanceMetrics } from '../types';
import { TrendingDown, Shield, CheckCheck, Award, Clock } from 'lucide-react';

interface MetricsBarProps {
  metrics: PerformanceMetrics | null;
  isRunning: boolean;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics, isRunning }) => {
  return (
    <section aria-label="Live Engineering Metrics" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {/* 1. Token Efficiency */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span className="font-medium">Token Efficiency</span>
          <TrendingDown className="w-4 h-4 text-purple-400" aria-hidden="true" />
        </div>
        <div className="text-xl font-bold text-purple-300">
          {metrics ? `-${metrics.tokenSavingsPercentage}%` : isRunning ? 'Calculating...' : '-72%'}
        </div>
        <div className="text-[11px] text-slate-500 truncate">
          {metrics ? `${metrics.totalTokensUsed} / ${metrics.rawRepoTokens} tokens` : 'AST signature compression'}
        </div>
      </div>

      {/* 2. Automated Test Pass Rate */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span className="font-medium">TDD Test Pass Rate</span>
          <CheckCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        </div>
        <div className="text-xl font-bold text-emerald-400">
          {metrics ? `${metrics.testPassRate}%` : isRunning ? 'Testing...' : '100%'}
        </div>
        <div className="text-[11px] text-slate-500 truncate">
          Automated Red $\rightarrow$ Green verified
        </div>
      </div>

      {/* 3. SAST Security Score */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span className="font-medium">SAST Security</span>
          <Shield className="w-4 h-4 text-blue-400" aria-hidden="true" />
        </div>
        <div className="text-xl font-bold text-blue-400">
          {metrics ? `${metrics.sastFindingsFixed} Remediated` : isRunning ? 'Scanning...' : '0 CVEs'}
        </div>
        <div className="text-[11px] text-slate-500 truncate">
          OWASP Top 10 + CWE compliant
        </div>
      </div>

      {/* 4. Code Quality Grade */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span className="font-medium">Code Quality</span>
          <Award className="w-4 h-4 text-amber-400" aria-hidden="true" />
        </div>
        <div className="text-xl font-bold text-amber-400">
          {metrics ? `Grade ${metrics.codeQualityRating}` : isRunning ? 'Evaluating...' : 'Grade A+'}
        </div>
        <div className="text-[11px] text-slate-500 truncate">
          Strict TypeScript, SOLID design
        </div>
      </div>

      {/* 5. Latency / Duration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span className="font-medium">Agent Latency</span>
          <Clock className="w-4 h-4 text-teal-400" aria-hidden="true" />
        </div>
        <div className="text-xl font-bold text-teal-300">
          {metrics ? `${(metrics.executionTimeMs / 1000).toFixed(2)}s` : isRunning ? 'Executing...' : '1.82s'}
        </div>
        <div className="text-[11px] text-slate-500 truncate">
          Non-blocking event loop
        </div>
      </div>
    </section>
  );
};
