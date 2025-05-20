import { test, expect } from '@playwright/test';

test.describe('User Shopping Experience', () => {
  test('Complete shopping flow from homepage to checkout', async ({ page }) => {
    // Visit the homepage
    await page.goto('/');
    
    // Assert homepage elements
    await expect(page.locator('h1:has-text("Modern & Stylish Collection")')).toBeVisible();
    await expect(page.locator('text=Featured Products')).toBeVisible();
    
    // Navigate to all products page
    await page.click('text=Shop All');
    await expect(page).toHaveURL('/products');
    
    // Verify product listing page loaded
    await expect(page.locator('h1:has-text("All Products")')).toBeVisible();
    
    // Search for a product
    await page.fill('input[placeholder="Search products..."]', 'headphones');
    
    // Wait for search results to update
    await page.waitForTimeout(500);
    
    // Verify search results contain headphones
    await expect(page.locator('text=Wireless Noise-Cancelling Headphones')).toBeVisible();
    await expect(page.locator('text=Modern Slim Fit T-Shirt')).not.toBeVisible();
    
    // Clear search and filter by category
    await page.fill('input[placeholder="Search products..."]', '');
    await page.selectOption('select', 'Electronics');
    
    // Wait for filter results to update
    await page.waitForTimeout(500);
    
    // Verify filter results
    await expect(page.locator('text=Wireless Noise-Cancelling Headphones')).toBeVisible();
    await expect(page.locator('text=Smart Fitness Tracker')).toBeVisible();
    await expect(page.locator('text=Modern Slim Fit T-Shirt')).not.toBeVisible();
    
    // Click on product to view details
    await page.click('text=Wireless Noise-Cancelling Headphones');
    
    // Verify product details page
    await expect(page).toHaveURL(/\/products\/[^/]+/);
    await expect(page.locator('h1:has-text("Wireless Noise-Cancelling Headphones")')).toBeVisible();
    await expect(page.locator('text=$199.99')).toBeVisible();
    
    // Increase quantity to 2
    await page.click('text=+');
    
    // Add product to cart
    await page.click('button:has-text("Add to Cart")');
    
    // Click on cart icon
    await page.click('a[aria-label="View Cart"]');
    
    // Verify cart page
    await expect(page).toHaveURL('/cart');
    await expect(page.locator('h1:has-text("Shopping Cart")')).toBeVisible();
    
    // Verify added product is in cart with quantity = 2
    await expect(page.locator('text=Wireless Noise-Cancelling Headphones')).toBeVisible();
    await expect(page.locator('.quantity span')).toHaveText('2');
    await expect(page.locator('text=$399.98')).toBeVisible(); // 199.99 * 2
    
    // Proceed to checkout
    await page.click('text=Proceed to Checkout');
    
    // Verify checkout page
    await expect(page).toHaveURL('/checkout');
    await expect(page.locator('h1:has-text("Checkout")')).toBeVisible();
    
    // Fill out checkout form
    await page.fill('input#firstName', 'John');
    await page.fill('input#lastName', 'Doe');
    await page.fill('input#email', 'john.doe@example.com');
    await page.fill('input#address', '123 Main St');
    await page.fill('input#city', 'Anytown');
    await page.fill('input#state', 'CA');
    await page.fill('input#zipCode', '12345');
    await page.fill('input#country', 'USA');
    
    await page.fill('input#cardName', 'John Doe');
    await page.fill('input#cardNumber', '4111111111111111');
    await page.fill('input#expiryDate', '12/25');
    await page.fill('input#cvv', '123');
    
    // Place order
    await page.click('button:has-text("Place Order")');
    
    // Check for order confirmation
    await expect(page.locator('text=Order Confirmed')).toBeVisible();
    await expect(page.locator('text=Thank you for your purchase')).toBeVisible();
  });
  
  test('Theme toggle functionality', async ({ page }) => {
    // Visit the homepage
    await page.goto('/');
    
    // Check initial theme (default is light)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    
    // Click the theme toggle button
    await page.click('button[aria-label="Switch to dark mode"]');
    
    // Verify theme has changed to dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    
    // Click again to switch back to light
    await page.click('button[aria-label="Switch to light mode"]');
    
    // Verify theme has changed back to light
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
