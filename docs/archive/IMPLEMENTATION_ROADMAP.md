# Implementation Roadmap - OpenAI Agent Builder Clone
**Project**: Local Agent Builder with Ollama  
**Start Date**: October 9, 2025  
**Timeline**: 6 weeks to MVP

---

## Project Overview

Build a production-quality clone of OpenAI's Agent Builder that:
- ✅ Uses local LLMs (Ollama) instead of GPT API
- ✅ 100% feature parity with OpenAI's visual builder
- ✅ Self-hosted and privacy-focused
- ✅ Can export workflows as code

---

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Canvas**: React Flow (@xyflow/react)
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Code Editor**: Monaco Editor
- **HTTP Client**: Axios
- **Markdown**: react-markdown

### Backend
- **Runtime**: Node.js 20+ + TypeScript
- **Framework**: Express.js
- **Validation**: Zod
- **Database**: PostgreSQL (workflows) + Redis (sessions)
- **Vector Store**: ChromaDB (for file search)
- **LLM**: Ollama API client
- **CEL**: cel-js or custom interpreter

### Development Tools
- **Package Manager**: pnpm
- **Linter**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library
- **E2E**: Playwright
- **Git Hooks**: Husky + lint-staged

---

## Phase 1: Foundation (Week 1)

### Goal
Working canvas with basic nodes and simple workflow execution

### Tasks

#### Day 1-2: Project Setup
- [ ] Initialize monorepo structure
- [ ] Set up Vite + React + TypeScript
- [ ] Install and configure Tailwind + shadcn/ui
- [ ] Set up Express backend
- [ ] Configure PostgreSQL + Prisma
- [ ] Install Ollama and test connection
- [ ] Set up dev environment (hot reload, etc.)

#### Day 3-4: Basic Canvas
- [ ] Integrate React Flow
- [ ] Create canvas layout (3-column)
- [ ] Build node palette component (left sidebar)
- [ ] Build inspector panel component (right sidebar)
- [ ] Implement drag-and-drop from palette
- [ ] Add pan/zoom controls

#### Day 5-7: Core Nodes (MVP)
- [ ] Create Start node component
- [ ] Create Agent node component
- [ ] Create End node component
- [ ] Build node inspectors for each
- [ ] Implement node connection logic
- [ ] Add save/load workflow (JSON)
- [ ] Basic workflow validation

**Deliverable**: Can create a simple Start → Agent → End workflow

---

## Phase 2: Execution Engine (Week 2)

### Goal
Execute simple workflows with Ollama integration

### Tasks

#### Day 8-9: Backend Architecture
- [ ] Design workflow execution API
- [ ] Create workflow storage (PostgreSQL)
- [ ] Implement graph validation
- [ ] Build topological sort for execution order
- [ ] Create execution state manager
- [ ] Add WebSocket support for streaming

#### Day 10-12: Node Executors
- [ ] Build Start node executor
- [ ] Build Agent node executor with Ollama
- [ ] Implement streaming responses
- [ ] Add error handling and retries
- [ ] Create execution logs/traces
- [ ] Test with real Ollama models

#### Day 13-14: Integration & Testing
- [ ] Connect frontend to backend
- [ ] Implement workflow execution UI
- [ ] Add execution progress indicators
- [ ] Create debug panel
- [ ] Show output at each node
- [ ] Test end-to-end workflows

**Deliverable**: Can execute and debug simple agent workflows

---

## Phase 3: All Node Types (Week 3)

### Goal
Implement all node types for feature parity

### Tasks

#### Day 15-16: Logic Nodes
- [ ] CEL expression evaluator
- [ ] If/Else node component
- [ ] If/Else executor (branching)
- [ ] While node component  
- [ ] While executor (loops + limits)
- [ ] Human Approval node
- [ ] Human Approval executor (pause/resume)

