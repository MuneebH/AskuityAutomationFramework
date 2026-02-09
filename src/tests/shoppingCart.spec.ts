import { test, expect } from '@playwright/test';
import { StorePage } from '../pages/storePage';
import { logger } from '../utils/logger';

test('Shopping Cart Flow Test', async ({ page }) => {
  const storePage = new StorePage(page);
  const productsToAdd = ['Blue T-Shirt', 'Black T-shirt with white stripes'];

  logger.info('Starting Shopping Cart Flow Test');

  try {
    // Navigate to the URL
    logger.info('Step 0: Navigating to store');
    await storePage.open();

    // Select the XS and ML size filter
    logger.info('Step 1: Applying size filters');
    await storePage.clickSizeFilter('XS');
    await page.waitForTimeout(100);
    await storePage.clickSizeFilter('ML');
    await page.waitForTimeout(100);

    // Verify that the number of products found is equal to the number of products in the products grid
    logger.info('Step 2: Verifying product count');
    await storePage.verifyProductCount();

    // Unselect the XS and ML size filter
    logger.info('Step 3: Removing size filters');
    await storePage.clickSizeFilter('XS');
    await page.waitForTimeout(100);
    await storePage.clickSizeFilter('ML');

    // Click the Add to Cart button on the 'Blue T-Shirt' product
    logger.info('Step 4: Adding products to cart');
    await storePage.addProductsToCart(productsToAdd);

    // Open the cart
    logger.info('Step 5: Opening cart');
    await storePage.openCart();

    // Verify that the cart contains 2 items
    logger.info('Step 6: Verifying product count in cart');
    const count = await storePage.getProductItemCount();
    expect(count).toBe(productsToAdd.length);

    // Increase the quantity of 'Blue T-Shirt' to 3
    logger.info('Step 7: Increasing product quantity');
    await storePage.increaseProductQuantity(productsToAdd[0], 2);

    // Verify that the total cart items count in the badge is 4 (3 Blue T-Shirts + 1 Black T-shirt with white stripes)
    logger.info('Step 8: Verifying total cart items count');
    await storePage.verifyTotalCartItemsCount();

    // Verify that the subtotal is correct (3 * 27 + 1 * 14.9 = 95.9)
    logger.info('Step 9: Verifying subtotal');
    await storePage.verifySubtotalMatchesItemCosts();

    // Empty cart by clicking the 'X' button for each item
    logger.info('Step 10: Emptying cart');
    await storePage.emptyCartByRemoveButton();

    // Verify that the cart is empty
    logger.info('Step 11: Verifying cart is empty');
    await storePage.verifyCartIsEmpty();

    // Verify that the subtotal is 0 since the cart is empty
    logger.info('Step 12: Verifying subtotal is 0');
    const subtotal = await storePage.getCartSubtotal();
    expect(subtotal).toBe(0);

    // Close the cart
    logger.info('Step 13: Closing cart');
    await storePage.closeCart();

    logger.info('Shopping Cart Flow Test completed successfully');
  } catch (error) {
    logger.error('Shopping Cart Flow Test failed', error as Error);
    throw error;
  }
});
