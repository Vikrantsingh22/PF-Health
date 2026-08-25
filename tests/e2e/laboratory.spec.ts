import { expect, test } from "@playwright/test";

test("landing offers both product paths", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Open Guided Ravi/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Enter PF Record Laboratory/ })).toBeVisible();

  const guidedTab = page.locator('[data-path-tab="guided"]');
  const laboratoryTab = page.locator('[data-path-tab="laboratory"]');
  const tabPath = "M1 25L10 8C12 3.5 16.5 1 22 1H116C125 1 132 5 137 14L144 25H1Z";
  await expect(guidedTab.locator("path")).toHaveAttribute("d", tabPath);
  await expect(laboratoryTab.locator("path")).toHaveAttribute("d", tabPath);
  expect(await guidedTab.locator("path").evaluate((path) => getComputedStyle(path).fill)).toBe("rgb(7, 56, 109)");
  expect(await laboratoryTab.locator("path").evaluate((path) => ({
    fill: getComputedStyle(path).fill,
    stroke: getComputedStyle(path).stroke,
  }))).toEqual({ fill: "rgb(255, 253, 248)", stroke: "rgb(7, 56, 109)" });
});

test("every laboratory preset produces its declared outcome", async ({ page }) => {
  await page.goto("/laboratory");
  const preset = page.getByRole("combobox", { name: "Load preset" });
  for (const [label, outcome] of [
    ["Clean history", "HEALTHY"],
    ["Missing exit", "NEEDS ATTENTION"],
    ["Overlapping employment", "REVIEW REQUIRED"],
    ["Split synthetic accounts", "BLOCKED"],
    ["Compound case", "BLOCKED"],
  ]) {
    await preset.selectOption({ label });
    await page.getByRole("button", { name: "Run assessment" }).click();
    await expect(page.getByText(outcome, { exact: true })).toBeVisible();
  }
});

test("judge edits a record, inspects evidence, and applies a supported fix", async ({ page }) => {
  await page.goto("/laboratory");
  await page.getByRole("combobox", { name: "Load preset" }).selectOption({ label: "Missing exit" });
  await page.getByRole("button", { name: "Run assessment" }).click();
  await expect(page.getByText("NEEDS ATTENTION", { exact: true })).toBeVisible();
  await page.getByText("Read the textual evidence trace").click();
  await expect(page.getByText(/R001 read/)).toBeVisible();
  await page.getByRole("button", { name: "Prepare simulated exit update" }).click();
  await page.getByRole("button", { name: "Apply simulated change" }).click();
  await expect(page.getByText("HEALTHY", { exact: true })).toBeVisible();
  await expect(page.getByText("No correction plan is needed.")).toBeVisible();
});

test("laboratory has no horizontal overflow at target widths", async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/laboratory");
    await expect(page.getByRole("heading", { name: "Construct the record. Test the consequence." })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  }
});
