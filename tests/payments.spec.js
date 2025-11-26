import { test, expect } from "@playwright/test";
import { addToCart, goToPaymentWithItem } from "./utils/helpers.js";
import { paymentMethods } from "./data/payments.data.js";

test("Validate payment summary", async ({ page }) => {
  const { productName, productPrice } = await test.step(
    "Add product to cart",
    async () => await addToCart(page)
  );

  await test.step("Navigate to cart page", async () => {
    await page.getByTestId("store-tab-cart").click();
    await expect(page.getByTestId("cart-title")).toBeVisible();
  });

  await test.step("Go to payment page", async () => {
    await page.getByTestId("cart-go-to-payment").click();
    await expect(page.getByTestId("payment-title")).toBeVisible();
  });

  await test.step("Validate product name", async () => {
    const name = await page.getByTestId("payment-item-name-0").innerText();
    expect(name).toBe(productName);
  });

  await test.step("Validate product quantity", async () => {
    const quantity = Number(await page.getByTestId("payment-item-quantity-0").innerText());
    expect(quantity).toBe(1);
  });

  await test.step("Validate product price", async () => {
    const price = Number(await page.getByTestId("payment-item-price-value-0").innerText());
    expect(price).toBe(productPrice);
  });

  await test.step("Validate subtotal and total", async () => {
    const quantity = 1;
    const total = productPrice * quantity;

    const itemTotal = Number(await page.getByTestId("payment-item-total-value-0").innerText());
    expect(itemTotal).toBe(total);

    const paymentTotal = Number(await page.getByTestId("payment-total-value").innerText());
    expect(paymentTotal).toBe(total);
  });
});

// Dynamically generate a separate test for each payment method
for (const method of paymentMethods) {
  test(`Payment method: ${method}`, async ({ page }) => {
    await goToPaymentWithItem(page);

    const locator = page.getByTestId(`payment-method-input-${method}`);

    await test.step(`Select ${method}`, async () => {
      await locator.click();
    });

    await test.step("Click confirm payment button", async () => {
      await page.getByTestId("payment-confirm-button").click();
    });

    await test.step("Verify order on Orders tab", async () => {
      await expect(page.getByTestId("orders-title")).toBeVisible();
      await expect(page.getByTestId("order-0")).toBeVisible();
    });

  });
}

// Test payment without selecting a method
test("Payment without method", async ({ page }) => {
  await goToPaymentWithItem(page);

  await test.step("Click confirm payment button", async () => {
    await page.getByTestId("payment-confirm-button").click();
  });

  await test.step("Verify alert", async () => {
    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("alert");
      expect(dialog.message()).toBe("Please select a payment method!");
      await dialog.accept();
    });
  });
});