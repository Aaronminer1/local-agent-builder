const { chromium } = require('playwright');

async function captureUIState() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(2000);
  
  // Take full page screenshot
  await page.screenshot({ 
    path: '/home/aaron/vscode_Projects/local-agent-builder/screenshots/full-ui.png',
    fullPage: true 
  });
  
  console.log('✅ Screenshot saved to screenshots/full-ui.png');
  
  // Get all visible text content
  const bodyText = await page.locator('body').textContent();
  console.log('\n📄 ALL VISIBLE TEXT ON PAGE:\n');
  console.log(bodyText);
  
  // Get all buttons
  const buttons = await page.locator('button').allTextContents();
  console.log('\n🔘 ALL BUTTONS:\n', buttons);
  
  // Get all inputs
  const inputs = await page.locator('input').count();
  console.log('\n📝 INPUT COUNT:', inputs);
  
  // Get all selects
  const selects = await page.locator('select').count();
  console.log('📋 SELECT COUNT:', selects);
  
  // Get structure
  const structure = await page.evaluate(() => {
    return {
      hasSidebar: !!document.querySelector('.sidebar, [class*="sidebar"]'),
      hasCanvas: !!document.querySelector('.react-flow, [class*="flow"]'),
      hasInspector: !!document.querySelector('.inspector, [class*="inspector"]'),
      hasToolbar: !!document.querySelector('.toolbar, [class*="toolbar"]'),
      mainDivs: Array.from(document.querySelectorAll('body > div')).map(d => ({
        id: d.id,
        className: d.className,
        childCount: d.children.length
      }))
    };
  });
  
  console.log('\n🏗️  PAGE STRUCTURE:\n', JSON.stringify(structure, null, 2));
  
  await page.waitForTimeout(5000);
  await browser.close();
}

captureUIState().catch(console.error);
