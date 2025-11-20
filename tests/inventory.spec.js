import { test, expect } from "@playwright/test";
import { products } from "./data/inventory.data";

test("Add product", async ({ page }) => {
  await page.goto("/store");
  await expect(page.getByTestId("instructions-title")).toBeVisible();
  await page.getByTestId("store-tab-inventory").click();
  await expect(page.getByTestId("inventory-title")).toBeVisible();

  await test.step("Fill in", async () => {
    await page.getByTestId("inventory-input-name").fill(products.bananas.name);
    await page
      .getByTestId("inventory-input-price")
      .fill(products.bananas.price);
    await page
      .getByTestId("inventory-input-quantity")
      .fill(products.bananas.quantity);
  });

  await test.step("Click button", async () => {
    await page.getByTestId("inventory-submit-button").click();
  });

  await test.step("Verify product", async () => {
    await expect(page.getByTestId("inventory-product-name-8")).toHaveText(
      products.bananas.name
    );
    await expect(
      page.getByTestId("inventory-product-price-value-8")
    ).toHaveText(products.bananas.price);
    await expect(page.getByTestId("inventory-product-quantity-8")).toHaveText(
      products.bananas.quantity
    );
  });
});

test("Increase quantity", async ({ page }) => {
  await page.goto("/store");
  await expect(page.getByTestId("instructions-title")).toBeVisible();
  await page.getByTestId("store-tab-inventory").click();
  await expect(page.getByTestId("inventory-title")).toBeVisible();

  if (page.getByTestId("inventory-product-0")) {
    const iniQuant = await page.getByTestId("inventory-product-quantity-0").innerText();
    console.log(iniQuant);
    await page.getByTestId("inventory-product-increase-0").click();
    const finQuant = await page.getByTestId("inventory-product-quantity-0").innerText();
    expect (Number(finQuant)).toBeGreaterThan(Number(iniQuant));
  }
});

test("Decrease quantity", async ({ page }) => {
  await page.goto("/store");
  await expect(page.getByTestId("instructions-title")).toBeVisible();
  await page.getByTestId("store-tab-inventory").click();
  await expect(page.getByTestId("inventory-title")).toBeVisible();

  if (page.getByTestId("inventory-product-0")) {
    const initQuant = await page.getByTestId("inventory-product-quantity-0").innerText();
    console.log(initQuant);
    await page.getByTestId("inventory-product-decrease-0").click();
    const finQuant = await page.getByTestId("inventory-product-quantity-0").innerText();
    expect (Number(finQuant)).toBeLessThan(Number(initQuant));
  }
});
