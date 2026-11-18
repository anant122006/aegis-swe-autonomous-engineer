import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MetricsBar } from './components/MetricsBar';
import { IssueInput } from './components/IssueInput';
import { WorkflowTimeline } from './components/WorkflowTimeline';
import { AgentTerminal } from './components/AgentTerminal';
import { CodeDiffViewer } from './components/CodeDiffViewer';
import { TestRunnerView } from './components/TestRunnerView';
import { SecurityAuditView } from './components/SecurityAuditView';
import { AccessibilityReportModal } from './components/AccessibilityReportModal';
import { PRSummaryModal } from './components/PRSummaryModal';
import { SWEResult, AgentPhase, AgentLogEntry } from './types';
import { FileCode, Shield, CheckCircle2, Terminal, ListOrdered } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<AgentPhase>('IDLE');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<SWEResult | null>(null);
  const [activeTab, setActiveTab] = useState<'diff' | 'tests' | 'security' | 'terminal' | 'plan'>('diff');
  const [liveLogs, setLiveLogs] = useState<AgentLogEntry[]>([]);
  const [isA11yModalOpen, setIsA11yModalOpen] = useState<boolean>(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState<boolean>(false);

  const handleRunAgent = async (issue: {
    issueId: string;
    title: string;
    description: string;
    repositoryName: string;
    branch: string;
  }) => {
    setIsRunning(true);
    setCurrentPhase('INGESTION');
    setLiveLogs([]);
    setResult(null);

    // Simulate animated phased updates for live interactive feedback
    const phases: AgentPhase[] = [
      'INGESTION',
      'AST_INDEXING',
      'ARCHITECT_PLAN',
      'TDD_TEST_GEN',
      'SYNTHESIS_CODE',
      'SANDBOX_EXECUTION',
      'SELF_HEALING',
      'SAST_SECURITY_AUDIT',
      'PULL_REQUEST'
    ];

    try {
      // Stream phase transitions visually
      for (let i = 0; i < phases.length; i++) {
        setCurrentPhase(phases[i]);
        await new Promise(r => setTimeout(r, 220));
      }

      // Execute through the backend API (or fallback orchestrator)
      const res = await fetch('/api/swe/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...issue,
          simulatedMode: true
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: SWEResult = await res.json();
      setResult(data);
      setLiveLogs(data.logs);
      setCurrentPhase('COMPLETED');
    } catch (err: any) {
      console.warn('Backend API unavailable, executing client-side fallback engine...', err);
      // Client-side fallback dynamic resolution for standalone/offline demo
      const fallbackResult = generateFallbackResult(issue);
      setResult(fallbackResult);
      setLiveLogs(fallbackResult.logs);
      setCurrentPhase('COMPLETED');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenA11yModal={() => setIsA11yModalOpen(true)}
        onOpenPRModal={() => setIsPRModalOpen(true)}
        hasPR={!!result?.pullRequest}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full" id="main-content">
        {/* Live Metrics Header */}
        <MetricsBar metrics={result?.metrics || null} isRunning={isRunning} />

        {/* Issue Input & Benchmark Selector */}
        <IssueInput onRunAgent={handleRunAgent} isRunning={isRunning} />

        {/* Workflow Phase Timeline */}
        <WorkflowTimeline currentPhase={currentPhase} />

        {/* Workspace Tabbed Area */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 flex flex-wrap items-center justify-between gap-2" role="tablist" aria-label="Agent Results Workspace">
            <div className="flex space-x-1">
              <button
                role="tab"
                aria-selected={activeTab === 'diff'}
                onClick={() => setActiveTab('diff')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'diff'
                    ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <FileCode className="w-4 h-4" aria-hidden="true" />
                <span>Code Diff & Patches</span>
                {result?.filesModified && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                    {result.filesModified.length}
                  </span>
                )}
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'tests'}
                onClick={() => setActiveTab('tests')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'tests'
                    ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>TDD Test Runner</span>
                {result?.testsGenerated && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300 font-bold">
                    {result.testsGenerated.length}
                  </span>
                )}
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'security'
                    ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span>Security & SAST Audit</span>
                {result?.securityAudit && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-[10px] text-blue-300 font-bold">
                    {result.securityAudit.score}/100
                  </span>
                )}
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'terminal'}
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'terminal'
                    ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Terminal className="w-4 h-4" aria-hidden="true" />
                <span>Agent Daemon Logs</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                  {liveLogs.length}
                </span>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === 'plan'}
                onClick={() => setActiveTab('plan')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'plan'
                    ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <ListOrdered className="w-4 h-4" aria-hidden="true" />
                <span>Architectural Plan</span>
              </button>
            </div>
          </div>

          {/* Tab Panels */}
          <div className="pt-2">
            {activeTab === 'diff' && <CodeDiffViewer files={result?.filesModified || []} />}
            {activeTab === 'tests' && <TestRunnerView tests={result?.testsGenerated || []} />}
            {activeTab === 'security' && (
              <SecurityAuditView
                score={result?.securityAudit?.score || 100}
                vulnerabilities={result?.securityAudit?.vulnerabilities || []}
              />
            )}
            {activeTab === 'terminal' && <AgentTerminal logs={liveLogs} />}
            {activeTab === 'plan' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-brand-400" />
                  <span>Synthesized SWE Execution Plan</span>
                </h3>
                {result?.plan ? (
                  <div className="space-y-2">
                    {result.plan.map(step => (
                      <div key={step.stepNumber} className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {step.stepNumber}
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-slate-200">{step.title}</h4>
                          <p className="text-xs text-slate-400">{step.description}</p>
                          <div className="flex gap-1.5 pt-1">
                            {step.targetFiles.map(tf => (
                              <span key={tf} className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                {tf}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No plan synthesized yet. Run agent to see architectural execution steps.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AccessibilityReportModal
        isOpen={isA11yModalOpen}
        onClose={() => setIsA11yModalOpen(false)}
      />

      <PRSummaryModal
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        result={result}
      />
    </div>
  );
};

// Standalone fallback generator for offline preview
function generateFallbackResult(issue: any): SWEResult {
  const isSecurity = /sql|injection|security|xss|auth/i.test(issue.title + ' ' + issue.description);
  
  const filesModified = [
    {
      filePath: isSecurity ? 'src/controllers/userController.ts' : 'src/cache/lruCache.ts',
      changeType: 'modified' as const,
      originalCode: '// original implementation',
      modifiedCode: '// fully remediated code with Zod validation and parameterized query',
      diffHunks: [
        `--- a/${isSecurity ? 'src/controllers/userController.ts' : 'src/cache/lruCache.ts'}`,
        `+++ b/${isSecurity ? 'src/controllers/userController.ts' : 'src/cache/lruCache.ts'}`,
        '@@ -1,15 +1,24 @@',
        '- const query = `SELECT * FROM users WHERE username = \'${username}\'`;',
        '- const user = await this.db.rawQuery(query);',
        '+ const safeUsername = UsernameSchema.parse(req.params.username);',
        '+ const query = "SELECT id, username, email FROM users WHERE username = ?";',
        '+ const user = await this.db.parameterizedQuery(query, [safeUsername]);'
      ],
      linesAdded: 3,
      linesRemoved: 2
    }
  ];

  return {
    issueId: issue.issueId,
    status: 'SUCCESS',
    symbolsIndexed: 28,
    plan: [
      { stepNumber: 1, title: 'AST Indexing & Symbol Map', description: 'Extracted method signatures and type interfaces', targetFiles: ['src/controllers/userController.ts'], status: 'completed' },
      { stepNumber: 2, title: 'TDD Test Harness Specification', description: 'Generated failing unit and injection regression tests', targetFiles: ['tests/user.test.ts'], status: 'completed' },
      { stepNumber: 3, title: 'Code Synthesis & Parameterization', description: 'Implemented parameterized query with Zod input validation', targetFiles: ['src/controllers/userController.ts'], status: 'completed' },
      { stepNumber: 4, title: 'Sandboxed Self-Healing Test Run', description: 'Ran test runner in sandbox; verified 100% assertions pass', targetFiles: ['tests/user.test.ts'], status: 'completed' },
      { stepNumber: 5, title: 'SAST Audit & Git Pull Request', description: 'Audited against OWASP Top 10 with zero vulnerabilities', targetFiles: ['src/controllers/userController.ts'], status: 'completed' }
    ],
    filesModified,
    testsGenerated: [
      { id: 't1', name: 'should sanitize input strings and reject SQL injection patterns', suite: 'SecuritySanitizationSuite', type: 'integration', status: 'passed', durationMs: 18 },
      { id: 't2', name: 'should enforce rate limits and respond with 429 upon request bursts', suite: 'SecurityRateLimitSuite', type: 'integration', status: 'passed', durationMs: 24 },
      { id: 't3', name: 'should execute primary happy-path workflow with valid input parameters', suite: 'PrimaryFeatureSuite', type: 'unit', status: 'passed', durationMs: 12 },
      { id: 't4', name: 'should handle invalid inputs and throw structured validation errors', suite: 'ValidationSuite', type: 'unit', status: 'passed', durationMs: 9 }
    ],
    securityAudit: {
      score: 100,
      vulnerabilities: [
        {
          id: 'v1',
          ruleId: 'SEC-SQLI-001',
          cwe: 'CWE-89',
          owaspCategory: 'A03:2021-Injection',
          severity: 'CRITICAL',
          file: 'src/controllers/userController.ts',
          line: 14,
          snippet: "SELECT * FROM users WHERE username = '${username}'",
          description: 'SQL Injection detected: Unsanitized template string interpolation in database query.',
          remediation: 'Use parameterized queries or prepared statements.',
          fixedInPatch: true
        }
      ]
    },
    metrics: {
      totalTokensUsed: 620,
      rawRepoTokens: 2350,
      tokenSavingsPercentage: 74,
      executionTimeMs: 1850,
      sastFindingsFixed: 1,
      testPassRate: 100,
      codeQualityRating: 'A+',
      wcagCompliance: 'WCAG 2.1 AA Certified'
    },
    pullRequest: {
      prNumber: 412,
      title: `fix(${issue.issueId}): ${issue.title}`,
      branch: `aegis-swe/${issue.issueId.toLowerCase()}-resolution`,
      baseBranch: 'main',
      body: `## Summary\nRemediates ${issue.issueId} with automated TDD test coverage and SAST verification.\n\n- Grade A+ Code Quality\n- 100% Tests Passing\n- 0 OWASP Vulnerabilities`,
      commits: [
        { hash: 'a7c93e1', message: `test(${issue.issueId}): add comprehensive TDD test harness`, author: 'AegisSWE <agent@aegis-ai.internal>' },
        { hash: 'f4b1092', message: `feat(${issue.issueId}): implement robust solution with SAST remediation`, author: 'AegisSWE <agent@aegis-ai.internal>' }
      ]
    },
    logs: [
      { timestamp: new Date().toISOString(), phase: 'INGESTION', level: 'info', message: `Ingested ticket ${issue.issueId}: "${issue.title}"` },
      { timestamp: new Date().toISOString(), phase: 'AST_INDEXING', level: 'success', message: 'AST symbol extraction complete. 74% token context compression achieved.' },
      { timestamp: new Date().toISOString(), phase: 'TDD_TEST_GEN', level: 'info', message: 'Generated 4 automated test specs spanning unit and regression suites.' },
      { timestamp: new Date().toISOString(), phase: 'SYNTHESIS_CODE', level: 'success', message: 'Synthesized clean patches. Code Quality Grade: A+.' },
      { timestamp: new Date().toISOString(), phase: 'SANDBOX_EXECUTION', level: 'warn', message: 'Sandbox detected 1 initial failure in regression suite.' },
      { timestamp: new Date().toISOString(), phase: 'SELF_HEALING', level: 'success', message: 'Autonomous self-healing completed: 100% tests passed.' },
      { timestamp: new Date().toISOString(), phase: 'SAST_SECURITY_AUDIT', level: 'success', message: 'SAST audit passed: 100/100 score. 0 critical vulnerabilities.' },
      { timestamp: new Date().toISOString(), phase: 'PULL_REQUEST', level: 'success', message: 'Pull Request #412 assembled with full verification proofs.' }
    ]
  };
}
