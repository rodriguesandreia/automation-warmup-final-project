import { test, expect } from "@playwright/test";
import { addToCart, add2ToCart } from "./utils/helpers";

test("One item on cart", async ({ page }) => {
  // add to cart
  await addToCart(page);
  //import product name and product price from addToCart function
  const { productName, productPrice } = await addToCart(page);

  //navigate to cart
  await page.getByTestId("store-tab-cart").click();
  await expect(page.getByTestId("cart-title")).toBeVisible();

  //verify name
  expect(await page.getByTestId("cart-item-name-0").innerText()).toBe(
    productName
  );

  //verify quantity
  const quantity = Number(
    await page.getByTestId("cart-item-quantity-0").innerText()
  );
  expect(quantity).toBe(1);

  //verify price
  expect(
    Number(await page.getByTestId("cart-item-price-value-0").innerText())
  ).toBe(productPrice);

  //verify subtotal & total - as only one item was added, the total and subtotal are the same
  const total = productPrice * quantity;
  expect(
    Number(await page.getByTestId("cart-item-total-value-0").innerText())
  ).toBe(total);
  expect(Number(await page.getByTestId("cart-total-value").innerText())).toBe(
    total
  );
});

test("Two items on cart", async ({ page }) => {
  // add two items to cart
  await add2ToCart(page);
  //import product name and product price from addToCart function
  const { productName1, productName2, productPrice1, productPrice2 } =
    await add2ToCart(page);

  //navigate to cart
  await page.getByTestId("store-tab-cart").click();

  //verify names
  await expect(page.getByTestId("cart-title")).toBeVisible();
  expect(await page.getByTestId("cart-item-name-0").innerText()).toBe(
    productName1
  );
  expect(await page.getByTestId("cart-item-name-1").innerText()).toBe(
    productName2
  );

  //verify quantity - quantities are 1 for both items as only one of each item was added to the cart
  const quantity1 = Number(
    await page.getByTestId("cart-item-quantity-0").innerText()
  );
  expect(quantity1).toBe(1);

  const quantity2 = Number(
    await page.getByTestId("cart-item-quantity-1").innerText()
  );
  expect(quantity2).toBe(1);

  //verify subtotals
  const subtotal1 = productPrice1 * quantity1;
  const subtotal2 = productPrice2 * quantity2;
  expect(
    Number(await page.getByTestId("cart-item-total-value-0").innerText())
  ).toBe(subtotal1);
  expect(
    Number(await page.getByTestId("cart-item-total-value-1").innerText())
  ).toBe(subtotal2);

  //verify total
  const total = subtotal1 + subtotal2;
  expect(Number(await page.getByTestId("cart-total-value").innerText())).toBe(
    total
  );
});

test("Go to payment", async ({ page }) => {
  // add to cart
  await addToCart(page);

  //navigate to cart
  await page.getByTestId("store-tab-cart").click();
  await expect(page.getByTestId("cart-title")).toBeVisible();

  //verify the item exists
  expect(await page.getByTestId("cart-item-0").toBeVisible);

  //click Go to payments
  await page.getByTestId("cart-go-to-payment").click();

  //verify the payment page opened
  await expect(page.getByTestId("payment-title")).toBeVisible();

});
