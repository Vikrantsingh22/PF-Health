import { expect, test } from "@playwright/test";

test("Ravi moves from 4/5 to 5/5 and resets", async ({ page }) => {
  const response = await page.goto("/");
  expect(response).not.toBeNull();
  expect(response?.headers()["content-security-policy"]).toContain("default-src 'self'");
  expect(response?.headers()["permissions-policy"]).toContain("camera=()");
  expect(response?.headers()["referrer-policy"]).toBe("no-referrer");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");

  await expect(page.getByRole("heading", { name: "Check a synthetic PF record before it becomes a problem." })).toBeVisible();
  await expect(page.getByText("Synthetic sample · No EPFO connection")).toBeVisible();

  await page.getByRole("button", { name: "Load Ravi's sample record" }).click();

  await expect(page.getByRole("heading", { name: "4 of 5 checks look healthy" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Supported record checks" }).getByRole("listitem")).toHaveCount(5);
  await expect(page.getByText("Previous employment exit information")).toBeVisible();
  await expect(page.getByText("Needs attention", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your previous employment is missing exit information." })).toBeVisible();

  await page.getByText("Why we're saying this").click();
  await expect(page.getByText("Rule R001 version 1 · Deterministic fallback explanation")).toBeVisible();
  await expect(page.getByRole("link", { name: /official source/i })).toHaveCount(2);

  await page.getByRole("button", { name: "Review what to do next" }).click();
  await expect(page.getByRole("heading", { name: "Confirm the exact synthetic change" })).toBeVisible();
  await expect(page.getByText("2025-06-30")).toBeVisible();
  await expect(page.getByText("This changes only Ravi's sample record. Nothing will be sent to EPFO or an employer.")).toBeVisible();

  const confirmationButtons = await page
    .getByRole("main")
    .getByRole("button")
    .evaluateAll((buttons) => buttons.map((button) => {
      const bounds = button.getBoundingClientRect();
      return { height: bounds.height, width: bounds.width };
    }));
  expect(confirmationButtons).toHaveLength(2);
  expect(confirmationButtons[0]).toEqual(confirmationButtons[1]);

  await page.getByRole("button", { name: "Apply simulated correction" }).click();

  await expect(page.getByRole("heading", { name: "5 of 5 checks look healthy" })).toBeVisible();
  await expect(page.getByText("No known blockers were detected by the checks supported in this prototype.")).toBeVisible();
  await expect(page.getByText("Ravi's exit information is now complete in the sample.")).toBeVisible();
  await expect(page.getByText("The same R001 check now passes. No generated text changed this result.")).toBeVisible();

  await page.getByRole("button", { name: "View activity timeline" }).click();
  await expect(page.getByRole("heading", { name: "Activity timeline" })).toBeVisible();
  await expect(page.getByText("Synthetic correction applied")).toBeVisible();
  await expect(page.getByText("Record revalidated")).toBeVisible();

  await page.getByRole("button", { name: "Reset Ravi's sample" }).click();
  await expect(page.getByRole("heading", { name: "Check a synthetic PF record before it becomes a problem." })).toBeVisible();
});

test("hero controls remain keyboard reachable at 375px", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Load Ravi's sample record" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "4 of 5 checks look healthy" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Review what to do next" })).toBeEnabled();
});

test("case file remains usable across submission widths and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 900 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.getByRole("button", { name: "Load Ravi's sample record" }).click();

    await expect(page.getByRole("heading", { name: "4 of 5 checks look healthy" })).toBeVisible();
    const checkRows = page.getByRole("list", { name: "Supported record checks" }).getByRole("listitem");
    await expect(checkRows).toHaveCount(5);
    await expect(checkRows.nth(2).locator("svg")).toHaveCount(1);
    await expect(checkRows.nth(2)).not.toHaveAttribute("title");
    await expect(page.getByRole("heading", { name: "Your previous employment is missing exit information." })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    const caseFileGeometry = await page
      .getByRole("region", { name: "4 of 5 checks look healthy" })
      .evaluate((caseFile) => {
        const bounds = caseFile.getBoundingClientRect();
        const rightTab = getComputedStyle(caseFile, "::after");
        return {
          overflow: getComputedStyle(caseFile).overflow,
          rightTabEdge: bounds.right - Number.parseFloat(rightTab.right),
          surfaceEdge: bounds.right,
        };
      });
    expect(caseFileGeometry.overflow).toBe("hidden");
    expect(caseFileGeometry.rightTabEdge).toBe(caseFileGeometry.surfaceEdge);

    const transitionDuration = await page
      .getByRole("button", { name: "Review what to do next" })
      .evaluate((button) => getComputedStyle(button).transitionDuration);
    expect(transitionDuration).toBe("0s");
  }
});
