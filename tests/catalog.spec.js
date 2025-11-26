import { test, expect } from "@playwright/test";
import { goToCatalog } from "./utils/helpers.js";

test.describe("Catalog tests", () => {
  // Setup: Navigate to Catalog page before each test
  test.beforeEach(async ({ page }) => {
    await goToCatalog(page);
  });

  test("Add to Cart", async ({ page }) => {
    // Test skips if first item is out of stock (quantity = 0)
    if (page.getByTestId("catalog-item-quantity-0") != 0) {
      const productName = await page
        .getByTestId("catalog-item-name-0")
        .innerText();

      await test.step("Click add to cart", async () => {
        // Capture initial quantity, click button, verify quantity decreased
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
        // Navigate to cart and verify the added item is there
        await page.getByTestId("store-tab-cart").click();
        await expect(page.getByTestId("cart-title")).toBeVisible();
        expect(await page.getByTestId("cart-item-name-0").innerText()).toBe(
          productName
        );
      });
    }
  });

  test("Out of stock items", async ({ page }) => {
    // Catalog page is visited in beforeEach

    let outOfStockid;

    await test.step("Find first out-of-stock item", async () => {
      // Query all quantity elements, iterate to find first with quantity = 0
      const quantities = page.getByTestId(/catalog-item-quantity-/);
      const count = await quantities.count(); // number of items on the list

      for (let i = 0; i < count; i++) {
        const text = await quantities.nth(i).innerText(); // get the item quantity text
        const units = Number(text.match(/\d+/)[0]); // Extract numeric value from text
        if (units === 0) {
          outOfStockid = i;
          break; // Stop after finding first out-of-stock item
        }
      }
    });

    await test.step("Verify out-of-stock button is disabled", async () => {
      // Validate the out-of-stock item has correct label and disabled state
      const buttonOutOfStock = "catalog-item-add-button-" + outOfStockid;

      expect(await page.getByTestId(buttonOutOfStock).innerText()).toBe(
        "Out of Stock"
      );
      await expect(page.getByTestId(buttonOutOfStock)).toBeDisabled();
    });
  });
});
