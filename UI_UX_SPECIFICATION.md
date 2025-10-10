# Agent Builder UI/UX Specification
**Based on**: Live OpenAI Agent Builder Interface  
**Date**: October 9, 2025  
**Purpose**: Visual and interaction design reference for cloning the interface

---

## Layout Structure

### Overall Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Top Navigation Bar                                                  │
│ ┌─────────────┐  [Workflow Name] [v1 · production ▼]  [⚙] [Preview][Deploy] │
│ │ ← All Workflows │                                                 │
│ └─────────────┘                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────┬───────────────────────────────────┬──────────────┐ │
│  │            │                                   │              │ │
│  │   Node     │         Canvas Area              │   Inspector  │ │
│  │  Palette   │      (React Flow)                │    Panel     │ │
│  │  (Left)    │                                   │   (Right)    │ │
│  │            │                                   │              │ │
│  │  Core      │    ┌─────┐                       │  [Node Props]│ │
│  │  • Agent   │    │Start│                       │              │ │
│  │  • End     │    └──┬──┘                       │  Name:       │ │
│  │  • Note    │       │                          │  [________]  │ │
│  │            │       ▼                          │              │ │
│  │  Tools     │    ┌─────────┐                  │  Instructions│ │
│  │  • File    │    │ Agent   │                  │  [________]  │ │
│  │  • Guard.  │    │  Node   │                  │  [________]  │ │
│  │  • MCP     │    └────┬────┘                  │              │ │
│  │            │         │                       │  Model:      │ │
│  │  Logic     │         ▼                       │  [gpt-5  ▼]  │ │
│  │  • If/Else │    ┌─────────┐                  │              │ │
│  │  • While   │    │ Another │                  │  Tools:      │ │
│  │  • Approval│    │  Node   │                  │  [+ Add]     │ │
│  │            │    └─────────┘                  │              │ │
│  │  Data      │                                  │              │ │
│  │  • Transf. │                                  │  [More ▼]    │ │
│  │  • SetState│                                  │  [Evaluate]  │ │
│  │            │                                   │              │ │
│  │            │  [Pan 🤚] [Select ➤] [↶][↷]      │              │ │
│  └────────────┴───────────────────────────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Components Breakdown

### 1. Top Navigation Bar

**Layout:**
```
[← Back Button] [Workflow Name] [Version Selector ▼] [Spacer] [Actions Menu ⚙] [Preview Button] [Deploy Button]
```

**Elements:**
- **Back Button**: `← View all workflows` - Returns to workflow list
- **Workflow Name**: Editable title (e.g., "Advanced Research Agent Workflow")
- **Version Selector**: Dropdown showing version (e.g., "v1 · production")
- **Actions Menu**: `⚙` icon - Workflow settings/actions
- **Preview Button**: Disabled until workflow is valid
- **Deploy Button**: Disabled until workflow is published

**Styling:**
- Background: White
- Height: ~60px
- Border bottom: 1px solid gray-200
- Padding: 16px 24px

---

### 2. Node Palette (Left Sidebar)

**Width**: ~240px  
**Background**: Light gray (gray-50)  
**Scrollable**: Yes

**Section Structure:**
```
┌─────────────────────┐
│ Core                │
│ ┌─────────────────┐ │
│ │ 🤖 Agent       │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ ⊗  End         │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 📝 Note        │ │
│ └─────────────────┘ │
│                     │
│ Tools               │
│ ┌─────────────────┐ │
│ │ 🔍 File search │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 🛡️ Guardrails  │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 🔌 MCP         │ │
│ └─────────────────┘ │
│                     │
│ Logic               │
│ ┌─────────────────┐ │
│ │ 🔀 If / else   │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 🔄 While       │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ ✋ User approval│ │
│ └─────────────────┘ │
│                     │
│ Data                │
│ ┌─────────────────┐ │
│ │ 🔧 Transform   │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 📦 Set state   │ │
│ └─────────────────┘ │
└─────────────────────┘
```

**Node Button Styling:**
- Background: White
- Border: 1px solid gray-200
- Border radius: 6px
- Padding: 10px 12px
- Margin: 4px 0
- Hover: Shadow + border highlight
- Cursor: Pointer (draggable)

**Interaction:**
- Click to add to canvas
- Drag to place on canvas
- Visual feedback on hover

---

### 3. Canvas Area (Center)

