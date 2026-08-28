import { expect, test } from "@playwright/test";

const authenticatedTest = process.env.E2E_AUTH_STORAGE_STATE ? test : test.skip;

test("landing offers both product paths", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "See the problem. Change the record. Trace the result." })).toBeVisible();
  await expect(page.getByRole("list", { name: "PF Health evidence route" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open Guided Ravi/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Enter PF Record Laboratory/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "See how I built PF Health with Codex" })).toHaveAttribute("href", "/codex");
  await expect(page.getByRole("link", { name: "Explore the Codex build journey →" })).toHaveAttribute("href", "/codex");

  const guidedTab = page.locator('[data-path-tab="guided"]');
  const laboratoryTab = page.locator('[data-path-tab="laboratory"]');
  const guidedSideTab = page.locator('[data-path-side-tab="guided"]');
  const laboratorySideTab = page.locator('[data-path-side-tab="laboratory"]');
  const guidedRail = page.locator('[data-path-side-rail="guided"]');
  const laboratoryRail = page.locator('[data-path-side-rail="laboratory"]');
  const tabPath = "M1 25L10 8C12 3.5 16.5 1 22 1H116C125 1 132 5 137 14L144 25H1Z";
  const sidePath = "M0 0H8C13.5 0 18 4.5 18 10V116L11 136H0Z";
  await expect(guidedTab.locator("path")).toHaveAttribute("d", tabPath);
  await expect(laboratoryTab.locator("path")).toHaveAttribute("d", tabPath);
  await expect(guidedSideTab.locator("path")).toHaveAttribute("d", sidePath);
  await expect(laboratorySideTab.locator("path")).toHaveAttribute("d", sidePath);
  expect(await guidedTab.locator("path").evaluate((path) => getComputedStyle(path).fill)).toBe("rgb(7, 56, 109)");
  expect(await laboratoryTab.locator("path").evaluate((path) => ({
    fill: getComputedStyle(path).fill,
    stroke: getComputedStyle(path).stroke,
  }))).toEqual({ fill: "rgb(255, 253, 248)", stroke: "rgb(7, 56, 109)" });
  expect(await guidedSideTab.locator("path").evaluate((path) => getComputedStyle(path).fill)).toBe("rgb(7, 56, 109)");
  expect(await guidedRail.evaluate((rail) => getComputedStyle(rail).backgroundColor)).toBe("rgb(7, 56, 109)");
  expect(await laboratorySideTab.locator("path").evaluate((path) => ({
    fill: getComputedStyle(path).fill,
    stroke: getComputedStyle(path).stroke,
  }))).toEqual({ fill: "rgb(255, 253, 248)", stroke: "rgb(7, 56, 109)" });
  expect(await laboratoryRail.evaluate((rail) => ({
    background: getComputedStyle(rail).backgroundColor,
    border: getComputedStyle(rail).borderRightColor,
    borderTopWidth: getComputedStyle(rail).borderTopWidth,
    borderRightWidth: getComputedStyle(rail).borderRightWidth,
    borderBottomWidth: getComputedStyle(rail).borderBottomWidth,
  }))).toEqual({
    background: "rgb(255, 253, 248)",
    border: "rgb(7, 56, 109)",
    borderTopWidth: "0px",
    borderRightWidth: "2px",
    borderBottomWidth: "2px",
  });

  const mobileCardGap = await page.evaluate(() => {
    const guidedCard = document.querySelector('[data-path-side-tab="guided"]')!.parentElement!.getBoundingClientRect();
    const laboratoryTab = document.querySelector('[data-path-tab="laboratory"]')!.getBoundingClientRect();
    const stack = document.querySelector('[data-path-side-tab="guided"]')!.parentElement!.parentElement!;
    return {
      authoredGap: getComputedStyle(stack).gap,
      visibleGap: laboratoryTab.top - guidedCard.bottom,
    };
  });
  expect(mobileCardGap.authoredGap).toBe("64px");
  expect(mobileCardGap.visibleGap).toBeGreaterThanOrEqual(32);

  for (const card of ["guided", "laboratory"]) {
    const geometry = await page.evaluate((name) => {
      const side = document.querySelector(`[data-path-side-tab="${name}"]`)!.getBoundingClientRect();
      const rail = document.querySelector(`[data-path-side-rail="${name}"]`)!.getBoundingClientRect();
      const caseFile = document.querySelector(`[data-path-side-tab="${name}"]`)!.parentElement!.getBoundingClientRect();
      const cardStyle = getComputedStyle(document.querySelector(`[data-path-side-tab="${name}"]`)!.parentElement!);
      return {
        sideExtends: side.right > caseFile.right,
        joinGap: rail.top - side.bottom,
        railBottom: rail.bottom - caseFile.bottom,
        bottomRightRadius: cardStyle.borderBottomRightRadius,
      };
    }, card);
    expect(geometry).toEqual({ sideExtends: true, joinGap: -1, railBottom: 0, bottomRightRadius: "0px" });
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("shared navigation and authentication boundaries connect every product route", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Synthetic records only · No EPFO connection")).toBeVisible();
  expect(await page.locator('[role="note"]').evaluate((notice) => { const bounds = notice.getBoundingClientRect(); return { left: bounds.left, right: bounds.right, viewport: document.documentElement.clientWidth }; })).toEqual({ left: 0, right: 375, viewport: 375 });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(navigation.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/");
  await expect(navigation.getByRole("link", { name: "Guided Ravi", exact: true })).toHaveAttribute("href", "/guided-ravi");
  await expect(navigation.getByRole("link", { name: "Laboratory", exact: true })).toHaveAttribute("href", "/laboratory");
  await expect(navigation.getByRole("link", { name: "Codex Build Journey", exact: true })).toHaveAttribute("href", "/codex");
  await expect(navigation.getByRole("link", { name: "Sign in", exact: true })).toHaveAttribute("href", "/login?next=%2F");
  await expect(page.getByRole("link", { name: "PF Health", exact: true })).toHaveAttribute("href", "/");

  for (const route of ["/guided-ravi", "/laboratory", "/history"]) {
    await page.goto(route);
    await expect(page).toHaveURL(`/login?next=${encodeURIComponent(route)}`);
    await expect(page.getByText("Synthetic records only · No EPFO connection")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Continue securely with Google." })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  }
});

test("public Codex page exposes the curated build ledger without overflow", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 900 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("link", { name: "See how I built PF Health with Codex" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

    await page.goto("/codex");
    await expect(page.getByRole("heading", { name: "The build process is part of the proof." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Complete build journal" })).toBeVisible();
    await expect(page.getByText("Repository documentation harness", { exact: false })).toBeVisible();
    await expect(page.getByText("Raw private chats, credentials, provider tokens, and secret values are never published.", { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  }

  const actionableErrors = consoleErrors.filter((message) => !message.includes(
    "The Cross-Origin-Opener-Policy header has been ignored, because the URL's origin was untrustworthy.",
  ));
  expect(actionableErrors).toEqual([]);
});

test("signed-out navigation stays intentional at responsive widths", async ({ page }) => {
  for (const width of [375, 600, 720, 768, 877, 960]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/login?next=%2Fguided-ravi");
    const menuButton = page.getByRole("button", { name: "Open navigation menu" });
    await expect(menuButton).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
    await menuButton.click();
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");
    const geometry = await page.getByRole("navigation", { name: "Primary navigation" }).evaluate((navigation) => {
      const bounds = navigation.getBoundingClientRect();
      const items = Array.from(navigation.querySelectorAll("a, button")).map((item) => item.getBoundingClientRect());
      const overlaps = items.some((item, index) => items.slice(index + 1).some((other) => (
        item.left < other.right && item.right > other.left && item.top < other.bottom && item.bottom > other.top
      )));
      return {
        contained: items.every((item) => item.left >= bounds.left && item.right <= bounds.right),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        overlaps,
      };
    });
    expect(geometry).toEqual({ contained: true, horizontalOverflow: false, overlaps: false });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
  }
});

authenticatedTest("authenticated navigation stays intentional on Guided Ravi", async ({ page }) => {
  for (const width of [375, 600, 720, 768, 877, 960]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/guided-ravi");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const navigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(navigation.getByRole("link", { name: "My History" })).toBeVisible();
    await expect(navigation.getByRole("button", { name: "Sign out" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  }
});

authenticatedTest("every laboratory preset produces its declared outcome", async ({ page }) => {
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

authenticatedTest("judge edits a record, inspects evidence, and applies a supported fix", async ({ page }) => {
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

authenticatedTest("laboratory supports editable fictional labels and has no duplicate control", async ({ page }) => {
  await page.goto("/laboratory");
  await expect(page.getByRole("button", { name: "Duplicate" })).toHaveCount(0);
  const labels = page.getByLabel("Fictional employer label");
  await labels.first().fill("Fictional Workshop North");
  await page.getByRole("button", { name: "Run assessment" }).click();
  await expect(page.getByText("Fictional Workshop North", { exact: true }).first()).toBeVisible();
});

authenticatedTest("duplicate default previous intervals trigger chronology review", async ({ page }) => {
  await page.goto("/laboratory");
  await page.getByRole("button", { name: "+ Add previous employment" }).click();
  await page.getByRole("button", { name: "+ Add previous employment" }).click();
  await page.getByRole("button", { name: "Run assessment" }).click();
  await expect(page.getByText("REVIEW REQUIRED", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Detected issues/ }).locator("..").getByText("Employment dates overlap and require review", { exact: true })).toBeVisible();
});

authenticatedTest("mobile hierarchy separates case files and groups employment history", async ({ page }) => {
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

authenticatedTest("missing-exit confirmation follows edited chronology and requires a reason", async ({ page }) => {
  await page.goto("/laboratory");
  await page.getByRole("combobox", { name: "Load preset" }).selectOption({ label: "Missing exit" });
  await page.getByLabel("Start date").last().fill("2021-02-02");
  await page.getByRole("button", { name: "Run assessment" }).click();
  await page.getByRole("button", { name: "Prepare simulated exit update" }).click();
  await expect(page.getByLabel("Exit date", { exact: true }).last()).toHaveValue("2021-02-01");
  await expect(page.getByRole("button", { name: "Apply simulated change" })).toBeDisabled();
});

authenticatedTest("workspace cards use the authored case-file tab geometry", async ({ page }) => {
  await page.goto("/laboratory");
  const tabPath = "M1 25L10 8C12 3.5 16.5 1 22 1H116C125 1 132 5 137 14L144 25H1Z";
  for (const name of ["editor", "results"]) {
    const tab = page.locator(`[data-workspace-tab="${name}"]`);
    await expect(tab.locator("path")).toHaveAttribute("d", tabPath);
    expect(await tab.locator("path").evaluate((path) => getComputedStyle(path).fill)).toBe("rgb(7, 56, 109)");
  }
});

authenticatedTest("account-link confirmation has a complete trustworthy-blue outline", async ({ page }) => {
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

authenticatedTest("laboratory has no horizontal overflow at target widths", async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/laboratory");
    await expect(page.getByRole("heading", { name: "Construct the record. Test the consequence." })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  }
});
