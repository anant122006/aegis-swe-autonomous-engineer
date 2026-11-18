import React, { useState } from 'react';
import { BENCHMARK_ITEMS } from '../mockData/benchmarks';
import { Play, Sparkles, FolderGit2, AlertCircle } from 'lucide-react';

interface IssueInputProps {
  onRunAgent: (issue: {
    issueId: string;
    title: string;
    description: string;
    repositoryName: string;
    branch: string;
  }) => void;
  isRunning: boolean;
}

export const IssueInput: React.FC<IssueInputProps> = ({ onRunAgent, isRunning }) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>(BENCHMARK_ITEMS[0].id);
  const [issueId, setIssueId] = useState<string>(BENCHMARK_ITEMS[0].id);
  const [title, setTitle] = useState<string>(BENCHMARK_ITEMS[0].title);
  const [description, setDescription] = useState<string>(BENCHMARK_ITEMS[0].description);
  const [repo, setRepo] = useState<string>(BENCHMARK_ITEMS[0].repositoryName);
  const [branch, setBranch] = useState<string>('main');

  const handleBenchmarkSelect = (bId: string) => {
    setSelectedBenchmark(bId);
    const item = BENCHMARK_ITEMS.find(b => b.id === bId);
    if (item) {
      setIssueId(item.id);
      setTitle(item.title);
      setDescription(item.description);
      setRepo(item.repositoryName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onRunAgent({
      issueId: issueId || 'ISSUE-' + Math.floor(Math.random() * 900 + 100),
      title,
      description,
      repositoryName: repo || 'repo/core',
      branch: branch || 'main'
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-brand-400" aria-hidden="true" />
            <span>Target Issue & SWE Benchmark Scenarios</span>
          </h2>
          <p className="text-xs text-slate-400">
            Select a verified SWE-Bench benchmark or input your custom engineering ticket.
          </p>
        </div>

        {/* Benchmark Chips */}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Quick Select Benchmarks">
          {BENCHMARK_ITEMS.map(b => (
            <button
              key={b.id}
              type="button"
              onClick={() => handleBenchmarkSelect(b.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                selectedBenchmark === b.id
                  ? 'bg-brand-500/10 border-brand-500 text-brand-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              aria-pressed={selectedBenchmark === b.id}
            >
              {b.id}: {b.category.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label htmlFor="issue-id" className="block text-xs font-medium text-slate-300 mb-1">
              Issue Key
            </label>
            <input
              id="issue-id"
              type="text"
              value={issueId}
              onChange={e => setIssueId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              placeholder="e.g. SEC-104"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="repo-name" className="block text-xs font-medium text-slate-300 mb-1">
              Target Repository
            </label>
            <input
              id="repo-name"
              type="text"
              value={repo}
              onChange={e => setRepo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              placeholder="organization/repo-name"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="branch-name" className="block text-xs font-medium text-slate-300 mb-1">
              Base Branch
            </label>
            <input
              id="branch-name"
              type="text"
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              placeholder="main"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="issue-title" className="block text-xs font-medium text-slate-300 mb-1">
            Issue Title / Bug Description
          </label>
          <input
            id="issue-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            placeholder="e.g. Fix SQL injection in authentication handler"
            required
          />
        </div>

        <div>
          <label htmlFor="issue-desc" className="block text-xs font-medium text-slate-300 mb-1">
            Issue Context & Acceptance Criteria
          </label>
          <textarea
            id="issue-desc"
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            placeholder="Describe the defect, required test coverage, and constraints..."
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-brand-400" aria-hidden="true" />
            <span>Autonomous Pipeline: Ingestion $\rightarrow$ AST Index $\rightarrow$ TDD Red/Green $\rightarrow$ SAST Audit $\rightarrow$ PR</span>
          </div>

          <button
            type="submit"
            disabled={isRunning}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold transition shadow-lg shadow-brand-600/20 focus:ring-2 focus:ring-brand-400"
            aria-live="polite"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running SWE Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Execute Autonomous Engineer</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
