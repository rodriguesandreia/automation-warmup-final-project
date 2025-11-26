import { test, expect } from "@playwright/test";
import { makeOrder, getOrderItemInfo } from "./utils/helpers.js";

test("Validate order details", async ({ page }) => {
  const { productName, productPrice, orderDate, paymentMethod } =
    // Make an order using the helper and capture returned order details
    await test.step("Make an order", async () => {
      return await makeOrder(page);
    });

  await test.step("Validate date", async () => {
    // Validate that the order date shown in the UI matches the value returned by makeOrder
    expect(await page.getByTestId("order-date-0").innerText()).toBe(
      `Date: ${orderDate}`
    );
  });

  await test.step("Validate payment method", async () => {
    // Verify the payment method label matches what the order helper recorded
    expect(await page.getByTestId("order-payment-0").innerText()).toBe(
      `Payment Method: ${paymentMethod}`
    );
  });

  await test.step("Validate product name & quantity", async () => {
    // Read the order's item info via helper getOrderItemInfo(page, orderIndex, itemIndex)
    const { orderQuantity, orderName } = await getOrderItemInfo(page, 0, 0);
    expect(orderName).toBe(productName);
    //quantity is 1 as only 1 item was added to the cart
    expect(orderQuantity).toBe(1);
  });

  await test.step("Validate product price", async () => {
    // Check the displayed total for the order item matches productPrice returned by makeOrder
    const price = Number(
      await page.getByTestId("order-item-total-value-0-0").innerText()
    );
    expect(price).toBe(productPrice);
  });

  await test.step("Validate subtotal and total", async () => {
    //as only one item was added, the total and subtotal are the same
    const quantity = 1;
    const total = productPrice * quantity;

    const itemTotal = Number(
      await page.getByTestId("order-item-total-value-0-0").innerText()
    );
    expect(itemTotal).toBe(total);

    const paymentTotal = Number(
      await page.getByTestId("order-total-value-0").innerText()
    );
    expect(paymentTotal).toBe(total);
  });
});
