import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fixture from "../../../packages/standard-core/examples/abierto-project.v0.1.json";
test("one active project, close confirmation, preserved copy and explicit reopen", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation", exact: true });
  await expect(nav.getByText("Workspace")).toHaveCount(0);
  await page.getByRole("button", { name: "Start a blank project" }).click();
  await page.getByLabel("Project title", { exact: true }).fill("Browser project");
  await page.getByRole("button", { name: "Create project", exact: true }).click();
  await expect(page).toHaveURL(/\/workspace$/);
  await expect(nav.getByText("Workspace")).toBeVisible();
  await page.locator(".public-project-name").click();
  await expect(page.getByRole("menuitem", { name: "Download JSON" })).toBeVisible();
  await page.getByRole("menuitem", { name: "Close project" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator(".public-project-name")).toHaveText("Browser project");
  await page.locator(".public-project-name").click();
  await page.getByRole("menuitem", { name: "Close project" }).click();
  await page.getByRole("button", { name: "Close project", exact: true }).click();
  await expect(page).toHaveURL(/\/$/); await page.reload();
  await expect(nav.getByText("Workspace")).toHaveCount(0);
  await page.getByRole("button", { name: "Open a saved local project" }).click();
  await page.getByRole("combobox", { name: "Saved project", exact: true }).selectOption({ label: "Browser project" });
  await page.getByRole("button", { name: "Open saved project", exact: true }).click();
  await expect(page.locator(".public-project-name")).toHaveText("Browser project");
});
test("project-type start keeps multiple types editable and adds no criteria", async ({ page }) => {
  await page.goto("/explore/project-types");
  await expect(page.locator(".public-types > section")).toHaveCount(9);
  await page.getByRole("button", { name: "Start a publication project" }).click();
  await page.getByLabel("Project title", { exact: true }).fill("Publication pilot");
  await page.getByRole("button", { name: "Create project", exact: true }).click();
  await expect(page).toHaveURL(/\/workspace\?recommendations=review/);
  await expect(page.getByText("no criteria have been added automatically", { exact: false })).toBeVisible();
  const library = await page.evaluate(() => JSON.parse(localStorage.getItem("sd-standard:projects:v1")!));
  expect(library.records[library.activeId].project.projectTypes).toEqual(["publication"]);
  expect(library.records[library.activeId].criteriaAssessments).toEqual([]);
  await page.getByLabel("Project types", { exact: false }).fill("publication, website");
  await page.getByLabel("Project title", { exact: true }).fill("Renamed publication pilot");
  await expect(page.locator(".public-project-name")).toHaveText("Renamed publication pilot");
  await page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Explore", exact: true }).click();
  await expect(page.locator(".public-project-name")).toHaveText("Renamed publication pilot");
});
test("seven design questions disclose current criterion links", async ({ page }) => {
  await page.goto("/explore");
  const questions = page.locator(".public-questions details"); await expect(questions).toHaveCount(7);
  for (let index = 0; index < 7; index++) {
    const question = questions.nth(index); await expect(question).not.toHaveAttribute("open");
    await question.locator("summary").click(); await expect(question.locator("ul a").first()).toBeVisible();
    await expect(question.locator("ul a").first()).toHaveAttribute("href", /generated\/criteria\/.+\.html/);
  }
});
test("new content, preserved gallery and legacy routes", async ({ page }) => {
  for (const route of ["/projects", "/projects/abierto", "/about", "/about/updates", "/about/get-involved", "/explore/project-types", "/explore/sdgs", "/es/abierto/economia", "/es/abierto/segunda-vida", "/es/abierto/colabora"]) {
    await page.goto(route); await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator("html")).toHaveAttribute("lang", route.startsWith("/es/") ? "es" : "en");
    if (route.startsWith("/es/abierto")) { await expect(page.locator(".public-nav")).toHaveCount(0); await expect(page.locator("main .public-button")).toHaveCount(1); }
  }
  await page.goto("/projects"); await expect(page.locator(".public-project-card")).toHaveCount(6);
  const oldProject = await page.locator(".public-project-card").first().getAttribute("href");
  await page.goto(oldProject!); await expect(page.locator("main h1")).toBeVisible();
  for (const [from, to] of [["/updates", "/about/updates"], ["/learn", "/explore"], ["/imagine", "/brief-generator"], ["/the-standard-and-the-sdgs", "/explore/sdgs"], ["/relationship-map", "/explore/sdgs"], ["/#get-involved", "/about/get-involved"], ["/get-involved", "/about/get-involved"], ["/explore/criteria/?pillar=culture", "/explore/criteria?pillar=culture"]]) {
    await page.goto(from); await expect(page).toHaveURL(`http://127.0.0.1:4175${to}`);
  }
});
test("legacy migration, valid import, save failure and local deletion", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(value => localStorage.setItem("sd-standard:project:v0.1", JSON.stringify(value)), fixture);
  await page.reload(); await expect(page.locator(".public-project-name")).toHaveText(fixture.project.title);
  expect(await page.evaluate(() => localStorage.getItem("sd-standard:project:v0.1"))).toBeNull();
  await page.goto("/workspace");
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error("Simulated quota failure"); }; });
  await page.getByLabel("Project title", { exact: true }).fill("Unsaved title");
  await page.locator(".public-project-name").click(); await page.getByRole("menuitem", { name: "Close project" }).click();
  await page.getByRole("button", { name: "Close project", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toContainText("The project remains open");
  // Reload restores the browser implementation; persisted content remains intact.
  page.on("dialog", dialog => dialog.accept()); await page.reload();
  await page.goto("/workspace/project-file"); await page.getByRole("button", { name: "Delete local copy", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete local copy", exact: true }).click();
  await expect(page.locator(".public-project-name")).toHaveCount(0);
  const picker = page.waitForEvent("filechooser"); await page.getByRole("banner").getByRole("button", { name: "Open Project", exact: true }).click();
  await (await picker).setFiles({ name: "project.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(fixture)) });
  await expect(page.getByRole("heading", { name: "Import preview" })).toBeVisible();
  await page.getByRole("button", { name: "Open project", exact: true }).last().click();
  await expect(page.locator(".public-project-name")).toHaveText(fixture.project.title);
});
test("public pages have no automated WCAG A/AA violations and fit narrow screens", async ({ page }) => {
  test.setTimeout(120000);
  for (const route of ["/", "/explore", "/explore/pillars", "/explore/criteria", "/es/criteria", "/explore/project-types", "/projects", "/projects/abierto", "/about", "/about/get-involved", "/es/abierto/economia", "/es/abierto/segunda-vida", "/es/abierto/colabora"]) {
    await page.setViewportSize({ width: 390, height: 844 }); await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBeTruthy();
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations, `${route}: ${JSON.stringify(result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })))}`).toEqual([]);
    const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    await page.screenshot({ path: `../../.local/review-${name}-mobile.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 }); await page.screenshot({ path: `../../.local/review-${name}-desktop.png`, fullPage: true });
  }
});
test("Open Project invokes JSON picker without creating a project", async ({ page }) => {
  await page.goto("/");
  const picker = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Open Project", exact: true }).click();
  const chooser = await picker;
  await chooser.setFiles({ name: "invalid.json", mimeType: "application/json", buffer: Buffer.from("{}") });
  await expect(page.getByText("This file is invalid and cannot be opened.")).toBeVisible();
  await expect(page.locator(".public-project-name")).toHaveCount(0);
});
test("criteria filter URLs, search, public codes and Spanish fallback", async ({ page }) => {
  await page.goto("/explore/criteria?pillar=environment");
  await expect(page.locator(".public-criterion")).toHaveCount(24);
  await page.getByLabel("Search by code, name or summary").fill("Ink, Printing");
  await expect(page.locator(".public-criterion")).toHaveCount(1);
  await expect(page.locator(".public-code")).toHaveText("E3");
  await page.reload(); await expect(page.locator(".public-criterion")).toHaveCount(1);
  await page.goto("/es/criteria"); await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator(".public-criterion")).toHaveCount(56);
  await expect(page.getByRole("link", { name: "Más información (en inglés) →", exact: true })).toHaveCount(56);
});
test("initial public routes and mobile keyboard navigation", async ({ page }) => {
  for (const route of ["/", "/explore", "/explore/pillars", "/explore/criteria", "/es/criteria"]) {
    await page.goto(route); await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  }
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open main navigation" });
  await toggle.click(); await expect(page.getByRole("navigation", { name: "Main navigation", exact: true })).toBeVisible();
  await page.keyboard.press("Escape"); await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: "../../.local/home-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.screenshot({ path: "../../.local/home-desktop.png", fullPage: true });
});

