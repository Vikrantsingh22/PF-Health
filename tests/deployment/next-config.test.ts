import { describe, expect, it } from "vitest";

import { deploymentOutput } from "../../next.config";

describe("deployment output", () => {
  it("uses Vercel's native Next.js output when the Vercel adapter is active", () => {
    expect(deploymentOutput("1")).toBeUndefined();
  });

  it("retains standalone output for the Docker production image", () => {
    expect(deploymentOutput(undefined)).toBe("standalone");
  });
});
