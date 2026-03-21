const Anthropic = require("@anthropic-ai/sdk");
const { ANTHROPIC_API_KEY } = require("../config/env");

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const MODEL = "claude-3-5-sonnet-20241022";
const MAX_TOKENS = 4096;

function buildPrompt(auditContext) {
  const sections = [];

  if (auditContext.npm) {
    const outdated = auditContext.npm.versions.filter((p) => p.isOutdated);
    const errors = auditContext.npm.versions.filter((p) => p.fetchError);
    sections.push(`## npm Packages
Project: ${auditContext.npm.meta.name || "unknown"} v${auditContext.npm.meta.version || "unknown"}
Total packages: ${auditContext.npm.versions.length}
Outdated packages (${outdated.length}):
${outdated.map((p) => `  - ${p.name}: specified ${p.specifiedVersion} → latest ${p.latestVersion}`).join("\n") || "  none"}
Registry fetch errors (${errors.length}):
${errors.map((p) => `  - ${p.name}`).join("\n") || "  none"}`);
  }

  if (auditContext.pypi) {
    const outdated = auditContext.pypi.filter((p) => p.isOutdated);
    sections.push(`## Python (PyPI) Packages
Total packages: ${auditContext.pypi.length}
Outdated packages (${outdated.length}):
${outdated.map((p) => `  - ${p.name}: specified ${p.specifiedVersion} → latest ${p.latestVersion}`).join("\n") || "  none"}`);
  }

  if (auditContext.vscode) {
    sections.push(`## VS Code Extensions
${auditContext.vscode.map((e) => `  - ${e.id}${e.displayName ? ` (${e.displayName})` : ""}${e.latestVersion ? ` — latest: ${e.latestVersion}` : ""}${e.fetchError ? " [fetch error]" : ""}`).join("\n")}`);
  }

  if (auditContext.system) {
    const sys = auditContext.system;
    const runtimes = sys.runtimes || {};
    sections.push(`## System Scan
OS: ${sys.os?.platform} ${sys.os?.release}
Scanned at: ${sys.scannedAt}
Runtimes:
${Object.entries(runtimes).map(([k, v]) => `  - ${k}: ${v}`).join("\n")}
npm global packages: ${sys.npmGlobalPackages?.length || 0}
pip packages: ${sys.pipPackages?.length || 0}
VS Code extensions (from scan): ${sys.vscodeExtensions?.length || 0}`);
  }

  return `You are an expert developer environment health checker. Analyse the following audit data and return a JSON array of findings.

Each finding must be a JSON object with exactly these fields:
- "severity": one of "CRITICAL", "WARNING", or "INFO"
- "category": a short category label, e.g. "npm", "pypi", "vscode", "security", "runtime", "system"
- "title": a concise issue title (max 80 chars)
- "description": a clear explanation of the issue and its impact (2-4 sentences)
- "fixCommand": the exact shell command to fix the issue, or null if not applicable

Rules:
- CRITICAL: security vulnerabilities, major version gaps (3+ major versions behind), deprecated packages with known CVEs, end-of-life runtimes
- WARNING: minor/patch version gaps, deprecated APIs, performance concerns, missing recommended tools
- INFO: best practice suggestions, optional upgrades, informational notes
- Always provide a fixCommand for outdated packages.
- Return ONLY a valid JSON array, no markdown fences, no explanation text.

${sections.join("\n\n")}`;
}

async function analyzeWithClaude(auditContext) {
  const prompt = buildPrompt(auditContext);

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0]?.text?.trim() || "[]";

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (f) =>
        f &&
        typeof f.severity === "string" &&
        typeof f.title === "string" &&
        typeof f.description === "string"
    );
  } catch {
    return [
      {
        severity: "INFO",
        category: "system",
        title: "AI analysis parse error",
        description:
          "Claude returned a response that could not be parsed as structured JSON. Raw output has been logged server-side.",
        fixCommand: null,
      },
    ];
  }
}

module.exports = { analyzeWithClaude };
