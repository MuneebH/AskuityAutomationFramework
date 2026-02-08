import { Page, Locator, expect } from "@playwright/test";

export type SizeFilter = 'XS' | 'S' | 'M' | 'ML' | 'L' | 'XL' | 'XXL';

export class StorePage {
  readonly page: Page;
  readonly closeCartButton: Locator;
  readonly productsContainer: Locator;
  readonly productsFoundText: Locator;
  readonly cartButton: Locator;
  readonly itemsInCart: Locator;
  readonly totalCartItemsCount: Locator;
  readonly cartSubtotal: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartButton = page.locator('button:has(div[class="sc-1h98xa9-2 fGgnoG"])');
    this.closeCartButton = page.getByRole('button', { name: 'X' });
    this.productsContainer = page.locator('div.sc-uhudcz-0.iZZGui');
    this.productsFoundText = page.getByText(/Product\(s\) found/);
    this.itemsInCart = page.locator('div.sc-11uohgb-0.hDmOrM');
    this.totalCartItemsCount = page.locator('div.sc-1h98xa9-3.VLMSP');
    this.cartSubtotal = page.locator('div.sc-1h98xa9-8.bciIxg p.sc-1h98xa9-9.jzywDV');
    this.emptyCartMessage = page.locator('p.sc-7th5t8-1.hqDkK');
  }

  /** Returns the Add to cart button for a specific product by exact name (only in the products grid). */
  getAddToCartButton(productName: string): Locator {
    return this.productsContainer
      .locator('div[tabindex="1"]')
      .filter({ has: this.page.getByText(productName, { exact: true }) })
      .getByRole('button', { name: /add to cart/i });
  }

  /** Get plus button for a specific product in the cart. */
  getPlusButton(productName: string): Locator {
    return this.itemsInCart
      .filter({ has: this.page.getByText(productName, { exact: true }) })
      .locator('button:has-text("+")');
  }

  /** Get filter size locator for a specific size. */
  getFilterSize(size: SizeFilter): Locator {
    return this.page.locator(`label:has(input[data-testid="checkbox"][value="${size}"])`);
  }

  /** Navigates to the store page URL. */
  async open() {
    await this.page.goto("https://automation-interview.vercel.app/");
  }
  
  /** Clicks the size filter checkbox for the given size (e.g., 'M'). */
  async clickSizeFilter(size: SizeFilter): Promise<void> {
    await this.getFilterSize(size).click();
  }

  /** Returns the number before "Product(s) found" (e.g. 3 from "3 Product(s) found"). */
  async getProductsFoundCount(): Promise<number> {
    const text = await this.productsFoundText.textContent();
    const match = text?.match(/^\s*(\d+)\s*Product/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /** Returns the number of product cards in the products grid. */
  async getProductCount(): Promise<number> {
    return this.productsContainer.locator('> div').count();
  }

  /** Verifying that the number of products found is equal to the number of products in the products grid. */
  async verifyProductCount(): Promise<void> {
    const productsFoundCount = await this.getProductsFoundCount();
    const productCount = await this.getProductCount();
    expect(productsFoundCount).toBe(productCount);
  }  

  /** Adds each product in the list to the cart (clicks Add to cart for each by exact name). */
  async addProductsToCart(productNames: string[]): Promise<void> {  
    for (const productName of productNames) {
      const button = this.getAddToCartButton(productName);      
      await button.click();
    }
    await this.closeCart();    
  }

  /** Opens the cart by clicking the cart button. */
  async openCart(): Promise<void> {
    await this.cartButton.click();
  }

  /** Closes the cart window by clicking the X button. */
  async closeCart(): Promise<void> {
    await this.closeCartButton.click();
  }

  /** Returns the number of distinct products in the cart */
  async getProductItemCount(): Promise<number> {
    return this.itemsInCart.count();
  }

  /** Returns the total cart items count from the badge. */
  async verifyTotalCartItemsCount(): Promise<void> {
    const totalItems = await this.totalCartItemsCount.innerText();
    const totalCartItemsCount = await this.getTotalCartItemsCount();
    expect(parseInt(totalItems, 10)).toBe(totalCartItemsCount);
  }

  /** Returns the price of a specific product in the cart. */
  async getPriceOfItem(item: Locator): Promise<number> {
    const priceText = await item.locator('div.sc-11uohgb-4 p').innerText();
    const priceMatch = priceText.match(/\$\s*([\d.]+)/);
    return priceMatch ? parseFloat(priceMatch[1]) : 0;
  }

  /** Returns the quantity of a specific product in the cart. */
  async getQuantityOfItem(item: Locator): Promise<number> {
    const quantityText = await item.locator('p:has-text("Quantity:")').innerText();
    const quantityMatch = quantityText.match(/Quantity:\s*(\d+)/i);
    return quantityMatch ? parseInt(quantityMatch[1], 10) : 0;
  }

  /** Returns the number of items in the cart (sum of quantities of all products in the cart). */
  async getTotalCartItemsCount(): Promise<number> {
    let total = 0;
    const items = this.itemsInCart;
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const quantity = await this.getQuantityOfItem(item);
      total += quantity;
    }
    return total;
  }

  /**
   * Clears the cart by clicking the remove button for each item.
   */
  async emptyCartByRemoveButton(): Promise<void> {
    const items = this.itemsInCart;
    let count = await items.count();

    while (count > 0) {
      const item = items.first();
      const removeButton = item.locator('button[title="remove product from cart"]');
      await removeButton.click();
      count = await items.count();
    }
  }

  /** Verifies that the cart is empty by checking if the empty cart message is visible. */
  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.emptyCartMessage).toBeVisible();
  } 

  /** Clicks the plus button `n` times. */
  async increaseProductQuantity(productName: string, times: number): Promise<void> {
    const button = this.getPlusButton(productName);
    if (times <= 0) throw new Error('times must be greater than 0');
    for (let i = 0; i < times; i++) {
      await button.click();
      await this.page.waitForTimeout(150);
    }
  }

  /** Clicks the minus button `times` times. Optionally provide `currentQuantity` to prevent going below zero. */
  async clickMinusNTimes(button: Locator, times: number, currentQuantity?: number): Promise<void> {
    if (times <= 0) throw new Error('times must be greater than 0');
    if (currentQuantity !== undefined && times > currentQuantity) {
      throw new Error('Cannot subtract more than the current quantity');
    }
    for (let i = 0; i < times; i++) {
      await button.click();
      await this.page.waitForTimeout(150);
    }
  }

  /**
   * Calculates the cost of each item in the cart (price × quantity).
   * Returns an object with product names as keys and costs as values.
   */
  async getCartItemCosts(): Promise<number> {
    let total = 0;
    const items = this.itemsInCart;
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const price = await this.getPriceOfItem(item);
      const quantity = await this.getQuantityOfItem(item);

      total += price * quantity;
    }

    return total;
  }

  /** Verifies subtotal matches the sum of item costs. */
  async verifySubtotalMatchesItemCosts(): Promise<void> {
    const subtotal = await this.getCartSubtotal();
    const itemCosts = await this.getCartItemCosts();
    expect(subtotal).toBe(itemCosts);
  }

  /** Returns the cart subtotal value. */
  async getCartSubtotal(): Promise<number> {
    const subtotalText = (await this.cartSubtotal.innerText()).trim();
    const priceMatch = subtotalText.match(/\$\s*([\d.]+)/);
    return priceMatch ? parseFloat(priceMatch[1]) : 0;
  }

  /** Verifies that the cart is empty by checking if the empty cart message is displayed. */
  async isCartEmpty(): Promise<boolean> {
    return this.emptyCartMessage.isVisible();
  }
}
