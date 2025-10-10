# OpenAI Agent Builder Clone - Project Plan

**Start Date**: October 9, 2025  
**Goal**: Build a production-ready clone of OpenAI's Agent Builder using local LLMs

---

## 🎯 Project Objectives

1. **Clone OpenAI's Agent Builder** - Replicate functionality, not use existing open-source
2. **Use Local Models** - Ollama instead of GPT API
3. **Follow OpenAI's Success** - Use their proven architecture and design patterns
4. **Production Quality** - Not just a prototype, but a real alternative

---

## 📋 Phase 1: Project Setup (Day 1)

### Initialize Project Structure
```bash
cd ~/vscode_Projects/local-agent-builder
mkdir agent-builder-clone
cd agent-builder-clone

# Create project structure
mkdir -p frontend backend shared docs
```

### Frontend Setup
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install

# Install core dependencies
npm install @xyflow/react zustand react-hook-form zod
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install tailwindcss postcss autoprefixer
npm install lucide-react class-variance-authority clsx tailwind-merge
```

### Backend Setup
```bash
cd ../backend
npm init -y
npm install express cors dotenv
npm install @types/express @types/cors typescript ts-node nodemon -D
npm install ollama zod
npm install chromadb  # For vector store
```

### Shared Types
```bash
cd ../shared
npm init -y
npm install zod
```

---

## 🏗️ Phase 2: Core Canvas (Days 2-3)

### Frontend Components to Build

1. **Canvas Component** (`frontend/src/components/Canvas`)
   - React Flow setup
   - Node palette (left sidebar)
   - Canvas area (center)
   - Properties panel (right sidebar)
   - Top toolbar (save, run, preview)

2. **Node Components** (`frontend/src/components/Nodes`)
   - BaseNode (shared styling/logic)
   - StartNode
   - AgentNode
   - NoteNode
   - Custom handles/ports

3. **Store** (`frontend/src/store`)
   - Workflow state (nodes, edges)
   - Execution state
   - UI state (selected node, panel visibility)

### Expected Output
- Working drag-and-drop canvas
- Can add Start and Agent nodes
- Can connect nodes
- Can select and configure nodes

---

## 🤖 Phase 3: Execution Engine (Days 4-5)

### Backend Components to Build

1. **Workflow Executor** (`backend/src/engine/executor.ts`)
   - Parse workflow graph
   - Topological sort (execution order)
   - Execute nodes sequentially
   - Manage state between nodes
   - Error handling

2. **Node Executors** (`backend/src/engine/nodes/`)
   - `start.ts` - Initialize workflow
   - `agent.ts` - Call Ollama with instructions
   - `transform.ts` - Data transformations
   - `setState.ts` - Update global state

3. **Ollama Client** (`backend/src/llm/ollama.ts`)
   - Chat completions
   - Streaming support
   - Function calling
   - Structured outputs (JSON mode)

### Expected Output
- Can execute simple workflows
- Start → Agent → Output
- State variables work
- Ollama integration complete

---

## 🔧 Phase 4: All Node Types (Days 6-8)

### Implement Each Node Type

#### Tool Nodes
- **File Search** - Vector store retrieval
  - Integrate ChromaDB
  - Embedding generation
  - Semantic search
- **Guardrails** - Safety checks
  - PII detection (regex patterns)
  - Jailbreak prevention
  - Content filtering
- **MCP** - External integrations
  - HTTP client
  - Authentication
  - Response parsing

#### Logic Nodes
- **If/Else** - Conditional branching
  - CEL expression evaluation
  - Route to different paths
  - Support multiple conditions
- **While** - Loops
  - Loop condition evaluation
  - Max iteration limit
  - Loop state management
- **Human Approval** - Manual review
  - Pause execution
  - UI for approval/rejection
  - Resume workflow

#### Data Nodes
- **Transform** - Data manipulation
  - Object → Array conversion
  - Field extraction
  - Template rendering
- **Set State** - Global variables
  - Variable assignment
  - Type validation
  - Scoping rules

### Expected Output
- All 10+ node types working
- Each node fully tested
- Documentation for each node

---

## 🎨 Phase 5: UI Polish (Days 9-10)

### Canvas Improvements
- [ ] Auto-layout algorithm
- [ ] Minimap navigation
- [ ] Zoom controls
- [ ] Grid snapping
- [ ] Multi-select
- [ ] Copy/paste nodes
- [ ] Undo/redo stack

### Node Inspector
- [ ] Dynamic form based on node type
- [ ] Model selector dropdown
- [ ] Code editor for instructions
- [ ] Tool selection checkboxes
- [ ] Variable picker for state

### Preview Mode
- [ ] Live execution viewer
- [ ] Step-by-step debugger
- [ ] Variable inspector
- [ ] Execution logs
- [ ] Breakpoint support

---

## 📚 Phase 6: Templates & Examples (Days 11-12)

### Pre-built Workflows

1. **Homework Helper** (from OpenAI docs)
   - Question input
   - Rewrite for clarity
   - Classify (Q&A vs Research)
   - Route and respond

2. **Customer Support**
   - Ticket input
   - Intent classification
   - Route to specialist
   - Generate response
   - Human approval

3. **Content Generator**
   - Topic input
   - Research gathering
   - Outline creation
   - Draft writing
   - Editing pass

4. **Data Analysis**
   - CSV upload
   - Data exploration
   - Insight generation
   - Visualization
   - Report generation

### Template System
- Template gallery UI
- Import template → new workflow
- Export workflow → share template
- Template metadata (name, description, author)

---

## 🚀 Phase 7: Deploy & Export (Days 13-14)

### Export Options

1. **JSON Export**
   - Save workflow as JSON
   - Import from JSON
   - Version management

2. **API Deployment**
   - Generate REST endpoint
   - Input validation
   - Rate limiting
   - Authentication

3. **Standalone Script**
   - Export as Node.js script
   - Self-contained execution
   - CLI interface

4. **Docker Container**
   - Containerize workflow
   - Include Ollama
   - One-command deploy

---

## 🧪 Phase 8: Testing & Quality (Days 15-16)

### Testing Strategy

1. **Unit Tests**
   - Node executors
   - State management
   - Expression evaluation
   - Data transformations

2. **Integration Tests**
   - End-to-end workflows
   - Ollama integration
   - Vector store operations
   - Error scenarios

3. **UI Tests**
   - Canvas interactions
   - Node creation/deletion
   - Edge connections
   - Form validation

### Quality Checks
- [ ] TypeScript strict mode
- [ ] ESLint configured
- [ ] Prettier formatting
- [ ] Error boundaries
- [ ] Loading states
- [ ] Empty states

---

## 📊 Success Metrics

### Functional Requirements
- ✅ All node types from OpenAI docs implemented
- ✅ Workflows execute correctly
- ✅ State management works
- ✅ Ollama integration stable
- ✅ Vector search accurate

### Performance Requirements
- ✅ Canvas renders 100+ nodes smoothly
- ✅ Execution starts within 1 second
- ✅ LLM responses stream in real-time
- ✅ UI responsive (60fps)

### Usability Requirements
- ✅ Intuitive drag-and-drop
- ✅ Clear error messages
- ✅ Helpful documentation
- ✅ Example templates
- ✅ Export/import works

---

## 🛠️ Development Commands

### Frontend
```bash
cd frontend
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Check code
```

### Backend
```bash
cd backend
npm run dev          # Start with nodemon (localhost:3000)
npm run build        # Compile TypeScript
npm run start        # Production server
npm test             # Run tests
```

### Full Stack
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Open http://localhost:5173
```

