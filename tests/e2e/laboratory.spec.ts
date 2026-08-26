import { expect, test } from "@playwright/test";

test("landing offers both product paths", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "See the problem. Change the record. Trace the result." })).toBeVisible();
  await expect(page.getByRole("list", { name: "PF Health evidence route" })).toBeVisible();
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
  await expect(page.getByLabel("Exit date", { exact: true }).last()).toHaveValue("2021-03-31");
  await page.getByRole("combobox", { name: "Confirmed exit reason" }).selectOption("RESIGNATION");
  await page.getByRole("button", { name: "Apply simulated change" }).click();
  await expect(page.getByText("HEALTHY", { exact: true })).toBeVisible();
  await expect(page.getByText("No correction plan is needed.")).toBeVisible();
});

test("laboratory supports editable fictional labels and has no duplicate control", async ({ page }) => {
  await page.goto("/laboratory");
  await expect(page.getByRole("button", { name: "Duplicate" })).toHaveCount(0);
  const labels = page.getByLabel("Fictional employer label");
  await labels.first().fill("Fictional Workshop North");
  await page.getByRole("button", { name: "Run assessment" }).click();
  await expect(page.getByText("Fictional Workshop North", { exact: true }).first()).toBeVisible();
});

test("mobile hierarchy separates case files and groups employment history", async ({ page }) => {
  await page.setViewportSize({ width: 549, height: 757 });
  await page.goto("/laboratory");
  await expect(page.getByRole("list", { name: "Laboratory workflow" })).toBeVisible();
  const previousGroup = page.locator('[data-employment-group="previous"]');
  const currentGroup = page.locator('[data-employment-group="current"]');
  await expect(previousGroup.getByRole("heading", { name: "Previous employments" })).toBeVisible();
  await expect(currentGroup.getByRole("heading", { name: "Current employment" })).toBeVisible();
  await page.getByRole("button", { name: "+ Add previous employment" }).click();
  await expect(previousGroup).toContainText("2 records");
  await expect(page.getByLabel("Fictional employer label")).toHaveCount(3);
  expect(await previousGroup.evaluate((element) => element.compareDocumentPosition(document.querySelector('[data-employment-group="current"]')!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();

  const spacing = await page.evaluate(() => {
    const intro = document.querySelector("main > section")!.getBoundingClientRect();
    const editor = document.querySelector('[data-case-file="editor"]')!.getBoundingClientRect();
    const results = document.querySelector('[data-case-file="results"]')!.getBoundingClientRect();
    const current = document.querySelector('[data-employment-group="current"]')!.getBoundingClientRect();
    const run = document.querySelector("button[class*='runButton']")!.getBoundingClientRect();
    return { heroToEditor: editor.top - intro.bottom, betweenFiles: results.top - editor.bottom, currentToRun: run.top - current.bottom };
  });
  expect(spacing.betweenFiles).toBeGreaterThanOrEqual(80);
  expect(spacing.betweenFiles).toBeGreaterThan(spacing.heroToEditor);
  expect(spacing.currentToRun).toBeGreaterThanOrEqual(16);
});

test("missing-exit confirmation follows edited chronology and requires a reason", async ({ page }) => {
  await page.goto("/laboratory");
  await page.getByRole("combobox", { name: "Load preset" }).selectOption({ label: "Missing exit" });
  await page.getByLabel("Start date").last().fill("2021-02-02");
  await page.getByRole("button", { name: "Run assessment" }).click();
  await page.getByRole("button", { name: "Prepare simulated exit update" }).click();
  await expect(page.getByLabel("Exit date", { exact: true }).last()).toHaveValue("2021-02-01");
  await expect(page.getByRole("button", { name: "Apply simulated change" })).toBeDisabled();
});

test("workspace cards use the authored case-file tab geometry", async ({ page }) => {
  await page.goto("/laboratory");
  const tabPath = "M1 25L10 8C12 3.5 16.5 1 22 1H116C125 1 132 5 137 14L144 25H1Z";
  for (const name of ["editor", "results"]) {
    const tab = page.locator(`[data-workspace-tab="${name}"]`);
    await expect(tab.locator("path")).toHaveAttribute("d", tabPath);
    expect(await tab.locator("path").evaluate((path) => getComputedStyle(path).fill)).toBe("rgb(7, 56, 109)");
  }
});

test("account-link confirmation has a complete trustworthy-blue outline", async ({ page }) => {
  await page.goto("/laboratory");
  await page.getByRole("combobox", { name: "Load preset" }).selectOption({ label: "Split synthetic accounts" });
  await page.getByRole("button", { name: "Run assessment" }).click();
  await page.getByRole("button", { name: "Prepare simulated account link" }).click();
  const outline = await page.locator("[data-confirmation-panel]").evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      color: style.borderTopColor,
      widths: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth],
      radii: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius],
    };
  });
  expect(outline.color).toBe("rgb(12, 75, 145)");
  expect(outline.widths).toEqual(["1px", "1px", "1px", "1px"]);
  expect(outline.radii.every((radius) => radius !== "0px")).toBe(true);
});

test("laboratory has no horizontal overflow at target widths", async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/laboratory");
    await expect(page.getByRole("heading", { name: "Construct the record. Test the consequence." })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  }
});
