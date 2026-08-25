import { describe, expect, it } from "vitest";
import { GET as presets } from "@/app/api/v1/laboratory/presets/route";
import { POST as create } from "@/app/api/v1/laboratory/sessions/route";
import { POST as run } from "@/app/api/v1/laboratory/sessions/[sessionId]/runs/route";

const jsonRequest = (url: string, body: unknown) => new Request(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

describe("laboratory API", () => {
  it("lists five versioned presets", async () => { const response = await presets(); const body = await response.json(); expect(response.status).toBe(200); expect(body.presets).toHaveLength(5); expect(body.presets[0].scenario.formatVersion).toBe(1); });
  it("rejects unknown import fields", async () => { const response = await create(jsonRequest("http://test/api", { scenario: { format: "pf-health-synthetic-scenario", formatVersion: 1, workflow: "TRANSFER", employments: [], uan: "forbidden" } })); expect(response.status).toBe(400); });
  it("maps stale draft versions to conflict", async () => { const createdResponse = await create(jsonRequest("http://test/api", { presetId: "clean-history" })); const created = await createdResponse.json(); const response = await run(jsonRequest("http://test/api", { expectedDraftVersion: 999 }), { params: Promise.resolve({ sessionId: created.session.sessionId }) }); expect(response.status).toBe(409); });
});
