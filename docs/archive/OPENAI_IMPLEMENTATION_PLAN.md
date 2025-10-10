# OpenAI Agent Builder Implementation Plan
**Created:** October 9, 2025, 9:41 PM  
**Based On:** Live exploration of OpenAI's Agent Builder  
**Goal:** Achieve 90%+ feature parity with OpenAI's implementation

---

## 🎯 Mission

Transform our local agent builder to match OpenAI's Agent Builder functionality, focusing on critical features that make workflows actually work.

---

## 📊 Current Status

**Feature Parity:** 45% (5/11 nodes working)  
**Critical Issues:** 3  
**High Priority Issues:** 3  
**Medium Priority Issues:** 3  
**Low Priority Issues:** 3  

**Total Estimated Time:** 26-43 hours

---

## 🚀 Implementation Phases

### Phase 1: Critical Fixes (MUST HAVE)
**Time:** 6-8 hours  
**Priority:** 🔴 CRITICAL  
**Goal:** Make all nodes work and fix input system

### Phase 2: Essential Features (SHOULD HAVE)
**Time:** 9-15 hours  
**Priority:** 🟠 HIGH  
**Goal:** Add tool selection, workflow management, undo/redo

### Phase 3: Polish & Enhancement (NICE TO HAVE)
**Time:** 11-20 hours  
**Priority:** 🟡 MEDIUM  
**Goal:** Improve UX, add advanced features

---

## Phase 1: Critical Fixes

### Task 1.1: Register All Missing Node Types ⚡ QUICK WIN
**Time:** 15 minutes  
**Priority:** 🔴 CRITICAL  
**Impact:** Fixes 61% of broken nodes (8/13)

**Files to Modify:**
- `/agent-builder/src/pages/Builder.tsx`

**Implementation:**

```typescript
// Add imports at top of Builder.tsx
import EndNode from '../components/nodes/EndNode';
import NoteNode from '../components/nodes/NoteNode';
import FileSearchNode from '../components/nodes/FileSearchNode';
import GuardrailsNode from '../components/nodes/GuardrailsNode';
import MCPNode from '../components/nodes/MCPNode';
import UserApprovalNode from '../components/nodes/UserApprovalNode';
import TransformNode from '../components/nodes/TransformNode';
import SetStateNode from '../components/nodes/SetStateNode';

// Update nodeTypes object (lines 19-22)
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
```bash
# Start dev server
bun run client:dev

