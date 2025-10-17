import { test, expect } from '@playwright/test';

test.describe('Agent Builder - Ollama Integration', () => {
  
  test('should check if Ollama is available', async ({ page }) => {
    // Try to fetch from Ollama API
    const response = await page.request.get('http://localhost:11434/api/tags').catch(() => null);
    
    if (response && response.ok()) {
      const data = await response.json();
      console.log('✅ Ollama is running with models:', data.models?.map((m: any) => m.name));
      expect(data.models).toBeDefined();
      expect(Array.isArray(data.models)).toBeTruthy();
    } else {
      console.log('⚠️  Ollama is not running on localhost:11434');
      test.skip();
    }
  });

  test('should list available models in UI', async ({ page }) => {
    await page.goto('/builder/new');
    await page.waitForSelector('.react-flow', { timeout: 5000 });
    
    // Click on a node to open inspector
    const node = page.locator('.react-flow__node').first();
    await node.click();
    await page.waitForTimeout(500);
    
    // Look for model dropdown
    const modelSelect = page.locator('select').filter({ hasText: /llama|model/i }).first();
    
    if (await modelSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await modelSelect.click();
      
      // Check for model options
      const options = await page.locator('option').allTextContents();
      console.log('Available models in UI:', options);
      
      expect(options.length).toBeGreaterThan(0);
    }
  });

  test('should successfully call Ollama during execution', async ({ page }) => {
    // First check if Ollama is available
    const ollamaCheck = await page.request.get('http://localhost:11434/api/tags').catch(() => null);
    
    if (!ollamaCheck || !ollamaCheck.ok()) {
      console.log('⚠️  Skipping test - Ollama not available');
      test.skip();
      return;
    }
    
    await page.goto('/builder/new');
    await page.waitForSelector('.react-flow', { timeout: 5000 });
    
    // Enter input
    const inputField = page.locator('input[type="text"]').or(page.locator('textarea')).first();
    if (await inputField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await inputField.fill('Say hello');
    }
    
    // Execute workflow
    const executeButton = page.getByRole('button', { name: /run|execute|test/i }).first();
    if (await executeButton.isVisible()) {
      await executeButton.click();
      
      // Wait for execution (Ollama can be slow)
      await page.waitForTimeout(5000);
      
      // Check for response
      const logs = await page.locator('[class*="log"]').allTextContents();
      console.log('Execution logs:', logs);
      
      // Should have some output
      expect(logs.length).toBeGreaterThan(0);
    }
  });
});
