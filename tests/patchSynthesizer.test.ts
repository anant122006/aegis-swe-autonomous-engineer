import { describe, it, expect } from 'vitest';
import { PatchSynthesizer } from '../server/engine/patchSynthesizer.js';

describe('PatchSynthesizer (Parameter 1: Code Quality)', () => {
  it('should generate standard unified diff hunks with correct line counts', () => {
    const orig = 'line 1\nline 2\nline 3';
    const mod = 'line 1\nmodified line 2\nline 3\nline 4';

    const diff = PatchSynthesizer.createUnifiedDiff('src/example.ts', orig, mod);

    expect(diff.filePath).toBe('src/example.ts');
    expect(diff.linesAdded).toBeGreaterThanOrEqual(2);
    expect(diff.linesRemoved).toBeGreaterThanOrEqual(1);
    expect(diff.diffHunks.some(h => h.startsWith('--- a/'))).toBe(true);
    expect(diff.diffHunks.some(h => h.startsWith('+++ b/'))).toBe(true);
  });

  it('should evaluate code quality and reward type safety and clean patterns', () => {
    const highQualityCode = `
      export class CleanService {
        public async processItem(id: string): Promise<boolean> {
          return true;
        }
      }
    `;

    const quality = PatchSynthesizer.assessCodeQuality(highQualityCode);

    expect(quality.score).toBeGreaterThanOrEqual(90);
    expect(['A+', 'A']).toContain(quality.rating);
    expect(quality.metrics.hasTypeDefinitions).toBe(true);
  });
});