# Test each node type:
# 1. Drag End node to canvas → Should show proper UI
# 2. Drag Note node → Should show proper UI
# 3. Drag File Search → Should show proper UI
# 4. Drag Guardrails → Should show proper UI
# 5. Drag MCP → Should show proper UI
# 6. Drag User Approval → Should show proper UI
# 7. Drag Transform → Should show proper UI
# 8. Drag Set State → Should show proper UI
```

**Success Criteria:**
- ✅ All 13 node types render with custom UI
- ✅ No "Node type not found" console warnings
- ✅ Inspector panel shows for each node

---

### Task 1.2: Implement `input_as_text` Variable System
**Time:** 2-3 hours  
**Priority:** 🔴 CRITICAL  
**Impact:** Fixes hardcoded input, enables dynamic workflows

**Files to Modify:**
- `/agent-builder/src/components/Inspector.tsx`
- `/agent-builder/src/lib/WorkflowExecutor.ts`
- `/agent-builder/src/pages/Builder.tsx`

**Step 1: Update Start Node Inspector**

```typescript
// In Inspector.tsx, Start node section
{selectedNode.type === 'start' && (
  <div className="space-y-4">
    {/* Input Variables Section */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Input variables
      </label>
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-green-600">📝</span>
          <span className="font-mono text-sm">input_as_text</span>
          <span className="text-xs text-gray-500">string</span>
        </div>
      </div>
    </div>

    {/* State Variables Section */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        State variables
      </label>
      <button 
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all"
        onClick={() => {
          // TODO: Implement in Phase 2
          alert('State variables coming in Phase 2');
        }}
      >
        <span>+</span>
        <span className="ml-2">Add</span>
      </button>
    </div>
  </div>
)}
```

**Step 2: Add Input Panel to Builder**

```typescript
// In Builder.tsx, add before execution logs
const [userInput, setUserInput] = useState('');

// Add input panel UI
<div className="mb-4">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Workflow Input
  </label>
  <textarea
    value={userInput}
    onChange={(e) => setUserInput(e.target.value)}
    placeholder="Enter your input here..."
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    rows={3}
  />
</div>
```

**Step 3: Update WorkflowExecutor**

```typescript
// In WorkflowExecutor.ts constructor
constructor(
  nodes: Node[],
  edges: Edge[],
  input_as_text: string,  // Renamed from userInput
  onLog: (log: ExecutionLog) => void
) {
  this.nodes = nodes;
  this.edges = edges;
  this.context = {
    input_as_text,  // Store as input_as_text
    variables: {},
    history: [],
  };
  this.onLog = onLog;
}
```

**Step 4: Update Builder.tsx handleRun**

```typescript
const handleRun = async () => {
  if (!userInput.trim()) {
    alert('Please enter an input before running the workflow');
    return;
  }

  setIsExecuting(true);
  setExecutionLogs([]);

  try {
    const executor = new WorkflowExecutor(
      nodes,
      edges,
      userInput,  // Use dynamic input
      (log) => {
        setExecutionLogs(prev => [...prev, log]);
      }
    );

    await executor.execute();
    alert('Workflow completed successfully!');
  } catch (error) {
    console.error('Execution error:', error);
    alert(`Execution failed: ${error.message}`);
  } finally {
    setIsExecuting(false);
  }
};
```

**Testing:**
```bash
# Test workflow with input
1. Enter "Test input" in input field
2. Click Run
3. Check execution logs show input_as_text
4. Verify agents receive the input
```

**Success Criteria:**
- ✅ Start node shows `input_as_text` variable
- ✅ Input panel appears in Builder
- ✅ Workflows use dynamic input
- ✅ No more hardcoded "My score is 75 points"

---

### Task 1.3: Implement Tool Selection Dropdown
**Time:** 3-4 hours  
**Priority:** 🔴 CRITICAL  
**Impact:** Enables agents to use tools

**Files to Modify:**
- `/agent-builder/src/components/Inspector.tsx`

**Implementation:**

```typescript
// Add state for tool selection
const [showToolMenu, setShowToolMenu] = useState(false);
const [selectedTools, setSelectedTools] = useState<string[]>(
  (selectedNode.data as any).tools || []
);

// Tool definitions
const availableTools = {
  chatkit: [
    { id: 'client-tool', name: 'Client tool', icon: '🔧' }
  ],
  hosted: [
    { id: 'mcp-server', name: 'MCP server', icon: '🔌' },
    { id: 'file-search', name: 'File search', icon: '📄' },
    { id: 'web-search', name: 'Web search', icon: '🌐' },
    { id: 'code-interpreter', name: 'Code Interpreter', icon: '💻' }
  ],
  local: [
    { id: 'function', name: 'Function', icon: '⚡' },
    { id: 'custom', name: 'Custom', icon: '⚙️' }
  ]
};

// Tool selection UI
<div>
  <label className="block text-xs font-semibold text-gray-700 mb-2">
    Tools
  </label>
  
  {/* Selected tools list */}
  {selectedTools.length > 0 && (
    <div className="mb-2 space-y-1">
      {selectedTools.map(toolId => {
        const tool = Object.values(availableTools)
          .flat()
          .find(t => t.id === toolId);
        return (
          <div key={toolId} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
            <span className="text-sm">
              {tool?.icon} {tool?.name}
            </span>
            <button
              onClick={() => {
                const updated = selectedTools.filter(id => id !== toolId);
                setSelectedTools(updated);
                onUpdateNode?.(selectedNode.id, { tools: updated });
              }}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  )}

  {/* Add tool button */}
  <div className="relative">
    <button
      onClick={() => setShowToolMenu(!showToolMenu)}
      className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
    >
      <span>+</span>
      <span>Add tool</span>
    </button>

    {/* Tool dropdown menu */}
    {showToolMenu && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
        {/* ChatKit section */}
        <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
          ChatKit
        </div>
        {availableTools.chatkit.map(tool => (
          <button
            key={tool.id}
            onClick={() => {
              const updated = [...selectedTools, tool.id];
              setSelectedTools(updated);
              onUpdateNode?.(selectedNode.id, { tools: updated });
              setShowToolMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            disabled={selectedTools.includes(tool.id)}
          >
            <span>{tool.icon}</span>
            <span>{tool.name}</span>
          </button>
        ))}

        <div className="border-t my-2"></div>

        {/* Hosted section */}
        <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
          Hosted
        </div>
        {availableTools.hosted.map(tool => (
          <button
            key={tool.id}
            onClick={() => {
              const updated = [...selectedTools, tool.id];
              setSelectedTools(updated);
              onUpdateNode?.(selectedNode.id, { tools: updated });
              setShowToolMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            disabled={selectedTools.includes(tool.id)}
          >
            <span>{tool.icon}</span>
            <span>{tool.name}</span>
          </button>
        ))}

        <div className="border-t my-2"></div>

        {/* Local section */}
        <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
          Local
        </div>
        {availableTools.local.map(tool => (
          <button
            key={tool.id}
            onClick={() => {
              const updated = [...selectedTools, tool.id];
              setSelectedTools(updated);
              onUpdateNode?.(selectedNode.id, { tools: updated });
              setShowToolMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            disabled={selectedTools.includes(tool.id)}
          >
            <span>{tool.icon}</span>
            <span>{tool.name}</span>
          </button>
        ))}
      </div>
    )}
  </div>
</div>

{/* Click outside to close */}
{showToolMenu && (
  <div
    className="fixed inset-0 z-40"
    onClick={() => setShowToolMenu(false)}
  />
)}
```

**Testing:**
```bash
# Test tool selection
1. Click Agent node
2. Click "+ Add tool" button
3. Verify dropdown appears with categories
4. Click "File search"
5. Verify tool appears in list
6. Click X to remove tool
7. Save workflow and reload
8. Verify tools persist
```

**Success Criteria:**
- ✅ "+ Add tool" button opens dropdown
- ✅ Tools organized by category
- ✅ Can add/remove tools
- ✅ Tools save to node data
- ✅ Tools persist after reload

---

## Phase 1 Summary

**Total Time:** 6-8 hours  
**Deliverables:**
- ✅ All 13 node types working
- ✅ `input_as_text` variable system
- ✅ Dynamic input panel
- ✅ Tool selection dropdown functional

**Testing Checklist:**
- [ ] All nodes render correctly
- [ ] Start node shows `input_as_text`
- [ ] Input panel accepts text
- [ ] Workflows use dynamic input
- [ ] Tool dropdown works
- [ ] Tools save and persist
- [ ] No console errors

---

## Phase 2: Essential Features

### Task 2.1: Replace Checkboxes with Toggle Switches
**Time:** 1-2 hours  
**Priority:** 🟠 HIGH

**Install Toggle Component:**
```bash
cd agent-builder
npm install @radix-ui/react-switch
```

**Implementation:**
```typescript
import * as Switch from '@radix-ui/react-switch';

// Replace checkbox with toggle
<div className="flex items-center justify-between">
  <label className="text-sm font-medium">Include chat history</label>
  <Switch.Root
    checked={includeHistory}
    onCheckedChange={(checked) => {
      setIncludeHistory(checked);
      onUpdateNode?.(selectedNode.id, { includeHistory: checked });
    }}
    className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
  >
    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
  </Switch.Root>
</div>
```

---

### Task 2.2: Add Collapsible Sections
**Time:** 2 hours  
**Priority:** 🟠 HIGH

**Implementation:**
```typescript
const [showAdvanced, setShowAdvanced] = useState(false);

// Add "More" button
<button
  onClick={() => setShowAdvanced(!showAdvanced)}
  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
>
  {showAdvanced ? '↑ Less' : '↓ More'}
</button>

// Collapsible section
{showAdvanced && (
  <div className="space-y-4 pt-4 border-t">
    <h3 className="text-sm font-semibold">Advanced Options</h3>
    {/* Advanced settings */}
  </div>
)}
```

---

### Task 2.3: Implement Workflow Actions Menu
**Time:** 2 hours  
**Priority:** 🟠 HIGH

**Implementation:**
```typescript
// Add to TopBar.tsx
<Menu>
  <MenuButton>⋮</MenuButton>
  <MenuItems>
    <MenuItem onClick={handleDuplicate}>
      📋 Duplicate
    </MenuItem>
    <MenuItem onClick={handleRename}>
      ✏️ Rename
    </MenuItem>
    <MenuItem onClick={handleDelete} className="text-red-600">
      🗑️ Delete
    </MenuItem>
  </MenuItems>
</Menu>
```

---

### Task 2.4: Implement Undo/Redo
**Time:** 3-4 hours  
**Priority:** 🟠 HIGH

**Implementation:**
```typescript
// Add history state
const [history, setHistory] = useState<WorkflowState[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);

// Undo function
const undo = () => {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1);
    restoreState(history[historyIndex - 1]);
  }
};

// Redo function
const redo = () => {
  if (historyIndex < history.length - 1) {
    setHistoryIndex(historyIndex + 1);
    restoreState(history[historyIndex + 1]);
  }
};

// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [historyIndex, history]);
```

---

## Phase 2 Summary

**Total Time:** 9-15 hours  
**Deliverables:**
- ✅ Toggle switches instead of checkboxes
- ✅ Collapsible advanced sections
- ✅ Workflow actions menu (Duplicate/Rename/Delete)
- ✅ Undo/Redo with keyboard shortcuts
- ✅ Duplicate workflow functionality

---

## Phase 3: Polish & Enhancement

### Task 3.1: Enhance Code Export
**Time:** 3 hours  
**Priority:** 🟡 MEDIUM

**Add SDK Code Generation:**
```typescript
// Generate TypeScript code
const generateSDKCode = (workflow) => {
  return `
import { Agent, Runner } from "@openai/agents";

type WorkflowInput = { input_as_text: string };

export const runWorkflow = async (workflow: WorkflowInput) => {
  const agent = new Agent({
    name: "${workflow.name}",
    instructions: "${workflow.instructions}",
    model: "gpt-5"
  });
  
  const runner = new Runner();
  const result = await runner.run(agent, [{
    role: "user",
    content: [{ type: "input_text", text: workflow.input_as_text }]
  }]);
  
  return result;
};
  `.trim();
};
```

---

### Task 3.2: Add Model Parameters Section
**Time:** 2 hours  
**Priority:** 🟡 MEDIUM

---

### Task 3.3: Add Pan/Selection Mode Toggle
**Time:** 1 hour  
**Priority:** 🟡 MEDIUM

---

### Task 3.4: Improve Node Styling
**Time:** 2 hours  
**Priority:** 🟡 MEDIUM

---

## Phase 3 Summary

**Total Time:** 11-20 hours  
**Deliverables:**
- ✅ SDK code generation
- ✅ Model parameters section
- ✅ Pan/selection mode
- ✅ Improved node styling
- ✅ Better UX overall

---

## 📝 Changelog

### Version 0.2.0 (In Progress)
**Date:** October 9, 2025

**Phase 1: Critical Fixes**
- [ ] Registered all 13 node types
- [ ] Implemented `input_as_text` variable
- [ ] Added dynamic input panel
- [ ] Implemented tool selection dropdown

**Phase 2: Essential Features**
- [ ] Replaced checkboxes with toggles
- [ ] Added collapsible sections
- [ ] Implemented workflow actions menu
- [ ] Added undo/redo functionality

**Phase 3: Polish**
- [ ] Enhanced code export
- [ ] Added model parameters
- [ ] Improved node styling

---

## 🎯 Success Metrics

| Metric | Before | After Phase 1 | After Phase 2 | After Phase 3 |
|--------|--------|---------------|---------------|---------------|
| Node Registration | 38% | 100% | 100% | 100% |
| Feature Parity | 45% | 65% | 80% | 90% |
| Critical Issues | 3 | 0 | 0 | 0 |
| User Trust | Low | Medium | High | Excellent |

---

## 🚀 Getting Started

1. **Start with Phase 1, Task 1.1** (15 minutes)
2. **Test thoroughly after each task**
3. **Commit changes with descriptive messages**
4. **Update this changelog as you progress**
5. **Take screenshots of improvements**

---

**Let's build the best local agent builder! 🎯**
