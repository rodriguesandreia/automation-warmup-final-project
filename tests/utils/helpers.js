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

export async function addToCart(page) {
  // Navigate to the cart page and confirm we are there
  await goToCatalog(page);
  if (page.getByTestId("catalog-item-quantity-0") != 0) {
    // store name & price
    const productName = await page
      .getByTestId("catalog-item-name-0")
      .innerText();
    const productPrice = Number(
      await page.getByTestId("catalog-item-price-value-0").innerText()
    );

    // click add to cart
    await page.getByTestId("catalog-item-add-button-0").click();

    //so these consts can be used on other files
    return { productName, productPrice };
  }
}

export async function add2ToCart(page) {
  // Navigate to the cart page and confirm we are there
  await goToCatalog(page);

  if (page.getByTestId("catalog-item-quantity-0") != 0) {
    // store name & price for the first item
    const productName1 = await page
      .getByTestId("catalog-item-name-0")
      .innerText();
    const productPrice1 = Number(
      await page.getByTestId("catalog-item-price-value-0").innerText()
    );

    // click add to cart
    await page.getByTestId("catalog-item-add-button-0").click();

    // add second item to cart
    if (page.getByTestId("catalog-item-quantity-1") != 0) {
      // store name & price for the second item
      const productName2 = await page
        .getByTestId("catalog-item-name-1")
        .innerText();
      const productPrice2 = Number(
        await page.getByTestId("catalog-item-price-value-1").innerText()
      );
      // click add to cart
      await page.getByTestId("catalog-item-add-button-1").click();

      return {productName1, productName2, productPrice1, productPrice2};
    }
  }
}
