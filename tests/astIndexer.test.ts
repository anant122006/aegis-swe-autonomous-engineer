import { describe, it, expect } from 'vitest';
import { ASTCodeIndexer } from '../server/engine/astIndexer.js';

describe('ASTCodeIndexer (Parameter 3: Efficiency & Token Optimization)', () => {
  it('should extract functions, classes, and interfaces from code', () => {
    const code = `
      export interface UserProfile {
        id: string;
        username: string;
      }

      export class UserService {
        public async getUser(id: string): Promise<UserProfile> {
          return { id, username: 'test' };
        }
      }

      export function validateId(id: string): boolean {
        return id.length > 0;
      }
    `;

    const summary = ASTCodeIndexer.indexRepository({ 'src/user.ts': code });

    expect(summary.totalFiles).toBe(1);
    expect(summary.totalSymbols).toBeGreaterThanOrEqual(3);
    expect(summary.symbols.some(s => s.name === 'UserProfile' && s.kind === 'interface')).toBe(true);
    expect(summary.symbols.some(s => s.name === 'UserService' && s.kind === 'class')).toBe(true);
    expect(summary.symbols.some(s => s.name === 'validateId' && s.kind === 'function')).toBe(true);
  });

  it('should achieve significant token savings by stripping body implementations', () => {
    const verboseCode = `
      export class MassiveService {
        public executeJob(): void {
          // Bulky logic with repeated lines
          ${Array(50).fill('console.log("doing heavy processing work in loop");').join('\n')}
        }
      }
    `;

    const summary = ASTCodeIndexer.indexRepository({ 'src/massive.ts': verboseCode });

    expect(summary.savingsPercentage).toBeGreaterThanOrEqual(50);
    expect(summary.compressedTokenEstimate).toBeLessThan(summary.rawTokenEstimate);
  });
});
