import { describe, expect, it } from "vitest";

describe("application harness", () => {
  it("runs in the configured non-root Docker environment", () => {
    expect(process.getuid?.()).toBe(1000);
    expect(process.env.NEXT_TELEMETRY_DISABLED).toBe("1");
  });
});
