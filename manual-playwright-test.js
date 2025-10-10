/**
 * MANUAL PLAYWRIGHT TESTING SESSION
 * Testing user-reported issues:
 * 1. "View all workflows" button -> blank page
 * 2. "More options" button on nodes -> does nothing
 * 3. "Add Tools" button -> does nothing
 * 4. "Evaluate" button at top -> doesn't work
 * 5. "Code" button at top -> doesn't work
 */

const { chromium } = require('playwright');

async function manualTest() {
  console.log('🎭 Starting Manual Playwright Testing Session\n');
  console.log('Testing user-reported issues...\n');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000  // Slow down so we can see what's happening
  });
  
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  // Enable console logging from the page
  page.on('console', msg => {
    console.log(`   🌐 PAGE: ${msg.text()}`);
  });
  
  // Track navigation
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      console.log(`   📍 Navigated to: ${frame.url()}`);
    }
  });
  
  try {
    console.log('1️⃣  Loading application...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    console.log('   ✅ App loaded\n');
    
    // TEST 1: "View all workflows" button
    console.log('='.repeat(80));
    console.log('TEST 1: "View all workflows" button');
    console.log('='.repeat(80));
    console.log('\n2️⃣  Looking for "View all workflows" button...');
    
    const viewAllButton = page.locator('text="View all workflows"').first();
    const viewAllExists = await viewAllButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (viewAllExists) {
      console.log('   ✅ Button found!');
      console.log('   🖱️  Clicking "View all workflows"...');
      
      await viewAllButton.click();
      await page.waitForTimeout(3000);
      
      // Check what page we're on
      const currentUrl = page.url();
      console.log(`   📍 Current URL: ${currentUrl}`);
      
      // Check page content
      const bodyText = await page.locator('body').textContent();
      const hasContent = bodyText.length > 100;
      
      if (hasContent) {
        console.log('   📄 Page content length:', bodyText.length, 'characters');
        console.log('   📝 First 200 chars:', bodyText.substring(0, 200).replace(/\s+/g, ' '));
      } else {
        console.log('   ⚠️  Page appears to be blank or minimal content');
      }
      
      // Take a screenshot
      await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/view-all-workflows.png' });
      console.log('   📸 Screenshot saved: test-screenshots/view-all-workflows.png');
      
      // Go back to main page
      console.log('   ⬅️  Going back...');
      await page.goBack();
      await page.waitForTimeout(2000);
    } else {
      console.log('   ❌ "View all workflows" button not found');
    }
    
    // TEST 2: Node "More options" button
    console.log('\n' + '='.repeat(80));
    console.log('TEST 2: Node "More options" button');
    console.log('='.repeat(80));
    console.log('\n3️⃣  Looking for nodes with "More options" button...');
    
    // Find any node on the canvas
    const nodes = page.locator('.react-flow__node');
    const nodeCount = await nodes.count();
    console.log(`   📊 Found ${nodeCount} nodes on canvas`);
    
    if (nodeCount > 0) {
      // Click on the first node to select it
      await nodes.first().click();
      await page.waitForTimeout(1000);
      
      // Look for "More options" button (three dots, kebab menu)
      const moreOptionsSelectors = [
        'button:has-text("⋮")',
        'button:has-text("•••")',
        'button:has-text("...")',
        'button[aria-label*="more"]',
        'button[aria-label*="options"]',
        'button[title*="more"]',
        'button[title*="options"]'
      ];
      
      let moreOptionsFound = false;
      for (const selector of moreOptionsSelectors) {
        const button = page.locator(selector).first();
        const exists = await button.isVisible({ timeout: 1000 }).catch(() => false);
        if (exists) {
          console.log(`   ✅ Found "More options" button with selector: ${selector}`);
          console.log('   🖱️  Clicking "More options"...');
          
          // Set up dialog handler in case there's an alert
          page.once('dialog', async dialog => {
            console.log(`   💬 Alert appeared: "${dialog.message()}"`);
            await dialog.dismiss();
          });
          
          await button.click();
          await page.waitForTimeout(2000);
          
          // Check if a menu appeared
          const menuSelectors = [
            '[role="menu"]',
            '.menu',
            '.dropdown',
            '.popover'
          ];
          
          let menuFound = false;
          for (const menuSelector of menuSelectors) {
            const menu = page.locator(menuSelector);
            const menuVisible = await menu.isVisible({ timeout: 500 }).catch(() => false);
            if (menuVisible) {
              console.log(`   ✅ Menu appeared! Selector: ${menuSelector}`);
              const menuText = await menu.textContent();
              console.log(`   📝 Menu content: ${menuText}`);
              menuFound = true;
              break;
            }
          }
          
          if (!menuFound) {
            console.log('   ⚠️  No menu appeared - button may not be functional');
          }
          
          moreOptionsFound = true;
          break;
        }
      }
      
      if (!moreOptionsFound) {
        console.log('   ❌ No "More options" button found on nodes');
      }
      
      await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/node-more-options.png' });
      console.log('   📸 Screenshot saved: test-screenshots/node-more-options.png');
    }
    
    // TEST 3: "Add Tools" button
    console.log('\n' + '='.repeat(80));
    console.log('TEST 3: "Add Tools" button');
    console.log('='.repeat(80));
    console.log('\n4️⃣  Looking for "Add Tools" button...');
    
    const addToolsSelectors = [
      'button:has-text("Add Tools")',
      'button:has-text("Add Tool")',
      'button:has-text("+ Tools")',
      'button[aria-label*="add tool"]'
    ];
    
    let addToolsFound = false;
    for (const selector of addToolsSelectors) {
      const button = page.locator(selector).first();
      const exists = await button.isVisible({ timeout: 1000 }).catch(() => false);
      if (exists) {
        console.log(`   ✅ Found "Add Tools" button with selector: ${selector}`);
        console.log('   🖱️  Clicking "Add Tools"...');
        
        // Set up dialog handler
        page.once('dialog', async dialog => {
          console.log(`   💬 Alert appeared: "${dialog.message()}"`);
          await dialog.dismiss();
        });
        
        await button.click();
        await page.waitForTimeout(2000);
        
        // Check if anything happened
        const dialogAppeared = await page.locator('[role="dialog"]').isVisible({ timeout: 1000 }).catch(() => false);
        const modalAppeared = await page.locator('.modal').isVisible({ timeout: 1000 }).catch(() => false);
        
        if (dialogAppeared || modalAppeared) {
          console.log('   ✅ Dialog/Modal appeared');
        } else {
          console.log('   ⚠️  No dialog/modal appeared - button may not be functional');
        }
        
        addToolsFound = true;
        break;
      }
    }
    
    if (!addToolsFound) {
      console.log('   ❌ "Add Tools" button not found');
    }
    
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/add-tools-button.png' });
    console.log('   📸 Screenshot saved: test-screenshots/add-tools-button.png');
    
    // TEST 4: "Evaluate" button at top
    console.log('\n' + '='.repeat(80));
    console.log('TEST 4: "Evaluate" button at top');
    console.log('='.repeat(80));
    console.log('\n5️⃣  Looking for "Evaluate" button...');
    
    const evaluateButton = page.locator('button:has-text("Evaluate")').first();
    const evaluateExists = await evaluateButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (evaluateExists) {
      console.log('   ✅ "Evaluate" button found');
      console.log('   🖱️  Clicking "Evaluate"...');
      
      // Set up dialog handler
      page.once('dialog', async dialog => {
        console.log(`   💬 Alert appeared: "${dialog.message()}"`);
        await dialog.dismiss();
      });
      
      await evaluateButton.click();
      await page.waitForTimeout(2000);
      
      // Check for any response
      const dialogVisible = await page.locator('[role="dialog"]').isVisible({ timeout: 1000 }).catch(() => false);
      if (dialogVisible) {
        console.log('   ✅ Dialog appeared');
      } else {
        console.log('   ⚠️  No visible response - button may not be functional');
      }
    } else {
      console.log('   ❌ "Evaluate" button not found');
    }
    
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/evaluate-button.png' });
    console.log('   📸 Screenshot saved: test-screenshots/evaluate-button.png');
    
    // TEST 5: "Code" button at top
    console.log('\n' + '='.repeat(80));
    console.log('TEST 5: "Code" button at top');
    console.log('='.repeat(80));
    console.log('\n6️⃣  Looking for "Code" button...');
    
    const codeSelectors = [
      'button:has-text("Code")',
      'button:has-text("</>")',
      'button[aria-label*="code"]',
      'button[title*="code"]'
    ];
    
    let codeFound = false;
    for (const selector of codeSelectors) {
      const button = page.locator(selector).first();
      const exists = await button.isVisible({ timeout: 1000 }).catch(() => false);
      if (exists) {
        console.log(`   ✅ Found "Code" button with selector: ${selector}`);
        console.log('   🖱️  Clicking "Code"...');
        
        // Set up dialog handler
        page.once('dialog', async dialog => {
          console.log(`   💬 Alert appeared: "${dialog.message()}"`);
          await dialog.dismiss();
        });
        
        await button.click();
        await page.waitForTimeout(2000);
        
        // Check for any response
        const dialogVisible = await page.locator('[role="dialog"]').isVisible({ timeout: 1000 }).catch(() => false);
        if (dialogVisible) {
          console.log('   ✅ Dialog appeared');
        } else {
          console.log('   ⚠️  No visible response - button may not be functional');
        }
        
        codeFound = true;
        break;
      }
    }
    
    if (!codeFound) {
      console.log('   ❌ "Code" button not found');
    }
    
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/code-button.png' });
    console.log('   📸 Screenshot saved: test-screenshots/code-button.png');
    
    // FINAL SUMMARY
    console.log('\n' + '='.repeat(80));
    console.log('📊 MANUAL TEST SUMMARY');
    console.log('='.repeat(80));
    console.log('\nAll screenshots saved to: test-screenshots/');
    console.log('\nKeeping browser open for 30 seconds for manual inspection...');
    console.log('Press Ctrl+C to close early.\n');
    
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Test error:', error);
    await page.screenshot({ path: '/home/aaron/vscode_Projects/local-agent-builder/test-screenshots/error.png' });
  } finally {
    await browser.close();
    console.log('\n✅ Test session complete!');
  }
}

manualTest().catch(console.error);
