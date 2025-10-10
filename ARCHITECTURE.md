# Agent Builder Clone - Architecture Plan

**Goal**: Build a pixel-perfect clone of OpenAI's Agent Builder using local models

## 🏗️ Architecture (Based on OpenAI Documentation)

### 1. Frontend - Visual Canvas
- **Technology**: React + React Flow (for node-based UI)
- **Pages**:
  - `/builder` - Main canvas for drag-and-drop
  - `/templates` - Pre-built workflow templates
  - `/preview` - Test workflows with live data
  - `/publish` - Export/deploy workflows

### 2. Backend - Execution Engine
- **Technology**: Node.js/Express or Deno
- **Responsibilities**:
  - Execute workflow graphs
  - Manage state between nodes
  - Interface with Ollama for LLM calls
  - Handle tool integrations

### 3. Node System (Exact OpenAI Parity)

#### Core Nodes
- **Start Node**: Define inputs and state variables
- **Agent Node**: LLM with instructions, tools, model config
- **Note Node**: Documentation/comments

#### Tool Nodes
- **File Search**: Vector store for RAG
- **Guardrails**: PII detection, jailbreak prevention
- **MCP (Model Context Protocol)**: External integrations

#### Logic Nodes
- **If/Else**: Conditional branching (CEL expressions)
- **While**: Loop on conditions
- **Human Approval**: Human-in-the-loop

#### Data Nodes
- **Transform**: Data reshaping
- **Set State**: Define global variables

### 4. LLM Integration Layer
- **Provider**: Ollama (local)
- **Features Needed**:
  - Function calling (tools)
  - Structured outputs (JSON mode)
  - Streaming responses
  - Context management

## 📁 Proposed Project Structure

```
openai-agent-builder-clone/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas/           # React Flow canvas
│   │   │   ├── Nodes/            # Individual node components
│   │   │   ├── Sidebar/          # Node palette
│   │   │   ├── Inspector/        # Node properties panel
│   │   │   └── Preview/          # Workflow testing
│   │   ├── pages/
│   │   │   ├── Builder.tsx       # Main builder page
│   │   │   ├── Templates.tsx     # Template gallery
│   │   │   └── Preview.tsx       # Test/debug page
│   │   ├── types/
│   │   │   ├── nodes.ts          # Node type definitions
│   │   │   └── workflow.ts       # Workflow structure
│   │   └── services/
│   │       ├── api.ts            # Backend API client
│   │       └── execution.ts      # Workflow execution
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── engine/
│   │   │   ├── executor.ts       # Workflow execution engine
│   │   │   ├── nodes/            # Node executors
│   │   │   │   ├── agent.ts
│   │   │   │   ├── ifelse.ts
│   │   │   │   └── ...
│   │   │   └── state.ts          # State management
│   │   ├── llm/
│   │   │   ├── ollama.ts         # Ollama client
│   │   │   └── tools.ts          # Function calling
│   │   ├── tools/
│   │   │   ├── fileSearch.ts     # Vector store
│   │   │   ├── guardrails.ts     # Safety checks
│   │   │   └── mcp.ts            # MCP integration
│   │   └── server.ts             # Express/API server
│   └── package.json
├── shared/
│   └── types/                    # Shared TypeScript types
└── docs/
    └── nodes/                    # Node documentation
```

## 🎨 UI/UX Requirements (From OpenAI)

### Canvas Features
- [x] Drag and drop nodes from palette
- [x] Connect nodes with edges
- [x] Pan and zoom canvas
- [x] Select and delete nodes/edges
- [x] Undo/redo support
- [x] Auto-layout options

### Node Inspector (Right Panel)
- Node name/description
- Configuration fields per node type
- Model selection (for Agent nodes)
- Instructions/prompts
- Tool selection
- State variable management

### Preview Mode
- Live workflow testing
- Step-by-step execution view
- Variable inspection
- Execution logs
- Debug breakpoints

## 🔧 Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up project structure
- [ ] Initialize React + Vite frontend
- [ ] Initialize Node.js/Express backend
- [ ] Set up React Flow canvas
- [ ] Create basic node types (Start, Agent)
- [ ] Implement simple workflow execution

### Phase 2: Core Nodes (Week 2)
- [ ] Implement all node types
- [ ] Build node executors
- [ ] Add Ollama integration
- [ ] Implement state management
- [ ] Add edge validation

### Phase 3: Tools (Week 3)
- [ ] File Search (vector store)
- [ ] Guardrails (safety)
- [ ] MCP integration
- [ ] Function calling support
- [ ] Structured outputs

### Phase 4: Logic & Polish (Week 4)
- [ ] If/Else with CEL expressions
- [ ] While loops
- [ ] Human approval workflow
- [ ] Preview/debug mode
- [ ] Templates gallery
- [ ] Export/import workflows

### Phase 5: Advanced (Week 5+)
- [ ] Deployment options
- [ ] Evaluation/grading
- [ ] Monitoring/logging
- [ ] Performance optimization
- [ ] Documentation

## 🎯 Success Criteria

1. **Visual Parity**: UI looks and feels like OpenAI's Agent Builder
2. **Feature Parity**: All node types and features work
3. **Local Models**: Works 100% offline with Ollama
4. **Performance**: Workflows execute in real-time
5. **Usability**: Intuitive drag-and-drop interface

## 🚀 Tech Stack Decision

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Canvas**: React Flow (xyflow)
- **UI Library**: Tailwind CSS + shadcn/ui (modern, clean)
- **State**: Zustand (lightweight)
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express or Fastify
- **API**: REST or GraphQL
- **Validation**: Zod
- **Vector Store**: ChromaDB or similar

### AI/LLM
- **Runtime**: Ollama
- **Models**: LLaMA 3.2, Mistral, etc.
- **Function Calling**: Native Ollama tools support

## 📊 Differences from OpenAI

| Feature | OpenAI | Our Clone |
|---------|--------|-----------|
| LLM Provider | GPT-4/5 (cloud) | Ollama (local) |
| Hosting | Cloud | Self-hosted |
| Cost | Pay per call | Free (hardware only) |
| Privacy | Data sent to OpenAI | 100% local |
| Internet | Required | Optional |
| Models | GPT only | Any Ollama model |

## 🎓 Key Learning Resources

1. **OpenAI Docs** (we have): `/openai-agent-builder-docs.md`
2. **React Flow**: https://reactflow.dev/
3. **Ollama API**: https://github.com/ollama/ollama/blob/main/docs/api.md
4. **CEL Expressions**: https://github.com/google/cel-spec
5. **Vector Stores**: ChromaDB, Qdrant, Weaviate

---

**Next Step**: Initialize the project structure and start with Phase 1
