import { expect, test } from "@playwright/test";

test("Ravi moves from 4/5 to 5/5 and resets", async ({ page }) => {
  const response = await page.goto("/guided-ravi");
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
  const issueDossierConnector = await page
    .getByRole("region", { name: "Your previous employment is missing exit information." })
    .evaluate((dossier) => ({ after: getComputedStyle(dossier, "::after").content, before: getComputedStyle(dossier, "::before").content }));
  expect(issueDossierConnector).toEqual({ after: "none", before: "none" });

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
  await expect(page.locator("[data-case-file-decoration='record-top-tab']")).toBeVisible();
  await expect(page.locator("[data-case-file-decoration='record-side-rail']")).toBeVisible();
  await expect(page.getByText("No known blockers were detected by the checks supported in this prototype.")).toBeVisible();
  await expect(page.getByText("Ravi's exit information is now complete in the sample.")).toBeVisible();
  await expect(page.getByText("The same R001 check now passes. No generated text changed this result.")).toBeVisible();
  const healthyDossierConnector = await page
    .getByRole("region", { name: "Ravi's exit information is now complete in the sample." })
    .evaluate((dossier) => ({ after: getComputedStyle(dossier, "::after").content, before: getComputedStyle(dossier, "::before").content }));
  expect(healthyDossierConnector).toEqual({ after: "none", before: "none" });

  await page.getByRole("button", { name: "View activity timeline" }).click();
  await expect(page.getByRole("heading", { name: "Activity timeline" })).toBeVisible();
  await expect(page.getByText("Synthetic correction applied")).toBeVisible();
  await expect(page.getByText("Record revalidated")).toBeVisible();

  await page.getByRole("button", { name: "Reset Ravi's sample" }).click();
  await expect(page.getByRole("heading", { name: "Check a synthetic PF record before it becomes a problem." })).toBeVisible();
});

test("hero controls remain keyboard reachable at 375px", async ({ page }) => {
  await page.goto("/guided-ravi");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  for (const linkName of ["PF Health", "Home", "Guided Ravi", "Laboratory"]) {
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: linkName, exact: true })).toBeFocused();
  }
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Load Ravi's sample record" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "4 of 5 checks look healthy" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Review what to do next" })).toBeEnabled();
});

test("evidence disclosure keeps the guidance-row vertical rhythm", async ({ page }) => {
  await page.setViewportSize({ width: 760, height: 757 });
  await page.goto("/guided-ravi");
  await page.getByRole("button", { name: "Load Ravi's sample record" }).click();

  const spacing = await page.getByText("Why we're saying this", { exact: true }).locator("..")
    .evaluate((summary) => ({
      paddingTop: getComputedStyle(summary).paddingTop,
      paddingBottom: getComputedStyle(summary).paddingBottom,
      height: summary.getBoundingClientRect().height,
    }));
  expect(spacing).toEqual({ paddingTop: "22px", paddingBottom: "22px", height: 92 });
});

