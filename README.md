# 🤖 Local Agent Builder v2.0.0

A visual workflow builder for creating AI agents with **real tool use capabilities** that run entirely on your local machine using Ollama.

![Status](https://img.shields.io/badge/status-production-green) ![Version](https://img.shields.io/badge/version-2.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-yellow)

## ⚡ Quick Start (2 Steps!)

1. **Install Ollama & a model** (one-time setup)
   ```bash
   # Download Ollama from: https://ollama.ai/download
   ollama pull llama3.1:8b
   ```

2. **Run the launcher**
   - **Windows**: Double-click `start.bat`
   - **Mac/Linux**: `./start.sh`
   - **Or**: `npm start`

**That's it!** The launcher auto-installs dependencies, checks everything, and opens your browser. ✨

---

## 📋 Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [Node Types](#-node-types)
- [Model Compatibility](#-model-compatibility)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [Development](#-development)

---

## ✨ Features

### Core Capabilities
- **🎨 Visual Workflow Builder**: Intuitive drag-and-drop interface for creating AI agent workflows
- **🔧 Tool-Enabled Agents**: Local models can use tools to access external information
- **📚 Knowledge Base**: Upload documents (PDF, MD, TXT, CSV, JSON, XML) for agents to search and reference
- **🌐 Web Search**: Agents can fetch current information from Wikipedia API
- **🔊 Text-to-Speech**: Built-in voice output with 15+ voice options (male/female, US/UK/AU accents)
- **💾 State Management**: Pass data between workflow nodes with variables
- **🔄 Control Flow**: If/else conditions, while loops, and user approval gates
- **🤖 Local AI**: Powered by Ollama - **no API keys or cloud dependencies required**
- **🌙 Dark Mode**: Beautiful dark theme for comfortable extended use
- **💬 Chat History**: Agents maintain conversation context across interactions

### Node Types (15+)
- **Core**: Start, Agent, End, Note
- **Tools**: Knowledge Base, Database, File Search, Guardrails, MCP, Voice (TTS)
- **Logic**: If/Else, While Loop, User Approval
- **Data**: Transform, Set State, Prompt Injection
- **External I/O**: External Input, External Output

---

## 📦 Prerequisites

Before installing, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18 or higher)
   - Download: [https://nodejs.org/](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Ollama** (for local AI models)
   - Download: [https://ollama.ai/download](https://ollama.ai/download)
   - Verify installation: `ollama --version`

4. **Python 3.8+** (for Text-to-Speech)
   - Download: [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - Verify installation: `python --version` or `python3 --version`

5. **edge-tts** (Python package for TTS)
   ```bash
   pip install edge-tts
   # or
   pip3 install edge-tts
   ```

### Recommended Models

Install at least one model with tool support:

```bash
# Recommended: Good balance of size and capability
ollama pull llama3.1:8b

# Alternative: Larger, more capable
ollama pull gpt-oss:latest

# Alternative: Smaller, faster
ollama pull llama3.2:latest
```

**Note**: Models with tool support (🔧) can use Knowledge Base, Web Search, and other tools. See [Model Compatibility](#-model-compatibility) for details.

---

## 🔧 Installation

### Quick Start (Automated)

**The easiest way to get started:**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd local-agent-builder-main
   ```

2. **Run the launcher**
   
   **Windows:**
   - Double-click `start.bat`
   - Or run: `npm start`
   
   **Mac/Linux:**
   ```bash
   chmod +x start.sh
   ./start.sh
   # Or: npm start
   ```

**That's it!** The launcher will:
- ✅ Check all prerequisites (Node.js, Python, Ollama)
- ✅ Auto-install missing dependencies (npm packages, edge-tts)
- ✅ Verify Ollama is running and has models
- ✅ Start both frontend and TTS servers
- ✅ Open your browser automatically

### Manual Installation (Advanced)

If you prefer manual control:

**Step 1: Clone the Repository**
```bash
git clone <repository-url>
cd local-agent-builder-main
```

**Step 2: Install Dependencies**
```bash
npm install
cd agent-builder
npm install
cd ..
```

**Step 3: Install Python TTS**
```bash
pip install edge-tts
```

**Step 4: Verify Ollama**
```bash
ollama list
```

---

## 🚀 Running the Application

### Option 1: Automated Launcher (Recommended)

**Windows:**
```bash
start.bat
# Or: npm start
```

**Mac/Linux:**
```bash
./start.sh
# Or: npm start
```

The launcher handles everything automatically!

### Option 2: Manual Start

**Start everything at once:**
```bash
npm run dev
```

**Or start separately (for debugging):**

Terminal 1 - Frontend:
```bash
cd agent-builder
npm run dev
```

Terminal 2 - TTS Server:
```bash
node tts-server.js
```

### Access the Application
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **TTS Server**: [http://localhost:3001](http://localhost:3001)
- **Ollama API**: [http://localhost:11434](http://localhost:11434)

---

## 📖 Usage Guide

### Creating Your First Workflow

1. **Open the Application**
   - Navigate to `http://localhost:5173`
   - You'll see the workflow builder interface

2. **Add Nodes**
   - Drag nodes from the left sidebar onto the canvas
   - Start with: **Start** → **Agent** → **Voice** → **End**

3. **Configure Agent Node**
   - Click on the Agent node
   - Select a model (look for 🔧 icon for tool support)
   - Add instructions (e.g., "You are a helpful assistant")

4. **Connect Nodes**
   - Drag from the output handle of one node to the input handle of another
   - Workflow executes from Start to End following connections

5. **Add Input**
   - Type your message in the input box at the top
   - Example: "What is quantum computing?"

6. **Run Workflow**
   - Click the green **▶ Run** button
   - Watch execution logs in real-time
   - Hear voice output if Voice node is connected

### Using Knowledge Base

1. **Add Knowledge Base Node**
   - Drag "Knowledge Base" from Tools section

2. **Upload Documents**
   - Click the Knowledge Base node
   - Click "Browse & Select Documents"
   - Select PDF, MD, TXT, or other supported files

3. **Connect to Agent**
   - Drag from Knowledge Base **📚 KB** handle to Agent **📚 KB** handle
   - Agent can now search your documents

4. **Ask Questions**
   - Input: "What does the document say about X?"
   - Agent will search and cite sources

### Using Multiple Agents

Create multi-agent workflows:
```
Start → Agent1 (Research) → Voice1 → Prompt → Agent2 (Summarize) → Voice2 → End
```

Each agent can have:
- Different models
- Different instructions
- Different voices
- Different tools

---

## 📚 Node Types

### Core Nodes
- **Start**: Entry point for workflows
- **Agent**: AI agent with model selection and tool support
- **End**: Exit point for workflows
- **Note**: Add comments and documentation to your workflow

### Tool Nodes
- **Knowledge Base**: Upload and search documents (PDF, MD, TXT, CSV, JSON, XML)
- **Database**: Connect to external databases (planned)
- **File Search**: Search local file system (planned)
- **Guardrails**: Add safety checks and content filtering
- **MCP**: Model Context Protocol integration
- **Voice (TTS)**: Text-to-speech output with 15+ voices

### Logic Nodes
- **If/Else**: Conditional branching based on conditions
- **While Loop**: Repeat actions until condition is met
- **User Approval**: Pause workflow for human approval

### Data Nodes
- **Transform**: Transform data between nodes
- **Set State**: Store variables for later use
- **Prompt**: Inject custom prompts into the workflow

### External I/O Nodes
- **External Input**: Receive input from external sources
- **External Output**: Send output to external systems

---

## 🔧 Model Compatibility

### Models with Tool Support (🔧)

These models can use Knowledge Base, Web Search, and other tools:

| Model | Size | Tool Support | Best For |
|-------|------|--------------|----------|
| `llama3.1:8b` | 4.9GB | ✅ Yes | **Recommended** - Best balance |
| `llama3.2:latest` | 2.0GB | ✅ Yes | Smaller systems |
| `gpt-oss:latest` | 13.8GB | ✅ Yes | Maximum capability |
| `qwen2.5:7b` | ~4GB | ✅ Yes | Multilingual support |
| `deepseek-coder` | ~7GB | ✅ Yes | Coding tasks |

### Models WITHOUT Tool Support

These work for basic chat but cannot use tools:

| Model | Size | Tool Support | Best For |
|-------|------|--------------|----------|
| `mistral:latest` | 4.4GB | ❌ No | Fast responses |
| `phi3:latest` | ~2GB | ❌ No | Very small systems |
| `gemma:latest` | ~5GB | ❌ No | Basic tasks |

**Visual Indicator**: Models with tool support show a 🔧 wrench icon in the dropdown.

---

## 🐛 Troubleshooting

### Ollama Not Running

**Symptom**: Red banner "Ollama Not Running"

**Solution**:
```bash
# Check if Ollama is running
ollama list

# If not, start it:
# Windows: Ollama starts automatically
# Mac/Linux: ollama serve
```

### No Models Available

**Symptom**: Yellow banner "No Models Installed"

**Solution**:
```bash
# Install a model
ollama pull llama3.1:8b

# Verify installation
ollama list
```

### TTS Not Working

**Symptom**: No voice output, errors in console

**Solution**:
1. Check if TTS server is running on port 3001
2. Verify edge-tts is installed:
   ```bash
   pip install edge-tts
   ```
3. Restart TTS server:
   ```bash
   node tts-server.js
   ```

### Knowledge Base Not Working

**Symptom**: Agent doesn't use uploaded documents

**Solution**:
1. Ensure you're using a tool-capable model (look for 🔧 icon)
2. Check that Knowledge Base is connected to Agent's **📚 KB** handle
3. Try switching to `llama3.1:8b` or `gpt-oss:latest`

### Port Already in Use

**Symptom**: Error "Port 5173 already in use"

**Solution**:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### Workflow Not Executing

**Symptom**: Nothing happens when clicking Run

**Solution**:
1. Check that all nodes are connected properly
2. Ensure Start node exists and is connected
3. Check browser console for errors (F12)
4. Verify Ollama is running and has models

---

## 📁 Project Structure

```
local-agent-builder-main/
├── README.md                           # This file
├── MODEL_COMPATIBILITY.md              # Model tool support guide
├── UI_UX_SPECIFICATION.md              # UI/UX design specification
├── openai-agent-builder-reference.md   # OpenAI reference docs
│
├── agent-builder/                      # 🎨 Main React application
│   ├── src/
│   │   ├── components/                # React components
│   │   │   ├── nodes/                 # Custom node components
│   │   │   ├── Inspector.tsx          # Node configuration panel
│   │   │   ├── NodePalette.tsx        # Drag-and-drop palette
│   │   │   └── OllamaStatusBanner.tsx # Ollama health check
│   │   ├── pages/
│   │   │   ├── Builder.tsx            # Main workflow builder
│   │   │   └── WorkflowsList.tsx      # Workflow management
│   │   ├── services/
│   │   │   ├── workflowExecutor.ts    # Workflow execution engine
│   │   │   ├── ollamaService.ts       # Ollama API client
│   │   │   └── ollamaHealthCheck.ts   # Health monitoring
│   │   └── data/
│   │       └── defaultWorkflow.ts     # Default workflow template
│   ├── package.json                   # App dependencies
│   └── vite.config.ts                 # Vite configuration
│
├── tts-server.js                       # Text-to-Speech HTTP server
├── edge-tts-nossl.py                   # TTS Python wrapper
├── package.json                        # Root dependencies
│
├── tests/                              # Playwright tests
└── temp-audio/                         # Temporary TTS audio files
```

---

## 🔧 Development

### Tech Stack

**Frontend:**
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Styling
- **ReactFlow** - Visual workflow editor
- **Zustand** - State management

**Backend:**
- **Node.js + Express** - TTS server
- **Ollama** - Local LLM inference
- **edge-tts** - Microsoft Edge TTS

### Key Files

| File | Purpose |
|------|---------|
| `agent-builder/src/pages/Builder.tsx` | Main workflow builder UI |
| `agent-builder/src/components/Inspector.tsx` | Node configuration panel |
| `agent-builder/src/services/workflowExecutor.ts` | Workflow execution engine |
| `agent-builder/src/services/ollamaService.ts` | Ollama API integration |
| `tts-server.js` | Text-to-Speech HTTP server |

### Running Tests

```bash
# Run Playwright tests
cd agent-builder
npm run test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug
```

### Building for Production

```bash
# Build the application
cd agent-builder
npm run build

# Preview production build
npm run preview
```

The build output will be in `agent-builder/dist/`.

### Environment Variables

No environment variables required! Everything runs locally.

---

## 🎯 Use Cases

### 1. Research Assistant
Create an agent that searches your documents and the web to answer questions with cited sources.

**Example Workflow:**
```
Start → Agent (Research) + Knowledge Base → Voice → End
```

### 2. Multi-Agent Workflows
Chain multiple agents together, each with different specializations and voices.

**Example Workflow:**
```
Start → Agent1 (Analyze) → Voice1 → Prompt → Agent2 (Summarize) → Voice2 → End
```

### 3. Document Analysis
Upload PDFs/documents and have agents extract insights, summarize, or answer questions.

**Example Workflow:**
```
Start → Knowledge Base → Agent (Analyzer) → Transform → Voice → End
```

### 4. Voice Assistants
Build conversational agents with natural voice output in multiple languages and accents.

**Example Workflow:**
```
Start → Agent (Chat) → Voice (Female, UK) → End
```

### 5. Automated Workflows
Create complex workflows with conditional logic, loops, and state management.

**Example Workflow:**
```
Start → Agent → If/Else → [Path A: Voice] / [Path B: Transform] → End
```

---

## 🚀 Deployment

### Local Deployment
The application is designed to run locally. No server deployment needed.

### Network Access (Optional)
To access from other devices on your network:

1. Find your local IP:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Start the application:
   ```bash
   npm run dev
   ```

3. Access from other devices:
   ```
   http://YOUR_LOCAL_IP:5173
   ```

**Note**: Ollama must be running on the same machine.

---

## 📊 System Requirements

### Minimum Requirements
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 10GB free space
- **OS**: Windows 10+, macOS 11+, Linux

### Recommended Requirements
- **CPU**: 8+ cores
- **RAM**: 16GB+
- **Storage**: 20GB+ free space
- **GPU**: Optional (for faster inference)

### Model Size Considerations

| Model | RAM Required | Inference Speed |
|-------|--------------|-----------------|
| `llama3.2:latest` (2GB) | 4GB | Fast |
| `llama3.1:8b` (4.9GB) | 8GB | Medium |
| `gpt-oss:latest` (13.8GB) | 16GB | Slower |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**: `npm run test`
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style
- Follow existing TypeScript/React patterns
- Use meaningful variable names
- Add comments for complex logic
- Update documentation for new features

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- **[Ollama](https://ollama.ai/)** - Local LLM inference
- **[edge-tts](https://github.com/rany2/edge-tts)** - Text-to-speech
- **[ReactFlow](https://reactflow.dev/)** - Visual workflow editor
- **[Vite](https://vitejs.dev/)** - Build tool
- **[TailwindCSS](https://tailwindcss.com/)** - Styling
- Inspired by OpenAI's Agent Builder

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: See files in this repository

---

## 🗺️ Roadmap

### v2.1 (Planned)
- [ ] Database integration
- [ ] File search functionality
- [ ] Enhanced guardrails
- [ ] Workflow templates
- [ ] Export/import workflows

### v2.2 (Planned)
- [ ] Multi-user support
- [ ] Cloud sync (optional)
- [ ] Advanced debugging tools
- [ ] Performance optimizations
- [ ] Mobile responsive improvements

---

**Made with ❤️ for the local AI community**

**Version:** 2.0.0 | **Last Updated:** October 17, 2025
