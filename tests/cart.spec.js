import { test, expect } from "@playwright/test";
import { addToCart, add2ToCart, goToCart } from "./utils/helpers.js";

test("One item in cart", async ({ page }) => {
  // Add product to cart + get product data
  const { productName, productPrice } =
    await test.step("Add product to cart", async () => {
      return await addToCart(page);
    });

  await test.step("Navigate to cart page", async () => {
    await goToCart(page);
  });

  await test.step("Validate product name in cart", async () => {
    const name = await page.getByTestId("cart-item-name-0").innerText();
    expect(name).toBe(productName);
  });

  await test.step("Validate product quantity", async () => {
    const quantity = Number(
      await page.getByTestId("cart-item-quantity-0").innerText()
    );
    expect(quantity).toBe(1);
  });

  await test.step("Validate product price", async () => {
    const price = Number(
      await page.getByTestId("cart-item-price-value-0").innerText()
    );
    expect(price).toBe(productPrice);
  });

  await test.step("Validate subtotal and total", async () => {
    // Since only 1 item was added (quantity=1), subtotal equals item price
    const quantity = 1;
    const expectedTotal = productPrice * quantity;

    const itemTotal = Number(
      await page.getByTestId("cart-item-total-value-0").innerText()
    );
    expect(itemTotal).toBe(expectedTotal);

    const cartTotal = Number(
      await page.getByTestId("cart-total-value").innerText()
    );
    expect(cartTotal).toBe(expectedTotal);
  });
});

test("Two items in cart", async ({ page }) => {
  // Add products to cart + get products data
  const { productName1, productName2, productPrice1, productPrice2 } =
    await test.step("Add two products to cart", async () => {
      return await add2ToCart(page);
    });

  await test.step("Navigate to cart page", async () => {
    await goToCart(page);
  });

  await test.step("Validate product names", async () => {
    const name1 = await page.getByTestId("cart-item-name-0").innerText();
    expect(name1).toBe(productName1);

    const name2 = await page.getByTestId("cart-item-name-1").innerText();
    expect(name2).toBe(productName2);
  });

  await test.step("Validate quantities", async () => {
    const quantity1 = Number(
      await page.getByTestId("cart-item-quantity-0").innerText()
    );
    expect(quantity1).toBe(1);

    const quantity2 = Number(
      await page.getByTestId("cart-item-quantity-1").innerText()
    );
    expect(quantity2).toBe(1);
  });

  await test.step("Validate item subtotals", async () => {
    const quantity1 = 1;
    const quantity2 = 1;

    const subtotal1 = productPrice1 * quantity1;
    const subtotal2 = productPrice2 * quantity2;

    const cartSubtotal1 = Number(
      await page.getByTestId("cart-item-total-value-0").innerText()
    );
    expect(cartSubtotal1).toBe(subtotal1);

    const cartSubtotal2 = Number(
      await page.getByTestId("cart-item-total-value-1").innerText()
    );
    expect(cartSubtotal2).toBe(subtotal2);
  });

  //Validate final cart total
  await test.step("Validate total amount", async () => {
    // Cart total = item1_subtotal + item2_subtotal (each item has quantity 1)
    const quantity1 = 1;
    const quantity2 = 1;

    const subtotal1 = productPrice1 * quantity1;
    const subtotal2 = productPrice2 * quantity2;
    const expectedTotal = subtotal1 + subtotal2;

    const cartTotal = Number(
      await page.getByTestId("cart-total-value").innerText()
    );
    expect(cartTotal).toBe(expectedTotal);
  });
});

test("Go to payment", async ({ page }) => {
  await test.step("Add to cart", async () => {
    await addToCart(page);
  });

  await test.step("Navigate to cart", async () => {
    await goToCart(page);
  });

  await test.step("Verify item exists in cart", async () => {
    await expect(page.getByTestId("cart-item-0")).toBeVisible();
  });

  await test.step("Click Go to payments", async () => {
    await page.getByTestId("cart-go-to-payment").click();
  });

  await test.step("Verify payment page opened", async () => {
    await expect(page.getByTestId("payment-title")).toBeVisible();
  });
});
