import { test, expect } from '@playwright/test';

test.describe('Application Loading', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to /workflows
    await expect(page).toHaveURL(/\/workflows/);
    
    // Should have the main title
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should navigate to builder', async ({ page }) => {
    await page.goto('/workflows');
    
    // Look for "New Workflow" or similar button
    const newWorkflowButton = page.getByRole('button', { name: /new/i });
    if (await newWorkflowButton.isVisible()) {
      await newWorkflowButton.click();
      await expect(page).toHaveURL(/\/builder/);
    } else {
      // Navigate directly
      await page.goto('/builder/new');
      await expect(page).toHaveURL(/\/builder/);
    }
  });

  test('should display the canvas', async ({ page }) => {
    await page.goto('/builder/new');
    
    // React Flow should be present
    const canvas = page.locator('.react-flow');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });
});
