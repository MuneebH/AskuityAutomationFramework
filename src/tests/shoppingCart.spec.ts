import { test, expect } from '@playwright/test';
import { StorePage } from '../pages/storePage';

test('Shopping Cart Test', async ({ page }) => {
  const storePage = new StorePage(page);
  const productsToAdd = ['Blue T-Shirt', 'Black T-shirt with white stripes'];

  // Navigate to the URL
  await storePage.open();

  // Select the XS and ML size filter
  await storePage.clickSizeFilter('XS');
  await page.waitForTimeout(1000);
  await storePage.clickSizeFilter('ML');
  await page.waitForTimeout(1000);

  // Verify that the number of products found is equal to the number of products in the products grid
  await storePage.verifyProductCount();

  // Unselect the XS and ML size filter
  await storePage.clickSizeFilter('XS');
  await page.waitForTimeout(1000);
  await storePage.clickSizeFilter('ML');

  // Click the Add to Cart button on the 'Blue T-Shirt' product
  await storePage.addProductsToCart(productsToAdd);

  // Open the cart
  await storePage.openCart();

  // Verify that the cart contains 2 items
  await storePage.getProductItemCount().then(count => {
    expect(count).toBe(productsToAdd.length);
  });

  // Increase the quantity of 'Blue T-Shirt' to 3
  await storePage.increaseProductQuantity(productsToAdd[0], 2);

  // Verify that the total cart items count in the badge is 4 (3 Blue T-Shirts + 1 Black T-shirt with white stripes)
  await storePage.verifyTotalCartItemsCount();

  // Verify that the subtotal is correct (3 * 27 + 1 * 14.9 = 95.9)
  await storePage.verifySubtotalMatchesItemCosts();

  // Empty cart by clicking the 'X' button for each item
  await storePage.emptyCartByRemoveButton();

  // Verify that the cart is empty
  await storePage.verifyCartIsEmpty();

  // Verify that the subtotal is 0 since the cart is empty
  await storePage.getCartSubtotal().then(subtotal => {
    console.log('Cart subtotal after closing:', subtotal);
    expect(subtotal).toBe(0);
  });

  // Close the cart
  await storePage.closeCart();
  
});
