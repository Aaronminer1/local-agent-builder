# Agentic Signal - Local Agent Builder Setup

## Overview

**Agentic Signal** is an open-source visual AI workflow automation platform that provides a drag-and-drop interface for building agentic workflows with **local LLM support** (via Ollama). This is a clone-like alternative to OpenAI's Agent Builder that runs entirely on your local machine without cloud dependencies.

## Key Features

### 🎯 Visual Workflow Builder
- **Drag & Drop Interface** - Built with React Flow for intuitive workflow design
- **Node-Based Architecture** - Connect data sources, AI processors, and outputs seamlessly
- **Real-time Execution** - See workflows run in real-time with live data flow

### 🧠 Local AI Intelligence
- **Ollama Integration** - Run AI models locally (LLaMA, Gemma, etc.)
- **Tool Calling** - AI agents can execute functions and access external APIs
- **Structured Output** - JSON schema validation for reliable AI responses
- **Conversation Memory** - Maintain context across workflow executions

### 🔗 Rich Integrations
- Discord, Slack, Notion, Airtable (coming soon)
- Gmail integration via Google APIs
- Custom tools and functions

## Architecture

```
agentic-signal/
├── client/          # React + Vite frontend with React Flow
├── server/          # Deno backend (GraphQL server)
├── shared/          # Shared types and utilities
├── docs/            # Docusaurus documentation
└── src-tauri/       # Desktop app wrapper (Tauri)
```

## Technology Stack

- **Frontend**: React 19, React Flow, Material UI, Vite
- **Backend**: Deno, GraphQL
- **Desktop**: Tauri (Rust-based)
- **AI**: Ollama (local LLM runtime)
- **Build Tools**: Bun, TypeScript
- **Validation**: Zod, AJV
- **Testing**: Playwright

## Comparison with OpenAI Agent Builder

| Feature | OpenAI Agent Builder | Agentic Signal |
|---------|---------------------|----------------|
| Visual Workflow | ✅ | ✅ |
| Node-Based Design | ✅ | ✅ |
| AI Integration | GPT-4/5 (Cloud) | Ollama (Local) |
| Privacy | Cloud-based | 100% Local |
| Cost | API charges | Free (local) |
| Customization | Limited | Full control |
| Offline Mode | ❌ | ✅ |
| Open Source | ❌ | ✅ (AGPL v3) |

## Installation Steps

### Prerequisites

1. **Bun** (already installed) - JavaScript runtime
2. **Deno** (already installed) - TypeScript/JavaScript runtime
3. **Ollama** (needs installation) - Local LLM runtime
4. **Rust** (optional, for building desktop app) - Systems programming language

### Install Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model (e.g., LLaMA 3.1)
ollama pull llama3.1

# Or pull a smaller model for testing
ollama pull llama3.2:3b
```

### Setup Agentic Signal

```bash
# Navigate to project
cd ~/agentic-signal

# Install dependencies
bun install
cd client && bun install
cd ..

# Build client
bun run client:build

# Run development server (requires Deno in PATH)
export PATH="$HOME/.deno/bin:$PATH"
bun run server:dev
```

### Development Commands

```bash
# Client development
bun run client:dev          # Start Vite dev server
bun run client:build        # Build client for production
bun run client:preview      # Preview production build

# Server development
bun run server:dev          # Start Deno GraphQL server
bun run server:build        # Compile server binary

# Desktop app (Linux)
bun run dev:linux           # Run Tauri desktop app in dev mode
bun run build:linux         # Build desktop app for Linux

# Linting
bun run lint                # Run ESLint
bun run lint:fix            # Fix ESLint issues
```

## Node Types Available

Based on the OpenAI Agent Builder documentation, Agentic Signal should support:

### Core Nodes
- **Start Node** - Define workflow inputs
- **Agent Node** - AI agent with instructions and tools
- **Note Node** - Comments and documentation

### Tool Nodes
- **File Search** - Vector store retrieval
- **Guardrails** - Input validation and safety checks
- **MCP (Model Context Protocol)** - External tool integrations

### Logic Nodes
- **If/Else** - Conditional branching
- **While Loop** - Iterative processing
- **Human Approval** - Human-in-the-loop workflows

### Data Nodes
- **Transform** - Data reshaping (object → array, etc.)
- **Set State** - Global variable management

## Configuration

### Ollama Setup

1. Start Ollama service:
```bash
ollama serve
```

2. Configure Agentic Signal to use Ollama endpoint (typically `http://localhost:11434`)

### Environment Variables

Create `.env` files in client and server directories:

**client/.env**:
```
VITE_API_URL=http://localhost:8000/graphql
VITE_OLLAMA_URL=http://localhost:11434
```

**server/.env**:
```
PORT=8000
OLLAMA_HOST=http://localhost:11434
```

## Usage Guide

### Creating Your First Workflow

1. **Start the Application**
   - Run `bun run client:dev` and `bun run server:dev` in separate terminals
   - Open browser to `http://localhost:5173`

2. **Add Start Node**
   - Defines inputs to your workflow
   - Configure input variables

3. **Add Agent Node**
   - Select Ollama model (e.g., llama3.1)
   - Write agent instructions
   - Configure tools if needed

4. **Connect Nodes**
   - Drag connections between nodes
   - Data flows from one node to the next

5. **Test & Debug**
   - Use preview mode to test workflow
   - Monitor real-time execution
   - Debug with node outputs

### Example Workflow: Q&A Agent

```
[Start Node] → [Agent Node: Question Classifier]
                    ↓
           [If/Else: Route by Type]
              ↙            ↘
    [Agent: Q&A]    [Agent: Research]
              ↘            ↙
            [Transform: Format]
                    ↓
               [Output]
```

## Extending Agentic Signal

### Adding New Tools

See `ADD_NEW_TOOLS.md` in the project for detailed instructions.

Basic steps:
1. Create tool definition in `shared/types/tools.ts`
2. Implement tool logic in `server/tools/`
3. Add tool UI component in `client/components/nodes/`
4. Register tool in tool registry

### Custom Node Types

1. Define node schema in `shared/types/nodes.ts`
2. Create node component in `client/components/nodes/`
3. Implement node executor in `server/executors/`
4. Add to node palette

## Troubleshooting

### Ollama Connection Issues
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
pkill ollama
ollama serve
```

### Build Errors
```bash
# Clean and rebuild
bun run clean:bin
rm -rf node_modules client/node_modules
bun install
cd client && bun install
```

### Port Already in Use
```bash
# Kill process on port 8000 (server)
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173 (client)
lsof -ti:5173 | xargs kill -9
```

## Resources

- **Documentation**: https://code-forge-temple.github.io/agentic-signal/
- **GitHub**: https://github.com/code-forge-temple/agentic-signal
- **Discord**: https://discord.gg/HZPEbJM8
- **Reddit**: r/AgenticSignal

## License

Dual License:
- **AGPL v3** - Free for personal, educational, non-commercial use
- **Commercial License** - Required for business/SaaS use

## Next Steps

1. ✅ Install Ollama
2. ✅ Pull LLM models
3. ✅ Start development servers
4. 🔨 Create your first workflow
5. 🎯 Explore example workflows
6. 🚀 Build custom tools and integrations

---

*Last Updated: October 9, 2025*
