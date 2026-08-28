import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClient, exchangeCodeForSession } = vi.hoisted(() => ({
  createClient: vi.fn(),
  exchangeCodeForSession: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient,
}));

import { GET } from "@/app/auth/callback/route";

describe("Google OAuth callback", () => {
  beforeEach(() => {
    createClient.mockImplementation(async (response?: { cookies: { set: (name: string, value: string, options: { path: string }) => void } }) => {
      response?.cookies.set("sb-test-auth", "session", { path: "/" });
      return { auth: { exchangeCodeForSession } };
    });
    exchangeCodeForSession.mockReset();
  });

  it("exchanges the PKCE code and returns to the requested protected route", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });

    const response = await GET(new Request("http://localhost:3000/auth/callback?code=oauth-code&next=%2Flaboratory"));

    expect(exchangeCodeForSession).toHaveBeenCalledWith("oauth-code");
    expect(response.headers.get("location")).toBe("http://localhost:3000/laboratory");
    expect(response.headers.get("set-cookie")).toContain("sb-test-auth=session");
  });

  it("rejects an unsafe next URL after a successful exchange", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });

    const response = await GET(new Request("http://localhost:3000/auth/callback?code=oauth-code&next=https%3A%2F%2Fevil.example"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("returns to login without losing the requested destination when the code is invalid", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: new Error("invalid code") });

    const response = await GET(new Request("http://localhost:3000/auth/callback?code=invalid&next=%2Fguided-ravi"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/login?error=oauth_failed&next=%2Fguided-ravi");
  });
});
