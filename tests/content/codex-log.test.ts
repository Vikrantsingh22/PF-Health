import { describe, expect, it } from "vitest";

import { parseCodexLog } from "@/lib/codex-log";

describe("Codex contribution log parser", () => {
  it("preserves entries written with either historical heading level", () => {
    const parsed = parseCodexLog(`# Codex Contribution Log

Public introduction.

## 2026-08-22 — First mission

**Task:** Build the NEXT_PUBLIC_SUPABASE_URL harness.

- \`Dockerfile\`
- [Official source](https://example.com)

# 2026-08-23 — Second mission

Verification passed.`);

    expect(parsed.introduction).toEqual(["Public introduction."]);
    expect(parsed.sections).toEqual([
      {
        title: "2026-08-22 — First mission",
        blocks: [
          { type: "paragraph", text: "Task: Build the NEXT_PUBLIC_SUPABASE_URL harness." },
          { type: "list", items: ["Dockerfile", "Official source (https://example.com)"] },
        ],
      },
      {
        title: "2026-08-23 — Second mission",
        blocks: [{ type: "paragraph", text: "Verification passed." }],
      },
    ]);
  });
});
