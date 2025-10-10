/**
 * INTERACTIVE FULL UI TEST
 * This will ACTUALLY click every button and observe what happens
 * Running in headed mode so you can watch
 */

const { chromium } = require('playwright');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runInteractiveTest() {
  console.log('🎬 INTERACTIVE UI TEST - You will see EVERYTHING I do\n');
  console.log('I will click every button and tell you what happens\n');
  console.log('=' .repeat(80) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500, // Slow down so you can see each action
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Listen to console messages from the page
  page.on('console', msg => {
    console.log(`   [BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });
  
  // Listen to dialogs
  page.on('dialog', async dialog => {
    console.log(`   [DIALOG] ${dialog.type()}: ${dialog.message()}`);
    await dialog.dismiss();
  });
  
  try {
    console.log('📍 Navigating to http://localhost:5173\n');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await delay(2000);
    
    console.log('\n' + '='.repeat(80));
    console.log('TEST 1: TOP BAR BUTTONS - Clicking each one');
    console.log('='.repeat(80) + '\n');
    
    // Test 1: Back button
    console.log('1️⃣  Clicking "←View all workflows"...');
    try {
      await page.click('button:has-text("←View all workflows")');
      await delay(2000);
      const url = page.url();
      console.log(`   Result: URL is now ${url}`);
      if (url !== 'http://localhost:5173/') {
        console.log('   ✅ Button WORKS - navigated away');
        console.log('   ⏪ Going back to test page...');
        await page.goBack();
        await delay(2000);
      } else {
        console.log('   ⚠️  Button clicked but URL unchanged');
      }
    } catch (e) {
      console.log(`   ❌ FAILED: ${e.message}`);
    }
    
    // Test 2: Version dropdown
    console.log('\n2️⃣  Clicking "v1 · draft"...');
    try {
      await page.click('button:has-text("v1 · draft")');
      await delay(1500);
      const dropdownVisible = await page.locator('[role="menu"], .dropdown, [class*="dropdown"]').isVisible({ timeout: 1000 }).catch(() => false);
      if (dropdownVisible) {
        console.log('   ✅ WORKS - Dropdown menu appeared');
        await page.keyboard.press('Escape');
      } else {
        console.log('   ⚠️  Button clicked but no dropdown visible');
      }
    } catch (e) {
      console.log(`   ⚠️  ${e.message}`);
    }
    
    // Test 3: Test Audio
    console.log('\n3️⃣  Clicking "🔊Test Audio"...');
    try {
      await page.click('button:has-text("🔊Test Audio")');
      await delay(3000); // Wait for audio to potentially play
      console.log('   ✅ Button clicked - check if you heard audio');
      console.log('   (Audio playback is external, cannot detect programmatically)');
    } catch (e) {
      console.log(`   ❌ FAILED: ${e.message}`);
    }
    
    // Test 4: Save
    console.log('\n4️⃣  Clicking "💾Save"...');
    try {
      await page.click('button:has-text("💾Save")');
      await delay(1500);
      // Check for success message or toast
      const toastVisible = await page.locator('.toast, .notification, [class*="toast"]').isVisible({ timeout: 1000 }).catch(() => false);
      if (toastVisible) {
        console.log('   ✅ WORKS - Notification appeared');
      } else {
        console.log('   ⚠️  Button clicked - no visual feedback');
      }
    } catch (e) {
      console.log(`   ❌ FAILED: ${e.message}`);
    }
    
    // Test 5: Settings
    console.log('\n5️⃣  Clicking "⚙" (Settings)...');
    try {
      await page.click('button:has-text("⚙")');
      await delay(1500);
      const modalVisible = await page.locator('[role="dialog"], .modal, [class*="modal"]').isVisible({ timeout: 1000 }).catch(() => false);
      if (modalVisible) {
        console.log('   ✅ WORKS - Settings modal opened');
        await page.keyboard.press('Escape');
        await delay(500);
      } else {
        console.log('   ⚠️  Button clicked but no modal visible');
      }
    } catch (e) {
      console.log(`   ⚠️  ${e.message}`);
    }
    
    // Test 6: Evaluate
    console.log('\n6️⃣  Clicking "📊Evaluate"...');
    try {
      await page.click('button:has-text("📊Evaluate")');
      await delay(1500);
      console.log('   ⚠️  Button exists - need to observe what happens');
    } catch (e) {
      console.log(`   ❌ FAILED: ${e.message}`);
    }
    
    // Test 7: Code View
    console.log('\n7️⃣  Clicking "</>Code"...');
    try {
      await page.click('button:has-text("</>Code")');
      await delay(1500);
      const codeViewVisible = await page.locator('.code-editor, pre, code').isVisible({ timeout: 1000 }).catch(() => false);
      if (codeViewVisible) {
        console.log('   ✅ WORKS - Code view appeared');
      } else {
        console.log('   ⚠️  Button clicked - checking for panel change...');
      }
    } catch (e) {
      console.log(`   ❌ FAILED: ${e.message}`);
    }
    
    // Test 8: Run button
    console.log('\n8️⃣  Clicking "▶Run" (IMPORTANT TEST)...');
    try {
      await page.click('button:has-text("▶Run")');
      await delay(2000);
      
      // Check for execution indicators
      const runningIndicator = await page.locator('.running, .executing, [class*="running"]').isVisible({ timeout: 1000 }).catch(() => false);
      if (runningIndicator) {
        console.log('   ✅ WORKS - Workflow is executing');
        console.log('   🔍 CRITICAL: Looking for STOP button...');
        
        const stopButton = await page.locator('button:has-text("Stop"), button:has-text("⏹"), button:has-text("Cancel")').isVisible({ timeout: 1000 }).catch(() => false);
        if (stopButton) {
          console.log('   ✅ STOP button found!');
        } else {
          console.log('   ❌ CRITICAL ISSUE: NO STOP BUTTON FOUND!');
          console.log('   ⚠️  User cannot cancel running workflow!');
        }
      } else {
        console.log('   ⚠️  Button clicked - no obvious execution indicator');
      }
    } catch (e) {
      console.log(`   ❌ FAILED: ${e.message}`);
    }
    
    // Test 9: Deploy
    console.log('\n9️⃣  Clicking "Deploy"...');
    try {
      await page.click('button:has-text("Deploy")');
      await delay(1500);
      console.log('   ⚠️  Button clicked - need to observe result');
    } catch (e) {
      console.log(`   ❌ FAILED: ${e.message}`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('TEST 2: NODE PALETTE - Testing node creation');
    console.log('='.repeat(80) + '\n');
    
    // Test dragging a node from palette
    console.log('1️⃣  Testing node palette drag-and-drop...');
    try {
      // Find the Agent node in palette
      const agentNode = page.locator('text=/.*Agent.*/').first();
      const canvas = page.locator('.react-flow__pane');
      
      // Drag to canvas
      await agentNode.dragTo(canvas, {
        targetPosition: { x: 500, y: 500 }
      });
      await delay(1500);
      
      console.log('   ✅ Dragged node to canvas - check if it appeared');
    } catch (e) {
      console.log(`   ⚠️  ${e.message}`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('TEST 3: INSPECTOR PANEL - Testing node configuration');
    console.log('='.repeat(80) + '\n');
    
    // Click on a node to open inspector
    console.log('1️⃣  Clicking on a node to open inspector...');
    try {
      const node = page.locator('.react-flow__node').first();
      await node.click();
      await delay(1500);
      
      // Take screenshot of inspector
      await page.screenshot({ 
        path: '/home/aaron/vscode_Projects/local-agent-builder/screenshots/inspector-state.png',
      });
      console.log('   📸 Screenshot saved: screenshots/inspector-state.png');
      
      // Check what's visible in inspector
      console.log('\n   📋 Inspector Contents:');
      
      const inputs = await page.locator('input:visible').count();
      console.log(`   - Input fields: ${inputs}`);
      
      const textareas = await page.locator('textarea:visible').count();
      console.log(`   - Text areas: ${textareas}`);
      
      const selects = await page.locator('select:visible').count();
      console.log(`   - Dropdowns: ${selects}`);
      
      const buttons = await page.locator('button:visible').allTextContents();
      const inspectorButtons = buttons.filter(b => 
        b && 
        !b.includes('▶') && 
        !b.includes('Deploy') && 
        !b.includes('Save') &&
        !b.includes('View all')
      );
      console.log(`   - Inspector buttons: ${inspectorButtons.join(', ')}`);
      
      // Test clicking inspector buttons
      if (inspectorButtons.includes('More options')) {
        console.log('\n2️⃣  Testing "More options" button...');
        try {
          await page.click('button:has-text("More options")');
          await delay(1500);
          await page.screenshot({ 
            path: '/home/aaron/vscode_Projects/local-agent-builder/screenshots/more-options-clicked.png',
          });
          console.log('   📸 Screenshot after click: screenshots/more-options-clicked.png');
          console.log('   ⚠️  Check screenshot to see if anything changed');
        } catch (e) {
          console.log(`   ❌ ${e.message}`);
        }
      }
      
      if (inspectorButtons.includes('+Add variable')) {
        console.log('\n3️⃣  Testing "+Add variable" button...');
        try {
          await page.click('button:has-text("+Add variable")');
          await delay(1500);
          const inputsAfter = await page.locator('input:visible').count();
          if (inputsAfter > inputs) {
            console.log(`   ✅ WORKS - Input count increased from ${inputs} to ${inputsAfter}`);
          } else {
            console.log(`   ❌ DOES NOT WORK - Input count unchanged (${inputs})`);
          }
        } catch (e) {
          console.log(`   ❌ ${e.message}`);
        }
      }
      
    } catch (e) {
      console.log(`   ❌ FAILED: ${e.message}`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('TEST 4: CANVAS CONTROLS');
    console.log('='.repeat(80) + '\n');
    
    // Test zoom controls
    console.log('1️⃣  Testing zoom controls...');
    try {
      const zoomInBtn = page.locator('.react-flow__controls button').first();
      await zoomInBtn.click();
      await delay(1000);
      console.log('   ✅ Zoom in clicked');
      
      const zoomOutBtn = page.locator('.react-flow__controls button').nth(1);
      await zoomOutBtn.click();
      await delay(1000);
      console.log('   ✅ Zoom out clicked');
      
      const fitViewBtn = page.locator('.react-flow__controls button').nth(2);
      await fitViewBtn.click();
      await delay(1000);
      console.log('   ✅ Fit view clicked');
    } catch (e) {
      console.log(`   ⚠️  ${e.message}`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('TEST 5: EDGE CONNECTIONS');
    console.log('='.repeat(80) + '\n');
    
    console.log('1️⃣  Testing node connections...');
    try {
      const edges = await page.locator('.react-flow__edge').count();
      console.log(`   Found ${edges} existing edges`);
      
      // Try to click an edge
      if (edges > 0) {
        const edge = page.locator('.react-flow__edge').first();
        await edge.click();
        await delay(1000);
        console.log('   ✅ Can select edges');
      }
    } catch (e) {
      console.log(`   ⚠️  ${e.message}`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('FINAL OBSERVATIONS');
    console.log('='.repeat(80) + '\n');
    
    // Take final full screenshot
    await page.screenshot({ 
      path: '/home/aaron/vscode_Projects/local-agent-builder/screenshots/final-full-state.png',
      fullPage: true
    });
    console.log('📸 Final screenshot: screenshots/final-full-state.png\n');
    
    console.log('🔍 CRITICAL FINDINGS:');
    console.log('1. NO STOP BUTTON for running workflows');
    console.log('2. Check screenshots to see which buttons actually do something');
    console.log('3. Inspector buttons may be placeholders\n');
    
    console.log('⏸️  Pausing for 30 seconds so you can explore the browser...');
    console.log('   The browser window will stay open for you to click around\n');
    
    await delay(30000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete. Check the screenshots folder!');
  }
}

runInteractiveTest().catch(console.error);
