import { test, expect } from "@playwright/test";
import {goToCatalog } from "./utils/helpers.js";

test("Add to Cart", async ({ page }) => {
  await goToCatalog(page);
  if (page.getByTestId("catalog-item-quantity-0") != 0) {
    const productName = await page
      .getByTestId("catalog-item-name-0")
      .innerText();

    await test.step("Click add to cart", async () => {
      const iniQuant = await page
        .getByTestId("catalog-item-quantity-0")
        .innerText();
      await page.getByTestId("catalog-item-add-button-0").click();
      const finQuant = await page
        .getByTestId("catalog-item-quantity-0")
        .innerText();
      expect(Number(finQuant)).toBe(Number(iniQuant) - 1);
    });

    await test.step("Verify cart", async () => {
      await page.getByTestId("store-tab-cart").click();
      await expect(page.getByTestId("cart-title")).toBeVisible();
      expect(await page.getByTestId("cart-item-name-0").innerText()).toBe(
        productName
      );
    });
  }
});

test("Out of stock items", async ({ page }) => {

  await test.step("Go to Catalog page", async () => {
    await goToCatalog(page);
  });

  let outOfStockid;

  await test.step("Find first out-of-stock item", async () => {
    const quantities = page.getByTestId(/catalog-item-quantity-/); // gets all quantities
    const count = await quantities.count(); // number of items on the list

    for (let i = 0; i < count; i++) {
      const text = await quantities.nth(i).innerText(); // get the item quantity text
      const units = Number(text.match(/\d+/)[0]); // gets only the number
      if (units === 0) {
        outOfStockid = i;
      }
    }
  });

  await test.step("Verify out-of-stock button is disabled", async () => {
    const buttonOutOfStock = "catalog-item-add-button-" + outOfStockid;

    expect(await page.getByTestId(buttonOutOfStock).innerText()).toBe("Out of Stock");
    await expect(page.getByTestId(buttonOutOfStock)).toBeDisabled();
  });
});

