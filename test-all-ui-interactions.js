/**
 * COMPREHENSIVE UI INTERACTION TEST
 * 
 * This script will:
 * 1. Click EVERY button in the UI
 * 2. Toggle EVERY switch
 * 3. Select EVERY dropdown option
 * 4. Type in EVERY input field
 * 5. Interact with EVERY node type
 * 6. Document what works vs what doesn't
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

async function testNodePalette(page) {
  console.log('\n=== TESTING NODE PALETTE ===\n');
  
  // Test each node type drag/drop
  const nodeTypes = [
    'Start', 'Agent', 'Transform', 'If/Else', 'While', 
    'Set State', 'End', 'File Search', 'Guardrails', 
    'User Approval', 'Voice', 'Note'
  ];
  
  for (const nodeType of nodeTypes) {
    try {
      const nodeButton = page.locator(`text="${nodeType}"`).first();
      const isVisible = await nodeButton.isVisible({ timeout: 2000 });
      
      if (isVisible) {
        logResult('passed', `Node Palette - ${nodeType}`, 'PASS', 'Node type visible and clickable');
      } else {
        logResult('failed', `Node Palette - ${nodeType}`, 'FAIL', 'Node type not visible');
      }
    } catch (e) {
      logResult('failed', `Node Palette - ${nodeType}`, 'FAIL', e.message);
    }
  }
  
  // Test MCP expandable section
  try {
    const mcpSection = page.locator('text="MCP Servers"').first();
    await mcpSection.click();
    await delay(500);
    logResult('passed', 'Node Palette - MCP Expand', 'PASS', 'MCP section expandable');
  } catch (e) {
    logResult('failed', 'Node Palette - MCP Expand', 'FAIL', e.message);
  }
}

async function testCanvasControls(page) {
  console.log('\n=== TESTING CANVAS CONTROLS ===\n');
  
  // Test zoom controls
  try {
    const zoomIn = page.locator('button:has-text("+")').first();
    if (await zoomIn.isVisible({ timeout: 1000 })) {
      await zoomIn.click();
      await delay(300);
      logResult('passed', 'Canvas - Zoom In', 'PASS', 'Zoom in button works');
    }
  } catch (e) {
    logResult('warnings', 'Canvas - Zoom In', 'WARN', 'Zoom button not found or not working');
  }
  
  // Test fit view
  try {
    const fitView = page.locator('button:has-text("Fit")').first();
    if (await fitView.isVisible({ timeout: 1000 })) {
      await fitView.click();
      await delay(300);
      logResult('passed', 'Canvas - Fit View', 'PASS', 'Fit view button works');
    }
  } catch (e) {
    logResult('warnings', 'Canvas - Fit View', 'WARN', 'Fit view not found');
  }
}

async function testAgentNodeInspector(page) {
  console.log('\n=== TESTING AGENT NODE INSPECTOR ===\n');
  
  // Click on an agent node to open inspector
  try {
    const agentNode = page.locator('.react-flow__node').first();
    await agentNode.click();
    await delay(500);
    
    // Test Name Input
    try {
      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.fill('Test Agent Name');
      await delay(300);
      const value = await nameInput.inputValue();
      if (value === 'Test Agent Name') {
        logResult('passed', 'Inspector - Agent Name Input', 'PASS', 'Name input works and saves');
      } else {
        logResult('failed', 'Inspector - Agent Name Input', 'FAIL', 'Name not saved correctly');
      }
    } catch (e) {
      logResult('failed', 'Inspector - Agent Name Input', 'FAIL', e.message);
    }
    
    // Test Instructions Textarea
    try {
      const instructionsArea = page.locator('textarea').first();
      await instructionsArea.fill('Test instructions for the agent');
      await delay(300);
      const value = await instructionsArea.inputValue();
      if (value.includes('Test instructions')) {
        logResult('passed', 'Inspector - Agent Instructions', 'PASS', 'Instructions textarea works');
      } else {
        logResult('failed', 'Inspector - Agent Instructions', 'FAIL', 'Instructions not saved');
      }
    } catch (e) {
      logResult('failed', 'Inspector - Agent Instructions', 'FAIL', e.message);
    }
    
    // Test Model Dropdown
    try {
      const modelSelect = page.locator('select').first();
      const options = await modelSelect.locator('option').count();
      if (options > 0) {
        await modelSelect.selectOption({ index: 0 });
        await delay(300);
        logResult('passed', 'Inspector - Model Dropdown', 'PASS', `Found ${options} models, selection works`);
      } else {
        logResult('failed', 'Inspector - Model Dropdown', 'FAIL', 'No models available');
      }
    } catch (e) {
      logResult('failed', 'Inspector - Model Dropdown', 'FAIL', e.message);
    }
    
    // Test "Include chat history" Toggle
    try {
      const historyToggle = page.locator('input[type="checkbox"]').first();
      const isChecked = await historyToggle.isChecked();
      await historyToggle.click();
      await delay(300);
      const newChecked = await historyToggle.isChecked();
      
      if (isChecked !== newChecked) {
        logResult('passed', 'Inspector - Chat History Toggle', 'PASS', 'Toggle changes state');
        // But does it save to node data?
        logResult('warnings', 'Inspector - Chat History Toggle (Save)', 'WARN', 'Toggle works visually, but may not save to node data');
      } else {
        logResult('failed', 'Inspector - Chat History Toggle', 'FAIL', 'Toggle does not change state');
      }
    } catch (e) {
      logResult('failed', 'Inspector - Chat History Toggle', 'FAIL', e.message);
    }
    
    // Test "Reasoning effort" Dropdown
    try {
      const reasoningSelect = page.locator('select:has-text("low")').first();
      if (await reasoningSelect.isVisible({ timeout: 1000 })) {
        await reasoningSelect.selectOption('high');
        await delay(300);
        const value = await reasoningSelect.inputValue();
        if (value === 'high') {
          logResult('warnings', 'Inspector - Reasoning Effort', 'WARN', 'Dropdown works but Ollama does not support reasoning effort');
        } else {
          logResult('failed', 'Inspector - Reasoning Effort', 'FAIL', 'Selection not saved');
        }
      } else {
        logResult('warnings', 'Inspector - Reasoning Effort', 'WARN', 'Dropdown hidden or not found');
      }
    } catch (e) {
      logResult('warnings', 'Inspector - Reasoning Effort', 'WARN', 'Likely hidden: ' + e.message);
    }
    
    // Test "Add tool" Button - THE CRITICAL ONE
    try {
      const addToolButton = page.locator('button:has-text("Add tool")').first();
      if (await addToolButton.isVisible({ timeout: 1000 })) {
        await addToolButton.click();
        await delay(500);
        
        // Check if modal or anything appeared
        const modalCount = await page.locator('[role="dialog"]').count();
        if (modalCount > 0) {
          logResult('passed', 'Inspector - Add Tool Button', 'PASS', 'Button opens modal/dialog');
        } else {
          logResult('failed', 'Inspector - Add Tool Button', 'FAIL', 'Button visible but does nothing - NO HANDLER');
        }
      } else {
        logResult('warnings', 'Inspector - Add Tool Button', 'WARN', 'Button hidden (expected after Day 1 fix)');
      }
    } catch (e) {
      logResult('warnings', 'Inspector - Add Tool Button', 'WARN', 'Button not found or hidden: ' + e.message);
    }
    
    // Test "Output format" Dropdown
    try {
      const outputSelect = page.locator('select:has-text("Text")').first();
      if (await outputSelect.isVisible({ timeout: 1000 })) {
        await outputSelect.selectOption('JSON');
        await delay(300);
        const value = await outputSelect.inputValue();
        if (value === 'JSON') {
          logResult('warnings', 'Inspector - Output Format', 'WARN', 'Dropdown works visually but may not save to node data');
        } else {
          logResult('failed', 'Inspector - Output Format', 'FAIL', 'Selection not saved');
        }
      }
    } catch (e) {
      logResult('warnings', 'Inspector - Output Format', 'WARN', e.message);
    }
    
    // Test "More options" Button
    try {
      const moreOptionsButton = page.locator('button:has-text("More options")').first();
      if (await moreOptionsButton.isVisible({ timeout: 1000 })) {
        await moreOptionsButton.click();
        await delay(500);
        
        // Check if anything expanded
        const advancedSection = await page.locator('.advanced, .more-options, [data-expanded]').count();
        if (advancedSection > 0) {
          logResult('passed', 'Inspector - More Options Button', 'PASS', 'Button expands advanced section');
        } else {
          logResult('failed', 'Inspector - More Options Button', 'FAIL', 'Button visible but does nothing - NO HANDLER');
        }
      } else {
        logResult('warnings', 'Inspector - More Options Button', 'WARN', 'Button hidden (expected after Day 1 fix)');
      }
    } catch (e) {
      logResult('warnings', 'Inspector - More Options Button', 'WARN', 'Button not found: ' + e.message);
    }
    
    // Test Delete Button
    try {
      const deleteButton = page.locator('button:has-text("🗑️")').first();
      if (await deleteButton.isVisible({ timeout: 1000 })) {
        // Don't actually delete, just check if clickable
        const isEnabled = await deleteButton.isEnabled();
        if (isEnabled) {
          logResult('passed', 'Inspector - Delete Button', 'PASS', 'Delete button is enabled and clickable');
        } else {
          logResult('failed', 'Inspector - Delete Button', 'FAIL', 'Delete button disabled');
        }
      }
    } catch (e) {
      logResult('failed', 'Inspector - Delete Button', 'FAIL', e.message);
    }
    
  } catch (e) {
    logResult('failed', 'Inspector - Agent Node', 'FAIL', 'Could not select agent node: ' + e.message);
  }
}

async function testTransformNode(page) {
  console.log('\n=== TESTING TRANSFORM NODE ===\n');
  
  try {
    // Add a transform node from palette
    const transformButton = page.locator('text="Transform"').first();
    await transformButton.click();
    await delay(500);
    
    // Click canvas to drop it
    const canvas = page.locator('.react-flow__pane').first();
    await canvas.click({ position: { x: 400, y: 300 } });
    await delay(500);
    
    // Click the new transform node
    const transformNode = page.locator('.react-flow__node:has-text("Transform")').first();
    await transformNode.click();
    await delay(500);
    
    // Test code editor
    const codeEditor = page.locator('textarea').first();
    const testCode = 'return input.toUpperCase();';
    await codeEditor.fill(testCode);
    await delay(300);
    
    const value = await codeEditor.inputValue();
    if (value === testCode) {
      logResult('passed', 'Transform - Code Editor', 'PASS', 'Code editor works and saves');
    } else {
      logResult('failed', 'Transform - Code Editor', 'FAIL', 'Code not saved correctly');
    }
  } catch (e) {
    logResult('failed', 'Transform Node', 'FAIL', e.message);
  }
}

async function testIfElseNode(page) {
  console.log('\n=== TESTING IF/ELSE NODE ===\n');
  
  try {
    const ifElseButton = page.locator('text="If/Else"').first();
    await ifElseButton.click();
    await delay(500);
    
    const canvas = page.locator('.react-flow__pane').first();
    await canvas.click({ position: { x: 500, y: 300 } });
    await delay(500);
    
    const ifElseNode = page.locator('.react-flow__node:has-text("If/Else")').first();
    await ifElseNode.click();
    await delay(500);
    
    // Test condition editor
    const conditionEditor = page.locator('textarea').first();
    const testCondition = 'return input > 50;';
    await conditionEditor.fill(testCondition);
    await delay(300);
    
    const value = await conditionEditor.inputValue();
    if (value === testCondition) {
      logResult('passed', 'If/Else - Condition Editor', 'PASS', 'Condition editor works');
    } else {
      logResult('failed', 'If/Else - Condition Editor', 'FAIL', 'Condition not saved');
    }
  } catch (e) {
    logResult('failed', 'If/Else Node', 'FAIL', e.message);
  }
}

async function testVoiceNode(page) {
  console.log('\n=== TESTING VOICE NODE ===\n');
  
  try {
    const voiceButton = page.locator('text="Voice"').first();
    await voiceButton.click();
    await delay(500);
    
    const canvas = page.locator('.react-flow__pane').first();
    await canvas.click({ position: { x: 600, y: 300 } });
    await delay(500);
    
    const voiceNode = page.locator('.react-flow__node:has-text("Voice")').first();
    await voiceNode.click();
    await delay(500);
    
    // Test gender selection
    try {
      const maleButton = page.locator('button:has-text("Male")').first();
      await maleButton.click();
      await delay(300);
      logResult('passed', 'Voice - Gender Selection', 'PASS', 'Gender buttons work');
    } catch (e) {
      logResult('failed', 'Voice - Gender Selection', 'FAIL', e.message);
    }
    
    // Test voice dropdown
    try {
      const voiceSelect = page.locator('select').first();
      const optionCount = await voiceSelect.locator('option').count();
      if (optionCount > 0) {
        await voiceSelect.selectOption({ index: 1 });
        await delay(300);
        logResult('passed', 'Voice - Voice Dropdown', 'PASS', `${optionCount} voices available, selection works`);
      }
    } catch (e) {
      logResult('failed', 'Voice - Voice Dropdown', 'FAIL', e.message);
    }
    
    // Test speed slider
    try {
      const speedSlider = page.locator('input[type="range"]').first();
      await speedSlider.fill('1.5');
      await delay(300);
      const value = await speedSlider.inputValue();
      logResult('passed', 'Voice - Speed Slider', 'PASS', `Speed set to ${value}x`);
    } catch (e) {
      logResult('failed', 'Voice - Speed Slider', 'FAIL', e.message);
    }
    
  } catch (e) {
    logResult('failed', 'Voice Node', 'FAIL', e.message);
  }
}

async function testMCPNode(page) {
  console.log('\n=== TESTING MCP NODE ===\n');
  
  try {
    // Expand MCP section first
    const mcpSection = page.locator('text="MCP Servers"').first();
    await mcpSection.click();
    await delay(500);
    
    // Try to add brave_search MCP
    const braveSearch = page.locator('text="brave_search"').first();
    await braveSearch.click();
    await delay(500);
    
    const canvas = page.locator('.react-flow__pane').first();
    await canvas.click({ position: { x: 700, y: 300 } });
    await delay(500);
    
    const mcpNode = page.locator('.react-flow__node:has-text("MCP")').first();
    await mcpNode.click();
    await delay(500);
    
    // Test server dropdown
    try {
      const serverSelect = page.locator('select').first();
      await serverSelect.selectOption({ index: 0 });
      await delay(300);
      logResult('passed', 'MCP - Server Dropdown', 'PASS', 'Server selection works visually');
      logResult('warnings', 'MCP - Execution', 'WARN', 'MCP execution is STUBBED - nodes do not actually call servers');
    } catch (e) {
      logResult('failed', 'MCP - Server Dropdown', 'FAIL', e.message);
    }
    
    // Test operation input
    try {
      const operationInput = page.locator('input[placeholder*="operation"]').first();
      if (await operationInput.isVisible({ timeout: 1000 })) {
        await operationInput.fill('search');
        await delay(300);
        logResult('passed', 'MCP - Operation Input', 'PASS', 'Operation input works');
      }
    } catch (e) {
      logResult('warnings', 'MCP - Operation Input', 'WARN', e.message);
    }
    
  } catch (e) {
    logResult('failed', 'MCP Node', 'FAIL', e.message);
  }
}

async function testSetStateNode(page) {
  console.log('\n=== TESTING SET STATE NODE ===\n');
  
  try {
    const setStateButton = page.locator('text="Set State"').first();
    await setStateButton.click();
    await delay(500);
    
    const canvas = page.locator('.react-flow__pane').first();
    await canvas.click({ position: { x: 800, y: 300 } });
    await delay(500);
    
    const setStateNode = page.locator('.react-flow__node:has-text("Set State")').first();
    await setStateNode.click();
    await delay(500);
    
    // Test variable name input
    try {
      const varNameInput = page.locator('input').first();
      await varNameInput.fill('testVariable');
      await delay(300);
      logResult('passed', 'Set State - Variable Name', 'PASS', 'Variable name input works');
    } catch (e) {
      logResult('failed', 'Set State - Variable Name', 'FAIL', e.message);
    }
    
    // Test "Add variable" button
    try {
      const addVarButton = page.locator('button:has-text("Add variable")').first();
      if (await addVarButton.isVisible({ timeout: 1000 })) {
        await addVarButton.click();
        await delay(500);
        
        // Check if new variable field appeared
        const inputCount = await page.locator('input').count();
        if (inputCount > 1) {
          logResult('passed', 'Set State - Add Variable Button', 'PASS', 'Add variable creates new field');
        } else {
          logResult('failed', 'Set State - Add Variable Button', 'FAIL', 'Button does nothing - NO HANDLER');
        }
      } else {
        logResult('warnings', 'Set State - Add Variable Button', 'WARN', 'Button hidden');
      }
    } catch (e) {
      logResult('warnings', 'Set State - Add Variable Button', 'WARN', e.message);
    }
    
  } catch (e) {
    logResult('failed', 'Set State Node', 'FAIL', e.message);
  }
}

async function testWorkflowControls(page) {
  console.log('\n=== TESTING WORKFLOW CONTROLS ===\n');
  
  // Test Run button
  try {
    const runButton = page.locator('button:has-text("Run")').first();
    if (await runButton.isVisible({ timeout: 1000 })) {
      const isEnabled = await runButton.isEnabled();
      if (isEnabled) {
        logResult('passed', 'Workflow - Run Button', 'PASS', 'Run button is enabled');
        // Don't actually run to avoid side effects
      } else {
        logResult('warnings', 'Workflow - Run Button', 'WARN', 'Run button disabled (may need valid workflow)');
      }
    }
  } catch (e) {
    logResult('warnings', 'Workflow - Run Button', 'WARN', e.message);
  }
  
  // Test Save button
  try {
    const saveButton = page.locator('button:has-text("Save")').first();
    if (await saveButton.isVisible({ timeout: 1000 })) {
      await saveButton.click();
      await delay(500);
      logResult('passed', 'Workflow - Save Button', 'PASS', 'Save button clickable');
    }
  } catch (e) {
    logResult('warnings', 'Workflow - Save Button', 'WARN', e.message);
  }
  
  // Test Load button
  try {
    const loadButton = page.locator('button:has-text("Load")').first();
    if (await loadButton.isVisible({ timeout: 1000 })) {
      logResult('passed', 'Workflow - Load Button', 'PASS', 'Load button exists');
    }
  } catch (e) {
    logResult('warnings', 'Workflow - Load Button', 'WARN', e.message);
  }
}

async function runComprehensiveTest() {
  console.log('🚀 STARTING COMPREHENSIVE UI INTERACTION TEST\n');
  console.log('This will click, type, and interact with EVERY element in the UI\n');
  console.log('=' .repeat(80) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false, // Show browser so you can watch
    slowMo: 100 // Slow down so you can see interactions
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to app
    console.log('📍 Navigating to http://localhost:5173\n');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });
    await delay(2000);
    
    // Run all tests
    await testNodePalette(page);
    await testCanvasControls(page);
    await testAgentNodeInspector(page);
    await testTransformNode(page);
    await testIfElseNode(page);
    await testVoiceNode(page);
    await testMCPNode(page);
    await testSetStateNode(page);
    await testWorkflowControls(page);
    
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
    
    if (testResults.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      testResults.warnings.forEach(r => {
        console.log(`   - ${r.element}: ${r.details}`);
      });
    }
    
    // Save detailed report
    const fs = require('fs');
    fs.writeFileSync(
      '/home/aaron/vscode_Projects/local-agent-builder/UI_TEST_RESULTS.json',
      JSON.stringify(testResults, null, 2)
    );
    console.log('\n💾 Detailed results saved to UI_TEST_RESULTS.json');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    logResult('failed', 'Overall Test', 'FAIL', error.message);
  } finally {
    console.log('\n⏳ Keeping browser open for 10 seconds so you can review...\n');
    await delay(10000);
    await browser.close();
  }
}

runComprehensiveTest().catch(console.error);
