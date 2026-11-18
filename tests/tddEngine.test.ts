import { describe, it, expect } from 'vitest';
import { TDDEngine } from '../server/engine/tddEngine.js';

describe('TDDEngine (Parameter 4: Testing & Autonomous TDD Loop)', () => {
  it('should generate test specifications tailored to security issues', () => {
    const tests = TDDEngine.generateTestSuitesForIssue(
      'Fix SQL Injection in Login Route',
      'Need to prevent unauthorized database querying'
    );

    expect(tests.length).toBeGreaterThanOrEqual(4);
    expect(tests.some(t => t.suite.includes('Security') || t.name.includes('SQL'))).toBe(true);
  });

  it('should generate test specifications tailored to performance issues', () => {
    const tests = TDDEngine.generateTestSuitesForIssue(
      'High Concurrency LRU Cache Eviction Bottleneck',
      'Optimize latency and thread locks'
    );

    expect(tests.length).toBeGreaterThanOrEqual(4);
    expect(tests.some(t => t.suite.includes('Performance') || t.name.includes('evict'))).toBe(true);
  });

  it('should simulate test execution and verify self-healing recovery', () => {
    const tests = TDDEngine.generateTestSuitesForIssue('Bug in processing pipeline', 'Workflow crash');
    const { initialRun, healedRun } = TDDEngine.executeTests(tests, true);

    expect(initialRun.failed).toBe(1);
    expect(initialRun.allPassed).toBe(false);

    expect(healedRun).toBeDefined();
    expect(healedRun?.failed).toBe(0);
    expect(healedRun?.allPassed).toBe(true);
  });
});
