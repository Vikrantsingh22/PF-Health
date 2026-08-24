import { expect, test } from "@playwright/test";

test("Ravi moves from 4/5 to 5/5 and resets", async ({ page }) => {
  await page.goto("/");

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
