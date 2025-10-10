/**
 * COMPREHENSIVE FIX VERIFICATION TEST
 * Tests all the fixes we just implemented
 */

const { chromium } = require('playwright');

async function testAllFixes() {
  console.log('🔧 TESTING ALL FIXES\n');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 800
  });
  
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  try {
    // TEST 1: View All Workflows - Should show workflows list page
    console.log('TEST 1: Fixed "View all workflows" navigation');
    console.log('='.repeat(80));
    
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const url1 = page.url();
    console.log(`📍 Initial URL: ${url1}`);
    
    if (url1.includes('/workflows')) {
      console.log('✅ PASS - Redirects to /workflows page');
    } else {
      console.log('❌ FAIL - Did not redirect to workflows page');
    }
    
    // Check for workflows list page
    const pageTitle = await page.locator('h1').first().textContent();
    console.log(`📄 Page title: ${pageTitle}`);
    
    if (pageTitle?.includes('Workflows')) {
      console.log('✅ PASS - Workflows list page loaded');
    } else {
      console.log('❌ FAIL - Not on workflows list page');
    }
    
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/fix-1-workflows-list.png' });
    
    // TEST 2: Create New Workflow button
    console.log('\nTEST 2: Create New Workflow button');
    console.log('='.repeat(80));
    
    const createButton = page.locator('button:has-text("Create")').first();
    const hasCreateButton = await createButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasCreateButton) {
      console.log('✅ PASS - Create button found');
      await createButton.click();
      await page.waitForTimeout(2000);
      
      const url2 = page.url();
      console.log(`📍 After click: ${url2}`);
      
      if (url2.includes('/builder')) {
        console.log('✅ PASS - Navigated to builder');
      } else {
        console.log('❌ FAIL - Did not navigate to builder');
      }
    } else {
      console.log('❌ FAIL - Create button not found');
    }
    
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/fix-2-builder.png' });
    
    // TEST 3: View All Workflows button in builder
    console.log('\nTEST 3: "View all workflows" button in builder');
    console.log('='.repeat(80));
    
    const viewAllButton = page.locator('text="View all workflows"').first();
    const hasViewAll = await viewAllButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasViewAll) {
      console.log('✅ PASS - "View all workflows" button found');
      await viewAllButton.click();
      await page.waitForTimeout(2000);
      
      const url3 = page.url();
      console.log(`📍 After click: ${url3}`);
      
      if (url3.includes('/workflows')) {
        console.log('✅ PASS - Navigated back to workflows list');
      } else if (url3 === 'about:blank') {
        console.log('❌ FAIL - Still goes to about:blank');
      } else {
        console.log(`⚠️  Unexpected URL: ${url3}`);
      }
    } else {
      console.log('❌ FAIL - Button not found');
    }
    
    // Go back to builder for other tests
    await page.goto('http://localhost:5173/builder', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // TEST 4: More options button on nodes
    console.log('\nTEST 4: "More options" button on nodes');
    console.log('='.repeat(80));
    
    const nodes = page.locator('.react-flow__node');
    const nodeCount = await nodes.count();
    console.log(`📊 Found ${nodeCount} nodes`);
    
    if (nodeCount > 0) {
      // Hover over first node to show the menu button
      await nodes.first().hover();
      await page.waitForTimeout(500);
      
      // Look for the three-dot menu
      const moreButton = page.locator('button:has-text("⋮")').first();
      const hasMore = await moreButton.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (hasMore) {
        console.log('✅ PASS - "More options" button found on node');
        await moreButton.click();
        await page.waitForTimeout(1000);
        
        // Check if menu appeared
        const menuVisible = await page.locator('text="Configure"').isVisible({ timeout: 1000 }).catch(() => false);
        if (menuVisible) {
          console.log('✅ PASS - Menu appeared with options');
        } else {
          console.log('❌ FAIL - Menu did not appear');
        }
      } else {
        console.log('❌ FAIL - "More options" button not found');
      }
    }
    
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/fix-4-node-menu.png' });
    
    // TEST 5: Evaluate button - Should show dialog, not just alert
    console.log('\nTEST 5: Evaluate button functionality');
    console.log('='.repeat(80));
    
    const evaluateButton = page.locator('button:has-text("Evaluate")').first();
    const hasEvaluate = await evaluateButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasEvaluate) {
      console.log('✅ PASS - Evaluate button found');
      
      // Don't set up dialog handler - we want a real dialog now
      await evaluateButton.click();
      await page.waitForTimeout(1500);
      
      // Check for evaluation dialog
      const dialogVisible = await page.locator('text="Workflow Evaluation"').isVisible({ timeout: 2000 }).catch(() => false);
      if (dialogVisible) {
        console.log('✅ PASS - Evaluation dialog appeared (not just alert!)');
        
        // Close the dialog
        const closeButton = page.locator('button:has-text("Close")').last();
        await closeButton.click();
      } else {
        console.log('⚠️  WARNING - Still showing alert instead of dialog');
      }
    } else {
      console.log('❌ FAIL - Evaluate button not found');
    }
    
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/fix-5-evaluate.png' });
    
    // TEST 6: Code button - Should show dialog, not just alert
    console.log('\nTEST 6: Code button functionality');
    console.log('='.repeat(80));
    
    const codeButton = page.locator('button:has-text("Code")').first();
    const hasCode = await codeButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasCode) {
      console.log('✅ PASS - Code button found');
      
      await codeButton.click();
      await page.waitForTimeout(1500);
      
      // Check for code dialog
      const codeDialogVisible = await page.locator('text="Workflow Code"').isVisible({ timeout: 2000 }).catch(() => false);
      if (codeDialogVisible) {
        console.log('✅ PASS - Code dialog appeared (not just alert!)');
        
        // Close the dialog
        const closeButton = page.locator('button:has-text("Close")').last();
        await closeButton.click();
      } else {
        console.log('⚠️  WARNING - Still showing alert instead of dialog');
      }
    } else {
      console.log('❌ FAIL - Code button not found');
    }
    
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/fix-6-code.png' });
    
    // FINAL SUMMARY
    console.log('\n' + '='.repeat(80));
    console.log('📊 FIX VERIFICATION COMPLETE');
    console.log('='.repeat(80));
    console.log('\nAll screenshots saved to: test-screenshots/fix-*.png');
    console.log('\nKeeping browser open for 20 seconds for manual review...\n');
    
    await page.waitForTimeout(20000);
    
  } catch (error) {
    console.error('❌ Test error:', error);
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/error-fix.png' });
  } finally {
    await browser.close();
    console.log('\n✅ Test complete!');
  }
}

testAllFixes().catch(console.error);