#### Day 17-18: Tool Nodes
- [ ] ChromaDB integration
- [ ] File Search node component
- [ ] File Search executor (vector search)
- [ ] Guardrails node component
- [ ] Guardrails executor (PII, jailbreak detection)
- [ ] MCP node component
- [ ] MCP executor (HTTP client)

#### Day 19-21: Data Nodes
- [ ] Transform node component
- [ ] Transform executor (data reshaping)
- [ ] Set State node component
- [ ] Set State executor (global variables)
- [ ] Note node component (UI only)
- [ ] End node executor (termination)
- [ ] Test all node types together

**Deliverable**: All node types working, can build complex workflows

---

## Phase 4: UI Polish & Features (Week 4)

### Goal
Professional UI with preview mode and templates

### Tasks

#### Day 22-23: Canvas Improvements
- [ ] Auto-layout algorithm
- [ ] Minimap component
- [ ] Multi-select nodes
- [ ] Copy/paste nodes
- [ ] Undo/redo stack
- [ ] Grid snapping
- [ ] Keyboard shortcuts
- [ ] Context menus

#### Day 24-25: Inspector Enhancements
- [ ] Dynamic forms per node type
- [ ] Model selector with Ollama models
- [ ] Code editor for instructions (Monaco)
- [ ] Variable picker/autocomplete
- [ ] Tool selector UI
- [ ] Output format selector
- [ ] Validation messages

#### Day 26-28: Preview Mode
- [ ] Preview mode toggle
- [ ] Execution viewer component
- [ ] Step-by-step debugger
- [ ] Variable inspector panel
- [ ] Execution timeline
- [ ] Breakpoint support
- [ ] Export execution logs

**Deliverable**: Polished UI with debugging capabilities

---

## Phase 5: Templates & Export (Week 5)

### Goal
Template library and deployment options

### Tasks

#### Day 29-30: Template System
- [ ] Template data structure
- [ ] Template gallery UI
- [ ] Import template → workflow
- [ ] 6 pre-built templates:
  - [ ] Data enrichment
  - [ ] Planning helper
  - [ ] Customer service
  - [ ] Structured Q&A
  - [ ] Document comparison
  - [ ] Knowledge assistant

#### Day 31-32: Export Features
- [ ] Export as JSON
- [ ] Import from JSON
- [ ] Export as Python code
- [ ] Export as TypeScript code
- [ ] Generate REST API endpoint
- [ ] Docker compose generator

#### Day 33-35: Deployment & Docs
- [ ] Docker containerization
- [ ] Environment configuration
- [ ] User documentation (Markdown)
- [ ] API documentation (OpenAPI)
- [ ] Deployment guide (Docker, K8s)
- [ ] Video walkthrough (optional)

**Deliverable**: Production-ready with templates and export

---

## Phase 6: Testing & Optimization (Week 6)

### Goal
Production hardening and performance optimization

### Tasks

#### Day 36-37: Testing
- [ ] Unit tests for executors
- [ ] Integration tests for workflows
- [ ] E2E tests with Playwright
- [ ] Load testing execution engine
- [ ] Security audit
- [ ] Accessibility testing

#### Day 38-39: Performance
- [ ] Optimize canvas rendering (large graphs)
- [ ] Database query optimization
- [ ] Caching strategy (Redis)
- [ ] Streaming optimization
- [ ] Bundle size reduction
- [ ] Lazy loading components

#### Day 40-42: Bug Fixes & Polish
- [ ] Fix critical bugs
- [ ] Improve error messages
- [ ] Add loading states
- [ ] Empty state designs
- [ ] Final UI polish
- [ ] Performance profiling
- [ ] Documentation review

**Deliverable**: Production-ready v1.0 release

---

## Detailed Implementation Specs

### 1. Data Models

#### Workflow Schema
```typescript
interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  nodes: Node[];
  edges: Edge[];
  state: Record<string, any>;
}

interface Node {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

type NodeType = 
  | 'start' 
  | 'agent' 
  | 'ifelse' 
  | 'while' 
  | 'transform'
  | 'fileSearch'
  | 'guardrails'
  | 'mcp'
  | 'humanApproval'
  | 'setState'
  | 'note'
  | 'end';
```

