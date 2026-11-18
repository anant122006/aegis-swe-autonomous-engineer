import { SecurityVulnerability } from '../types.js';

export class SASTSecurityAuditor {
  private static readonly RULES = [
    {
      ruleId: 'SEC-SQLI-001',
      cwe: 'CWE-89',
      owaspCategory: 'A03:2021-Injection',
      severity: 'CRITICAL' as const,
      regex: /(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\s+.*?\$\{.*?\}/i,
      description: 'SQL Injection detected: Unsanitized template string interpolation in database query.',
      remediation: 'Use parameterized queries or prepared statements (e.g., db.query("SELECT * FROM users WHERE id = ?", [userId])).'
    },
    {
      ruleId: 'SEC-CMDI-002',
      cwe: 'CWE-78',
      owaspCategory: 'A03:2021-Injection',
      severity: 'CRITICAL' as const,
      regex: /(?:child_process|exec|execSync|spawn)\s*\(\s*`[^`]*\$\{.*?\}[^`]*`/,
      description: 'Command Injection: User input dynamically concatenated into system shell command.',
      remediation: 'Use spawn() with separated argument arrays and input whitelisting instead of a raw shell string.'
    },
    {
      ruleId: 'SEC-XSS-003',
      cwe: 'CWE-79',
      owaspCategory: 'A03:2021-Injection',
      severity: 'HIGH' as const,
      regex: /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:\s*(?!DOMPurify)[a-zA-Z0-9_$.]+/,
      description: 'Potential Cross-Site Scripting (XSS): Unsanitized HTML directly injected into DOM.',
      remediation: 'Sanitize dynamic HTML content using DOMPurify.sanitize() before rendering.'
    },
    {
      ruleId: 'SEC-SECRET-004',
      cwe: 'CWE-798',
      owaspCategory: 'A07:2021-Identification and Authentication Failures',
      severity: 'CRITICAL' as const,
      regex: /(?:api_?key|jwt_?secret|private_?key|password|auth_?token)\s*[:=]\s*['"][a-zA-Z0-9_\-]{16,}['"]/i,
      description: 'Hardcoded secret detected: Plaintext credentials or secret tokens committed to source code.',
      remediation: 'Extract credentials to secure environment variables (.env) or a secret manager.'
    },
    {
      ruleId: 'SEC-EVAL-005',
      cwe: 'CWE-95',
      owaspCategory: 'A03:2021-Injection',
      severity: 'HIGH' as const,
      regex: /\beval\s*\([a-zA-Z0-9_$]+\)/,
      description: 'Dynamic Code Execution: Use of eval() creates high severity arbitrary code execution risks.',
      remediation: 'Refactor code to use standard JSON.parse() or a strict parser instead of eval().'
    },
    {
      ruleId: 'SEC-PATH-006',
      cwe: 'CWE-22',
      owaspCategory: 'A01:2021-Broken Access Control',
      severity: 'HIGH' as const,
      regex: /fs\.(?:readFile|writeFile|createReadStream)\s*\(\s*(?:path\.join\([^)]*req\.|`[^`]*\$\{req\.)/,
      description: 'Path Traversal: Unvalidated user request path directly accessed on local filesystem.',
      remediation: 'Resolve and sanitize paths using path.normalize() and verify they remain within the whitelisted root directory.'
    },
    {
      ruleId: 'SEC-RATELIMIT-007',
      cwe: 'CWE-400',
      owaspCategory: 'A04:2021-Insecure Design',
      severity: 'MEDIUM' as const,
      regex: /app\.(?:post|put)\s*\(\s*['"]\/(?:login|register|reset-password|api)/,
      description: 'Missing rate-limiting protection on sensitive authentication or API endpoint.',
      remediation: 'Implement express-rate-limit middleware to prevent brute force and denial of service attacks.'
    }
  ];

  /**
   * Scans code files and returns detailed security vulnerabilities.
   */
  public static auditCode(files: Record<string, string>): {
    score: number;
    vulnerabilities: SecurityVulnerability[];
  } {
    const vulnerabilities: SecurityVulnerability[] = [];

    for (const [file, content] of Object.entries(files)) {
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i];

        for (const rule of this.RULES) {
          if (rule.regex.test(lineText)) {
            vulnerabilities.push({
              id: `vuln-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              ruleId: rule.ruleId,
              cwe: rule.cwe,
              owaspCategory: rule.owaspCategory,
              severity: rule.severity,
              file,
              line: i + 1,
              snippet: lineText.trim(),
              description: rule.description,
              remediation: rule.remediation,
              fixedInPatch: false
            });
          }
        }
      }
    }

    // Calculate security health score (100 is pristine)
    let penalty = 0;
    vulnerabilities.forEach(v => {
      if (v.severity === 'CRITICAL') penalty += 25;
      else if (v.severity === 'HIGH') penalty += 15;
      else if (v.severity === 'MEDIUM') penalty += 8;
      else penalty += 4;
    });

    const score = Math.max(0, 100 - penalty);

    return { score, vulnerabilities };
  }

  /**
   * Masks sensitive credentials in logs or streaming output
   */
  public static redactSecrets(output: string): string {
    return output
      .replace(/(AIzaSy[a-zA-Z0-9_\-]{33})/g, 'AIzaSy[REDACTED_GOOGLE_KEY]')
      .replace(/(sk-[a-zA-Z0-9]{32,})/g, 'sk-[REDACTED_API_KEY]')
      .replace(/(ghp_[a-zA-Z0-9]{36})/g, 'ghp_[REDACTED_GH_TOKEN]')
      .replace(/(Bearer\s+[a-zA-Z0-9._\-]{20,})/gi, 'Bearer [REDACTED_TOKEN]');
  }
}
