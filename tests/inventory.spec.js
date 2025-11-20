import { test, expect } from "@playwright/test";

test("Add product", async ({ page }) => {
  await page.goto("https://playground-drab-six.vercel.app/");

  // Expect a title "to contain" a substring.

  await expect(page).toHaveTitle("Playground page");
  await page.getByRole("link", { name: "STORE" }).click();
  await expect(page.getByTestId("instructions-title")).toBeVisible();
  await page.getByTestId("store-tab-inventory").click();
  await expect(page.getByTestId("inventory-title")).toBeVisible();

  await test.step("Fill in", async () => {
    await page.getByTestId("inventory-input-name").fill("Bananas (Minions)");
    await page.getByTestId("inventory-input-price").fill("2.50");
    await page.getByTestId("inventory-input-quantity").fill("10");
  });

  await test.step("Click button", async () => {
    await page.getByTestId("inventory-submit-button").click();
  });

  await test.step("Verify product", async () => {
    await expect(page.getByTestId("inventory-product-name-8")).toHaveText(
      "Bananas (Minions)"
    );
    await expect(
      page.getByTestId("inventory-product-price-value-8")
    ).toHaveText("2.50");
    await expect(page.getByTestId("inventory-product-quantity-8")).toHaveText(
      "10"
    );
  });
});
