import { describe, it, expect } from 'vitest';
import { SASTSecurityAuditor } from '../server/engine/securityAuditor.js';

describe('SASTSecurityAuditor (Parameter 2: Security & Vulnerability Detection)', () => {
  it('should flag SQL Injection (CWE-89) in string interpolated queries', () => {
    const vulnCode = `
      function getUser(req: any) {
        const query = \`SELECT * FROM users WHERE id = \${req.params.id}\`;
        return db.query(query);
      }
    `;

    const audit = SASTSecurityAuditor.auditCode({ 'src/vuln.ts': vulnCode });

    expect(audit.vulnerabilities.length).toBeGreaterThan(0);
    const sqli = audit.vulnerabilities.find(v => v.ruleId === 'SEC-SQLI-001');
    expect(sqli).toBeDefined();
    expect(sqli?.cwe).toBe('CWE-89');
    expect(sqli?.severity).toBe('CRITICAL');
  });

  it('should flag hardcoded secrets and API keys (CWE-798)', () => {
    const secretCode = `
      const config = {
        api_key: "sk-proj-1234567890abcdef1234567890"
      };
    `;

    const audit = SASTSecurityAuditor.auditCode({ 'src/config.ts': secretCode });

    expect(audit.vulnerabilities.some(v => v.ruleId === 'SEC-SECRET-004')).toBe(true);
  });

  it('should flag dangerous eval statements (CWE-95)', () => {
    const evalCode = `
      function compute(input: string) {
        return eval(input);
      }
    `;

    const audit = SASTSecurityAuditor.auditCode({ 'src/eval.ts': evalCode });

    expect(audit.vulnerabilities.some(v => v.ruleId === 'SEC-EVAL-005')).toBe(true);
  });

  it('should redact sensitive tokens from logs and output', () => {
    const rawOutput = 'Authentication failure for user token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sk-1234567890abcdef1234567890';
    const redacted = SASTSecurityAuditor.redactSecrets(rawOutput);

    expect(redacted).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    expect(redacted).toContain('[REDACTED_');
  });
});
