# OpenAI Agent Builder - Live Exploration Findings
**Date:** October 9, 2025, 9:24 PM  
**Method:** Playwright browser automation + screenshots  
**Purpose:** Understand actual implementation to guide our local version

---

## 🎨 UI/UX Observations

### Overall Layout
- **Left Sidebar:** Node palette organized by category (Core, Tools, Logic, Data)
- **Center Canvas:** React Flow with white rounded node cards
- **Right Inspector:** Configuration panel for selected node
- **Top Bar:** Workflow name, version badge, action buttons
- **Bottom Toolbar:** Pan/Selection mode, Undo/Redo buttons

### Design System
- **Colors:** Clean white/gray with colored icons
- **Typography:** Sans-serif, clear hierarchy
- **Spacing:** Generous padding, not cramped
- **Icons:** Simple, recognizable symbols
- **Nodes:** Rounded white cards with subtle shadows

---

## 🔧 Key Features Discovered

### 1. Start Node Implementation
**Inspector Shows:**
- **Input variables section**
  - `input_as_text` (string) - **automatically included**
  - Icon shows it's a text input type
- **State variables section**
  - "+ Add" button to add custom variables
  - Empty by default

**Key Insight:** `input_as_text` is ALWAYS present - this is the standard way user input enters the workflow.

**Our Gap:**
- ❌ No `input_as_text` variable
- ❌ Hardcoded input instead
- ❌ "+ Add variable" button doesn't work

---

### 2. Agent Node Tool Selection
**How It Works:**
1. Click the "+ Add" button next to "Tools"
2. Dropdown menu appears with categories:

**ChatKit:**
- Client tool

**Hosted:**
- MCP server
- File search
- Web search  
- Code Interpreter

**Local:**
- Function
- Custom

**Key Insight:** Tools are organized by where they run (ChatKit/Hosted/Local), not by function type.

**Our Gap:**
- ❌ "+ Add tool" button has no onClick handler
- ❌ No tool selection modal
- ❌ No tool categories

---

### 3. Agent Node Configuration
**Full Inspector Includes:**
- **Name** - Text input
- **Instructions** - Large textarea with:
  - Expand button
  - "Generate" button (AI-assisted)
  - "+ Add context" button
- **Include chat history** - Toggle switch (ON by default)
- **Model** - Dropdown button showing "gpt-5"
- **Reasoning effort** - Dropdown showing "medium"
- **Tools** - Expandable section with "+ Add" button
- **Output format** - Dropdown showing "Text"

**Model parameters (expandable):**
- Verbosity - Dropdown (medium)
- Summary - With "Verify" link

**ChatKit section:**
- Display response in chat - Toggle (ON)
- Show search sources - Toggle (ON)

**Advanced section:**
- Continue on error - Toggle (OFF)
- Write to conversation history - Toggle (ON)

**Bottom buttons:**
- "Less" button (to collapse)
- "Evaluate" button (disabled)

**Key Insight:** Much more comprehensive than our implementation. Has AI-assisted features ("Generate" button) and ChatKit-specific settings.

**Our Implementation:**
- ✅ Name, Instructions, Model, Reasoning effort, Output format
- ✅ Include chat history toggle
- ❌ No "Generate" button
- ❌ No "+ Add context" button
- ❌ No Model parameters section
- ❌ No ChatKit section
- ❌ No Advanced section
- ❌ No collapsible sections

---

### 4. Version System
**Top bar shows:** "v1 · production"
- Clickable dropdown
- Shows version number and status
- Allows version selection

**Key Insight:** Workflows have proper versioning with production/draft states.

**Our Gap:**
- ❌ No versioning system
- ❌ Only shows "v1 · draft" as static text

---

### 5. Templates System
**Available Templates:**
1. **Data enrichment** - Pull together data to answer user questions
2. **Planning helper** - Simple multi-turn workflow for creating work plans
3. **Customer service** - Resolve customer queries with custom policies
4. **Structured Data Q/A** - Query databases using natural language
5. **Document comparison** - Analyze and highlight differences across uploaded documents
6. **Internal knowledge assistant** - Triage and answer questions from employees

