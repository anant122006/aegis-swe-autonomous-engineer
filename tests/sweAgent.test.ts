import { describe, it, expect } from 'vitest';
import { SWEAgentOrchestrator } from '../server/engine/sweAgent.js';

describe('SWEAgentOrchestrator (Parameter 6: Problem Statement Alignment)', () => {
  it('should run the complete autonomous SWE cycle from ticket to PR', async () => {
    const orchestrator = new SWEAgentOrchestrator();
    const result = await orchestrator.executeTask({
      issueId: 'TEST-101',
      title: 'Fix SQL Injection vulnerability in authentication service',
      description: 'CWE-89 identified in query execution. Needs parameterized query and input validation.',
      repositoryName: 'enterprise/auth',
      branch: 'main',
      simulatedMode: true
    });

    expect(result.status).toBe('SUCCESS');
    expect(result.symbolsIndexed).toBeGreaterThan(0);
    expect(result.plan.length).toBeGreaterThan(0);
    expect(result.filesModified.length).toBeGreaterThan(0);
    expect(result.testsGenerated.length).toBeGreaterThan(0);
    expect(result.metrics.tokenSavingsPercentage).toBeGreaterThanOrEqual(50);
    expect(result.pullRequest.prNumber).toBeGreaterThan(0);
    expect(result.pullRequest.commits.length).toBeGreaterThanOrEqual(2);
    expect(result.securityAudit.score).toBe(100); // Remediated
  });
});
