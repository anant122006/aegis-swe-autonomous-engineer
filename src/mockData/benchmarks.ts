import { BenchmarkItem } from '../types';

export const BENCHMARK_ITEMS: BenchmarkItem[] = [
  {
    id: 'BENCH-01',
    category: 'Security & Auth (OWASP A03)',
    title: 'CVE-2026-8942: SQL Injection & Missing Rate Limiting in User Auth Route',
    description: 'User input in UserController is concatenated directly into SQL queries without parametrization or input validation. Need parameterized queries, Zod validation, and rate limiter.',
    repositoryName: 'enterprise/auth-gateway',
    difficulty: 'Hard',
    tags: ['OWASP A03', 'CWE-89', 'SQLi', 'Zod', 'RateLimiting']
  },
  {
    id: 'BENCH-02',
    category: 'High-Concurrency & Performance',
    title: 'O(N) LRU Cache Bottleneck Under High-Concurrency Load',
    description: 'Current cache eviction algorithm uses O(N) linear scans causing thread lock contention and latency spikes under 10k req/sec load. Refactor to O(1) Doubly Linked List with Hash Map.',
    repositoryName: 'fintech/realtime-orderbook',
    difficulty: 'Medium',
    tags: ['DataStructures', 'O(1)', 'DoublyLinkedList', 'Concurrency']
  },
  {
    id: 'BENCH-03',
    category: 'Core Reliability & Crash Bug',
    title: 'Unhandled Null Step Handler Crash in Distributed Workflow Pipeline',
    description: 'Workflow execution engine crashes ungracefully with TypeError when an optional pipeline step handler is missing or throws an asynchronous rejection. Implement defensive validation and fallback isolation.',
    repositoryName: 'cloud/event-orchestrator',
    difficulty: 'Medium',
    tags: ['Reliability', 'DefensiveProgramming', 'FaultTolerance']
  }
];
