import { expect } from "@playwright/test";

export async function goToInventory(page) {
  // Navigate to the inventory page and confirm we are there.
  // Only perform a full navigation if we're not already on the store page.
  if (!page.url().includes("/store")) {
    await page.goto("/store");
    await expect(page.getByTestId("instructions-title")).toBeVisible();
  }

  await page.getByTestId("store-tab-inventory").click();
  await expect(page.getByTestId("inventory-title")).toBeVisible();
}

export async function goToCatalog(page) {
  // Navigate to the catalog page and confirm we are there.
  // Only perform a full navigation if we're not already on the store page.
  if (!page.url().includes("/store")) {
    await page.goto("/store");
    await expect(page.getByTestId("instructions-title")).toBeVisible();
  }

  await page.getByTestId("store-tab-catalog").click();
  await expect(page.getByTestId("catalog-title")).toBeVisible();
}

export async function goToCart(page) {
  // Navigate to the cart page and confirm we are there.
  // Only perform a full navigation if we're not already on the store page.
  if (!page.url().includes("/store")) {
    await page.goto("/store");
    await expect(page.getByTestId("instructions-title")).toBeVisible();
  }

  await page.getByTestId("store-tab-cart").click();
  await expect(page.getByTestId("cart-title")).toBeVisible();
}

export async function addToCart(page) {
  // Navigate to the Catalog page and confirm we are there
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
  // Navigate to the Catalog page and confirm we are there
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

      return { productName1, productName2, productPrice1, productPrice2 };
    }
  }
}

export async function goToPaymentWithItem(page) {
  const { productName, productPrice } = await addToCart(page);
  // go to cart
  await page.getByTestId("store-tab-cart").click();
  await expect(page.getByTestId("cart-title")).toBeVisible();

  // go to payment page
  await page.getByTestId("cart-go-to-payment").click();
  await expect(page.getByTestId("payment-title")).toBeVisible();

  // validate item exists on payment page
  await expect(page.getByTestId("payment-cart-item-0")).toBeVisible();

  return { productName, productPrice };
}

export async function makeOrder(page) {
  const { productName, productPrice } = await goToPaymentWithItem(page);

  // select payment method
  await page.getByTestId("payment-method-input-MBWay").click();

  // click confirm button
  await page.getByTestId("payment-confirm-button").click();

  //check if the the Order page opens and the order is there
  await expect(page.getByTestId("orders-title")).toBeVisible();
  await expect(page.getByTestId("order-0")).toBeVisible();

  return { productName, productPrice };
}

export async function getPaymentMethods(page) {
  const methods = page.getByTestId(/payment-method-input-/);
  const count = await methods.count();
  const list = [];

  for (let i = 0; i < count; i++) {
    const id = await methods.nth(i).getAttribute("data-testid");
    // create a list of the payment methods
    const method = id.replace("payment-method-input-", "");
    list.push(method);
  }

  return list;
}