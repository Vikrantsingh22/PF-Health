import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: null }, error: null }) },
  }),
}));

import { requireApiUser } from "@/lib/auth/current-user";

describe("authenticated API boundary", () => {
  it("rejects a request without a verified Supabase user", async () => {
    await expect(requireApiUser()).rejects.toMatchObject({
      code: "UNAUTHENTICATED",
      message: "Sign in to continue",
    });
  });
});