---

## 📝 Documentation Plan

### User Documentation
- [ ] Getting Started guide
- [ ] Node Reference (all types)
- [ ] Tutorial workflows
- [ ] Best practices
- [ ] FAQ

### Developer Documentation
- [ ] Architecture overview
- [ ] API reference
- [ ] Contributing guide
- [ ] Code style guide
- [ ] Testing guide

---

## 🎯 Milestones

### Milestone 1: MVP (End of Week 2)
- Basic canvas working
- Start + Agent nodes
- Simple workflow execution
- Ollama integration

### Milestone 2: Feature Complete (End of Week 3)
- All node types implemented
- Full execution engine
- Preview mode working
- Basic templates

### Milestone 3: Production Ready (End of Week 4)
- UI polished
- Documentation complete
- Testing done
- Deployment options
- Error handling robust

---

## 🚧 Known Challenges

1. **CEL Expression Evaluation**
   - Need a CEL interpreter for JavaScript
   - Fallback: Use simple JavaScript expressions

2. **Vector Store Performance**
   - Embedding generation can be slow
   - Consider caching strategies

3. **Function Calling**
   - Ollama support varies by model
   - Need fallback for older models

4. **State Serialization**
   - Complex objects in state
   - Need robust JSON handling

---

## 💡 Future Enhancements

- [ ] Multi-user collaboration (real-time)
- [ ] Version control (workflow history)
- [ ] A/B testing workflows
- [ ] Analytics dashboard
- [ ] Custom node plugins
- [ ] Visual regression testing
- [ ] Performance profiling
- [ ] Cloud sync (optional)

---

**Status**: Ready to start Phase 1
**Next Action**: Initialize project structure
