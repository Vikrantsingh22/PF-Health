import { beforeEach, describe, expect, it, vi } from "vitest";

const { exchangeCodeForSession } = vi.hoisted(() => ({ exchangeCodeForSession: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { exchangeCodeForSession } }),
}));

import { GET } from "@/app/auth/callback/route";

describe("Google OAuth callback", () => {
  beforeEach(() => {
    exchangeCodeForSession.mockReset();
  });

  it("exchanges the PKCE code and returns to the requested protected route", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });

    const response = await GET(new Request("http://localhost:3000/auth/callback?code=oauth-code&next=%2Flaboratory"));

    expect(exchangeCodeForSession).toHaveBeenCalledWith("oauth-code");
    expect(response.headers.get("location")).toBe("http://localhost:3000/laboratory");
  });

  it("rejects an unsafe next URL after a successful exchange", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });

    const response = await GET(new Request("http://localhost:3000/auth/callback?code=oauth-code&next=https%3A%2F%2Fevil.example"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/history");
  });

  it("returns to login when the provider code is absent or invalid", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: new Error("invalid code") });

    const response = await GET(new Request("http://localhost:3000/auth/callback?code=invalid"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/login?error=oauth_failed");
  });
});
