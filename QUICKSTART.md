# 🚀 Quick Reference Card - Local Agent Builder

## 📍 Project Location
```
~/vscode_Projects/local-agent-builder/
```

## ⚡ Quick Start Commands

### Start the Application (2 terminals needed)

**Terminal 1 - Backend:**
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

**Access:** http://localhost:5173

---

## 🤖 Ollama Commands

```bash
# List installed models
ollama list

# Run a model interactively
ollama run llama3.2:3b

# Download more models
ollama pull llama3.1:8b        # Better quality
ollama pull codellama:7b       # Code-specialized
ollama pull llava:7b           # Vision-capable

# Check Ollama status
systemctl status ollama

# Restart Ollama
sudo systemctl restart ollama
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project guide - start here |
| `summary.md` | Complete session history - tell AI to read this |
| `openai-agent-builder-docs.md` | OpenAI reference documentation |
| `agentic-signal-setup.md` | Technical setup guide |
| `agent-builder-clone-summary.md` | Feature comparison |

---

## 🛠️ Development Commands

```bash
# Client
bun run client:dev          # Dev server
bun run client:build        # Production build
bun run client:preview      # Preview build

# Server  
bun run server:dev          # Dev server
bun run server:build        # Compile binary

# Desktop App (optional)
bun run dev:linux           # Run desktop app
bun run build:linux         # Build desktop app

# Code Quality
bun run lint                # Check code
bun run lint:fix            # Auto-fix issues
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:5173 | xargs kill -9    # Kill frontend
lsof -ti:8000 | xargs kill -9    # Kill backend  
lsof -ti:11434 | xargs kill -9   # Kill Ollama
```

### Ollama Not Responding
```bash
sudo systemctl restart ollama
curl http://localhost:11434/api/tags
```

### Build Errors
```bash
cd ~/vscode_Projects/local-agent-builder/agentic-signal
rm -rf node_modules client/node_modules
bun install && cd client && bun install
```

---

## 📊 System Info

- **Bun**: v1.2.22 (`/home/aaron/.bun/bin/bun`)
- **Deno**: v2.5.3 (`/home/aaron/.deno/bin/deno`)
- **Ollama**: Installed (systemd service)
- **Model**: llama3.2:3b (2.0 GB)
- **GPU**: NVIDIA (acceleration enabled)

---

## 🎯 What This Is

A **complete local alternative to OpenAI's Agent Builder**:
- Visual drag-and-drop workflow builder
- Node-based architecture (Start, Agent, Tools, Logic, Data)
- Powered by local LLMs (Ollama) instead of GPT-4/5
- 100% private - no cloud, no API costs
- Open source (AGPL v3)

---

## 🔗 Resources

- **Docs**: https://code-forge-temple.github.io/agentic-signal/
- **GitHub**: https://github.com/code-forge-temple/agentic-signal
- **Discord**: https://discord.gg/HZPEbJM8
- **Reddit**: r/AgenticSignal

---

## 💡 First Workflow Example

1. Open http://localhost:5173
2. Add **Start Node** (user input)
3. Add **Agent Node**:
   - Model: `llama3.2:3b`
   - Instructions: "You are a helpful assistant"
4. Connect Start → Agent
5. Click **Preview** and test!

---

## 🔄 To Resume Project Later

1. Read `summary.md` to get up to speed
2. Run the "Quick Start Commands" above
3. Reference `README.md` for detailed info

---

**Last Updated**: October 9, 2025  
**Status**: ✅ Fully configured and ready to use
