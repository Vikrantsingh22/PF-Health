import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import { raviAfterCorrection, raviBeforeCorrection } from "@/fixtures/ravi";

type Finding = Readonly<{ category: string; file: string }>;

const repositoryRoot = process.cwd();
const scanTargets = [
  "src",
  "tests",
  "public",
  ".env.example",
  ".impeccable/config.json",
  ".impeccable/design.json",
  ".impeccable/mocks/approved/pf-health-case-file.png.json",
  ".impeccable/mocks/approved/pf-health-case-file.prompt.txt",
  ".impeccable/surfaces/src-app-page-tsx.md",
];
const requiredFiles = [
  "README.md",
  "ARCHITECTURE.md",
  "docs/product/DEMO.md",
  "docs/product/SUBMISSION.md",
  "docs/finalist/architecture.svg",
  ".impeccable/mocks/approved/pf-health-case-file.png",
];

const prohibitedPatterns = [
  { category: "private key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { category: "OpenAI-style key", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { category: "AWS access key", pattern: /\bAKIA[A-Z0-9]{16}\b/g },
  { category: "PAN-shaped identifier", pattern: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g },
  { category: "Aadhaar/UAN-shaped identifier", pattern: /\b[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\b/g },
  { category: "Indian mobile-shaped identifier", pattern: /(?:\+91[-\s]?|0)?[6-9][0-9]{9}\b/g },
] as const;

async function collectFiles(target: string): Promise<string[]> {
  const absoluteTarget = path.join(repositoryRoot, target);
  const targetStat = await stat(absoluteTarget);
  if (targetStat.isFile()) return [target];

  const entries = await readdir(absoluteTarget, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => collectFiles(path.join(target, entry.name))),
  );
  return nested.flat();
}

async function scanForProhibitedValues(files: readonly string[]): Promise<Finding[]> {
  const findings: Finding[] = [];

  for (const file of files) {
    const contents = await readFile(path.join(repositoryRoot, file), "utf8");
    for (const { category, pattern } of prohibitedPatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(contents)) findings.push({ category, file });
    }
  }

  return findings;
}

function verifySyntheticFixture(): string[] {
  const errors: string[] = [];
  const fixtures = [raviBeforeCorrection, raviAfterCorrection];

  for (const fixture of fixtures) {
    if (!fixture.memberId.startsWith("demo_")) errors.push("Fixture member ID is not visibly synthetic.");
    for (const employment of fixture.employments) {
      if (!employment.employmentId.startsWith("employment_")) {
        errors.push("Fixture employment ID is not visibly synthetic.");
      }
      if (!employment.employerLabel.startsWith("Synthetic ")) {
        errors.push("Fixture employer label is not visibly synthetic.");
      }
    }
  }

  return errors;
}

async function verifyRuntimeBoundary(): Promise<string[]> {
  const errors: string[] = [];
  const sourceFiles = await collectFiles("src");
  for (const file of sourceFiles) {
    const contents = await readFile(path.join(repositoryRoot, file), "utf8");
    if (/fetch\s*\(\s*["'`]https?:\/\//.test(contents)) {
      errors.push(`External runtime fetch found in ${file}.`);
    }
  }

  const client = await readFile(path.join(repositoryRoot, "src/components/pf-health-app.tsx"), "utf8");
  const externalUrlCalls = [...client.matchAll(/apiFetch(?:<[^>]+>)?\(\s*["'`]([^"'`]+)/g)]
    .map((match) => match[1])
    .filter((url) => !url.startsWith("/api/v1/"));
  if (externalUrlCalls.length > 0) errors.push("Client API calls escape the /api/v1 boundary.");

  return errors;
}

async function main() {
  const files = (await Promise.all(scanTargets.map(collectFiles))).flat();
  const findings = await scanForProhibitedValues(files);
  const fixtureErrors = verifySyntheticFixture();
  const runtimeErrors = await verifyRuntimeBoundary();
  const missingFiles: string[] = [];

  for (const requiredFile of requiredFiles) {
    try {
      await stat(path.join(repositoryRoot, requiredFile));
    } catch {
      missingFiles.push(requiredFile);
    }
  }

  if (findings.length || fixtureErrors.length || runtimeErrors.length || missingFiles.length) {
    for (const finding of findings) console.error(`Prohibited ${finding.category} detected in ${finding.file}.`);
    for (const error of fixtureErrors) console.error(error);
    for (const error of runtimeErrors) console.error(error);
    for (const file of missingFiles) console.error(`Required submission file is missing: ${file}.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Submission verification passed: ${files.length} files scanned; synthetic fixture and runtime boundaries verified.`);
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown verification error";
  console.error(`Submission verification could not complete: ${message}`);
  process.exitCode = 1;
});