**Key Insight:** Templates provide starting points for common use cases.

**Our Gap:**
- ❌ No templates system
- ❌ No template selection UI

---

### 6. Canvas Controls
**Bottom Toolbar:**
- **Pan mode** (hand icon) - Currently active
- **Selection mode** (cursor icon)
- **Undo** button (disabled)
- **Redo** button (disabled)

**Key Insight:** Mode switching between pan and selection, plus undo/redo.

**Our Implementation:**
- ✅ Has zoom controls
- ❌ No pan/selection mode toggle
- ❌ No undo/redo

---

### 7. Top Action Buttons
**Buttons Available:**
- **Workflow actions** (three dots menu)
- **Evaluate** (disabled in this workflow)
- **Code** (working)
- **Preview** (disabled)
- **Deploy** (disabled)

**Key Insight:** Some features disabled based on workflow state.

**Our Implementation:**
- ✅ Code button works
- ✅ Evaluate button works (shows basic metrics)
- ❌ Preview not implemented
- ❌ Deploy shows "coming soon"
- ❌ No workflow actions menu

---

## 📊 Node Comparison

### Nodes in OpenAI's Palette

**Core:**
- ▶ Agent
- ⬛ End
- 📝 Note

**Tools:**
- 📄 File search
- 🛡️ Guardrails
- 🔌 MCP

**Logic:**
- ⚡ If / else
- 🔄 While
- ✋ User approval

**Data:**
- 🔀 Transform
- 💾 Set state

**Total:** 11 node types

### Our Implementation
**Registered & Working:** 5 nodes (Agent, Start, If/Else, Voice, While)
**Not Registered:** 8 nodes (End, Note, File Search, Guardrails, MCP, User Approval, Transform, Set State)

**Match:** 45% (5/11) - We're missing Voice in their palette, they don't show Start

---

## 🎯 Critical Differences

### 1. Input Handling
**OpenAI:** Uses `input_as_text` variable automatically
**Us:** Hardcoded string

### 2. Tool System
**OpenAI:** Full dropdown menu with categories
**Us:** Non-functional button

### 3. Node Registration
**OpenAI:** All nodes work
**Us:** 61% broken (8/13 not registered)

### 4. Versioning
**OpenAI:** Full version management
**Us:** Static text only

### 5. Templates
**OpenAI:** 6+ templates
**Us:** None

### 6. AI Assistance
**OpenAI:** "Generate" button for instructions
**Us:** Manual only

### 7. Advanced Features
**OpenAI:** Model parameters, ChatKit settings, Advanced options
**Us:** Basic settings only

---

## 💡 Implementation Insights

### What We Should Copy

1. **`input_as_text` Variable**
   - Always present in Start node
   - Standard way to get user input
   - Type: string

2. **Tool Selection Dropdown**
   - Organized by category (ChatKit/Hosted/Local)
   - Icons for each tool type
   - Clear descriptions

3. **Collapsible Sections**
   - "More" button to show advanced options
   - Keeps UI clean by default
   - Power users can expand

4. **Toggle Switches**
   - Better than checkboxes for boolean options
   - Clear ON/OFF state
   - Modern UI pattern

5. **Dropdown Buttons**
   - Model, Reasoning effort, Output format
   - Shows current value
   - Click to change

### What We Can Skip (For Now)

1. **AI-Assisted Generation**
   - "Generate" button for instructions
   - Requires additional AI integration
   - Nice-to-have, not essential

2. **ChatKit Integration**
   - Specific to OpenAI's deployment
   - Not relevant for local version
   - Can skip entirely

3. **Version Management**
   - Complex feature
   - Can implement later
   - Not blocking core functionality

4. **Templates**
   - Useful but not critical
   - Can add after core features work
   - Users can create their own

---

## 🚀 Updated Fix Priorities

