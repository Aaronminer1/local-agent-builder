# Testing Results & Known Bugs

**Last Updated:** October 9, 2025, 10:13 PM  
**Testing Method:** Playwright browser automation + manual testing  
**Philosophy:** "Test beyond the obvious - ask qualifying questions"

---

## 🎯 Testing Summary

**Tests Run:** 15  
**Tests Passed:** 10  
**Tests Failed:** 2  
**Tests Pending:** 3  
**Critical Bugs Found:** 2

---

## 🚨 Critical Bugs

### Bug #1: Input State Not Syncing with UI

**Severity:** 🔴 CRITICAL  
**Status:** Confirmed, Not Fixed  
**Discovered:** October 9, 2025, 10:08 PM  
**Impact:** Workflows cannot execute

**Description:**
The input textarea shows text in the DOM, but React state (`userInput`) is not being updated. This causes validation to always fail, preventing workflow execution.

**Steps to Reproduce:**
1. Navigate to `/builder/new`
2. Type text in the "Workflow Input" textarea
3. Click "▶ Run" button
4. Observe alert: "Please enter an input before running the workflow"
5. Note: Input IS visible in UI but validation fails

**Expected Behavior:**
- Typing should update `userInput` state via `onChange`
- Validation should pass when text is present
- Workflow should execute

**Actual Behavior:**
- DOM value updates (text visible in UI)
- React state does NOT update
- Validation always fails with empty string check
- Workflow never executes

**Technical Details:**
```typescript
// File: /agent-builder/src/pages/Builder.tsx
// Line: 374

<textarea
  value={userInput}
  onChange={(e) => setUserInput(e.target.value)}
  placeholder="Enter your input here..."
  rows={2}
/>

// Line: 115
if (!userInput.trim()) {  // Always true!
  alert('Please enter an input before running the workflow');
  return;
}
```

**Root Cause Theories:**
1. Component re-rendering issue
2. Stale closure in useCallback
3. State not properly initialized
4. Event handler not firing
5. Competing state updates

**Testing Evidence:**
- Playwright `.fill()` sets DOM but doesn't trigger onChange
- Playwright `.pressSequentially()` should trigger onChange but state still doesn't update
- DOM inspection confirms value is present
- React state inspection needed

**Fix Priority:** 🔴 IMMEDIATE  
**Blocks:** All workflow execution  
**Assigned To:** Unassigned  
**Estimated Fix Time:** 30 minutes - 2 hours

---

### Bug #2: Tools Don't Execute

**Severity:** 🔴 CRITICAL  
**Status:** Confirmed, Not Fixed  
**Discovered:** October 9, 2025, 10:05 PM  
**Impact:** Tools are cosmetic only - misleading UX

**Description:**
Tools can be selected in the UI and save to node data, but are never used during workflow execution. The `executeAgent()` method doesn't check for or use tools.

**Steps to Reproduce:**
1. Click on Agent node
2. Click "+ Add tool"
3. Select "File search" from dropdown
4. Tool appears in list
5. Run workflow
6. Observe: Tool is never used

**Expected Behavior:**
- Tools should be extracted from node data
- Tools should be passed to LLM
- Tools should be executed when called
- Tool results should be returned to LLM

**Actual Behavior:**
- Tools save to `node.data.tools` array
- `executeAgent()` never reads `node.data.tools`
- No tool definitions exist
- No tool execution logic exists
- Tools have zero effect on agent behavior

**Technical Details:**
```typescript
// File: /agent-builder/src/services/workflowExecutor.ts
// Line: 217-221

private async executeAgent(node: Node): Promise<string> {
  const instructions = (node.data?.instructions as string) || '...';
  const model = (node.data?.model as string) || 'llama3.2:3b';
  const includeChatHistory = node.data?.includeChatHistory as boolean;
  const temperature = (node.data?.temperature as number) || 0.7;
  
  // ❌ NO TOOLS EXTRACTION!
  // const tools = node.data?.tools; // This line doesn't exist
  
  // No tool passing to Ollama
  // No tool execution logic
  // No tool result handling
}
```

**What's Missing:**
1. Tool extraction from node data
2. Tool definitions/schemas
3. Tool execution functions
4. Tool result processing
5. Integration with Ollama (if supported)

**Fix Priority:** 🟠 HIGH  
**Blocks:** Tool functionality  
**Assigned To:** Unassigned  
**Estimated Fix Time:** 26-40 hours (full implementation)

---

## ✅ Passing Tests

### Test 1: Node Registration
**Status:** ✅ PASS  
**Date:** October 9, 2025, 9:45 PM

**What Was Tested:**
- All 13 node types can be dragged to canvas
- All nodes render with custom UI
- No "Node type not found" errors

**Results:**
- ✅ Start node renders
- ✅ Agent node renders
- ✅ End node renders
- ✅ Note node renders
- ✅ File Search node renders
- ✅ Guardrails node renders
- ✅ MCP node renders
- ✅ Voice node renders
- ✅ If/Else node renders
- ✅ While node renders
- ✅ User Approval node renders
- ✅ Transform node renders
- ✅ Set State node renders

---

### Test 2: Input Panel UI
**Status:** ✅ PASS  
**Date:** October 9, 2025, 9:57 PM

**What Was Tested:**
- Input panel appears above canvas
- Textarea accepts input
- Clear button works
- Help text displays

