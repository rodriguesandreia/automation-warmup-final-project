import { test, expect } from "@playwright/test";
import { makeOrder, getOrderItemInfo } from "./utils/helpers.js";

test("Validate order details", async ({ page }) => {
  const { productName, productPrice } =
    await test.step("Make an order", async () => {
      return await makeOrder(page);
    });

  await test.step("Validate product price", async () => {
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

  await test.step("Validate product name & quantity", async () => {
    const { orderQuantity, orderName } = await getOrderItemInfo(page, 0, 0);
    expect(orderName).toBe(productName);
    //quantity is 1 as only 1 item was added to the cart
    expect(orderQuantity).toBe(1);
  });
});
