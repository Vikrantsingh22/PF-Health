import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { refreshSession } = vi.hoisted(() => ({ refreshSession: vi.fn() }));

vi.mock("@/lib/supabase/proxy", () => ({ refreshSession }));

import { proxy } from "@/proxy";

describe("local authentication origin", () => {
  beforeEach(() => refreshSession.mockReset());

  it("canonicalizes 0.0.0.0 before OAuth cookies can be created", async () => {
    const response = await proxy(new NextRequest("http://0.0.0.0:3000/laboratory?mode=clean", {
      headers: { host: "0.0.0.0:3000" },
    }));

    expect(response.headers.get("location")).toBe("http://localhost:3000/laboratory?mode=clean");
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("keeps localhost requests on the session refresh path", async () => {
    refreshSession.mockResolvedValue(new NextResponse(null, { status: 204 }));
    const request = new NextRequest("http://localhost:3000/guided-ravi", {
      headers: { host: "localhost:3000" },
    });

    const response = await proxy(request);

    expect(response.status).toBe(204);
    expect(refreshSession).toHaveBeenCalledWith(request);
  });
});