#### Node Data Schemas
```typescript
interface StartNodeData {
  inputVariables: Variable[];
  stateVariables: Variable[];
}

interface AgentNodeData {
  name: string;
  instructions: string;
  model: string; // Ollama model name
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  tools?: string[];
  includeChatHistory: boolean;
  outputFormat: 'text' | 'json' | 'structured';
  jsonSchema?: object;
}

interface IfElseNodeData {
  condition: string; // CEL expression
  description?: string;
}

interface WhileNodeData {
  condition: string; // CEL expression
  maxIterations: number;
  description?: string;
}

interface TransformNodeData {
  transformation: string; // JavaScript expression
  outputType: 'object' | 'array' | 'string' | 'number';
}

interface FileSearchNodeData {
  collectionName: string;
  query: string; // Can include variables
  topK: number;
}

interface GuardrailsNodeData {
  checks: GuardrailCheck[];
  onFailure: 'end' | 'retry' | 'route';
  failureRoute?: string; // Node ID
}

interface MCPNodeData {
  serverUrl: string;
  operation: string;
  parameters: Record<string, any>;
}

interface HumanApprovalNodeData {
  prompt: string;
  dataToShow: string[]; // Variable names
  approvalRoute: string; // Node ID
  rejectionRoute: string; // Node ID
}

interface SetStateNodeData {
  variableName: string;
  value: string; // Expression
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
}
```

---

### 2. API Endpoints

#### Workflows
```
GET    /api/workflows              # List all workflows
POST   /api/workflows              # Create new workflow
GET    /api/workflows/:id          # Get workflow by ID
PUT    /api/workflows/:id          # Update workflow
DELETE /api/workflows/:id          # Delete workflow
POST   /api/workflows/:id/publish  # Publish version
```

#### Execution
```
POST   /api/workflows/:id/execute     # Execute workflow
GET    /api/executions/:id            # Get execution status
WS     /api/executions/:id/stream     # Stream execution (WebSocket)
GET    /api/executions/:id/logs       # Get execution logs
POST   /api/executions/:id/approve    # Approve human approval node
POST   /api/executions/:id/reject     # Reject human approval node
```

#### Templates
```
GET    /api/templates              # List templates
GET    /api/templates/:id          # Get template
POST   /api/templates              # Create from workflow
```

#### Ollama Integration
```
GET    /api/models                 # List available models
POST   /api/models/test            # Test model connection
```

---

### 3. Execution Engine Architecture

```typescript
class WorkflowExecutor {
  private state: ExecutionState;
  private executors: Map<NodeType, NodeExecutor>;
  
  constructor(
    private workflow: Workflow,
    private ollamaClient: OllamaClient,
    private vectorStore: VectorStore
  ) {
    this.registerExecutors();
  }
  
  async execute(input: any): Promise<ExecutionResult> {
    // 1. Initialize state
    this.state = new ExecutionState({
      input_as_text: input,
      ...this.workflow.state
    });
    
    // 2. Find start node
    const startNode = this.workflow.nodes.find(n => n.type === 'start');
    
    // 3. Execute graph
    await this.executeNode(startNode.id);
    
    // 4. Return final state
    return {
      success: true,
      output: this.state.get('output'),
      logs: this.state.getLogs()
    };
  }
  
  private async executeNode(nodeId: string): Promise<void> {
    const node = this.workflow.nodes.find(n => n.id === nodeId);
    const executor = this.executors.get(node.type);
    
    // Execute node
    const result = await executor.execute(node, this.state);
    
    // Update state
    this.state.set(nodeId, result);
    
    // Find next nodes
    const nextNodes = this.getNextNodes(nodeId, result);
    
    // Execute next nodes
    for (const nextNodeId of nextNodes) {
      await this.executeNode(nextNodeId);
    }
  }
  
  private getNextNodes(nodeId: string, result: any): string[] {
    const edges = this.workflow.edges.filter(e => e.source === nodeId);
    
    // Handle conditional routing (if/else, while, etc.)
    // ...
    
    return edges.map(e => e.target);
  }
}
```

