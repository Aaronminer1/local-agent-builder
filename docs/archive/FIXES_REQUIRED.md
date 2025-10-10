# Agent Builder - Required Fixes
**Date:** October 9, 2025  
**Priority Levels:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## 🔴 CRITICAL FIXES (Blocks Core Functionality)

### 1. Register Missing Node Types
**Priority:** 🔴 CRITICAL  
**File:** `/agent-builder/src/pages/Builder.tsx`  
**Lines:** 19-22  
**Impact:** 61% of node types (8/13) don't work

**Problem:**
Only 5 node types are registered in React Flow. Users can drag nodes but they display as generic fallbacks without proper UI.

**Current Code:**
```typescript
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  start: StartNode,
  ifElse: IfElseNode,
};
```

**Fix Required:**
```typescript
// Add imports at top of file
import EndNode from '../components/nodes/EndNode';
import NoteNode from '../components/nodes/NoteNode';
import FileSearchNode from '../components/nodes/FileSearchNode';
import GuardrailsNode from '../components/nodes/GuardrailsNode';
import MCPNode from '../components/nodes/MCPNode';
import UserApprovalNode from '../components/nodes/UserApprovalNode';
import TransformNode from '../components/nodes/TransformNode';
import SetStateNode from '../components/nodes/SetStateNode';
import VoiceNode from '../components/nodes/VoiceNode';
import WhileNode from '../components/nodes/WhileNode';

// Update nodeTypes object
const nodeTypes: NodeTypes = {
  // Core
  start: StartNode,
  agent: AgentNode,
  end: EndNode,
  note: NoteNode,
  
  // Tools
  fileSearch: FileSearchNode,
  guardrails: GuardrailsNode,
  mcp: MCPNode,
  voice: VoiceNode,
  
  // Logic
  ifElse: IfElseNode,
  while: WhileNode,
  userApproval: UserApprovalNode,
  
  // Data
  transform: TransformNode,
  setState: SetStateNode,
};
```

**Testing:**
- Drag each node type to canvas
- Verify proper visual appearance
- Check inspector panel displays correctly
- Test all configuration options

**Estimated Time:** 15 minutes

---

### 2. Fix Hardcoded User Input
**Priority:** 🔴 CRITICAL  
**File:** `/agent-builder/src/pages/Builder.tsx`  
**Line:** 100  
**Impact:** Users cannot provide dynamic input to workflows

**Problem:**
User input is hardcoded as `"My score is 75 points"` in the workflow executor.

**Current Code:**
```typescript
const executor = new WorkflowExecutor(
  nodes,
  edges,
  'My score is 75 points',  // ← HARDCODED
  (log) => {
    setExecutionLogs(prev => [...prev, log]);
  }
);
```

**Fix Options:**

**Option A: Input Dialog (Quick Fix)**
```typescript
const handleRun = async () => {
  const userInput = prompt('Enter your input:');
  if (!userInput) return;
  
  const executor = new WorkflowExecutor(
    nodes,
    edges,
    userInput,
    (log) => {
      setExecutionLogs(prev => [...prev, log]);
    }
  );
  // ... rest of execution
};
```

**Option B: Use Start Node Variables (Proper Fix)**
```typescript
// Extract input from Start node configuration
const startNode = nodes.find(n => n.type === 'start');
const userInput = startNode?.data?.input || '';

const executor = new WorkflowExecutor(
  nodes,
  edges,
  userInput,
  (log) => {
    setExecutionLogs(prev => [...prev, log]);
  }
);
```

**Option C: Input Panel (Best UX)**
- Add input textarea above execution logs
- Store input in state
- Use stored input when running workflow

**Recommended:** Option C for best user experience

**Estimated Time:** 30 minutes (Option A), 1 hour (Option B), 2 hours (Option C)

---

### 3. Connect Start Node Variables to Execution
**Priority:** 🔴 CRITICAL  
**File:** `/agent-builder/src/components/Inspector.tsx`  
**Lines:** ~100-120 (Start node section)  
**Impact:** Start node variable configuration is non-functional

**Problem:**
Start node has "+ Add variable" button but variables aren't used in workflow execution.

**Fix Required:**
1. Implement variable storage in Start node data
2. Create variable input UI in Inspector
3. Pass variables to WorkflowExecutor
4. Use variables in workflow state

