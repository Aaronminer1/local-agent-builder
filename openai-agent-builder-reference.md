# Complete OpenAI Agent Builder Documentation
**Captured**: October 9, 2025  
**Purpose**: Offline reference for building a local clone of OpenAI's Agent Builder

---

## Table of Contents

1. [Overview](#overview)
2. [Agents & AgentKit](#agents--agentkit)
3. [Agent Builder](#agent-builder)
4. [Node Reference](#node-reference)
5. [ChatKit Deployment](#chatkit-deployment)
6. [Safety & Security](#safety--security)
7. [Agents SDK](#agents-sdk)
8. [Implementation Architecture](#implementation-architecture)

---

## Overview

### What are Agents?

Agents are systems that intelligently accomplish tasks—from simple goals to complex, open-ended workflows. OpenAI provides:
- **Models** with agentic strengths
- **Toolkit** for agent creation and deployment (AgentKit)
- **Dashboard features** for monitoring and optimizing agents

### Three-Step Process

1. **Design** a workflow in Agent Builder (visual canvas)
2. **Publish** your workflow (creates versioned object with ID)
3. **Deploy** your workflow (ChatKit integration or Agents SDK)

---

## Agents & AgentKit

### AgentKit Components

AgentKit is a modular toolkit with three main pillars:

#### 1. Build
- **Tool**: Agent Builder
- **Description**: Visual canvas for creating agent workflows
- **Features**: 
  - Drag-and-drop nodes
  - Starter templates
  - Brings models, tools, knowledge, and logic together

#### 2. Deploy
- **Tool**: ChatKit
- **Description**: Embed agent workflows in your frontend
- **Features**:
  - Customizable UI component
  - Pass workflow ID to embed
  - Hosted backend by OpenAI

#### 3. Optimize
- **Tool**: Evaluation features
- **Description**: Build robust evals to improve performance
- **Features**:
  - Trace grading
  - Dataset management
  - Prompt optimizer

### Building an Agent - Component Table

| Goal | What to Use | Description |
|------|-------------|-------------|
| Build an agent workflow | **Agent Builder** | Visual canvas for creating agent workflows. Brings models, tools, knowledge, and logic all into one place. |
| Connect to LLMs | **OpenAI models** | Core intelligence capable of reasoning, making decisions, and processing data. Select your model in Agent Builder. |
| Equip your agent | **Tools, guardrails** | Access to third-party services with connectors and MCP, search vector stores, and prevent misuse. |
| Provide knowledge and memory | **Vector stores, file search, embeddings** | External and persistent knowledge for more relevant information for your use case, hosted by OpenAI. |
| Add control-flow logic | **Logic nodes** | Custom logic for how agents work together, handle conditions, and route to other agents. |
| Write your own code | **Agents SDK** | Build agentic applications, with tools and orchestration, instead of using Agent Builder as the backend. |

### Deploying Agents

| Goal | What to Use | Description |
|------|-------------|-------------|
| Embed your agent | **ChatKit** | Customizable UI component. Paste your workflow ID to embed your agent workflow in your product. |
| Get more customization | **Advanced ChatKit** | Run ChatKit on your own infrastructure. Use widgets and connect to any agentic backend with SDKs. |

### Optimizing Agents

| Goal | What to Use | Description |
|------|-------------|-------------|
| Evaluate agent performance | **Evals features** | Full evaluation platform, including support for external model evaluation. |
| Automate trace grading | **Trace grading** | Develop, deploy, monitor, and improve agents. |
| Build and track evals | **Datasets** | A collaborative interface to build agent-level evals in a test environment. |
| Optimize prompts | **Prompt optimizer** | Measure agent performance, identify areas for improvement, and refine your agents. |

---

## Agent Builder

### What is Agent Builder?

Agent Builder is a **visual canvas** for building multi-step agent workflows. It provides:
- Template library for common patterns
- Drag-and-drop node interface
- Typed inputs and outputs
- Live preview and debugging
- Export to ChatKit or SDK code

### Agents and Workflows

A **workflow** is a combination of:
- **Agents** - AI models with instructions
- **Tools** - External capabilities
- **Control-flow logic** - Conditional routing, loops

### Key Features

#### 1. Compose with Nodes
- Insert and connect nodes to create workflow
- Each connection becomes a **typed edge**
- Click node to configure inputs/outputs
- Observe data contracts between steps

#### 2. Examples and Templates

**Pre-built Templates:**
- Data enrichment
- Planning helper
- Customer service
- Structured Data Q&A
- Document comparison
- Internal knowledge assistant

**Homework Helper Example:**
```
[Start: User Question]
    ↓
[Agent: Rewrite for Clarity]
    ↓
[Agent: Classify (Q&A vs Research)]
    ↓
[If/Else: Route by Type]
    ├─→ [Agent: Q&A Handler]
    └─→ [Agent: Research Handler]
         ↓
    [Transform: Format Response]
         ↓
    [End]
```

#### 3. Preview and Debug
- **Preview** feature for testing
- Attach sample files
- Observe execution of each node
- Step-by-step debugging

#### 4. Evaluate Your Workflow
- Run **trace graders** inside Agent Builder
- Click "Evaluate" in top navigation
- Select traces and run custom graders
- Assess overall workflow performance

### Publishing Workflows

- **Auto-saves** as you work
- **Publish** to create major version snapshot
- Use in ChatKit with workflow ID
- Create new versions or specify old versions

### Deployment Options

#### Option 1: ChatKit (Recommended)
- Follow ChatKit quickstart
- Pass in workflow ID
- Embed in your application
- OpenAI handles backend scaling

#### Option 2: Advanced Integration
- Copy workflow code
- Run ChatKit on your infrastructure
- Use Agents SDK for customization
- Full control over deployment

---

## Node Reference

### Node Categories

1. **Core Nodes** - Basic building blocks
2. **Tool Nodes** - External capabilities
3. **Logic Nodes** - Control flow
4. **Data Nodes** - Data manipulation

---

### Core Nodes

#### Start Node
**Purpose**: Define inputs to your workflow

**Features**:
- Append user input to conversation history
- Expose `input_as_text` variable (text contents of input)
- All chat start nodes have `input_as_text` as input variable
- Can add **state variables**

**Configuration**:
- Input variables: `input_as_text` (string)
- State variables: Custom defined

**Use Case**: Entry point for every workflow

---

#### Agent Node
**Purpose**: Call the model with instructions and tools

**Features**:
- Define instructions for the model
- Select model (GPT-5, GPT-5-mini, etc.)
- Attach tools
- Configure model parameters
- Add evaluations

**Configuration**:
- **Name**: Custom agent name
- **Instructions**: Model behavior prompts
- **Include chat history**: Toggle
- **Model**: GPT-5, GPT-5-mini, etc.
- **Reasoning effort**: low/medium/high
- **Tools**: File search, web search, MCP, etc.
- **Output format**: Text, JSON, structured

**Best Practices**:
- Keep each agent **well-defined in scope**
- Use separate agents for different tasks
- Example: One agent rewrites queries, another classifies them
- Pipe output from previous steps as context

**Use Cases**:
- Query rewriting
- Classification
- Content generation
- Analysis and reasoning

---

#### Note Node
**Purpose**: Leave comments and explanations

**Features**:
- Doesn't affect workflow execution
- Just for documentation
- Helps team understand workflow

**Use Case**: Documenting complex logic or explaining decisions

---

#### End Node
**Purpose**: Terminate workflow execution

**Features**:
- Marks completion of workflow
- Can have multiple end nodes (different paths)

**Use Case**: Explicit workflow termination

---

### Tool Nodes

#### File Search Node
**Purpose**: Retrieve data from vector stores

**Features**:
- Search by vector store ID
- Add search query
- Use variables from previous nodes
- Semantic search capabilities

**Configuration**:
- **Vector Store ID**: OpenAI-hosted store
- **Query**: What to search for
- **Variables**: Output from previous nodes

**Integration**:
- Uses OpenAI vector stores
- Supported file types: PDF, TXT, MD, DOCX, etc.
- Alternative: Use MCP for external storage

**Use Cases**:
- Knowledge base retrieval
- Document search
- RAG (Retrieval-Augmented Generation)

---

#### Guardrails Node
**Purpose**: Monitor for unwanted inputs and outputs

**Features**:
- PII detection
- Jailbreak prevention
- Hallucination detection
- Custom safety rules

**Configuration**:
- **Input to check**: Previous node output
- **Guardrail types**: PII, jailbreak, custom
- **On failure**: End workflow or retry

**Behavior**:
- **Pass/fail** by default
- Test output from previous node
- Define next steps on failure

**Recommendations on Failure**:
1. End the workflow
2. Return to previous step with reminder
3. Route to human approval

**Use Cases**:
- Content moderation
- Safety enforcement
- Compliance checking

---

#### MCP (Model Context Protocol) Node
**Purpose**: Call third-party tools and services

**Features**:
- Connect with OpenAI connectors
- Third-party MCP servers
- Custom server support
- Read/search data in external apps

**Supported Integrations**:
- Gmail
- Google Calendar
- Zapier
- Slack
- Custom APIs

**Configuration**:
- **Connector**: OpenAI or third-party
- **Server**: MCP server URL
- **Operation**: Read, write, search, etc.
- **Parameters**: Dynamic from workflow

**Use Cases**:
- Send emails
- Create calendar events
- Trigger automations
- External data access

---

### Logic Nodes

#### If/Else Node
**Purpose**: Add conditional branching

**Features**:
- Use **CEL (Common Expression Language)**
- Create custom expressions
- Multiple condition support
- Route to different paths

**Configuration**:
- **Condition**: CEL expression
- **If path**: Node to execute if true
- **Else path**: Node to execute if false

**Example Expressions**:
```javascript
// Check classification
classification == "Q&A"

// Check string contains
input_as_text.contains("urgent")

// Check number range
priority > 5 && priority < 10

// Complex conditions
(type == "question" && confidence > 0.8) || force_answer
```

**Use Cases**:
- Route by classification
- Handle edge cases
- Conditional processing
- Multi-path workflows

---

#### While Node
**Purpose**: Loop on custom conditions

**Features**:
- Use **CEL expressions**
- Check condition each iteration
- Max iteration limits (safety)
- Loop state management

**Configuration**:
- **Condition**: CEL expression (when to continue)
- **Max iterations**: Safety limit
- **Loop body**: Nodes to execute

**Example**:
```javascript
// Continue while not complete
!task_complete

// Iterate with counter
iteration_count < max_items

// Check for specific state
results.length < target_count
```

**Use Cases**:
- Iterative refinement
- Processing lists
- Retry logic
- Multi-step tasks

---

#### Human Approval Node (User Approval)
**Purpose**: Pause for end-user approval

**Features**:
- Pause workflow execution
- Present data to user
- Accept or reject
- Resume on approval

**Configuration**:
- **Prompt**: Question to ask user
- **Data to show**: Previous node output
- **On approval**: Next node
- **On rejection**: Alternate path

**Example Workflow**:
```
[Agent: Draft Email]
    ↓
[Human Approval: "Send this email?"]
    ├─ Approved → [MCP: Send via Gmail]
    └─ Rejected → [End]
```

**Use Cases**:
- Email sending
- Content publishing
- Critical actions
- Compliance requirements

---

### Data Nodes

#### Transform Node
**Purpose**: Reshape outputs and data structures

**Features**:
- Object → Array conversion
- Array → Object conversion
- Field extraction
- Type enforcement

**Configuration**:
- **Input**: Previous node output
- **Transformation**: JavaScript-like syntax
- **Output schema**: Define structure

**Example Transformations**:
```javascript
// Extract array from object
object.items

// Map array
items.map(i => i.name)

// Filter
items.filter(i => i.active)

// Reshape
{
  id: item.identifier,
  name: item.full_name,
  date: item.created_at
}
```

**Use Cases**:
- Data normalization
- Schema compliance
- Format conversion
- Data cleaning

---

#### Set State Node
**Purpose**: Define global variables for workflow

**Features**:
- Create workflow-scoped variables
- Persist across nodes
- Type validation
- Reference in later nodes

**Configuration**:
- **Variable name**: Identifier
- **Value**: From expression or previous output
- **Type**: String, number, object, array

**Example**:
```javascript
// Store user preference
user_preference = agent_output.preference

// Store intermediate result
search_results = file_search_output

// Accumulate data
all_items = all_items + new_items
```

**Use Cases**:
- Persist data between nodes
- Accumulate results
- Store configuration
- Share state

---

## ChatKit Deployment

### Overview

ChatKit is the framework for embedding agent chat experiences. Two implementation options:

1. **Recommended**: Embed ChatKit with OpenAI-hosted backend
2. **Advanced**: Run ChatKit on your own infrastructure

### Recommended Integration (OpenAI-Hosted)

#### Architecture

```
┌─────────────────────────────┐
│   Your Frontend (React)     │
│   ┌─────────────────────┐   │
│   │  ChatKit Component  │   │
│   └──────────┬──────────┘   │
└──────────────┼──────────────┘
               │ Client Secret
               │
┌──────────────▼──────────────┐
│   Your Backend (Node/Py)    │
│   ┌─────────────────────┐   │
│   │ Create ChatKit      │   │
│   │ Session Endpoint    │   │
│   └──────────┬──────────┘   │
└──────────────┼──────────────┘
               │ API Key + Workflow ID
               │
┌──────────────▼──────────────┐
│   OpenAI ChatKit Service    │
│   ┌─────────────────────┐   │
│   │  Agent Builder      │   │
│   │  Workflow Executor  │   │
│   └─────────────────────┘   │
└─────────────────────────────┘
```

#### Step 1: Create Agent Workflow

1. Design workflow in Agent Builder
2. Publish workflow
3. Copy **workflow ID** (e.g., `wf_68df4b13...`)

#### Step 2: Set Up Backend

Create server endpoint to generate client tokens:

**Python (FastAPI) Example:**
```python
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os

app = FastAPI()
openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

@app.post("/api/chatkit/session")
def create_chatkit_session():
    session = openai.chatkit.sessions.create({
        "workflow": {
            "id": "wf_68df4b13b3588190..." # Your workflow ID
        },
        "user": device_id  # User identifier
    })
    
    return {"client_secret": session.client_secret}
```

**TypeScript (Node.js) Example:**
```typescript
export default async function getChatKitSessionToken(
    deviceId: string
): Promise<string> {
    const response = await fetch(
        "https://api.openai.com/v1/chatkit/sessions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "OpenAI-Beta": "chatkit_beta=v1",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                workflow: {
                    id: "wf_68df4b13b3588190..."
                },
                user: deviceId
            })
        }
    );
    
    const { client_secret } = await response.json();
    return client_secret;
}
```

#### Step 3: Install ChatKit React

```bash
npm install @openai/chatkit-react
```

#### Step 4: Add ChatKit Script

```html
<script
    src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
    async
></script>
```

#### Step 5: Render ChatKit Component

```typescript
import { ChatKit, useChatKit } from '@openai/chatkit-react';

export function MyChat() {
    const { control } = useChatKit({
        api: {
            async getClientSecret(existing) {
                if (existing) {
                    // Implement session refresh
                }
                
                const res = await fetch('/api/chatkit/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const { client_secret } = await res.json();
                return client_secret;
            }
        }
    });
    
    return (
        <ChatKit 
            control={control} 
            className="h-[600px] w-[320px]"
        />
    );
}
```

### Advanced Integration (Self-Hosted)

#### Use Cases
- Custom backend implementation
- On-premise deployment
- Custom authentication
- Special data handling

#### Components
1. **ChatKit Python SDK** - Server-side backend
2. **ChatKit JS SDK** - Frontend integration
3. **Widgets** - UI components
4. **Agents SDK** - Custom agent execution

#### Resources
- [ChatKit Python SDK](https://github.com/openai/chatkit-python)
- [ChatKit JS SDK](https://github.com/openai/chatkit-js)
- [Starter App](https://github.com/openai/openai-chatkit-starter-app)
- [Advanced Samples](https://github.com/openai/openai-chatkit-advanced-samples)

### ChatKit Features

#### 1. Theming & Customization
- Custom CSS
- Brand colors
- Custom fonts
- Layout control

#### 2. Widgets
- Email composer
- Calendar event
- File attachment
- Custom widgets

#### 3. Actions
- Button clicks
- Form submissions
- Custom interactions

#### 4. Resources
- [chatkit.world](https://chatkit.world) - Interactive demo
- [Widget builder](https://widgets.chatkit.studio) - Browse widgets
- [ChatKit playground](https://chatkit.studio/playground) - Try it out
- [Documentation](https://openai.github.io/chatkit-python)

---

## Safety & Security

### Risks in Agent Workflows

1. **Prompt Injection**
   - Users manipulate agent behavior
   - Bypass safety controls
   - Extract system prompts

2. **Data Leakage**
   - PII exposure
   - Confidential data in outputs
   - Cross-user data mixing

3. **Jailbreaking**
   - Bypass content policies
   - Generate harmful content
   - Ignore instructions

4. **Hallucinations**
   - Fabricated information
   - Incorrect facts
   - Misleading responses

### Mitigation Strategies

#### 1. Input Validation
- **Use Guardrails nodes**
- PII detection
- Jailbreak prevention
- Content filtering

#### 2. Secure Prompting
- **Don't use untrusted variables in developer messages**
- Use structured outputs to constrain data flow
- Steer agents with clear guidance and examples
- Validate all user inputs

#### 3. Model Selection
- **Use GPT-5 or GPT-5-mini** for robustness
- Enable reasoning modes
- Set appropriate temperature

#### 4. Human Oversight
- **Keep tool approvals enabled**
- Human approval nodes for critical actions
- Review high-risk operations
- Audit logs

#### 5. Testing & Evaluation
- **Run trace graders**
- Test with adversarial inputs
- Monitor in production
- Continuous evaluation

#### 6. Defense in Depth
- **Combine multiple techniques**
- Guardrails + structured outputs
- Human approval + validation
- Monitoring + logging

### Best Practices Checklist

- [ ] Use Guardrails nodes for all user inputs
- [ ] Never inject untrusted variables directly into prompts
- [ ] Enable structured outputs where possible
- [ ] Use GPT-5/GPT-5-mini for security-critical tasks
- [ ] Keep tool approval enabled
- [ ] Add Human Approval nodes for sensitive actions
- [ ] Run trace graders and evaluations regularly
- [ ] Monitor production workflows
- [ ] Combine multiple security techniques
- [ ] Test with adversarial inputs
- [ ] Audit all workflow changes
- [ ] Document security decisions

---

## Agents SDK

### Overview

The OpenAI Agents SDK provides libraries for building agentic applications programmatically instead of using Agent Builder's visual canvas.

### Availability

**Python SDK:**
- Repository: [openai/openai-agents-python](https://github.com/openai/openai-agents-python)
- Language: Python 3.8+
- Installation: `pip install openai-agents`

**TypeScript SDK:**
- Repository: [openai/openai-agents-js](https://github.com/openai/openai-agents-js)
- Language: TypeScript/JavaScript
- Installation: `npm install openai-agents`

### Features

1. **Agent Creation**
   - Define agents programmatically
   - Configure models, tools, instructions
   - Chain multiple agents

2. **Tool Integration**
   - Custom tool definitions
   - Function calling
   - MCP integration
   - File search

3. **Orchestration**
   - Control flow logic
   - Conditional routing
   - Loops and iterations
   - State management

4. **Streaming**
   - Partial results
   - Real-time updates
   - Token streaming

5. **Tracing**
   - Full execution trace
   - Debug information
   - Performance metrics

### Use Cases

- **Custom backends** not using Agent Builder
- **Programmatic workflows** generated from code
- **Advanced customization** beyond visual builder
- **Integration** with existing systems
- **Automated workflow generation**

### Documentation

Full documentation available at:
- [OpenAI Developers](https://developers.openai.com)
- [Agents Topic](https://developers.openai.com/agents)
- Quickstarts, guides, apps, and demos

---

## Implementation Architecture

### For Building a Local Clone

Based on the documentation, here's the architecture needed to build a local version:

#### Frontend (React + React Flow)

**Components:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── Canvas/              # React Flow canvas
│   │   │   ├── Canvas.tsx
│   │   │   ├── NodePalette.tsx  # Left sidebar
│   │   │   └── Inspector.tsx    # Right panel
│   │   ├── Nodes/               # Node components
│   │   │   ├── StartNode.tsx
│   │   │   ├── AgentNode.tsx
│   │   │   ├── IfElseNode.tsx
│   │   │   ├── WhileNode.tsx
│   │   │   ├── TransformNode.tsx
│   │   │   ├── FileSearchNode.tsx
│   │   │   ├── GuardrailsNode.tsx
│   │   │   ├── MCPNode.tsx
│   │   │   ├── HumanApprovalNode.tsx
│   │   │   ├── SetStateNode.tsx
│   │   │   ├── NoteNode.tsx
│   │   │   └── EndNode.tsx
│   │   ├── Inspector/           # Node configuration
│   │   │   ├── StartInspector.tsx
│   │   │   ├── AgentInspector.tsx
│   │   │   └── ...
│   │   ├── Preview/
│   │   │   ├── PreviewMode.tsx
│   │   │   ├── ExecutionView.tsx
│   │   │   └── DebugPanel.tsx
│   │   └── Templates/
│   │       └── TemplateGallery.tsx
│   ├── store/
│   │   ├── workflowStore.ts     # Zustand store
│   │   ├── executionStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── nodes.ts
│   │   ├── workflow.ts
│   │   └── execution.ts
│   └── services/
│       ├── api.ts               # Backend client
│       └── ollama.ts            # Ollama client
```

**Key Libraries:**
- `@xyflow/react` - Canvas and nodes
- `zustand` - State management
- `react-hook-form` + `zod` - Forms & validation
- `tailwindcss` + `shadcn/ui` - Styling
- `monaco-editor` or `react-ace` - Code editing

#### Backend (Node.js/TypeScript or Python)

**Components:**
```
backend/
├── src/
│   ├── engine/
│   │   ├── executor.ts           # Workflow executor
│   │   ├── nodeExecutors/
│   │   │   ├── startExecutor.ts
│   │   │   ├── agentExecutor.ts
│   │   │   ├── ifElseExecutor.ts
│   │   │   ├── whileExecutor.ts
│   │   │   ├── transformExecutor.ts
│   │   │   ├── fileSearchExecutor.ts
│   │   │   ├── guardrailsExecutor.ts
│   │   │   ├── mcpExecutor.ts
│   │   │   ├── humanApprovalExecutor.ts
│   │   │   └── setStateExecutor.ts
│   │   ├── stateManager.ts       # Global state
│   │   └── graphResolver.ts      # Topological sort
│   ├── llm/
│   │   ├── ollamaClient.ts       # Ollama integration
│   │   ├── streaming.ts          # Stream handling
│   │   └── tools.ts              # Function calling
│   ├── tools/
│   │   ├── vectorStore.ts        # ChromaDB/Qdrant
│   │   ├── guardrails.ts         # Safety checks
│   │   ├── mcp.ts                # MCP client
│   │   └── fileSearch.ts         # Vector search
│   ├── cel/
│   │   └── celEvaluator.ts       # CEL interpreter
│   ├── api/
│   │   ├── workflows.ts          # CRUD endpoints
│   │   ├── execution.ts          # Execute workflow
│   │   └── preview.ts            # Test execution
│   └── server.ts
```

**Key Libraries:**
- `express` or `fastify` - Web framework
- `ollama` - LLM client
- `chromadb` - Vector store
- `zod` - Validation
- `cel-js` or custom - CEL evaluation

#### Shared Types

```typescript
// workflow.ts
interface Workflow {
  id: string;
  name: string;
  version: number;
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

interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

// Node-specific data
interface AgentNodeData {
  name: string;
  instructions: string;
  model: string;
  temperature?: number;
  tools?: string[];
  outputFormat?: 'text' | 'json';
}

interface IfElseNodeData {
  condition: string; // CEL expression
  ifPath: string;    // Node ID
  elsePath: string;  // Node ID
}
```

#### Execution Engine Logic

```typescript
// executor.ts
class WorkflowExecutor {
  async execute(workflow: Workflow, input: any) {
    // 1. Initialize state
    const state = { input_as_text: input, ...workflow.state };
    
    // 2. Topological sort of nodes
    const executionOrder = this.topologicalSort(workflow);
    
    // 3. Execute nodes in order
    for (const nodeId of executionOrder) {
      const node = workflow.nodes.find(n => n.id === nodeId);
      const executor = this.getExecutor(node.type);
      
      // 4. Execute node
      const output = await executor.execute(node, state);
      
      // 5. Update state
      state[nodeId] = output;
      
      // 6. Handle control flow (if/else, while)
      if (node.type === 'ifelse') {
        const nextNode = this.evaluateCondition(node, state);
        // Adjust execution order
      }
    }
    
    return state;
  }
  
  private getExecutor(type: NodeType): NodeExecutor {
    return this.executors[type];
  }
}
```

#### Node Executor Example

```typescript
// agentExecutor.ts
class AgentExecutor implements NodeExecutor {
  constructor(private ollama: OllamaClient) {}
  
  async execute(node: Node, state: Record<string, any>) {
    const data = node.data as AgentNodeData;
    
    // Build prompt from instructions
    const messages = [
      { role: 'system', content: data.instructions },
      { role: 'user', content: state.input_as_text }
    ];
    
    // Call Ollama
    const response = await this.ollama.chat({
      model: data.model,
      messages,
      temperature: data.temperature,
      tools: data.tools,
      format: data.outputFormat === 'json' ? 'json' : undefined
    });
    
    return response.message.content;
  }
}
```

### Tech Stack Recommendation

**Frontend:**
- React 19
- Vite
- React Flow (xyflow)
- Tailwind CSS + shadcn/ui
- Zustand
- React Hook Form + Zod

**Backend:**
- Node.js + TypeScript (or Python + FastAPI)
- Express (or Fastify)
- Ollama (local LLM)
- ChromaDB (vector store)
- Zod (validation)

**Database:**
- PostgreSQL (workflows, metadata)
- ChromaDB (vector embeddings)
- Redis (sessions, cache)

---

## Key Insights for Implementation

### 1. Node System
- Each node type has specific executor
- Nodes communicate via typed edges
- State flows through the graph
- Some nodes modify execution order (if/else, while)

### 2. State Management
- Global workflow state
- Node-specific outputs
- Variables accessible by name
- Scoping rules for transforms

### 3. Execution Model
- Topological sort for order
- Sequential execution (with branches)
- Async node execution
- Error handling at each step

### 4. LLM Integration
- Ollama for local inference
- Support for multiple models
- Function calling for tools
- Streaming for real-time output

### 5. UI/UX Patterns
- Left sidebar: Node palette
- Center: React Flow canvas
- Right sidebar: Node inspector
- Top bar: Actions (save, run, preview, deploy)

### 6. Templates
Pre-built workflows users can start from:
- Data enrichment
- Planning helper
- Customer service
- Structured Q&A
- Document comparison
- Knowledge assistant

---

## Next Steps for Implementation

### Phase 1: Core Canvas (Week 1)
1. Set up React + Vite project
2. Integrate React Flow
3. Create basic Start and Agent nodes
4. Implement node palette and inspector
5. Save/load workflow JSON

### Phase 2: Execution Engine (Week 2)
1. Build workflow executor
2. Implement Start and Agent executors
3. Integrate Ollama
4. Add state management
5. Test simple workflows

### Phase 3: All Nodes (Week 3)
1. Implement all node executors
2. Add CEL expression evaluator
3. Vector store integration
4. Guardrails implementation
5. MCP client

### Phase 4: UI Polish (Week 4)
1. Node inspector for all types
2. Preview mode
3. Debug panel
4. Templates gallery
5. Export functionality

### Phase 5: Deployment (Week 5)
1. JSON export/import
2. API generation
3. Docker packaging
4. Documentation
5. Testing

---

## Resources

### Official Links
- [Agent Builder](https://platform.openai.com/agent-builder)
- [Documentation](https://platform.openai.com/docs/guides/agent-builder)
- [ChatKit Python SDK](https://github.com/openai/chatkit-python)
- [ChatKit JS SDK](https://github.com/openai/chatkit-js)
- [Agents SDK Python](https://github.com/openai/openai-agents-python)
- [Agents SDK TypeScript](https://openai.github.io/openai-agents-js)

### Learning Resources
- [Cookbook](https://cookbook.openai.com)
- [Forum](https://community.openai.com)
- [chatkit.world](https://chatkit.world) - Demo
- [Widget Builder](https://widgets.chatkit.studio)
- [ChatKit Playground](https://chatkit.studio/playground)

### Code Examples
- [Starter App](https://github.com/openai/openai-chatkit-starter-app)
- [Advanced Samples](https://github.com/openai/openai-chatkit-advanced-samples)

---

**Document Version**: 1.0  
**Last Updated**: October 9, 2025  
**Purpose**: Complete offline reference for building local Agent Builder clone
