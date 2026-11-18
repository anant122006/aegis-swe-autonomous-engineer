export type AgentPhase = 
  | 'IDLE'
  | 'INGESTION'
  | 'AST_INDEXING'
  | 'ARCHITECT_PLAN'
  | 'TDD_TEST_GEN'
  | 'SYNTHESIS_CODE'
  | 'SANDBOX_EXECUTION'
  | 'SELF_HEALING'
  | 'SAST_SECURITY_AUDIT'
  | 'PULL_REQUEST'
  | 'COMPLETED'
  | 'FAILED';

export interface CodeSymbol {
  name: string;
  kind: 'function' | 'class' | 'interface' | 'variable' | 'type';
  file: string;
  line: number;
  signature: string;
  dependencies: string[];
}

export interface FileDiff {
  filePath: string;
  changeType: 'modified' | 'added' | 'deleted';
  originalCode: string;
  modifiedCode: string;
  diffHunks: string[];
  linesAdded: number;
  linesRemoved: number;
}

export interface TestCase {
  id: string;
  name: string;
  suite: string;
  type: 'unit' | 'integration' | 'regression';
  status: 'passed' | 'failed' | 'pending';
  durationMs: number;
  failureMessage?: string;
  stackTrace?: string;
}

export interface SecurityVulnerability {
  id: string;
  ruleId: string;
  cwe: string;
  owaspCategory: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  file: string;
  line: number;
  snippet: string;
  description: string;
  remediation: string;
  fixedInPatch: boolean;
}

export interface SWEPlanStep {
  stepNumber: number;
  title: string;
  description: string;
  targetFiles: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface AgentLogEntry {
  timestamp: string;
  phase: AgentPhase;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  totalTokensUsed: number;
  rawRepoTokens: number;
  tokenSavingsPercentage: number;
  executionTimeMs: number;
  sastFindingsFixed: number;
  testPassRate: number;
  codeQualityRating: 'A+' | 'A' | 'B';
  wcagCompliance: string;
}

export interface BenchmarkItem {
  id: string;
  category: string;
  title: string;
  description: string;
  repositoryName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export interface SWEResult {
  issueId: string;
  status: 'SUCCESS' | 'FAILURE';
  plan: SWEPlanStep[];
  symbolsIndexed: number;
  filesModified: FileDiff[];
  testsGenerated: TestCase[];
  securityAudit: {
    score: number;
    vulnerabilities: SecurityVulnerability[];
  };
  metrics: PerformanceMetrics;
  pullRequest: {
    prNumber: number;
    title: string;
    body: string;
    branch: string;
    baseBranch: string;
    commits: Array<{ hash: string; message: string; author: string }>;
  };
  logs: AgentLogEntry[];
}
