import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { SWEAgentOrchestrator } from '../engine/sweAgent.js';
import { SASTSecurityAuditor } from '../engine/securityAuditor.js';
import { ASTCodeIndexer } from '../engine/astIndexer.js';
import { SWERequest } from '../types.js';

export const agentRouter = Router();
const orchestrator = new SWEAgentOrchestrator();

const SWEPayloadSchema = z.object({
  issueId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(5),
  repositoryName: z.string().default('acme/core-infrastructure'),
  branch: z.string().default('main'),
  benchmarkId: z.string().optional(),
  simulatedMode: z.boolean().default(true)
});

// Pre-packaged SWE-Bench benchmark scenarios for instant demo
const BENCHMARKS = [
  {
    id: 'BENCH-01',
    category: 'Security & Auth',
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

// GET /api/benchmarks
agentRouter.get('/benchmarks', (_req: Request, res: Response) => {
  res.json({ benchmarks: BENCHMARKS });
});

// POST /api/swe/run
agentRouter.post('/swe/run', async (req: Request, res: Response) => {
  try {
    const validated = SWEPayloadSchema.parse(req.body);
    const result = await orchestrator.executeTask(validated as SWERequest);
    res.json(result);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Agent Execution Failed', message: err.message });
    }
  }
});

// POST /api/audit
agentRouter.post('/audit', (req: Request, res: Response) => {
  const { code, filename = 'source.ts' } = req.body;
  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Code string is required' });
    return;
  }
  const audit = SASTSecurityAuditor.auditCode({ [filename]: code });
  res.json(audit);
});

// POST /api/index
agentRouter.post('/index', (req: Request, res: Response) => {
  const { code, filename = 'source.ts' } = req.body;
  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Code string is required' });
    return;
  }
  const index = ASTCodeIndexer.indexRepository({ [filename]: code });
  res.json(index);
});
