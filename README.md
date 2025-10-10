# Local Agent Builder Project

> A complete local alternative to OpenAI's Agent Builder using open-source tools

## 🎯 Project Overview

This project provides a **fully local, open-source alternative** to OpenAI's Agent Builder. Build sophisticated AI agent workflows using a visual drag-and-drop interface, powered by local LLMs via Ollama - no cloud dependencies, no API costs, complete privacy.

## 📁 Project Structure

```
local-agent-builder/
├── agentic-signal/                      # Main application (cloned from code-forge-temple)
│   ├── client/                          # React + Vite frontend
│   ├── server/                          # Deno GraphQL backend
│   ├── shared/                          # Shared TypeScript types
│   ├── docs/                            # Docusaurus documentation site
│   └── src-tauri/                       # Desktop app wrapper (Tauri)
│
├── openai-agent-builder-docs.md         # Complete OpenAI Agent Builder documentation
├── agentic-signal-setup.md              # Setup and installation guide
├── agent-builder-clone-summary.md       # Project summary and comparison
└── README.md                            # This file
```

## ✨ Key Features

### Visual Workflow Builder
- 🎨 Drag-and-drop canvas built with React Flow
- 🔗 Node-based architecture for composing workflows
- 👁️ Real-time execution and debugging
- 📊 Live data flow visualization

### Local AI Intelligence
- 🤖 **Ollama Integration** - Run LLaMA, Gemma, and other models locally
- 🛠️ **Tool Calling** - AI agents can execute functions and access APIs
- 📝 **Structured Output** - JSON schema validation for reliability
- 💭 **Conversation Memory** - Maintain context across executions
- 🔒 **100% Private** - All processing happens on your machine

### Rich Node Library
- **Core**: Start, Agent, Note nodes
- **Tools**: File Search, Guardrails, MCP integrations
- **Logic**: If/Else, While loops, Human Approval
- **Data**: Transform, Set State for data manipulation

## 🚀 Quick Start

### Prerequisites

All dependencies are already installed:
- ✅ Bun (v1.2.22) - JavaScript runtime
- ✅ Deno (v2.5.3) - TypeScript/JavaScript runtime  
- ✅ Ollama - Local LLM runtime
- ✅ LLaMA 3.2 (3B) model downloaded

### Running the Application

**Terminal 1 - Backend Server:**
```bash
cd ~/vscode_Projects/local-agent-builder/agentic-signal
export PATH="$HOME/.deno/bin:$PATH"
bun run server:dev
```

**Terminal 2 - Frontend:**
```bash
cd ~/vscode_Projects/local-agent-builder/agentic-signal
bun run client:dev
```

**Access the app at:** http://localhost:5173

### Verify Ollama

```bash
# List installed models
ollama list

# Test a model
ollama run llama3.2:3b "Hello! Please introduce yourself."
```

## 📚 Documentation

