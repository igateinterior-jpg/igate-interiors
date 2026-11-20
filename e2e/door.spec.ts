import { expect, test, type Page } from "@playwright/test";

const door = (page: Page) =>
  page.getByRole("button", { name: "Enter the site" });
const hoarding = (page: Page) => page.locator("header[data-door]");
const behind = (page: Page) => page.locator("#behind");

/** Scroll like a person does, in small native wheel steps (nothing is intercepted). */
const wheel = async (page: Page, totalPx: number, steps = 12) => {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, totalPx / steps);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(200);
};

const pinnedLength = (page: Page) =>
  page.evaluate(() => {
    const header = document.querySelector("header[data-door]") as HTMLElement;
    return (
      (header.parentElement as HTMLElement).offsetHeight - header.offsetHeight
    );
  });

test.describe("scroll-driven door", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await expect(hoarding(page)).toHaveAttribute("data-door", "closed");
    await expect(page.locator("html")).toHaveAttribute("data-scrolly", "on");
    // The mouse needs to be over the page for wheel events to scroll it.
    await page.mouse.move(20, 300);
  });

  test("scrolling down opens the door and walks in; scrolling back up closes it", async ({
    page,
  }) => {
    const length = await pinnedLength(page);

    await wheel(page, length * 0.25);
    await expect(hoarding(page)).toHaveAttribute("data-door", "opening");

    await wheel(page, length * 0.3);
    await expect(hoarding(page)).toHaveAttribute("data-door", "open");

    await wheel(page, length * 0.45);
    await expect(
      page.getByRole("heading", { name: "Behind the hoarding" }),
    ).toBeInViewport();
    await expect(page.locator("section:has(#behind)")).toHaveCSS(
      "opacity",
      "1",
    );

    await wheel(page, -length * 2);
    await expect(hoarding(page)).toHaveAttribute("data-door", "closed");
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("nothing moves in the first 10% of the scroll", async ({ page }) => {
    const length = await pinnedLength(page);
    await wheel(page, length * 0.08, 4);
    await expect(hoarding(page)).toHaveAttribute("data-door", "closed");
    await expect(
      page.getByRole("heading", { name: "Something new is being built." }),
    ).toHaveCSS("opacity", "1");
  });

  test("clicking the door plays the same walk-in and lands behind the hoarding", async ({
    page,
  }) => {
    await door(page).click();
    await expect(behind(page)).toBeFocused({ timeout: 4000 });
    await expect(hoarding(page)).toHaveAttribute("data-door", "open");
    await expect(
      page.getByRole("heading", { name: "Behind the hoarding" }),
    ).toBeInViewport();
  });

  for (const key of ["Enter", "Space"]) {
    test(`the door opens with the keyboard (${key})`, async ({ page }) => {
      await door(page).focus();
      await page.keyboard.press(key);
      await expect(behind(page)).toBeFocused({ timeout: 4000 });
      await expect(hoarding(page)).toHaveAttribute("data-door", "open");
      await expect(
        page.getByRole("heading", { name: "Behind the hoarding" }),
      ).toBeInViewport();
    });
  }

  test("a reload starts with the door shut at the top", async ({ page }) => {
    await door(page).click();
    await expect(behind(page)).toBeFocused({ timeout: 4000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.reload();
    await expect(hoarding(page)).toHaveAttribute("data-door", "closed");
  });

  test("the walk-in only blurs on screens 768px and wider", async ({ page }) => {
    const length = await pinnedLength(page);
    await page.evaluate((y) => window.scrollTo(0, y), length * 0.6);
    await page.waitForTimeout(300);
    const width = page.viewportSize()!.width;
    const filter = await page
      .locator("header[data-door] [class*='safety']")
      .first()
      .evaluate((el) => getComputedStyle(el).filter);
    if (width < 768) expect(filter).toBe("none");
    else expect(filter).toMatch(/blur\([1-9]/);
  });
});

test.describe("phone with the browser toolbar shown and hidden", () => {
  test.skip(({ isMobile }) => !isMobile, "phone only");

  const doorFitsOnScreen = async (page: Page) => {
    const box = await door(page).boundingBox();
    const height = page.viewportSize()!.height;
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(height);
  };

  for (const [label, height] of [
    ["toolbar hidden", 844],
    ["toolbar shown", 750],
  ] as const) {
    test(`at 390x${height} (${label}) the whole door is on screen and the walk-in completes`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height });
      await page.goto("/en");
      await expect(hoarding(page)).toHaveAttribute("data-door", "closed");
      await doorFitsOnScreen(page);

      await door(page).click();
      await expect(behind(page)).toBeFocused({ timeout: 4000 });
      await expect(page.getByRole("heading", { name: "Behind the hoarding" })).toBeInViewport();
    });
  }

  test("the toolbar appearing mid-scroll does not break the scene", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    const length = await pinnedLength(page);
    await page.evaluate((y) => window.scrollTo(0, y), length * 0.3);
    await page.waitForTimeout(200);
    const before = await page.evaluate(() => window.scrollY);

    // The toolbar slides in: the visible area gets shorter.
    await page.setViewportSize({ width: 390, height: 750 });
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    await expect(hoarding(page)).toHaveAttribute("data-door", /opening|open/);
    await doorFitsOnScreen(page);

    // And it still walks in and comes back out cleanly at the new size.
    await page.evaluate((y) => window.scrollTo(0, y), (await pinnedLength(page)) * 1);
    await expect(page.getByRole("heading", { name: "Behind the hoarding" })).toBeInViewport();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(hoarding(page)).toHaveAttribute("data-door", "closed");
  });
});

test.describe("with reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("there is no pinning, the door shows open and both the door and skip link jump", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-scrolly",
      "on",
    );
    await expect(hoarding(page)).toHaveAttribute("data-door", "open");
    await expect(hoarding(page)).toHaveCSS("position", "relative");

    await door(page).click();
    await expect(behind(page)).toBeFocused();

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("link", { name: /Skip to/ }).click();
    await expect(page.locator("#request")).toBeFocused();
  });
});