---

### 4. File Structure

```
agent-builder-clone/
├── packages/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Canvas/
│   │   │   │   │   ├── Canvas.tsx
│   │   │   │   │   ├── NodePalette.tsx
│   │   │   │   │   ├── Inspector.tsx
│   │   │   │   │   └── Controls.tsx
│   │   │   │   ├── Nodes/
│   │   │   │   │   ├── StartNode.tsx
│   │   │   │   │   ├── AgentNode.tsx
│   │   │   │   │   ├── IfElseNode.tsx
│   │   │   │   │   ├── WhileNode.tsx
│   │   │   │   │   ├── TransformNode.tsx
│   │   │   │   │   ├── FileSearchNode.tsx
│   │   │   │   │   ├── GuardrailsNode.tsx
│   │   │   │   │   ├── MCPNode.tsx
│   │   │   │   │   ├── HumanApprovalNode.tsx
│   │   │   │   │   ├── SetStateNode.tsx
│   │   │   │   │   ├── NoteNode.tsx
│   │   │   │   │   └── EndNode.tsx
│   │   │   │   ├── Inspectors/
│   │   │   │   │   └── [one for each node type]
│   │   │   │   ├── Preview/
│   │   │   │   │   ├── PreviewMode.tsx
│   │   │   │   │   ├── ExecutionViewer.tsx
│   │   │   │   │   └── DebugPanel.tsx
│   │   │   │   ├── Templates/
│   │   │   │   │   └── TemplateGallery.tsx
│   │   │   │   └── ui/
│   │   │   │       └── [shadcn components]
│   │   │   ├── store/
│   │   │   │   ├── workflowStore.ts
│   │   │   │   ├── executionStore.ts
│   │   │   │   └── uiStore.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useWorkflow.ts
│   │   │   │   ├── useExecution.ts
│   │   │   │   └── useOllama.ts
│   │   │   ├── lib/
│   │   │   │   ├── api.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── utils.ts
│   │   │   ├── types/
│   │   │   │   ├── workflow.ts
│   │   │   │   ├── nodes.ts
│   │   │   │   └── execution.ts
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── workflows.ts
│   │   │   │   ├── executions.ts
│   │   │   │   ├── templates.ts
│   │   │   │   └── models.ts
│   │   │   ├── engine/
│   │   │   │   ├── WorkflowExecutor.ts
│   │   │   │   ├── ExecutionState.ts
│   │   │   │   ├── executors/
│   │   │   │   │   ├── NodeExecutor.ts (interface)
│   │   │   │   │   ├── StartExecutor.ts
│   │   │   │   │   ├── AgentExecutor.ts
│   │   │   │   │   ├── IfElseExecutor.ts
│   │   │   │   │   ├── WhileExecutor.ts
│   │   │   │   │   ├── TransformExecutor.ts
│   │   │   │   │   ├── FileSearchExecutor.ts
│   │   │   │   │   ├── GuardrailsExecutor.ts
│   │   │   │   │   ├── MCPExecutor.ts
│   │   │   │   │   ├── HumanApprovalExecutor.ts
│   │   │   │   │   └── SetStateExecutor.ts
│   │   │   │   └── GraphResolver.ts
│   │   │   ├── services/
│   │   │   │   ├── OllamaService.ts
│   │   │   │   ├── VectorStoreService.ts
│   │   │   │   ├── GuardrailsService.ts
│   │   │   │   └── MCPService.ts
│   │   │   ├── db/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── client.ts
│   │   │   ├── cel/
│   │   │   │   └── evaluator.ts
│   │   │   ├── types/
│   │   │   │   └── [shared types]
│   │   │   ├── utils/
│   │   │   │   └── [utilities]
│   │   │   └── server.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/
│       ├── src/
│       │   ├── types/
│       │   │   ├── workflow.ts
│       │   │   ├── nodes.ts
│       │   │   └── execution.ts
│       │   └── schemas/
│       │       └── [zod schemas]
│       └── package.json
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
├── docs/
│   ├── getting-started.md
│   ├── node-reference.md
│   ├── api-reference.md
│   └── deployment.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── package.json (root)
├── pnpm-workspace.yaml
├── .gitignore
├── .env.example
└── README.md
```