1. **[OpenAI Agent Builder Docs](./openai-agent-builder-docs.md)** - Complete reference documentation from OpenAI
2. **[Setup Guide](./agentic-signal-setup.md)** - Detailed installation and configuration instructions
3. **[Project Summary](./agent-builder-clone-summary.md)** - Feature comparison and architecture overview
4. **[Online Docs](https://code-forge-temple.github.io/agentic-signal/)** - Official Agentic Signal documentation

## 🎨 Creating Your First Workflow

### Example: Simple Q&A Agent

1. **Add Start Node** - Define user input
2. **Add Agent Node** - Configure with:
   - Model: `llama3.2:3b`
   - Instructions: "You are a helpful assistant. Answer questions clearly and concisely."
3. **Connect Nodes** - Drag from Start to Agent
4. **Test** - Click Preview and enter a question

### Example: Homework Helper (from OpenAI docs)

```
[Start: User Question]
    ↓
[Agent: Rewrite Question]
    ↓
[Agent: Classify Question Type]
    ↓
[If/Else: Route by Type]
    ├─→ [Agent: Q&A Handler]
    └─→ [Agent: Research Handler]
         ↓
    [Transform: Format Output]
         ↓
    [Output]
```

## 🔧 Development Commands

### Client (Frontend)
```bash
bun run client:dev          # Development server
bun run client:build        # Production build
bun run client:preview      # Preview production build
```

### Server (Backend)
```bash
bun run server:dev          # Development server
bun run server:build        # Compile binary
```

### Desktop App (Optional)
```bash
bun run dev:linux           # Run desktop app (dev)
bun run build:linux         # Build desktop app
```

### Maintenance
```bash
bun run lint                # Check code quality
bun run lint:fix            # Auto-fix issues
```

## 🆚 Comparison with OpenAI Agent Builder

| Feature | OpenAI Agent Builder | This Project (Agentic Signal) |
|---------|---------------------|-------------------------------|
| Visual Workflow | ✅ | ✅ |
| Node Types | ✅ All types | ✅ All types |
| AI Models | GPT-4/5 (Cloud) | Any Ollama model (Local) |
| Privacy | ❌ Cloud processing | ✅ 100% Local |
| Cost | 💰 Per API call | ✅ Free |
| Internet Required | ✅ Yes | ❌ Works offline |
| Open Source | ❌ Proprietary | ✅ AGPL v3 |
| Customization | Limited | Full control |
| Data Storage | Cloud | Your machine |

## 🔐 Privacy & Security

- **No cloud dependencies** - Everything runs locally
- **No telemetry** - Your data never leaves your machine
- **Open source** - Audit the entire codebase
- **Local models** - AI processing happens on your hardware
- **Offline capable** - No internet required after setup

## 🎓 Learning Resources

### Tutorials
- [Adding New Tools](./agentic-signal/ADD_NEW_TOOLS.md)
- [Contributing Guide](./agentic-signal/CONTRIBUTING.md)
- [Node Reference](https://code-forge-temple.github.io/agentic-signal/docs/nodes/overview)

### Community
- **Discord**: https://discord.gg/HZPEbJM8
- **Reddit**: r/AgenticSignal
- **GitHub**: https://github.com/code-forge-temple/agentic-signal

## 🛠️ Advanced Usage

### Adding Custom Nodes

1. Define node type in `shared/types/nodes.ts`
2. Create component in `client/components/nodes/`
3. Implement executor in `server/executors/`
4. Register in node palette

### Integrating External APIs

Use MCP (Model Context Protocol) nodes to connect:
- Gmail, Google Calendar
- Discord, Slack
- Notion, Airtable
- Custom REST APIs

### Building Desktop App

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Build for Linux
bun run build:linux

# Find the built app in:
# src-tauri/target/release/bundle/
```

## 🐛 Troubleshooting

### Ports Already in Use
```bash
# Kill frontend (port 5173)
lsof -ti:5173 | xargs kill -9

# Kill backend (port 8000)
lsof -ti:8000 | xargs kill -9

# Kill Ollama (port 11434)
lsof -ti:11434 | xargs kill -9
```

### Ollama Issues
```bash
# Check status
systemctl status ollama

# Restart service
sudo systemctl restart ollama

# Test connection
curl http://localhost:11434/api/tags
```

### Build Errors
```bash
cd ~/vscode_Projects/local-agent-builder/agentic-signal
rm -rf node_modules client/node_modules
bun install
cd client && bun install
```

## 🎯 Use Cases

- **Customer Support Automation** - Build chatbots that route queries
- **Research Assistants** - Multi-step research workflows
- **Data Processing Pipelines** - Transform and analyze data
- **Content Generation** - Blog posts, summaries, reports
- **Code Review Agents** - Automated code analysis
- **Email Automation** - Smart email routing and responses

## 📊 Performance

### Recommended Models

- **LLaMA 3.2 (3B)** ⚡ - Fast, good for testing (currently installed)
- **LLaMA 3.1 (8B)** ⚖️ - Balanced quality/speed
- **LLaMA 3.3 (70B)** 🚀 - Best quality (requires powerful GPU)

**Your system**: NVIDIA GPU detected - GPU acceleration enabled!

### Download Additional Models

```bash
# Faster, smaller model
ollama pull llama3.2:1b

# Better quality
ollama pull llama3.1:8b

# Code-specialized
ollama pull codellama:7b

# Multi-modal (vision)
ollama pull llava:7b
```

## 🚧 Roadmap

- [ ] Implement all OpenAI Agent Builder node types
- [ ] Add vector database integration for RAG
- [ ] Build template library
- [ ] Create workflow marketplace
- [ ] Add collaboration features
- [ ] Implement workflow versioning
- [ ] Build mobile app

## 📝 License

**Agentic Signal** uses a dual-license model:
- **AGPL v3** - Free for personal, educational, non-commercial use
- **Commercial License** - Required for business/SaaS applications

See [LICENSE.md](./agentic-signal/LICENSE.md) for details.

## 🙏 Credits

- **Agentic Signal** by [Code Forge Temple](https://github.com/code-forge-temple)
- **OpenAI Agent Builder** documentation and concepts
- **React Flow** for the visual canvas
- **Ollama** for local LLM runtime
- **Meta** for LLaMA models

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./agentic-signal/CONTRIBUTING.md)

Easy ways to contribute:
- 🛠️ Add new tool integrations
- 🐛 Report bugs
- 📝 Improve documentation  
- 💡 Suggest features

## 📞 Support

- **Documentation Issues**: Create an issue in this repo
- **Agentic Signal Issues**: https://github.com/code-forge-temple/agentic-signal/issues
- **Discord**: https://discord.gg/HZPEbJM8
- **Email**: See GitHub profile

---

**Built with ❤️ for the open-source AI community**

*Last Updated: October 9, 2025*
