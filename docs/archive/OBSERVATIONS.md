# OpenAI Agent Builder - Live Interface Observations

**Date**: October 9, 2025  
**Workflow Examined**: Advanced Research Agent Workflow  
**Screenshots**: `.playwright-mcp/` directory

---

## 🎨 Visual Design Analysis

### Layout Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│ Header: [← Back] Advanced Research Agent Workflow [v1▼production]   │
│         [⚙][Evaluate][Code][Preview][Deploy]                         │
├─────────┬──────────────────────────────────────┬─────────────────────┤
│         │                                      │                     │
│ PALETTE │           CANVAS (React Flow)        │    INSPECTOR        │
│         │                                      │                     │
│ Core    │      ┌─────────┐                    │ Research Planner    │
│ • Agent │      │  Start  │                    │                     │
│ • End   │      └────┬────┘                    │ Name:               │
│ • Note  │           │                         │ [Research Planner]  │
│         │           ▼                         │                     │
│ Tools   │   ┌──────────────────┐              │ Instructions:       │
│ • File  │   │Research Planner  │              │ [Textarea...]       │
│ • Guard │   │     Agent        │              │                     │
│ • MCP   │   └────────┬─────────┘              │ □ Include chat hist │
│         │           │                         │                     │
│ Logic   │           ▼                         │ Model: gpt-5 ▼      │
│ • If    │   ┌──────────────────┐              │ Reasoning: medium ▼ │
│ • While │   │Web Research Agent│              │                     │
│ • Approval  │     Agent        │              │ Tools: [+ Add]      │
│         │   └──────────────────┘              │                     │
│ Data    │                                      │ Output: Text ▼      │
│ • Trans │                                      │                     │
│ • State │   [🤚][➤][↶][↷]                     │ [More ▼][Evaluate]  │
│         │                                      │                     │
└─────────┴──────────────────────────────────────┴─────────────────────┘
```

### Color Palette (Extracted)

**Node Colors:**
- **Agent**: Blue (#3b82f6 / rgb(59, 130, 246))
- **Start**: Gray/Light (#f3f4f6)
- **End**: Gray
- **File Search**: Yellow (#eab308)
- **Guardrails**: Yellow (#eab308)
- **MCP**: Yellow (#eab308)
- **If/Else**: Orange (#f97316)
- **While**: Orange (#f97316)
- **User Approval**: Orange (#f97316)
- **Transform**: Purple (#a855f7)
- **Set State**: Purple (#a855f7)
- **Note**: Gray (#9ca3af)

**UI Colors:**
- Background: #ffffff (white)
- Canvas: #f9fafb (light gray)
- Text Primary: #111827 (near black)
- Text Secondary: #6b7280 (gray)
- Border: #e5e7eb (light gray)
- Accent: #3b82f6 (blue)
- Success: #10b981 (green)

### Typography

- **Font Family**: "OpenAI Sans", -apple-system, BlinkMacSystemFont, "Segoe UI"
- **Node Name**: 14px, Medium weight
- **Node Type**: 12px, Regular weight, Gray
- **Inspector Labels**: 12px, Medium weight
- **Button Text**: 14px, Medium weight

---

## 🏗️ Node Structure (Observed)

### Agent Node Configuration

**Visual Properties:**
- Blue rounded rectangle
- Icon: Triangle/Play symbol
- Two connection points (top input, bottom output)
- Name displayed prominently
- Type label "Agent" below name

**Inspector Panel Fields:**

1. **Name** (Textbox)
   - Example: "Research Planner"

2. **Instructions** (Textarea)
   - Large multi-line text area
   - "Generate" button for AI-assisted writing
   - "Add context" button for inserting variables
   - Example: "You are a Research Planning Agent. Analyze the user's research topic..."

3. **Include chat history** (Toggle)
   - Checkbox/Switch control
   - Default: ON

4. **Model** (Dropdown)
   - Options: gpt-5, gpt-4o, etc.
   - Selected: "gpt-5"

5. **Reasoning effort** (Dropdown)
   - Options: low, medium, high
   - Selected: "medium"

6. **Tools** (List)
   - [+ Add] button to add tools
   - Can include: webSearchTool, etc.

7. **Output format** (Dropdown)
   - Options: Text, JSON, etc.
   - Selected: "Text"

8. **More** (Collapsible section)
   - Additional advanced options

---

## 💻 Code Export Structure

### TypeScript/JavaScript (Agents SDK)

```typescript
import { webSearchTool, Agent, AgentInputItem, Runner } from "@openai/agents";

// Tool definitions
const webSearchPreview = webSearchTool({
  filters: {
    allowed_domains: [
      "arxiv.org",
      "nature.com",
      "ieee.org",
      "sciencedirect.com",
      "scholar.google.com"
    ]
  },
  searchContextSize: "medium",
  userLocation: {
    type: "approximate"
  }
});

