import { expect } from "@playwright/test";

export async function goToInventory(page) {
  // Navigate to the inventory page and confirm we are there
  await page.goto("/store");
  await expect(page.getByTestId("instructions-title")).toBeVisible();
  await page.getByTestId("store-tab-inventory").click();
  await expect(page.getByTestId("inventory-title")).toBeVisible();
}


export async function goToCatalog(page) {
    // Navigate to the catalog page and confirm we are there
  await page.goto("/store");
  await expect(page.getByTestId("instructions-title")).toBeVisible();
  await page.getByTestId("store-tab-catalog").click();
  await expect(page.getByTestId("catalog-title")).toBeVisible();
}


export async function goToCart(page) {
    // Navigate to the cart page and confirm we are there
  await page.goto("/store");
  await expect(page.getByTestId("instructions-title")).toBeVisible();
  await page.getByTestId("store-tab-cart").click();
  await expect(page.getByTestId("cart-title")).toBeVisible();
}