**Technology**: React Flow  
**Background**: Dot pattern grid  
**Interactive**: Pan, zoom, select, connect

**Canvas Controls (Bottom Left):**
```
[🤚 Pan mode] [➤ Selection mode] [↶ Undo] [↷ Redo]
```

**Node Appearance:**

**Start Node:**
```
┌────────────────┐
│ 🏁 Start       │
└────────┬───────┘
         │ (connection handle)
```

**Agent Node:**
```
┌────────────────────┐
│ 🤖                 │
│ Research Planner   │
│ Agent              │
└────────┬───────────┘
         │
```

**End Node:**
```
         │
┌────────┴───────┐
│ ⊗  End         │
└────────────────┘
```

**Node States:**
- **Default**: White background, gray border
- **Selected**: Blue border (2px), shadow
- **Hover**: Light gray background
- **Active**: Highlighted border

**Connection Edges:**
- Bezier curves
- Gray color (#94a3b8)
- Animated on execution
- Arrow at target
- Thickness: 2px

**Empty State:**
```
┌─────────────────────────────────┐
│                                 │
│   Select a new node from the    │
│   sidebar                       │
│                                 │
└─────────────────────────────────┘
```

---

### 4. Inspector Panel (Right Sidebar)

**Width**: ~360px  
**Background**: White  
**Scrollable**: Yes  
**Border left**: 1px solid gray-200

**Header:**
```
┌──────────────────────────────┐
│ [Node Icon] Node Name        │
│ Subtitle/Description         │
└──────────────────────────────┘
```

**Content Sections:**

#### Start Node Inspector:
```
┌──────────────────────────────┐
│ 🏁 Start                     │
│ Define the workflow inputs   │
├──────────────────────────────┤
│                              │
│ Input variables              │
│ ┌──────────────────────────┐ │
│ │ 📄 input_as_text         │ │
│ │ string                   │ │
│ └──────────────────────────┘ │
│                              │
│ State variables              │
│ [+ Add] button               │
│                              │
└──────────────────────────────┘
```

#### Agent Node Inspector:
```
┌──────────────────────────────┐
│ 🤖 Research Planner          │
│ Call the model with your     │
│ instructions and tools       │
├──────────────────────────────┤
│                              │
│ Name                         │
│ ┌──────────────────────────┐ │
│ │ Research Planner         │ │
│ └──────────────────────────┘ │
│                              │
│ Instructions    [⚙][Generate]│
│ ┌──────────────────────────┐ │
│ │ You are a Research       │ │
│ │ Planning Agent...        │ │
│ │                          │ │
│ │ [+ Add context]          │ │
│ └──────────────────────────┘ │
│                              │
│ [✓] Include chat history    │
│                              │
│ Model                        │
│ [gpt-5              ▼]      │
│                              │
│ Reasoning effort             │
│ [medium             ▼]      │
│                              │
│ Tools                        │
│ [+ Add tool]                 │
│                              │
│ Output format                │
│ [Text               ▼]      │
│                              │
│ [More ▼] [Evaluate (disabled)]│
└──────────────────────────────┘
```

**Form Field Styling:**
- **Text Input**: Border, rounded corners, padding 8px
- **Textarea**: Min height 100px, resizable
- **Dropdown**: Custom select with chevron
- **Toggle**: iOS-style switch
- **Button**: Rounded, appropriate colors

**Footer:**
```
┌──────────────────────────────┐
│ [?] [📄 Docs] [✕ Delete]     │
└──────────────────────────────┘
```

---

## Node Types - Visual Specifications

### Start Node
- **Icon**: 🏁 or play circle
- **Color**: Green accent (#10b981)
- **Size**: Compact (160px × 60px)
- **Handles**: 1 output (bottom)

### Agent Node
- **Icon**: 🤖 robot
- **Color**: Blue accent (#3b82f6)
- **Size**: Medium (200px × 80px)
- **Handles**: 1 input (top), 1 output (bottom)
- **Content**: Name + "Agent" label

### If/Else Node
- **Icon**: 🔀 fork/branch
- **Color**: Purple accent (#8b5cf6)
- **Size**: Medium (200px × 80px)
- **Handles**: 1 input (top), 2 outputs (left="false", right="true")

### While Node
- **Icon**: 🔄 loop
- **Color**: Orange accent (#f59e0b)
- **Size**: Medium (200px × 80px)
- **Handles**: 1 input (top), 1 output (bottom), 1 loop output (left)

### Transform Node
- **Icon**: 🔧 wrench/tools
- **Color**: Cyan accent (#06b6d4)
- **Size**: Compact (180px × 60px)
- **Handles**: 1 input (top), 1 output (bottom)

### File Search Node
- **Icon**: 🔍 magnifying glass
- **Color**: Emerald accent (#059669)
- **Size**: Medium (200px × 70px)
- **Handles**: 1 input (top), 1 output (bottom)

### Guardrails Node
- **Icon**: 🛡️ shield
- **Color**: Red accent (#ef4444)
- **Size**: Medium (200px × 70px)
- **Handles**: 1 input (top), 2 outputs (pass/fail)

### MCP Node
- **Icon**: 🔌 plug/connector
- **Color**: Violet accent (#7c3aed)
- **Size**: Medium (200px × 70px)
- **Handles**: 1 input (top), 1 output (bottom)

### Human Approval Node
- **Icon**: ✋ raised hand
- **Color**: Amber accent (#f59e0b)
- **Size**: Medium (200px × 80px)
- **Handles**: 1 input (top), 2 outputs (approved/rejected)

### Set State Node
- **Icon**: 📦 box/package
- **Color**: Indigo accent (#6366f1)
- **Size**: Compact (180px × 60px)
- **Handles**: 1 input (top), 1 output (bottom)

### Note Node
- **Icon**: 📝 memo
- **Color**: Gray (neutral)
- **Size**: Flexible (resizable)
- **Handles**: None (doesn't connect)
- **Style**: Dashed border, yellow background

### End Node
- **Icon**: ⊗ stop/end circle
- **Color**: Red accent (#ef4444)
- **Size**: Compact (160px × 60px)
- **Handles**: 1 input (top)

---

## Color Palette

### Primary Colors
- **Blue**: `#3b82f6` - Primary actions, Agent nodes
- **Green**: `#10b981` - Success, Start nodes
- **Red**: `#ef4444` - Danger, End nodes, Guardrails
- **Purple**: `#8b5cf6` - Logic, If/Else
- **Orange**: `#f59e0b` - Loops, Approval

### UI Colors
- **Background**: `#ffffff` (white)
- **Canvas**: `#f9fafb` (gray-50)
- **Border**: `#e5e7eb` (gray-200)
- **Text Primary**: `#111827` (gray-900)
- **Text Secondary**: `#6b7280` (gray-500)
- **Hover**: `#f3f4f6` (gray-100)
- **Focus**: `#dbeafe` (blue-100)
- **Selected**: `#3b82f6` (blue-500)

### Node State Colors
- **Default Border**: `#d1d5db` (gray-300)
- **Hover Border**: `#9ca3af` (gray-400)
- **Selected Border**: `#3b82f6` (blue-500)
- **Active Border**: `#2563eb` (blue-600)
- **Error Border**: `#ef4444` (red-500)

---

## Typography

### Font Family
- **Primary**: "OpenAI Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Monospace**: "Monaco", "Courier New", monospace

### Font Sizes
- **Title**: 24px (1.5rem)
- **Heading**: 18px (1.125rem)
- **Body**: 14px (0.875rem)
- **Small**: 12px (0.75rem)
- **Tiny**: 10px (0.625rem)

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

---

## Spacing System

Using 8px base unit:

- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)

---

## Interactions

### Node Dragging
1. Click node in palette
2. Drag onto canvas
3. Drop at position
4. Node appears with default config
5. Auto-selects new node

### Connecting Nodes
1. Hover over source handle
2. Handle highlights
3. Click and drag
4. Preview connection line
5. Drop on target handle
6. Edge created with bezier curve

### Selecting Nodes
1. Click node
2. Node border highlights (blue)
3. Inspector shows node config
4. Can drag to move
5. Delete key removes

### Editing Node
1. Select node
2. Inspector updates
3. Edit fields in inspector
4. Changes auto-save
5. Node updates on canvas

### Preview Mode
1. Click "Preview" button
2. Canvas switches to read-only
3. Shows execution panel
4. Can input test data
5. Step through execution
6. View outputs at each node

---

## Responsive Behavior

### Minimum Window Size
- Width: 1280px
- Height: 720px

### Panel Resizing
- Node Palette: Fixed 240px
- Inspector: Fixed 360px
- Canvas: Fluid (remaining space)

### Collapsible Panels
- Inspector can collapse (just icon bar)
- Node Palette can collapse (just icons)
- Canvas always visible

---

## Animation & Transitions

### Hover Effects
- **Duration**: 150ms
- **Easing**: ease-in-out
- **Properties**: background, border, shadow

### Node Movement
- **Duration**: 200ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Smooth**: position transitions

### Panel Transitions
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Sliding**: left/right panels

### Execution Animation
- **Edge Flow**: 1000ms loop
- **Pulse**: Active node
- **Gradient**: Along edges

---

## Accessibility

### Keyboard Navigation
- **Tab**: Move between fields
- **Arrow Keys**: Navigate canvas (when focused)
- **Delete**: Remove selected node
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Ctrl+C/V**: Copy/Paste nodes
- **Escape**: Deselect

### Screen Reader
- ARIA labels on all interactive elements
- Role attributes on custom components
- Status announcements for actions

### Focus Indicators
- Visible blue outline on focus
- Skip to main content link
- Keyboard trap management

---

## Mobile/Touch (Optional)

While primarily desktop, basic touch support:
- Pinch to zoom canvas
- Two-finger pan
- Long-press for context menu
- Simplified node palette (modal)

---

## Error States

### Invalid Connection
- **Visual**: Red dashed line
- **Message**: "Cannot connect these nodes"
- **Auto-remove**: After 2 seconds

### Invalid Configuration
- **Visual**: Red border on node
- **Message**: In inspector
- **Prevent**: Save/publish until fixed

### Execution Error
- **Visual**: Red highlight on failed node
- **Message**: Error panel at bottom
- **Log**: Full stack trace available

---

## Loading States

### Initial Load
- Skeleton screens
- Progressive loading
- Spinner for heavy operations

### Node Processing
- Spinner in node
- Disabled state
- Progress indicator if applicable

### Saving
- Auto-save indicator (top right)
- "Saving..." → "Saved ✓"
- Debounced (500ms)

---

## Empty States

### No Workflows
```
┌─────────────────────────────────┐
│                                 │
│   🎯 Create your first workflow │
│                                 │
│   Build a chat agent workflow   │
│   with custom logic and tools   │
│                                 │
│   [Create workflow]             │
│                                 │
└─────────────────────────────────┘
```

### Empty Canvas
```
┌─────────────────────────────────┐
│                                 │
│   👈 Select a node from the     │
│      sidebar to get started     │
│                                 │
│   or choose a template above    │
│                                 │
└─────────────────────────────────┘
```

### No Selection
```
┌─────────────────────────────────┐
│                                 │
│   Select a node to view         │
│   and edit its properties       │
│                                 │
└─────────────────────────────────┘
```

---

## Implementation Notes

### React Flow Configuration
```typescript
const flowConfig = {
  nodeTypes: customNodeTypes,
  edgeTypes: customEdgeTypes,
  defaultEdgeOptions: {
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#94a3b8', strokeWidth: 2 }
  },
  fitView: true,
  minZoom: 0.5,
  maxZoom: 2,
  snapToGrid: true,
  snapGrid: [16, 16]
};
```

### Custom Node Component Pattern
```typescript
const AgentNode = ({ data, selected }) => {
  return (
    <div className={cn(
      "bg-white rounded-lg border-2 p-3",
      selected ? "border-blue-500 shadow-lg" : "border-gray-300",
      "hover:border-gray-400 transition-all"
    )}>
      <Handle type="target" position="top" />
      <div className="flex items-center gap-2">
        <span className="text-xl">🤖</span>
        <div>
          <div className="font-semibold">{data.name}</div>
          <div className="text-xs text-gray-500">Agent</div>
        </div>
      </div>
      <Handle type="source" position="bottom" />
    </div>
  );
};
```

---

## Figma/Design File Structure

If creating in Figma:

```
📁 Agent Builder Design
  📁 Pages
    📄 Overview
    📄 Components
      - Node Components
      - Form Elements
      - Panels
      - Navigation
    📄 Flows
      - Create Workflow
      - Edit Node
      - Execute Preview
    📄 States
      - Default
      - Hover
      - Active
      - Error
      - Loading
```

---

**Version**: 1.0  
**Last Updated**: October 9, 2025  
**Purpose**: Complete UI/UX specification for Agent Builder clone