// Agent instantiation
const researchPlanner = new Agent({
  name: "Research Planner",
  instructions: "You are a Research Planning Agent...",
  model: "gpt-5",
  modelSettings: {
    reasoning: {
      effort: "medium"
    },
    store: true
  }
});

const webResearchAgent = new Agent({
  name: "Web Research Agent",
  instructions: "",
  model: "gpt-5",
  tools: [webSearchPreview],
  modelSettings: {
    reasoning: {
      effort: "low"
    },
    store: true
  }
});

// Workflow execution
type WorkflowInput = { input_as_text: string };

export const runWorkflow = async (workflow: WorkflowInput) => {
  const state = {};
  const conversationHistory: AgentInputItem[] = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: workflow.input_as_text
        }
      ]
    }
  ];
  
  const runner = new Runner({
    traceMetadata: {
      __trace_source__: "agent-builder",
      workflow_id: "wf_68e67c3130048190b347ef0ec6d0f833085835cab438467a"
    }
  });
  
  const researchPlannerResultTemp = await runner.run(
    researchPlanner,
    [...conversationHistory]
  );
  
  conversationHistory.push(
    ...researchPlannerResultTemp.newItems.map((item) => item.rawItem)
  );
  
  if (!researchPlannerResultTemp.finalOutput) {
    throw new Error("Agent result is undefined");
  }
  
  const researchPlannerResult = {
    output_text: researchPlannerResultTemp.finalOutput ?? ""
  };
};
```

---

## 🔍 Key Observations

### 1. Node System Architecture

**Node Types Observed:**
- Start (entry point)
- Agent (LLM with instructions)
- End (termination)
- Note (documentation)
- File search (vector retrieval)
- Guardrails (safety checks)
- MCP (external integrations)
- If/Else (conditional logic)
- While (loops)
- User approval (human-in-the-loop)
- Transform (data manipulation)
- Set state (global variables)

**Node Structure:**
```typescript
interface Node {
  id: string;
  type: 'agent' | 'start' | 'end' | ...;
  data: {
    name: string;
    // Type-specific configuration
  };
  position: { x: number; y: number };
}
```

### 2. Edge System

**Edge Properties:**
- Connects output handle of one node to input handle of another
- Visual: Curved Bézier curves
- Directional flow (top to bottom)
- No labels on edges in this workflow

**Edge Structure:**
```typescript
interface Edge {
  id: string;
  source: string; // Source node ID
  target: string; // Target node ID
  sourceHandle?: string;
  targetHandle?: string;
}
```

### 3. State Management

**Conversation History:**
- Flows between nodes
- Each agent adds to the conversation
- Structured as `AgentInputItem[]`

**Global State:**
- Empty object `{}` initialized
- Can be modified by "Set state" nodes
- Accessible across workflow

### 4. Execution Model

**Sequential Flow:**
1. Initialize state and conversation history
2. Create Runner instance
3. Execute nodes in topological order
4. Each node:
   - Receives conversation history
   - Executes its logic
   - Appends to conversation history
   - Returns result
5. Final output extracted

**Runner Pattern:**
```typescript
const runner = new Runner({ traceMetadata });
const result = await runner.run(agent, conversationHistory);
```

### 5. Tool Integration

**Tool Definition Pattern:**
```typescript
const tool = webSearchTool({
  filters: { allowed_domains: [...] },
  searchContextSize: "medium",
  userLocation: { type: "approximate" }
});
```

**Tool Assignment:**
```typescript
const agent = new Agent({
  tools: [tool1, tool2, ...]
});
```

### 6. UI/UX Patterns

**Palette (Left Panel):**
- Categorized by function (Core, Tools, Logic, Data)
- Drag-and-drop source
- Icons + Labels
- Collapsed/Expanded sections

**Canvas (Center):**
- Infinite pan/zoom
- Grid background
- Node positioning
- Edge routing
- Selection mode / Pan mode toggle
- Toolbar: [Pan][Select][Undo][Redo]

**Inspector (Right Panel):**
- Context-sensitive
- Shows selected node configuration
- Form fields with labels
- Dropdowns, textboxes, toggles
- "More" expandable section
- Help link to docs
- Close button

**Top Bar:**
- Breadcrumb navigation
- Workflow name + version
- Action buttons (Evaluate, Code, Preview, Deploy)
- Workflow actions menu (⚙)

### 7. Code Export Options

**ChatKit:**
- Provides workflow ID
- Embed in web app
- Managed hosting

**Agents SDK:**
- Full TypeScript/Python code
- Self-hosted
- Complete workflow logic
- Can be modified and extended

---

## 🎯 Implementation Priorities (Based on Observations)

### Phase 1: Core Canvas ✅
1. Three-panel layout (palette, canvas, inspector)
2. React Flow integration
3. Basic node rendering (Start, Agent, End)
4. Drag-and-drop from palette
5. Node selection
6. Edge connections

### Phase 2: Agent Configuration ✅
1. Inspector panel
2. Agent node properties:
   - Name input
   - Instructions textarea
   - Model dropdown
   - Reasoning effort dropdown
   - Tools list
   - Output format dropdown
3. Form validation
4. Real-time updates

### Phase 3: Execution Engine 🔄
1. Workflow runner
2. Sequential execution
3. Conversation history management
4. State management
5. Ollama integration (replacing GPT)
6. Streaming support

### Phase 4: All Node Types 🔄
1. Logic nodes (If/Else, While)
2. Tool nodes (File Search, Guardrails, MCP)
3. Data nodes (Transform, Set State)
4. User approval node
5. Note node

### Phase 5: Code Export 🔄
1. JSON export/import
2. TypeScript code generation
3. Python code generation
4. Template system

### Phase 6: Polish 🔄
1. Undo/Redo
2. Keyboard shortcuts
3. Validation and errors
4. Preview mode
5. Deployment options

---

## 📐 React Flow Implementation Details

### Node Component Structure

```typescript
// Custom node component
const AgentNode = ({ data }: NodeProps) => {
  return (
    <div className="agent-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-icon">▶</div>
      <div className="node-content">
        <div className="node-name">{data.name}</div>
        <div className="node-type">Agent</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Register custom nodes
const nodeTypes = {
  agent: AgentNode,
  start: StartNode,
  end: EndNode,
  // ... other types
};
```

### Canvas Configuration

```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  nodeTypes={nodeTypes}
  fitView
  snapToGrid
  defaultEdgeOptions={{
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#b1b1b7', strokeWidth: 2 }
  }}
>
  <Background color="#e5e7eb" gap={16} />
  <Controls showInteractive={false} />
  <MiniMap />
</ReactFlow>
```

---

## 🔧 Technology Mapping

### OpenAI → Our Implementation

| OpenAI Component | Our Replacement |
|-----------------|-----------------|
| GPT-5 API | Ollama (llama3, mistral, etc.) |
| @openai/agents | Custom execution engine |
| OpenAI Runner | Custom workflow runner |
| ChatKit | Custom deployment (Docker) |
| Web Search Tool | Brave/DuckDuckGo API |
| File Search | ChromaDB + embeddings |
| Vector Store | ChromaDB local |

### Libraries to Use

```json
{
  "frontend": {
    "react": "^19.0.0",
    "@xyflow/react": "^12.0.0",
    "tailwindcss": "^3.4.0",
    "shadcn/ui": "latest",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.23.0",
    "@monaco-editor/react": "^4.6.0"
  },
  "backend": {
    "express": "^4.19.0",
    "prisma": "^5.14.0",
    "@prisma/client": "^5.14.0",
    "ollama": "^0.5.0",
    "chromadb": "^1.8.0"
  }
}
```

---

## 📊 Data Models (Inferred from Code)

### Workflow Schema

```typescript
interface Workflow {
  id: string;
  name: string;
  version: number;
  status: 'draft' | 'production';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

interface AgentNodeData extends NodeData {
  name: string;
  instructions: string;
  model: string;
  modelSettings: {
    reasoning: {
      effort: 'low' | 'medium' | 'high';
    };
    store: boolean;
  };
  tools: Tool[];
  outputFormat: 'text' | 'json';
  includeChatHistory: boolean;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
```

### Execution Schema

```typescript
interface ExecutionContext {
  workflowId: string;
  state: Record<string, any>;
  conversationHistory: AgentInputItem[];
  currentNodeId: string;
  trace: ExecutionTrace[];
}

interface ExecutionTrace {
  nodeId: string;
  nodeName: string;
  startTime: Date;
  endTime?: Date;
  input: any;
  output?: any;
  error?: string;
}

interface AgentInputItem {
  role: 'user' | 'assistant' | 'system';
  content: ContentItem[];
}

interface ContentItem {
  type: 'input_text' | 'output_text' | 'tool_call' | 'tool_result';
  text?: string;
  tool?: string;
  result?: any;
}
```

---

## 🎨 CSS Classes (Observed from Inspector)

### Node Styles

```css
.agent-node {
  background: #3b82f6;
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 180px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.node-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.node-type {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  margin-top: 4px;
}
```

### Inspector Styles

```css
.inspector-panel {
  width: 360px;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  padding: 24px;
  overflow-y: auto;
}

.inspector-field {
  margin-bottom: 20px;
}

.inspector-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
}

.inspector-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.inspector-textarea {
  min-height: 120px;
  resize: vertical;
}
```

---

## 🚀 Next Steps

1. ✅ **Analyze complete** - We now have comprehensive understanding
2. 🔄 **Start building** - Begin Phase 1 implementation
3. 📋 **Follow roadmap** - Use IMPLEMENTATION_ROADMAP.md
4. 🎯 **Priority**: Canvas + Basic Nodes (Week 1)

---

**Status**: Analysis Complete  
**Ready to Build**: YES ✅  
**Confidence**: 100% - We have all the details we need!
