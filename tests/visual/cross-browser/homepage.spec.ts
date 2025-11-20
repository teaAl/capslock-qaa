import test, { expect } from "@playwright/test";

test("cross-browser snapshots", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("/");
  await page.locator("video").first().waitFor({ state: "visible" });
  await expect(page.locator("video")).not.toHaveCount(0);
  const allVideos = await page.locator("video").all();
  for (const video of allVideos) {
    await expect(async () => {
      await expect(video).toHaveAttribute("src");
    }).toPass({ timeout: 30000, intervals: [500] });
  }
  await expect(page).toHaveScreenshot(`home-page.png`, {
    fullPage: true,
    animations: "disabled",
  });
});
