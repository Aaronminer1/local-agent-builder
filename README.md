# 🤖 Local Agent Builder v2.0.0 - Tool Use Revolution

A visual workflow builder for creating AI agents with **real tool use capabilities** that run entirely on your local machine using Ollama.

## 🚀 **NEW in v2.0.0: Local Models Can Use Tools!**

**BREAKTHROUGH:** We've successfully implemented tool use for local models! Local LLMs can now access external data and perform real actions.

### 🔥 **Tool Use Capabilities:**
- ✅ **Real external data access** via Wikipedia API
- ✅ **Multi-turn tool conversations** with context preservation  
- ✅ **Verified with 2025 data** that no training could contain
- ✅ **Tool-capable models**: gpt-oss:20b, llama3.1:8b, qwen, deepseek

## ✨ Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating AI agent workflows
- **🔧 Tool-Enabled Agents**: Local models can now use tools to access external information
- **🌐 Real Web Search**: Agents can fetch current data from Wikipedia API
- **Local AI Models**: Powered by Ollama - no API keys or cloud dependencies
- **Real-time Execution**: Watch your workflows run with live logging
- **Multiple Node Types**: Agent, Logic, Data transformation, and more
- **State Management**: Pass data between workflow nodes
- **Audio Output**: Text-to-speech for agent responses
- **Workflow Management**: Save, load, and organize your workflows

## 🔧 **Tool Use Examples:**

### **Research Agent:**
```
User: "What happened in the 2024 Nobel Prize announcements?"
Agent: *searches Wikipedia* → Returns real 2024 Nobel Prize information
```

### **Current Events:**
```
User: "What were the major news headlines on October 1, 2025?"
Agent: *searches Wikipedia* → Returns 2025 British cabinet reshuffle, MLB season info
```

### **Fact Checking:**
```
User: "What is quantum computing?"
Agent: *searches Wikipedia* → Returns sourced, current information with URLs
```

### For Developers:
- **[dev/TODO.md](./dev/TODO.md)** - ⭐ Current tasks and priorities
- **[dev/CHANGELOG.md](./dev/CHANGELOG.md)** - All changes
- **[dev/bugs/](./dev/bugs/)** - Active bug reports
- **[dev/testing/](./dev/testing/)** - Test results
- **[dev/planning/](./dev/planning/)** - Planning docs
- **[QUICKSTART.md](./QUICKSTART.md)** - Setup guide
- **[docs/](./docs/)** - User documentation

### Reference:
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[CODEBASE_AUDIT.md](./CODEBASE_AUDIT.md)** - Code audit results
- **[openai-agent-builder-docs.md](./openai-agent-builder-docs.md)** - OpenAI reference
- **[UI_UX_SPECIFICATION.md](./UI_UX_SPECIFICATION.md)** - UI/UX spec

---

## 🎯 Current Status

**Version:** 0.2.0-dev  
**Status:** 🟡 Partially Functional  
**Completion:** 65%

### ✅ Working:
- All 13 node types render
- Tool selection UI
- Input panel UI
- Save/load workflows

### 🔴 Critical Bugs:
1. **Input state doesn't sync** - Can't execute workflows
2. **Tools don't execute** - Tools are cosmetic only

**See:** [docs/CURRENT_STATUS.md](./docs/CURRENT_STATUS.md) for details

---

## 📁 Project Structure

```
local-agent-builder/
├── README.md                           # This file
├── QUICKSTART.md                       # Setup guide
├── CHANGELOG.md                        # All changes
│
├── docs/                               # 📚 Main documentation
│   ├── CURRENT_STATUS.md              # ⭐ Start here
│   ├── TESTING.md                     # Test results & bugs
│   ├── IMPLEMENTATION.md              # Implementation guide
│   ├── REFERENCE.md                   # OpenAI comparison
│   └── archive/                       # Old docs (reference only)
│
├── agent-builder/                      # 🎨 Main application
│   ├── src/                           # Source code
│   │   ├── components/                # React components
│   │   ├── pages/                     # Page components
│   │   ├── services/                  # Business logic
│   │   └── data/                      # Data/constants
│   └── ...
│
├── CRITICAL_BUGS_FOUND.md             # ⚠️ Active bugs
├── TOOL_INTEGRATION_GAP.md            # Tool execution gap
│
└── Reference docs (see above)
```

---

## 🧪 Testing

```bash
# Manual testing
cd agent-builder
bun run dev
# Open http://localhost:5173 and test

# Playwright testing (when available)
npx playwright test
```

**See:** [docs/TESTING.md](./docs/TESTING.md) for test results

---

## 🔧 Development

### Key Files:
- `agent-builder/src/pages/Builder.tsx` - Main builder page
- `agent-builder/src/components/Inspector.tsx` - Node inspector
- `agent-builder/src/services/workflowExecutor.ts` - Execution engine

### Current Priorities:
1. Fix input state bug (blocks execution)
2. Implement tool execution
3. Test all node types

**See:** [docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) for details

---

## 📊 Feature Parity

| Feature | OpenAI | Local | Status |
|---------|--------|-------|--------|
| Node Types | 13 | 13 | ✅ 100% |
| Input System | ✅ | 🔴 | Broken |
| Tool Selection | ✅ | ✅ | UI only |
| Tool Execution | ✅ | ❌ | Not implemented |
| Workflow Execution | ✅ | 🔴 | Broken |

**See:** [docs/REFERENCE.md](./docs/REFERENCE.md) for full comparison

---

## 🐛 Known Issues

### Critical:
1. **Input state doesn't sync** - Workflows can't execute
2. **Tools don't execute** - Tools are cosmetic only

### High Priority:
- Node settings untested
- Data flow untested
- Persistence untested

**See:** [CRITICAL_BUGS_FOUND.md](./CRITICAL_BUGS_FOUND.md) for details

---

## 📝 Contributing

1. Check [docs/CURRENT_STATUS.md](./docs/CURRENT_STATUS.md) for current state
2. Check [CRITICAL_BUGS_FOUND.md](./CRITICAL_BUGS_FOUND.md) for known issues
3. Follow [docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md) for implementation
4. Update [CHANGELOG.md](./CHANGELOG.md) with changes

---

## 📖 Additional Resources

- **Setup:** [QUICKSTART.md](./QUICKSTART.md)
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Code Audit:** [CODEBASE_AUDIT.md](./CODEBASE_AUDIT.md)
- **OpenAI Docs:** [openai-agent-builder-docs.md](./openai-agent-builder-docs.md)
- **UI/UX Spec:** [UI_UX_SPECIFICATION.md](./UI_UX_SPECIFICATION.md)

---

## 📜 License

[Add license here]

---

**Last Updated:** October 9, 2025, 10:20 PM  
**Status:** 🟡 Partially Functional - Critical bugs found  
**Next:** Fix input state bug, implement tool execution