**Implementation:**
```typescript
// In Inspector.tsx - Start node section
const [variables, setVariables] = useState(selectedNode.data.variables || []);

const addVariable = () => {
  const newVar = {
    id: Date.now(),
    name: '',
    type: 'string',
    value: '',
  };
  setVariables([...variables, newVar]);
  onUpdateNode?.(selectedNode.id, { variables: [...variables, newVar] });
};

// Render variable list with inputs
{variables.map(v => (
  <div key={v.id}>
    <input value={v.name} onChange={...} placeholder="Variable name" />
    <input value={v.value} onChange={...} placeholder="Value" />
    <button onClick={() => removeVariable(v.id)}>Remove</button>
  </div>
))}
```

**Estimated Time:** 2-3 hours

---

## 🟠 HIGH PRIORITY (Important Features)

### 4. Implement "+ Add tool" Functionality
**Priority:** 🟠 HIGH  
**File:** `/agent-builder/src/components/Inspector.tsx`  
**Line:** 200  
**Impact:** Cannot add tools to Agent nodes

**Problem:**
Button exists but has no onClick handler.

**Fix Required:**
```typescript
const [showToolModal, setShowToolModal] = useState(false);
const [selectedTools, setSelectedTools] = useState(selectedNode.data.tools || []);

// Add onClick handler
<button 
  onClick={() => setShowToolModal(true)}
  className="w-full px-4 py-2.5 border-2 border-dashed..."
>
  <span>+</span>
  <span>Add tool</span>
</button>

// Tool selection modal
{showToolModal && (
  <div className="modal">
    <h3>Select Tools</h3>
    {availableTools.map(tool => (
      <label key={tool.id}>
        <input 
          type="checkbox"
          checked={selectedTools.includes(tool.id)}
          onChange={() => toggleTool(tool.id)}
        />
        {tool.name}
      </label>
    ))}
    <button onClick={() => setShowToolModal(false)}>Done</button>
  </div>
)}
```

**Available Tools to Implement:**
- File Search (vector store)
- Web Search
- Code Interpreter
- Calculator
- Custom Functions
- API Integrations

**Estimated Time:** 3-4 hours

---

### 5. Implement Deploy Feature
**Priority:** 🟠 HIGH  
**File:** `/agent-builder/src/components/TopBar.tsx`  
**Impact:** Cannot deploy workflows

**Current:**
Shows "Deploy feature coming soon!" alert

**Fix Required:**
Implement deployment options:
- Export as JSON
- Export as standalone package
- Deploy to cloud (optional)
- Generate API endpoint
- Share workflow link

**Estimated Time:** 4-6 hours (basic export), 2-3 days (full deployment)

---

### 6. Implement Duplicate Workflow
**Priority:** 🟠 HIGH  
**File:** `/agent-builder/src/pages/WorkflowsList.tsx`  
**Impact:** Cannot duplicate workflows

**Current:**
Shows "Duplicate feature coming soon!" alert

**Fix Required:**
```typescript
const handleDuplicate = (workflowId: string) => {
  const workflow = workflows.find(w => w.id === workflowId);
  if (!workflow) return;
  
  const duplicate = {
    ...workflow,
    id: `workflow-${Date.now()}`,
    name: `${workflow.name} (Copy)`,
    createdAt: new Date().toISOString(),
  };
  
  // Save to localStorage
  const allWorkflows = [...workflows, duplicate];
  localStorage.setItem('workflows', JSON.stringify(allWorkflows));
  
  // Update state
  setWorkflows(allWorkflows);
};
```

**Estimated Time:** 1 hour

---

## 🟡 MEDIUM PRIORITY (Nice to Have)

### 7. Implement Settings Menu Items
**Priority:** 🟡 MEDIUM  
**File:** `/agent-builder/src/components/TopBar.tsx`  
**Impact:** Settings menu items don't work

**Items to Implement:**
- 🎨 Appearance (theme, colors)
- ⌨️ Keyboard shortcuts (list + customization)
- 🔌 Integrations (API keys, connections)
- About (version, credits)

**Estimated Time:** 2-3 hours per item

---

### 8. Implement "More Options" Features
**Priority:** 🟡 MEDIUM  
**Files:** Various node components  
**Impact:** Node context menu features are placeholders

**Features to Implement:**
- 📋 Duplicate Node
- 📤 Export Configuration
- 📥 Import Configuration
- 🔗 Copy Node ID
- 📊 View Stats
- 🎨 Change Color
- 🔒 Lock Position

