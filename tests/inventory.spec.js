import { test, expect } from "@playwright/test";
import { products } from "./data/inventory.data";
import { goToInventory } from "./utils/helpers.js";

test.describe("Inventory tests", () => {
  test.beforeEach(async ({ page }) => {
    await goToInventory(page);
  });

  test("Add product", async ({ page }) => {
    await test.step("Fill in", async () => {
      await page
        .getByTestId("inventory-input-name")
        .fill(products.bananas.name);
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
    await test.step("Increase product quantity", async () => {
      const locator = page.getByTestId("inventory-product-0");
      if ((await locator.count()) > 0) {
        const iniQuant = Number(
          await page.getByTestId("inventory-product-quantity-0").innerText()
        );
        await page.getByTestId("inventory-product-increase-0").click();
        const finQuant = Number(
          await page.getByTestId("inventory-product-quantity-0").innerText()
        );
        expect(finQuant).toBe(iniQuant + 1);
      }
    });
  });

  test("Decrease quantity", async ({ page }) => {
    await test.step("Decrease product quantity", async () => {
      const locator = page.getByTestId("inventory-product-0");
      if ((await locator.count()) > 0) {
        const initQuant = Number(
          await page.getByTestId("inventory-product-quantity-0").innerText()
        );
        if (initQuant > 0) {
          await page.getByTestId("inventory-product-decrease-0").click();
          const finQuant = Number(
            await page.getByTestId("inventory-product-quantity-0").innerText()
          );
          expect(finQuant).toBe(initQuant - 1);
        }
      }
    });
  });

  test("Never go below 0", async ({ page }) => {
    await test.step("Try decreasing quantity below 0", async () => {
      const locator = page.getByTestId("inventory-product-6");
      if ((await locator.count()) > 0) {
        const initQuant = Number(
          await page.getByTestId("inventory-product-quantity-6").innerText()
        );
        if (initQuant === 0) {
          await page.getByTestId("inventory-product-decrease-6").click();
          const finQuant = Number(
            await page.getByTestId("inventory-product-quantity-6").innerText()
          );
          expect(finQuant).toBe(0);
        }
      }
    });
  });
});
});