import React from 'react';
import { SecurityVulnerability } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

interface SecurityAuditViewProps {
  score: number;
  vulnerabilities: SecurityVulnerability[];
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({ score, vulnerabilities }) => {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <p className="text-sm font-medium">Static Security Audit: 0 Critical Vulnerabilities</p>
        <p className="text-xs text-slate-500 mt-1">Code adheres to OWASP Top 10 and CWE standards.</p>
      </div>
    );
  }

  const fixedCount = vulnerabilities.filter(v => v.fixedInPatch).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
      {/* Security Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-blue-400" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-white">SAST Code Security & OWASP Audit</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold">
            Health Score: {score}/100
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{fixedCount}/{vulnerabilities.length} Remediated</span>
          </span>
        </div>
      </div>

      {/* Vulnerabilities Cards */}
      <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto">
        {vulnerabilities.map(v => (
          <div key={v.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    v.severity === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : v.severity === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {v.severity}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">{v.cwe}</span>
                <span className="text-xs text-slate-500">• {v.owaspCategory}</span>
              </div>

              {v.fixedInPatch ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Remediated by Agent Patch</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-400 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Unresolved</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300">{v.description}</p>

            <div className="bg-slate-900 rounded p-2 text-xs font-mono text-slate-400 border border-slate-850">
              <div className="text-[10px] text-slate-500 mb-1">Target: {v.file}:{v.line}</div>
              <code className="text-red-300">{v.snippet}</code>
            </div>

            <div className="text-xs text-emerald-400/90 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
              <span className="font-semibold">Remediation:</span> {v.remediation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
