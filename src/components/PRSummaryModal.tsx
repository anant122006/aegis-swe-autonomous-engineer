import React, { useState } from 'react';
import { X, GitPullRequest, GitCommit, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { SWEResult } from '../types';

interface PRSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SWEResult | null;
}

export const PRSummaryModal: React.FC<PRSummaryModalProps> = ({ isOpen, onClose, result }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const pr = result.pullRequest;

  const handleCopy = () => {
    navigator.clipboard.writeText(pr.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pr-modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5 text-brand-400" aria-hidden="true" />
            <h2 id="pr-modal-title" className="text-lg font-bold text-white">
              Autonomous Pull Request #{pr.prNumber}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus:ring-2 focus:ring-brand-400"
            aria-label="Close Pull Request Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branch Details */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">{pr.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-medium">{pr.branch}</span>
              <span>$\rightarrow$</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{pr.baseBranch}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy PR Markdown'}</span>
            </button>
          </div>
        </div>

        {/* Git Commits */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Generated Git Commits ({pr.commits.length})
          </h4>
          <div className="space-y-1.5">
            {pr.commits.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-850 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-brand-300">{c.hash}</span>
                  <span className="text-slate-300">{c.message}</span>
                </div>
                <span className="text-slate-500 text-[11px]">{c.author}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PR Markdown Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Pull Request Body
          </h4>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {pr.body}
          </pre>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition focus:ring-2 focus:ring-brand-400"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
