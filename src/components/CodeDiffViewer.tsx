import React, { useState } from 'react';
import { FileDiff } from '../types';
import { FileCode, Plus, Minus, Check, Copy } from 'lucide-react';

interface CodeDiffViewerProps {
  files: FileDiff[];
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ files }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!files || files.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <FileCode className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium">No code patches generated yet.</p>
        <p className="text-xs text-slate-500 mt-1">Execute the autonomous agent to inspect unified Git diffs.</p>
      </div>
    );
  }

  const currentFile = files[selectedFileIdx] || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.modifiedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
      {/* File Navigation Tabs */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Modified Files">
          {files.map((f, idx) => (
            <button
              key={f.filePath}
              role="tab"
              aria-selected={idx === selectedFileIdx}
              onClick={() => setSelectedFileIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                idx === selectedFileIdx
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
              <span>{f.filePath}</span>
              <span className="flex items-center text-[10px] ml-1">
                <span className="text-emerald-400">+{f.linesAdded}</span>
                <span className="text-red-400 ml-1">-{f.linesRemoved}</span>
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
          aria-label="Copy full modified source code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Clean File'}</span>
        </button>
      </div>

      {/* Accessible Diff Content */}
      <div className="p-4 overflow-x-auto max-h-[460px] font-mono text-xs leading-relaxed">
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-850">
          {currentFile.diffHunks.map((line, lIdx) => {
            const isAdded = line.startsWith('+') && !line.startsWith('+++');
            const isRemoved = line.startsWith('-') && !line.startsWith('---');
            const isHeader = line.startsWith('@@') || line.startsWith('---') || line.startsWith('+++');

            return (
              <div
                key={lIdx}
                className={`flex items-start px-2 py-0.5 rounded ${
                  isAdded
                    ? 'bg-emerald-950/40 text-emerald-300 font-medium'
                    : isRemoved
                    ? 'bg-red-950/40 text-red-300 line-through font-medium opacity-80'
                    : isHeader
                    ? 'text-cyan-400 font-semibold py-1 bg-slate-900/60'
                    : 'text-slate-300'
                }`}
                aria-label={
                  isAdded
                    ? `Added line: ${line.substring(1)}`
                    : isRemoved
                    ? `Removed line: ${line.substring(1)}`
                    : line
                }
              >
                <span className="w-6 select-none opacity-50 text-[10px] text-right mr-3" aria-hidden="true">
                  {lIdx + 1}
                </span>
                <span className="w-4 select-none mr-2 font-bold" aria-hidden="true">
                  {isAdded ? '+' : isRemoved ? '-' : ' '}
                </span>
                <span className="flex-1 whitespace-pre">{line.startsWith('+') || line.startsWith('-') ? line.substring(1) : line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