**Estimated Time:** 3-4 hours

---

### 9. Add Delete Workflow Functionality
**Priority:** 🟡 MEDIUM  
**File:** `/agent-builder/src/pages/WorkflowsList.tsx`  
**Impact:** Cannot delete workflows (button exists but not tested)

**Fix Required:**
```typescript
const handleDelete = (workflowId: string) => {
  if (!confirm('Are you sure you want to delete this workflow?')) return;
  
  const filtered = workflows.filter(w => w.id !== workflowId);
  localStorage.setItem('workflows', JSON.stringify(filtered));
  setWorkflows(filtered);
};
```

**Estimated Time:** 30 minutes

---

## 🟢 LOW PRIORITY (Polish & Enhancement)

### 10. Add Keyboard Shortcuts
**Priority:** 🟢 LOW  
**Impact:** Better UX

**Shortcuts to Add:**
- `Ctrl+S` - Save workflow
- `Ctrl+R` - Run workflow
- `Delete` - Delete selected node
- `Ctrl+D` - Duplicate node
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+C/V` - Copy/Paste nodes

**Estimated Time:** 2-3 hours

---

### 11. Add Undo/Redo Functionality
**Priority:** 🟢 LOW  
**Impact:** Better UX

**Implementation:**
- Track workflow state history
- Implement undo/redo stack
- Add UI buttons
- Add keyboard shortcuts

**Estimated Time:** 3-4 hours

---

### 12. Improve Error Handling
**Priority:** 🟢 LOW  
**Impact:** Better debugging

**Improvements:**
- Add try-catch blocks
- Show user-friendly error messages
- Log errors to console
- Add error boundary components

**Estimated Time:** 2-3 hours

---

## 📊 Summary

| Priority | Count | Total Estimated Time |
|----------|-------|---------------------|
| 🔴 Critical | 3 | 4-7 hours |
| 🟠 High | 3 | 9-15 hours |
| 🟡 Medium | 3 | 6-11 hours |
| 🟢 Low | 3 | 7-10 hours |
| **TOTAL** | **12** | **26-43 hours** |

---

## 🎯 Recommended Fix Order

### Phase 1: Core Functionality (Week 1)
1. ✅ Register missing node types (15 min)
2. ✅ Fix hardcoded input (2 hours)
3. ✅ Connect Start node variables (3 hours)

**Result:** All nodes work, users can provide input

### Phase 2: Essential Features (Week 2)
4. ✅ Implement "+ Add tool" (4 hours)
5. ✅ Implement duplicate workflow (1 hour)
6. ✅ Add delete workflow (30 min)

**Result:** Core workflow management complete

### Phase 3: Advanced Features (Week 3)
7. ✅ Implement Deploy feature (6 hours basic)
8. ✅ Implement Settings menu (6 hours)
9. ✅ Implement "More Options" (4 hours)

**Result:** Full feature parity with design

### Phase 4: Polish (Week 4)
10. ✅ Add keyboard shortcuts (3 hours)
11. ✅ Add undo/redo (4 hours)
12. ✅ Improve error handling (3 hours)

**Result:** Production-ready application

---

## 🔧 Quick Wins (Can Fix in 1 Hour)

1. **Register node types** - 15 minutes, huge impact
2. **Duplicate workflow** - 30 minutes
3. **Delete workflow** - 30 minutes
4. **Hardcoded input (Option A)** - 30 minutes

**Total:** ~2 hours to fix 4 critical issues

---

## 📝 Testing Checklist

After each fix, verify:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] UI updates correctly
- [ ] Data persists (if applicable)
- [ ] Works with existing workflows
- [ ] Mobile responsive (if applicable)

---

## 🚀 Getting Started

**To begin fixing:**

1. **Start with node registration** (biggest impact, easiest fix)
   ```bash
   cd agent-builder/src/pages
   # Edit Builder.tsx lines 19-22
   ```

2. **Test the fix**
   ```bash
   bun run client:dev
   # Drag all node types to canvas
   # Verify they display correctly
   ```

3. **Move to next priority fix**

---

**Report Generated:** October 9, 2025, 9:20 PM  
**Total Issues Found:** 12  
**Critical Issues:** 3  
**Estimated Fix Time:** 26-43 hours  
**Quick Wins Available:** 4 fixes in ~2 hours
