# 🚀 Quick Start Guide

Get up and running with Local Agent Builder in under 5 minutes!

## 📋 Before You Start

Make sure you have:
1. **Ollama installed** - [Download here](https://ollama.ai/download)
2. **At least one model installed** - Run: `ollama pull llama3.1:8b`

That's it! Everything else is automated.

---

## ⚡ Super Quick Start

### Windows Users

1. **Download/Clone the project**
2. **Double-click `start.bat`**
3. **Done!** Browser opens automatically

### Mac/Linux Users

1. **Download/Clone the project**
2. **Run in terminal:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
3. **Done!** Browser opens automatically

---

## 🎯 What the Launcher Does

The automated launcher (`start.js`) handles everything:

### ✅ Checks Prerequisites
- Node.js installed?
- npm installed?
- Python installed?
- Ollama installed?
- Ollama running?
- Models installed?

### ✅ Auto-Installs Dependencies
- npm packages (if missing)
- edge-tts for voice output (if missing)

### ✅ Starts Everything
- Frontend server (port 5173)
- TTS server (port 3001)
- Opens browser automatically

### ⚠️ Helpful Errors
If something is missing, you'll get clear instructions:
- Where to download Ollama
- Which models to install
- How to fix the issue

---

## 📝 First Time Setup

### Step 1: Install Ollama

**Windows/Mac:**
1. Download from [https://ollama.ai/download](https://ollama.ai/download)
2. Install and run

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve
```

### Step 2: Install a Model

```bash
# Recommended (good balance)
ollama pull llama3.1:8b

# Or smaller (faster)
ollama pull llama3.2:latest

# Or larger (more capable)
ollama pull gpt-oss:latest
```

### Step 3: Run the Launcher

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
./start.sh
```

**Or use npm:**
```bash
npm start
```

---

## 🎨 Creating Your First Workflow

Once the browser opens:

1. **Drag nodes** from the left sidebar
   - Start with: Start → Agent → Voice → End

2. **Connect nodes** by dragging between handles

3. **Configure Agent**
   - Click the Agent node
   - Select a model (look for 🔧 icon)
   - Add instructions

4. **Add input** at the top
   - Example: "What is quantum computing?"

5. **Click Run** (green button)
   - Watch execution logs
   - Hear voice output

---

## 🔧 Model Selection

### Models with Tool Support (🔧)
Can use Knowledge Base, Web Search, etc.

- `llama3.1:8b` - **Recommended**
- `llama3.2:latest` - Smaller
- `gpt-oss:latest` - Larger
- `qwen2.5:7b` - Multilingual
- `deepseek-coder` - Coding

### Models WITHOUT Tool Support
Work for basic chat only:

- `mistral:latest`
- `phi3:latest`
- `gemma:latest`

**Tip:** Models with 🔧 icon in the dropdown support tools!

---

## 🐛 Common Issues

### "Ollama Not Running"

**Solution:**
```bash
# Check if running
ollama list

# Start Ollama
# Windows: Starts automatically
# Mac/Linux: ollama serve
```

### "No Models Installed"

**Solution:**
```bash
ollama pull llama3.1:8b
```

### "Port Already in Use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### "TTS Not Working"

**Solution:**
```bash
pip install edge-tts
```

---

## 📚 Next Steps

### Learn More
- **Full README**: [README.md](./README.md)
- **Model Guide**: [MODEL_COMPATIBILITY.md](./MODEL_COMPATIBILITY.md)
- **UI/UX Spec**: [UI_UX_SPECIFICATION.md](./UI_UX_SPECIFICATION.md)

### Try These Workflows

**Research Assistant:**
```
Start → Agent + Knowledge Base → Voice → End
```

**Multi-Agent:**
```
Start → Agent1 → Voice1 → Prompt → Agent2 → Voice2 → End
```

**Conditional Logic:**
```
Start → Agent → If/Else → [Voice A] / [Voice B] → End
```

---

## 💡 Pro Tips

1. **Use tool-capable models** (🔧 icon) for Knowledge Base and Web Search
2. **Save your workflows** - They persist in browser storage
3. **Check execution logs** - Click the logs panel to see what's happening
4. **Try different voices** - 15+ options in Voice node settings
5. **Chain multiple agents** - Each can have different models and instructions

---

## 🎉 You're Ready!

That's it! You now have a fully functional local AI agent builder.

**Need help?**
- Check the full [README.md](./README.md)
- Review [troubleshooting section](#-common-issues)
- Check browser console (F12) for errors

**Happy building!** 🚀