### Phase 1: Critical Fixes (Match OpenAI Core)
1. **Register all node types** (15 min)
2. **Add `input_as_text` to Start node** (1 hour)
3. **Implement tool selection dropdown** (3-4 hours)
4. **Fix input system to use variables** (2 hours)

### Phase 2: Essential Features
5. **Add toggle switches** (1 hour)
6. **Implement dropdown buttons** (2 hours)
7. **Add collapsible sections** (2 hours)
8. **Implement Undo/Redo** (3-4 hours)

### Phase 3: Polish
9. **Add pan/selection mode** (1 hour)
10. **Improve node styling** (2 hours)
11. **Add templates** (4-6 hours)
12. **Add versioning** (6-8 hours)

---

## 📸 Screenshots Captured

1. `openai-agent-builder-home.png` - Main landing page
2. `openai-workflow-canvas.png` - Workflow builder canvas
3. `openai-agent-inspector.png` - Agent node configuration
4. `openai-tools-menu.png` - Tool selection dropdown
5. `openai-start-node-inspector.png` - Start node with `input_as_text`
6. `openai-templates.png` - Template gallery

---

## 🎨 Design Tokens to Match

### Colors
- **Background:** White (#FFFFFF)
- **Canvas:** Light gray (#F9FAFB)
- **Node cards:** White with shadow
- **Primary action:** Black button
- **Icons:** Colored by category

### Typography
- **Headings:** Sans-serif, bold
- **Body:** Sans-serif, regular
- **Code:** Monospace

### Spacing
- **Node padding:** Generous (16-24px)
- **Section gaps:** 16px
- **Input height:** ~40px

### Borders
- **Radius:** 8-12px (rounded)
- **Width:** 1px
- **Color:** Light gray

---

## ✅ What We're Doing Right

1. **React Flow integration** - Same library, works well
2. **Node palette organization** - Same categories
3. **Inspector panel** - Right side, same concept
4. **Drag-and-drop** - Works perfectly
5. **Basic node configuration** - Name, instructions, model
6. **Execution logs** - Good debugging feature
7. **Save functionality** - Works with localStorage

---

## ❌ What Needs Immediate Attention

1. **Node registration** - 61% broken
2. **Input system** - Hardcoded instead of variable-based
3. **Tool selection** - Non-functional
4. **Variable passing** - Not implemented
5. **State management** - Missing

---

## 📝 Code Patterns Observed

### Tool Selection Pattern
```typescript
// Dropdown menu with categories
<Menu>
  <MenuSection title="ChatKit">
    <MenuItem>Client tool</MenuItem>
  </MenuSection>
  <MenuSection title="Hosted">
    <MenuItem>MCP server</MenuItem>
    <MenuItem>File search</MenuItem>
    <MenuItem>Web search</MenuItem>
    <MenuItem>Code Interpreter</MenuItem>
  </MenuSection>
  <MenuSection title="Local">
    <MenuItem>Function</MenuItem>
    <MenuItem>Custom</MenuItem>
  </MenuSection>
</Menu>
```

### Start Node Pattern
```typescript
// Always include input_as_text
const startNodeData = {
  inputVariables: [
    { name: 'input_as_text', type: 'string' }
  ],
  stateVariables: []
};
```

### Toggle Switch Pattern
```typescript
// Better than checkbox
<Switch 
  checked={includeHistory}
  onCheckedChange={setIncludeHistory}
/>
```

---

## 🎯 Success Metrics

To match OpenAI's Agent Builder, we need:
- ✅ All 11 node types registered and working
- ✅ `input_as_text` variable in Start node
- ✅ Tool selection dropdown functional
- ✅ Variable passing between nodes
- ✅ Toggle switches instead of checkboxes
- ✅ Collapsible advanced sections
- ✅ Undo/Redo functionality

**Current Progress:** 45% feature parity
**Target:** 90%+ feature parity (can skip ChatKit-specific features)

---

**Report Generated:** October 9, 2025, 9:24 PM  
**Exploration Method:** Live browser testing with Playwright  
**Screenshots:** 6 captured  
**Key Insights:** 7 major findings  
**Updated Priorities:** 12 fixes identified
