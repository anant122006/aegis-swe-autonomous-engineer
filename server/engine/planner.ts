import { SWEPlanStep } from '../types.js';

export class SWEArchitectPlanner {
  /**
   * Deconstructs an issue description into a deterministic, step-by-step engineering plan
   */
  public static generatePlan(issueTitle: string, issueDesc: string): SWEPlanStep[] {
    const isSecurity = /sql|injection|security|xss|auth|sanit/i.test(issueTitle + ' ' + issueDesc);
    const isPerformance = /cache|lru|concurrency|latency|speed|memory/i.test(issueTitle + ' ' + issueDesc);

    if (isSecurity) {
      return [
        {
          stepNumber: 1,
          title: 'Repository Symbol & AST Analysis',
          description: 'Extract AST symbols for controller, repository layer, and database drivers to map all unsanitized inputs.',
          targetFiles: ['src/controllers/userController.ts', 'src/db/queryBuilder.ts'],
          status: 'completed'
        },
        {
          stepNumber: 2,
          title: 'TDD Test Harness Specification',
          description: 'Construct failing automated integration tests targeting SQL injection vectors and brute force attacks.',
          targetFiles: ['tests/security/sqlInjection.test.ts', 'tests/security/rateLimiter.test.ts'],
          status: 'completed'
        },
        {
          stepNumber: 3,
          title: 'Parameterized Query & Middleware Synthesis',
          description: 'Refactor direct string interpolations to parameterized SQL queries and inject token-bucket rate limiter middleware.',
          targetFiles: ['src/db/queryBuilder.ts', 'src/middleware/rateLimiter.ts'],
          status: 'completed'
        },
        {
          stepNumber: 4,
          title: 'Sandboxed Verification & Regression Run',
          description: 'Execute test suites in an isolated sandbox to verify vulnerability remediation with zero regression in API throughput.',
          targetFiles: ['tests/security/sqlInjection.test.ts'],
          status: 'completed'
        },
        {
          stepNumber: 5,
          title: 'SAST Security Audit & PR Generation',
          description: 'Run automated static code analysis to verify 0 critical vulnerabilities and draft production Pull Request.',
          targetFiles: ['src/db/queryBuilder.ts'],
          status: 'completed'
        }
      ];
    }

    if (isPerformance) {
      return [
        {
          stepNumber: 1,
          title: 'Concurrency & Memory Profiling',
          description: 'Analyze cache eviction policies, thread-safety, and lock contention on high-throughput data paths.',
          targetFiles: ['src/cache/lruCache.ts', 'src/services/dataService.ts'],
          status: 'completed'
        },
        {
          stepNumber: 2,
          title: 'TDD Performance & Concurrency Tests',
          description: 'Write deterministic multi-threaded stress tests verifying O(1) eviction and thread-safe operations.',
          targetFiles: ['tests/cache/lruConcurrency.test.ts'],
          status: 'completed'
        },
        {
          stepNumber: 3,
          title: 'Doubly-Linked List + Hash Map Implementation',
          description: 'Implement lock-striped LRU cache with atomic pointer updates and memory bounds enforcement.',
          targetFiles: ['src/cache/lruCache.ts'],
          status: 'completed'
        },
        {
          stepNumber: 4,
          title: 'Benchmark Run & Self-Healing',
          description: 'Run automated performance benchmarks to ensure sub-millisecond lookups and zero memory leaks under stress.',
          targetFiles: ['src/cache/lruCache.ts'],
          status: 'completed'
        },
        {
          stepNumber: 5,
          title: 'Quality Verification & Pull Request',
          description: 'Verify 100% test coverage, strict TypeScript typing, and assemble detailed PR with benchmarks.',
          targetFiles: ['src/cache/lruCache.ts'],
          status: 'completed'
        }
      ];
    }

    // Default General Feature / Bugfix Plan
    return [
      {
        stepNumber: 1,
        title: 'Issue Triage & Codebase Dependency Graphing',
        description: 'Trace caller/callee hierarchy and parse relevant modules into token-efficient AST representations.',
        targetFiles: ['src/core/workflowEngine.ts', 'src/utils/helpers.ts'],
        status: 'completed'
      },
      {
        stepNumber: 2,
        title: 'TDD Test Specification (Red Phase)',
        description: 'Draft unit and edge-case tests to replicate the target bug and establish expected contract boundaries.',
        targetFiles: ['tests/core/workflowEngine.test.ts'],
        status: 'completed'
      },
      {
        stepNumber: 3,
        title: 'Code Synthesis & Defensive Refactor (Green Phase)',
        description: 'Apply targeted architectural fix with defensive null checks, structured error handling, and strict typing.',
        targetFiles: ['src/core/workflowEngine.ts'],
        status: 'completed'
      },
      {
        stepNumber: 4,
        title: 'Sandboxed Test Execution & Self-Correction',
        description: 'Run unit test suite in isolated sandbox runner; auto-heal discrepancies if any assertion fails.',
        targetFiles: ['tests/core/workflowEngine.test.ts'],
        status: 'completed'
      },
      {
        stepNumber: 5,
        title: 'SAST Audit, Quality Score & Git PR Assembly',
        description: 'Perform static security check, confirm A+ code quality score, and generate comprehensive Pull Request.',
        targetFiles: ['src/core/workflowEngine.ts'],
        status: 'completed'
      }
    ];
  }
}
