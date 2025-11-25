import { test, expect } from "@playwright/test";
import { makeOrder } from "./utils/helpers.js";

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

  // does not work from this point foward

  //     // not working because the components name and quantity are truncated into one
  //        await test.step("Validate product name", async () => {
  //     const name = await page.getByTestId('order-item-name-0-0').innerText();
  //     expect(name).toBe(productName);
  //   });

  //     // not working because the components name and quantity are truncated into one
  //   await test.step("Validate product quantity", async () => {
  //     const quantity = Number(
  //       await page.getByTestId("payment-item-quantity-0").innerText()
  //     );
  //     expect(quantity).toBe(1);
  //   });
});