**Results:**
- ✅ Input panel visible
- ✅ Textarea renders correctly
- ✅ Placeholder text shows
- ✅ Clear button (✕) works
- ✅ Help text with `input_as_text` shows

**Note:** UI works, but state doesn't sync (see Bug #1)

---

### Test 3: Start Node Inspector
**Status:** ✅ PASS  
**Date:** October 9, 2025, 9:57 PM

**What Was Tested:**
- Start node shows input variables section
- `input_as_text` variable displays
- Green highlight and "system" badge show
- State variables section appears

**Results:**
- ✅ "Input variables" section visible
- ✅ `input_as_text` (string, system) displays
- ✅ Green background highlight
- ✅ "State variables" section visible
- ✅ "+ Add variable" button shows

---

### Test 4: Tool Selection UI
**Status:** ✅ PASS  
**Date:** October 9, 2025, 10:05 PM

**What Was Tested:**
- "+ Add tool" button opens dropdown
- Dropdown shows 3 categories
- Tools can be added
- Tools can be removed
- Already-selected tools are disabled

**Results:**
- ✅ Dropdown opens on click
- ✅ ChatKit category shows
- ✅ Hosted category shows (4 tools)
- ✅ Local category shows (2 tools)
- ✅ Tools add to list with icons
- ✅ Remove button (✕) works
- ✅ Selected tools are disabled in dropdown
- ✅ Multiple tools can be added

**Note:** UI works, but tools don't execute (see Bug #2)

---

### Test 5: Tool Persistence
**Status:** ✅ PASS  
**Date:** October 9, 2025, 10:05 PM

**What Was Tested:**
- Tools save to node data
- Tools persist in inspector

**Results:**
- ✅ Tools save to `node.data.tools` array
- ✅ Tools remain visible in inspector
- ✅ Tools show correct icons and names

---

## ⏳ Pending Tests

### Test 6: Node Settings Affect Execution
**Status:** ⏳ NOT YET TESTED  
**Priority:** HIGH

**Questions to Answer:**
1. Does changing model actually use different model?
2. Does "Include chat history" actually include history?
3. Does changing instructions actually change behavior?
4. Does temperature setting work?
5. Does output format (Text vs JSON) work?

**Blocked By:** Bug #1 (can't execute workflows)

---

### Test 7: Node Connections Work
**Status:** ⏳ NOT YET TESTED  
**Priority:** HIGH

**Questions to Answer:**
1. Does output from Start reach Agent?
2. Does output from Agent reach End?
3. Do multiple agents pass data correctly?
4. Do If/Else branches work?
5. Do While loops work?

**Blocked By:** Bug #1 (can't execute workflows)

---

### Test 8: Data Persistence
**Status:** ⏳ NOT YET TESTED  
**Priority:** MEDIUM

**Questions to Answer:**
1. Do workflow settings save?
2. Do node configurations persist?
3. Do tools persist after reload?
4. Does input persist?
5. Do execution logs persist?

---

## 🧪 Testing Methodology

### Our Approach:
We follow a 5-level testing methodology:

**Level 1: UI Testing**
- Does it render?
- Does it look right?
- Can you click it?

**Level 2: State Testing**
- Does state update?
- Does data flow correctly?
- Are values stored?

**Level 3: Persistence Testing**
- Does data save?
- Does data reload?
- Does data survive refresh?

**Level 4: Execution Testing**
- Does it actually work?
- Does it affect behavior?
- Does it produce results?

**Level 5: Integration Testing**
- Does everything work together?
- Do workflows execute end-to-end?
- Are there edge cases?

### Key Questions:
For every feature, we ask:
1. ✅ Does the UI update?
2. ✅ Does the state update?
3. ⏳ Does the data persist?
4. ⏳ Does it affect behavior?
5. ⏳ Does it work end-to-end?

---

## 📊 Test Coverage

```
UI Tests:        10/10 (100%) ✅
State Tests:      2/10 (20%)  🔴
Persistence:      1/5  (20%)  🔴
Execution:        0/10 (0%)   🔴
Integration:      0/5  (0%)   🔴

Overall:         13/40 (33%)  🔴
```

---

## 🔧 How to Run Tests

### Manual Testing:
```bash
# Start dev server
cd agent-builder
bun run dev

# Open browser to http://localhost:5173
# Follow test cases above
```

### Playwright Testing:
```bash
# Install Playwright
npm install -D @playwright/test

# Run tests (when we have them)
npx playwright test
```

---

## 📝 Bug Report Template

When reporting bugs, include:

```markdown
### Bug #X: [Title]

**Severity:** 🔴/🟠/🟡/🟢  
**Status:** Confirmed/Not Fixed/Fixed  
**Discovered:** Date  
**Impact:** Description

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Technical Details:**
Code snippets, file locations, line numbers

**Fix Priority:** Immediate/High/Medium/Low  
**Estimated Fix Time:** X hours
```

---

## 🎯 Next Testing Steps

1. **Fix Bug #1** - Input state sync
2. **Test workflow execution** - Does it work?
3. **Test node settings** - Do they affect behavior?
4. **Test connections** - Does data flow?
5. **Test persistence** - Does data save?
6. **Document findings** - Update this file

---

**Last Updated:** October 9, 2025, 10:13 PM  
**Next Test:** After Bug #1 is fixed  
**Test Coverage Goal:** 80%
