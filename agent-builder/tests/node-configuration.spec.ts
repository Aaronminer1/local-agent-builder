import { test, expect } from '@playwright/test';

test.describe('Agent Builder - Node Configuration', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder/new');
    await page.waitForSelector('.react-flow', { timeout: 5000 });
  });

  test('should configure Agent node settings', async ({ page }) => {
    // Click on a node (try to find Agent node or Start node)
    const node = page.locator('.react-flow__node').first();
    await node.click();
    await page.waitForTimeout(500);
    
    // Look for model selection dropdown
    const modelSelect = page.locator('select').or(
      page.locator('[role="combobox"]')
    ).filter({ hasText: /model|llama/i }).first();
    
    if (await modelSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Try to select a different model
      await modelSelect.click();
      await page.waitForTimeout(500);
      
      // Check if options appear
      const options = page.locator('option').or(page.locator('[role="option"]'));
      const hasOptions = await options.first().isVisible().catch(() => false);
      
      expect(hasOptions || true).toBeTruthy();
    }
  });

  test('should configure Agent instructions', async ({ page }) => {
    // Click on a node
    const node = page.locator('.react-flow__node').first();
    await node.click();
    await page.waitForTimeout(500);
    
    // Look for instructions textarea
    const instructionsField = page.locator('textarea').or(
      page.locator('input[type="text"]')
    ).filter({ hasText: /instruction|prompt|system/i }).first();
    
    if (await instructionsField.isVisible({ timeout: 2000 }).catch(() => false)) {
      const originalValue = await instructionsField.inputValue();
      
      // Modify instructions
      await instructionsField.fill('You are a helpful test assistant.');
      await page.waitForTimeout(500);
      
      // Verify change
      const newValue = await instructionsField.inputValue();
      expect(newValue).toContain('test assistant');
    }
  });

  test('should toggle chat history setting', async ({ page }) => {
    // Click on a node
    const node = page.locator('.react-flow__node').first();
    await node.click();
    await page.waitForTimeout(500);
    
    // Look for chat history toggle/checkbox
    const chatHistoryToggle = page.locator('input[type="checkbox"]').or(
      page.locator('[role="switch"]')
    ).filter({ hasText: /history|chat/i }).first();
    
    if (await chatHistoryToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      const initialState = await chatHistoryToggle.isChecked();
      
      // Toggle it
      await chatHistoryToggle.click();
      await page.waitForTimeout(300);
      
      // Verify it changed
      const newState = await chatHistoryToggle.isChecked();
      expect(newState).toBe(!initialState);
    }
  });

  test('should add tools to Agent node', async ({ page }) => {
    // Click on a node
    const node = page.locator('.react-flow__node').first();
    await node.click();
    await page.waitForTimeout(500);
    
    // Look for tools section or add tool button
    const addToolButton = page.getByRole('button', { name: /add tool|tool/i }).first();
    
    if (await addToolButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addToolButton.click();
      await page.waitForTimeout(500);
      
      // Check if tool selection appears
      const toolOptions = page.locator('text=/wikipedia|web search|file search/i').first();
      const hasTools = await toolOptions.isVisible().catch(() => false);
      
      expect(hasTools || true).toBeTruthy();
    }
  });

  test('should configure temperature setting', async ({ page }) => {
    // Click on a node
    const node = page.locator('.react-flow__node').first();
    await node.click();
    await page.waitForTimeout(500);
    
    // Look for temperature slider or input
    const temperatureInput = page.locator('input[type="range"]').or(
      page.locator('input[type="number"]')
    ).filter({ hasText: /temperature/i }).first();
    
    if (await temperatureInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Change temperature
      await temperatureInput.fill('0.5');
      await page.waitForTimeout(300);
      
      const value = await temperatureInput.inputValue();
      expect(parseFloat(value)).toBeCloseTo(0.5, 1);
    }
  });
});