test("case file remains usable across submission widths and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 900 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/guided-ravi");

    const welcomeGeometry = await page
      .getByRole("region", { name: "Check a synthetic PF record before it becomes a problem." })
      .evaluate((welcome) => {
        const bounds = welcome.getBoundingClientRect();
        const topTab = welcome.querySelector<HTMLElement>("[data-case-file-decoration='top-tab']");
        const sideTab = welcome.querySelector<HTMLElement>("[data-case-file-decoration='side-tab']");
        const sideRail = welcome.querySelector<HTMLElement>("[data-case-file-decoration='side-rail']");
        if (!topTab || !sideTab || !sideRail) throw new Error("Welcome Case File decorations are missing.");
        const topTabBounds = topTab.getBoundingClientRect();
        const sideTabBounds = sideTab.getBoundingClientRect();
        const sideRailBounds = sideRail.getBoundingClientRect();
        return {
          borderBottomRightRadius: getComputedStyle(welcome).borderBottomRightRadius,
          borderTopLeftRadius: getComputedStyle(welcome).borderTopLeftRadius,
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          overflow: getComputedStyle(welcome).overflow,
          sideRailBottomLeftRadius: getComputedStyle(sideRail).borderBottomLeftRadius,
          sideRailBottomRightRadius: getComputedStyle(sideRail).borderBottomRightRadius,
          sideRailBottom: sideRailBounds.bottom,
          sideRailLeft: sideRailBounds.left,
          sideRailRight: sideRailBounds.right,
          sideRailTop: sideRailBounds.top,
          sideTabBottom: sideTabBounds.bottom,
          sideTabLeft: sideTabBounds.left,
          sideTabRight: sideTabBounds.right,
          surfaceBottom: bounds.bottom,
          surfaceTop: bounds.top,
          surfaceRight: bounds.right,
          topTabBottom: topTabBounds.bottom,
          topTabLeftOffset: getComputedStyle(topTab).left,
          topTabTop: topTabBounds.top,
        };
      });
    await expect(page.locator("[data-case-file-decoration='top-tab'] path")).toHaveAttribute("d", "M0 26L10 7C12 2.5 16.5 0 22 0H116C125 0 132 4 137 13L145 26H0Z");
    await expect(page.locator("[data-case-file-decoration='side-tab'] path")).toHaveAttribute("d", "M0 0H8C13.5 0 18 4.5 18 10V116L11 136H0Z");
    expect(welcomeGeometry.borderBottomRightRadius).toBe("0px");
    expect(welcomeGeometry.borderTopLeftRadius).toBe("0px");
    expect(welcomeGeometry.horizontalOverflow).toBe(false);
    expect(welcomeGeometry.overflow).toBe("visible");
    expect(welcomeGeometry.topTabTop).toBeLessThan(welcomeGeometry.surfaceTop);
    expect(welcomeGeometry.topTabBottom).toBeGreaterThanOrEqual(welcomeGeometry.surfaceTop);
    expect(welcomeGeometry.topTabLeftOffset).toBe("-2px");
    expect(welcomeGeometry.sideTabLeft).toBeLessThanOrEqual(welcomeGeometry.surfaceRight);
    expect(welcomeGeometry.sideTabRight).toBeGreaterThan(welcomeGeometry.surfaceRight);
    expect(welcomeGeometry.sideTabBottom - welcomeGeometry.sideRailTop).toBeGreaterThanOrEqual(0);
    expect(welcomeGeometry.sideTabBottom - welcomeGeometry.sideRailTop).toBeLessThanOrEqual(1);
    expect(welcomeGeometry.sideRailLeft).toBeLessThanOrEqual(welcomeGeometry.surfaceRight);
    expect(welcomeGeometry.sideRailRight).toBeGreaterThan(welcomeGeometry.surfaceRight);
    expect(welcomeGeometry.sideRailBottom).toBeGreaterThanOrEqual(welcomeGeometry.surfaceBottom);
    expect(welcomeGeometry.sideRailBottomLeftRadius).toBe("0px");
    expect(welcomeGeometry.sideRailBottomRightRadius).not.toBe("0px");

    await page.getByRole("button", { name: "Load Ravi's sample record" }).click();

    await expect(page.getByRole("heading", { name: "4 of 5 checks look healthy" })).toBeVisible();
    const checkRows = page.getByRole("list", { name: "Supported record checks" }).getByRole("listitem");
    await expect(checkRows).toHaveCount(5);
    await expect(checkRows.nth(2).locator("svg")).toHaveCount(1);
    await expect(checkRows.nth(2)).not.toHaveAttribute("title");
    await expect(page.getByRole("heading", { name: "Your previous employment is missing exit information." })).toBeVisible();
    const dossierConnector = await page
      .getByRole("region", { name: "Your previous employment is missing exit information." })
      .evaluate((dossier) => ({ after: getComputedStyle(dossier, "::after").content, before: getComputedStyle(dossier, "::before").content }));
    expect(dossierConnector).toEqual({ after: "none", before: "none" });

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    const caseFileGeometry = await page
      .getByRole("region", { name: "4 of 5 checks look healthy" })
      .evaluate((caseFile) => {
        const surface = caseFile.querySelector<HTMLElement>("[data-case-file-surface='record']");
        const topTab = caseFile.querySelector<HTMLElement>("[data-case-file-decoration='record-top-tab']");
        const sideTab = caseFile.querySelector<HTMLElement>("[data-case-file-decoration='record-side-tab']");
        const sideRail = caseFile.querySelector<HTMLElement>("[data-case-file-decoration='record-side-rail']");
        if (!surface || !topTab || !sideTab || !sideRail) throw new Error("Record Case File decorations are missing.");
        const surfaceBounds = surface.getBoundingClientRect();
        const topTabBounds = topTab.getBoundingClientRect();
        const sideTabBounds = sideTab.getBoundingClientRect();
        const sideRailBounds = sideRail.getBoundingClientRect();
        return {
          overflow: getComputedStyle(caseFile).overflow,
          sideRailBottom: sideRailBounds.bottom,
          sideRailBottomLeftRadius: getComputedStyle(sideRail).borderBottomLeftRadius,
          sideRailBottomRightRadius: getComputedStyle(sideRail).borderBottomRightRadius,
          sideRailRight: sideRailBounds.right,
          sideRailTop: sideRailBounds.top,
          sideTabBottom: sideTabBounds.bottom,
          sideTabRight: sideTabBounds.right,
          surfaceBottom: surfaceBounds.bottom,
          surfaceBottomRightRadius: getComputedStyle(surface).borderBottomRightRadius,
          surfaceOverflow: getComputedStyle(surface).overflow,
          surfaceRight: surfaceBounds.right,
          surfaceTop: surfaceBounds.top,
          surfaceTopLeftRadius: getComputedStyle(surface).borderTopLeftRadius,
          topTabBottom: topTabBounds.bottom,
          topTabLeftOffset: getComputedStyle(topTab).left,
          topTabTop: topTabBounds.top,
        };
      });
    await expect(page.locator("[data-case-file-decoration='record-top-tab'] path")).toHaveAttribute("d", "M0 26L10 7C12 2.5 16.5 0 22 0H116C125 0 132 4 137 13L145 26H0Z");
    await expect(page.locator("[data-case-file-decoration='record-side-tab'] path")).toHaveAttribute("d", "M0 0H8C13.5 0 18 4.5 18 10V116L11 136H0Z");
    expect(caseFileGeometry.overflow).toBe("visible");
    expect(caseFileGeometry.surfaceOverflow).toBe("hidden");
    expect(caseFileGeometry.surfaceTopLeftRadius).toBe("0px");
    expect(caseFileGeometry.surfaceBottomRightRadius).toBe("0px");
    expect(caseFileGeometry.topTabLeftOffset).toBe("-2px");
    expect(caseFileGeometry.topTabTop).toBeLessThan(caseFileGeometry.surfaceTop);
    expect(caseFileGeometry.topTabBottom).toBeGreaterThanOrEqual(caseFileGeometry.surfaceTop);
    expect(caseFileGeometry.sideTabRight).toBeGreaterThan(caseFileGeometry.surfaceRight);
    expect(caseFileGeometry.sideTabBottom - caseFileGeometry.sideRailTop).toBeGreaterThanOrEqual(0);
    expect(caseFileGeometry.sideTabBottom - caseFileGeometry.sideRailTop).toBeLessThanOrEqual(1);
    expect(caseFileGeometry.sideRailRight).toBeGreaterThan(caseFileGeometry.surfaceRight);
    expect(caseFileGeometry.sideRailBottom).toBeGreaterThanOrEqual(caseFileGeometry.surfaceBottom);
    expect(caseFileGeometry.sideRailBottomLeftRadius).toBe("0px");
    expect(caseFileGeometry.sideRailBottomRightRadius).not.toBe("0px");

    const transitionDuration = await page
      .getByRole("button", { name: "Review what to do next" })
      .evaluate((button) => getComputedStyle(button).transitionDuration);
    expect(transitionDuration).toBe("0s");
  }
});