---

## Environment Configuration

### Backend `.env`
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agentbuilder
REDIS_URL=redis://localhost:6379

# Ollama
OLLAMA_API_URL=http://localhost:11434

# ChromaDB
CHROMA_API_URL=http://localhost:8000

# Server
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`
```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

---

## Development Commands

### Install Dependencies
```bash
pnpm install
```

### Development
```bash
# Run everything
pnpm dev

# Frontend only
pnpm dev:frontend

# Backend only
pnpm dev:backend
```

### Build
```bash
# Build all
pnpm build

# Build specific package
pnpm build:frontend
pnpm build:backend
```

### Testing
```bash
# Run all tests
pnpm test

# Unit tests
pnpm test:unit

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

### Database
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

---

## Success Metrics

### Week 1
- [ ] Canvas renders with drag-and-drop
- [ ] Can create 3 node types (Start, Agent, End)
- [ ] Workflows save/load from JSON

### Week 2
- [ ] Workflows execute with Ollama
- [ ] Streaming responses work
- [ ] Debug panel shows execution

### Week 3
- [ ] All 11 node types implemented
- [ ] Complex workflows execute correctly
- [ ] CEL expressions work

### Week 4
- [ ] Professional UI polish
- [ ] Preview mode functional
- [ ] Undo/redo works

### Week 5
- [ ] 6 templates available
- [ ] Export to JSON/code works
- [ ] Docker deployment ready

### Week 6
- [ ] Test coverage >80%
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] **v1.0 RELEASE** 🚀

---

## Risk Mitigation

### Technical Risks

**Risk**: CEL expression evaluation is complex  
**Mitigation**: Use cel-js library or fallback to safe JavaScript eval with restricted scope

**Risk**: Ollama integration may have limitations  
**Mitigation**: Abstract LLM interface, could swap providers if needed

**Risk**: Large workflows may cause performance issues  
**Mitigation**: Implement virtualization for canvas, lazy loading, pagination

**Risk**: Vector store setup complexity  
**Mitigation**: Provide Docker compose with ChromaDB pre-configured

### Schedule Risks

**Risk**: Scope creep adding features  
**Mitigation**: Stick to MVP feature set, maintain backlog for v2.0

**Risk**: Underestimating node executor complexity  
**Mitigation**: Build simplest version first, iterate based on tests

**Risk**: UI polish takes longer than expected  
**Mitigation**: Use shadcn/ui for consistent components, don't reinvent

---

## Post-MVP Roadmap (v2.0+)

### Phase 7: Advanced Features
- [ ] Multi-user collaboration (real-time)
- [ ] Workflow versioning and branching
- [ ] A/B testing workflows
- [ ] Analytics dashboard
- [ ] Cost tracking (local compute)
- [ ] Workflow marketplace

### Phase 8: Enterprise Features
- [ ] RBAC (role-based access control)
- [ ] SSO integration
- [ ] Audit logs
- [ ] Workflow approvals
- [ ] SLA monitoring
- [ ] Custom branding

### Phase 9: Platform Extensions
- [ ] Plugin system for custom nodes
- [ ] Visual regression testing
- [ ] Performance profiling
- [ ] Cloud sync (optional)
- [ ] Mobile app
- [ ] CLI tool

---

**Status**: Ready to Begin  
**Next Action**: Initialize Phase 1, Day 1 tasks  
**Team**: Solo developer (adjust timeline for team)
