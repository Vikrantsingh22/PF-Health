import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClient } = vi.hoisted(() => ({ createClient: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({ createClient }));

import { hasCompletedGuidedRun, listGuidedRuns } from "@/persistence/guided-run-store";
import { listLaboratorySessions } from "@/persistence/laboratory-session-store";

function listQuery() {
  const query = {
    data: [],
    error: null,
    eq: vi.fn(),
    from: vi.fn(),
    gt: vi.fn(),
    limit: vi.fn(),
    order: vi.fn(),
    select: vi.fn(),
  };
  query.from.mockReturnValue(query);
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.gt.mockReturnValue(query);
  query.order.mockReturnValue(query);
  query.limit.mockResolvedValue({ data: [], error: null });
  return query;
}

describe("meaningful private history", () => {
  beforeEach(() => createClient.mockReset());

  it("excludes Laboratory drafts that have never been assessed", async () => {
    const query = listQuery();
    createClient.mockResolvedValue(query);

    await listLaboratorySessions("owner-1");

    expect(query.gt).toHaveBeenCalledWith("snapshot_version", 0);
  });

  it("lists only completed Guided Ravi evidence", async () => {
    const query = listQuery();
    createClient.mockResolvedValue(query);

    await listGuidedRuns("owner-1");

    expect(query.eq).toHaveBeenCalledWith("outcome", "HEALTHY");
  });

  it("detects completion only from the latest Guided Ravi run without mutating it", async () => {
    const query = listQuery() as ReturnType<typeof listQuery> & { maybeSingle: ReturnType<typeof vi.fn> };
    query.limit.mockReturnValue(query);
    query.maybeSingle = vi.fn().mockResolvedValue({ data: { outcome: "HEALTHY" }, error: null });
    createClient.mockResolvedValue(query);

    await expect(hasCompletedGuidedRun("owner-1")).resolves.toBe(true);
    expect(query.order).toHaveBeenCalledWith("updated_at", { ascending: false });
  });
});
