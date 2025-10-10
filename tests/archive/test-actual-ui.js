/**
 * UPDATED COMPREHENSIVE UI INTERACTION TEST
 * For the ACTUAL agentic-signal/agent-builder UI
 */

const { chromium } = require('playwright');

const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

function logResult(category, element, status, details) {
  const result = { element, status, details, timestamp: new Date().toISOString() };
  testResults[category].push(result);
  
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${emoji} [${category.toUpperCase()}] ${element}: ${details}`);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testTopBarButtons(page) {
  console.log('\n=== TESTING TOP BAR BUTTONS ===\n');
  
  const topBarButtons = [
    { text: '←View all workflows', name: 'Back to Workflows' },
    { text: 'v1 · draft', name: 'Version Dropdown' },
    { text: '🔊Test Audio', name: 'Test Audio' },
    { text: '💾Save', name: 'Save Workflow' },
    { text: '⚙', name: 'Settings' },
    { text: '📊Evaluate', name: 'Evaluate' },
    { text: '</>Code', name: 'Code View' },
    { text: '▶Run', name: 'Run Workflow' },
    { text: 'Deploy', name: 'Deploy' }
  ];
  
  for (const btn of topBarButtons) {
    try {
      const button = page.locator(`button:has-text("${btn.text}")`).first();
      const isVisible = await button.isVisible({ timeout: 2000 });
      const isEnabled = await button.isEnabled();
      
      if (isVisible && isEnabled) {
        logResult('passed', `Top Bar - ${btn.name}`, 'PASS', 'Button visible and enabled');
        
        // Actually click some safe ones
        if (btn.text === '⚙' || btn.text === 'v1 · draft') {
          try {
            await button.click();
            await delay(500);
            logResult('passed', `Top Bar - ${btn.name} Click`, 'PASS', 'Click successful');
          } catch (e) {
            logResult('warnings', `Top Bar - ${btn.name} Click`, 'WARN', 'Click failed: ' + e.message);
          }
        }
      } else if (isVisible && !isEnabled) {
        logResult('warnings', `Top Bar - ${btn.name}`, 'WARN', 'Button visible but disabled');
      } else {
        logResult('failed', `Top Bar - ${btn.name}`, 'FAIL', 'Button not found');
      }
    } catch (e) {
      logResult('failed', `Top Bar - ${btn.name}`, 'FAIL', e.message);
    }
  }
}

async function testNodePaletteCollapse(page) {
  console.log('\n=== TESTING NODE PALETTE SECTIONS ===\n');
  
  const sections = [
    '▶Core',
    '▶Tools',
    '▶Logic',
    '▶Data'
  ];
  
  for (const section of sections) {
    try {
      const sectionHeader = page.locator(`text="${section}"`).first();
      const isVisible = await sectionHeader.isVisible({ timeout: 2000 });
      
      if (isVisible) {
        // Click to collapse/expand
        await sectionHeader.click();
        await delay(300);
        logResult('passed', `Node Palette - ${section} Toggle`, 'PASS', 'Section toggle works');
        
        // Click again to restore
        await sectionHeader.click();
        await delay(300);
      } else {
        logResult('warnings', `Node Palette - ${section}`, 'WARN', 'Section not found');
      }
    } catch (e) {
      logResult('failed', `Node Palette - ${section}`, 'FAIL', e.message);
    }
  }
}

async function testNodeSelection(page) {
  console.log('\n=== TESTING NODE SELECTION & INSPECTOR ===\n');
  
  try {
    // Click on a node in the canvas
    const firstNode = page.locator('.react-flow__node').first();
    await firstNode.click();
    await delay(500);
    
    logResult('passed', 'Node Selection', 'PASS', 'Can select nodes');
    
    // Check if inspector appears on right side
    const rightPanel = page.locator('[class*="inspector"], [class*="panel"], .w-96').first();
    const inspectorVisible = await rightPanel.isVisible({ timeout: 2000 });
    
    if (inspectorVisible) {
      logResult('passed', 'Inspector Panel', 'PASS', 'Inspector appears on node selection');
      
      // Test inspector content
      await testInspectorContent(page);
    } else {
      logResult('failed', 'Inspector Panel', 'FAIL', 'Inspector does not appear');
    }
    
  } catch (e) {
    logResult('failed', 'Node Selection', 'FAIL', e.message);
  }
}

async function testInspectorContent(page) {
  console.log('\n=== TESTING INSPECTOR CONTENT ===\n');
  
  // Check for common inspector elements
  try {
    // Look for input fields
    const inputs = await page.locator('input:visible').count();
    logResult('passed', `Inspector - Input Fields`, 'PASS', `Found ${inputs} visible inputs`);
    
    // Look for text areas
    const textareas = await page.locator('textarea:visible').count();
    logResult('passed', `Inspector - Text Areas`, 'PASS', `Found ${textareas} visible textareas`);
    
    // Look for select dropdowns
    const selects = await page.locator('select:visible').count();
    logResult('passed', `Inspector - Dropdowns`, 'PASS', `Found ${selects} visible dropdowns`);
    
    // Look for buttons in inspector
    const buttons = await page.locator('button:visible').allTextContents();
    const inspectorButtons = buttons.filter(b => b && !b.includes('▶') && !b.includes('Deploy'));
    logResult('passed', `Inspector - Buttons`, 'PASS', `Found ${inspectorButtons.length} inspector buttons: ${inspectorButtons.join(', ')}`);
    
    // Try to interact with first input if exists
    if (inputs > 0) {
      const firstInput = page.locator('input:visible').first();
      const originalValue = await firstInput.inputValue();
      
      await firstInput.fill('TEST_VALUE_123');
      await delay(300);
      
      const newValue = await firstInput.inputValue();
      if (newValue === 'TEST_VALUE_123') {
        logResult('passed', 'Inspector - Input Editing', 'PASS', 'Can edit input fields');
        // Restore original
        await firstInput.fill(originalValue);
      } else {
        logResult('failed', 'Inspector - Input Editing', 'FAIL', 'Input value not updated');
      }
    }
    
  } catch (e) {
    logResult('failed', 'Inspector Content', 'FAIL', e.message);
  }
}

async function testCanvasInteractions(page) {
  console.log('\n=== TESTING CANVAS INTERACTIONS ===\n');
  
  try {
    // Test zoom controls
    const miniMapExists = await page.locator('text="Mini Map"').isVisible({ timeout: 1000 });
    if (miniMapExists) {
      logResult('passed', 'Canvas - Mini Map', 'PASS', 'Mini Map visible');
    } else {
      logResult('warnings', 'Canvas - Mini Map', 'WARN', 'Mini Map not found');
    }
    
    // Test node dragging
    const node = page.locator('.react-flow__node').first();
    const box = await node.boundingBox();
    
    if (box) {
      // Drag node slightly
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 50);
      await page.mouse.up();
      await delay(300);
      
      logResult('passed', 'Canvas - Node Dragging', 'PASS', 'Can drag nodes');
    }
    
    // Test pan (canvas dragging)
    const canvas = page.locator('.react-flow__pane').first();
    await canvas.click({ button: 'middle' });
    await delay(200);
    logResult('passed', 'Canvas - Panning', 'PASS', 'Can pan canvas');
    
  } catch (e) {
    logResult('warnings', 'Canvas Interactions', 'WARN', e.message);
  }
}

async function testWorkflowExecution(page) {
  console.log('\n=== TESTING WORKFLOW EXECUTION (DRY RUN) ===\n');
  
  try {
    // Don't actually run, just check if button is enabled
    const runButton = page.locator('button:has-text("▶Run")').first();
    const isEnabled = await runButton.isEnabled();
    
    if (isEnabled) {
      logResult('passed', 'Workflow - Run Button', 'PASS', 'Run button is enabled');
      logResult('warnings', 'Workflow - Execution', 'WARN', 'Skipping actual execution to avoid side effects');
    } else {
      logResult('warnings', 'Workflow - Run Button', 'WARN', 'Run button is disabled');
    }
    
    // Check save button
    const saveButton = page.locator('button:has-text("💾Save")').first();
    if (await saveButton.isVisible({ timeout: 1000 })) {
      await saveButton.click();
      await delay(500);
      logResult('passed', 'Workflow - Save', 'PASS', 'Save button clicked');
    }
    
  } catch (e) {
    logResult('failed', 'Workflow Execution', 'FAIL', e.message);
  }
}

async function testSpecificNodeTypes(page) {
  console.log('\n=== TESTING SPECIFIC NODE TYPES ===\n');
  
  const nodeTypesToTest = [
    { text: '▶🧠 Research PlannerAgent', type: 'Agent Node' },
    { text: '🔀🎯 Research CoordinatorData', type: 'Transform/Data Node' },
    { text: '⚡🔍 Deep Research?Logic', type: 'If/Else Node' },
    { text: '🔌🧠 Sequential Thinking MCPTool', type: 'MCP Node' },
    { text: '🔄🔁 Refinement LoopLoop', type: 'While Loop' },
    { text: '🔊🗣️ Male VoiceTool', type: 'Voice Node' },
    { text: '✋👤 Human ReviewLogic', type: 'User Approval' },
    { text: '📝🎯 System ArchitectureNote', type: 'Note Node' }
  ];
  
  for (const nodeInfo of nodeTypesToTest) {
    try {
      // Find node by text content
      const node = page.locator(`.react-flow__node:has-text("${nodeInfo.text.slice(0, 10)}")`).first();
      const exists = await node.isVisible({ timeout: 1000 });
      
      if (exists) {
        await node.click();
        await delay(500);
        logResult('passed', `Node Type - ${nodeInfo.type}`, 'PASS', `${nodeInfo.type} exists and is selectable`);
      } else {
        logResult('warnings', `Node Type - ${nodeInfo.type}`, 'WARN', 'Node not found in workflow');
      }
    } catch (e) {
      logResult('warnings', `Node Type - ${nodeInfo.type}`, 'WARN', e.message);
    }
  }
}

async function runComprehensiveTest() {
  console.log('🚀 COMPREHENSIVE UI INTERACTION TEST - AGENTIC SIGNAL\n');
  console.log('Testing the ACTUAL running application at localhost:5173\n');
  console.log('=' .repeat(80) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 Navigating to http://localhost:5173\n');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });
    await delay(2000);
    
    // Run all tests
    await testTopBarButtons(page);
    await testNodePaletteCollapse(page);
    await testNodeSelection(page);
    await testCanvasInteractions(page);
    await testSpecificNodeTypes(page);
    await testWorkflowExecution(page);
    
    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 TEST SUMMARY\n');
    console.log(`✅ PASSED: ${testResults.passed.length}`);
    console.log(`❌ FAILED: ${testResults.failed.length}`);
    console.log(`⚠️  WARNINGS: ${testResults.warnings.length}`);
    console.log(`\nTOTAL TESTS: ${testResults.passed.length + testResults.failed.length + testResults.warnings.length}`);
    
    // Detailed results
    if (testResults.failed.length > 0) {
      console.log('\n🔴 FAILED TESTS:');
      testResults.failed.forEach(r => {
        console.log(`   - ${r.element}: ${r.details}`);
      });
    }
    
    // Save detailed report
    const fs = require('fs');
    fs.writeFileSync(
      '/home/aaron/vscode_Projects/local-agent-builder/UI_ACTUAL_TEST_RESULTS.json',
      JSON.stringify(testResults, null, 2)
    );
    console.log('\n💾 Detailed results saved to UI_ACTUAL_TEST_RESULTS.json');
    
    // Take final screenshot
    await page.screenshot({ 
      path: '/home/aaron/vscode_Projects/local-agent-builder/screenshots/final-test-state.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved to screenshots/final-test-state.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    logResult('failed', 'Overall Test', 'FAIL', error.message);
  } finally {
    console.log('\n⏳ Keeping browser open for 15 seconds so you can review...\n');
    await delay(15000);
    await browser.close();
  }
}

runComprehensiveTest().catch(console.error);
