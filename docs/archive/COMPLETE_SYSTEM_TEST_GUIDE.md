# Agent Builder - Complete System Testing Guide

## 🚀 System is Ready!

The complete agent execution system is now built and ready to test. Here's what's been implemented:

## ✅ What's Been Built

### 1. **Ollama Integration** (`src/services/ollamaService.ts`)
- ✅ Check if Ollama server is running
- ✅ List available local models
- ✅ Generate text with LLMs (non-streaming)
- ✅ Stream text generation
- ✅ Chat completion with conversation history

### 2. **Workflow Execution Engine** (`src/services/workflowExecutor.ts`)
- ✅ Execute workflows node by node
- ✅ Follow connections and edges
- ✅ Handle all 12 node types:
  - **Start**: Workflow initialization
  - **Agent**: Call Ollama LLM with instructions
  - **If/Else**: Conditional branching
  - **Transform**: JavaScript data transformation
  - **File Search**: (Placeholder, not impl yet)
  - **Guardrails**: (Placeholder, not impl yet)
  - **MCP**: (Placeholder, not impl yet)
  - **While**: (Placeholder, not impl yet)
  - **User Approval**: (Auto-approve for now)
  - **Set State**: Workflow state management
  - **Note**: Comments (skip in execution)
  - **End**: Workflow completion
- ✅ Real-time execution logs
- ✅ Error handling
- ✅ Context management (state, history, variables)

### 3. **UI Enhancements**
- ✅ **Inspector Panel**: 
  - Fetches available Ollama models
  - Shows model sizes
  - Displays "Ollama not running" warning
  - All form fields wired with onChange handlers
- ✅ **Top Bar**:
  - **Save** button - saves workflow to localStorage
  - **Run** button - executes the workflow
  - Loading state during execution
- ✅ **Execution Logs Panel**:
  - Shows real-time logs during execution
  - Node name, timestamp, duration
  - Output preview
  - Error highlighting
  - Collapsible panel

### 4. **Data Persistence**
- ✅ Save workflows to localStorage
- ✅ Load saved workflows
- ✅ Node data updates persist in state

## 📋 Prerequisites

### 1. Install Ollama
```bash
# Install Ollama (if not already installed)
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
ollama serve
```

### 2. Download a Model
```bash
# Download a model (choose one or more)
ollama pull llama2        # 3.8GB - Good general purpose
ollama pull mistral       # 4.1GB - Fast and capable
ollama pull codellama     # 3.8GB - Good for code
ollama pull llama3.2      # Latest Llama model
ollama pull phi3          # 2.3GB - Smaller, faster

# List installed models
ollama list
```

## 🧪 Testing Instructions

### Test 1: Simple Agent Workflow

**Goal**: Test basic LLM call with a single agent

**Steps**:
1. Open http://localhost:5173/
2. You should see the Start node already on the canvas
3. Drag an **Agent** node from the sidebar to the canvas
4. Drag an **End** node to the canvas
5. **CONNECT THE NODES**:
   - Click and drag from the **Start** node's bottom handle (green dot)
   - Drop on the **Agent** node's top handle (blue dot)
   - Click and drag from the **Agent** node's bottom handle
   - Drop on the **End** node's top handle (red dot)

6. Click on the **Agent** node to select it
7. In the Inspector panel (right side):
   - Change **Name** to: `Helpful Assistant`
   - Set **Instructions** to: `You are a friendly assistant. Answer questions helpfully and concisely.`
   - Select a **Model** from the dropdown (should show your installed Ollama models)
   - Leave **Include chat history** checked

8. Click the **💾 Save** button in the top bar
9. Click the **▶ Run** button

**Expected Result**:
- The button should change to "⏳ Running..."
- A logs panel should appear at the bottom
- You should see:
  ```
  [timestamp] Start (Xms)
  [timestamp] Helpful Assistant (Xms)
  Output: [LLM response to "Hello! Please help me."]
  [timestamp] End (Xms)
  ```
- An alert should show: "Workflow completed! Result: [response]"

### Test 2: Conditional Workflow with If/Else

**Goal**: Test branching logic

**Steps**:
1. Start with a fresh canvas or continue from Test 1
2. Create this workflow:
   ```
   Start → Agent → If/Else → (true) → Agent 2 → End
                      ↓
                    (false) → Agent 3 → End
   ```

3. Configure **Agent** (first one):
   - Instructions: `Answer with just "yes" or "no": Is 2+2 equal to 4?`

4. Configure **If/Else**:
   - Click the If/Else node
   - (Note: Condition evaluation is basic - checks if output contains "yes")

5. Configure **Agent 2** (true branch):
   - Instructions: `Say "Correct! You know math!"`

6. Configure **Agent 3** (false branch):
   - Instructions: `Say "Oops, let's review basic math."`

7. Click **▶ Run**

**Expected Result**:
- Should execute Start → Agent → If/Else → Agent 2 (true branch) → End
- Final output should be about being correct

### Test 3: Transform Data

**Goal**: Test JavaScript transformation

**Steps**:
1. Create workflow: `Start → Transform → Agent → End`

2. Click the **Transform** node
3. In Inspector, add transform code:
   ```javascript
   return "Please count from 1 to 5";
   ```

4. Configure **Agent**:
   - Instructions: `Follow the user's request exactly.`

5. Click **▶ Run**

**Expected Result**:
- Transform converts input to "Please count from 1 to 5"
- Agent receives that as input and responds with counting

### Test 4: Model Selection

**Goal**: Verify Ollama model integration

**Steps**:
1. Make sure Ollama is running: `ollama serve`
2. Refresh the page
3. Click on an Agent node
4. In the Inspector, check the **Model** dropdown

**Expected Result**:
- Should show all your installed Ollama models
- Should show model sizes (e.g., "llama2 (3.8GB)")
- If Ollama not running, should show "(Ollama not running)" warning

### Test 5: Save and Load

**Goal**: Test workflow persistence

**Steps**:
1. Create any workflow with multiple nodes
2. Configure nodes with custom names and instructions
3. Click **💾 Save**
4. Refresh the page (Ctrl+R or Cmd+R)
5. You'll lose your workflow on refresh
6. Click **💾 Save** again (we need a Load button - will add)

**Expected Result**:
- Workflow data saved to localStorage
- Can be retrieved (need to add Load button to UI)

## 🐛 Troubleshooting

### Issue: "Ollama not running" in model dropdown
**Solution**: 
```bash
# Start Ollama server
ollama serve
```

### Issue: "No models available"
**Solution**:
```bash
# Download a model
ollama pull llama2

# Verify it's installed
ollama list
```

### Issue: "Workflow failed: LLM call failed"
**Possible causes**:
1. Ollama server not running
2. Model not downloaded
3. Model name mismatch

**Solution**:
```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Should return JSON with models list
```

### Issue: Nodes pile up when dropped
**Status**: FIXED ✅
- Smart positioning with auto-offset implemented

### Issue: Nodes look basic/blocky
**Status**: FIXED ✅
- All nodes now have beautiful gradients, shadows, rounded corners

### Issue: Can't connect nodes
**Steps to connect**:
1. Click and hold on the source node's handle (colored dot)
2. Drag to the target node's handle
3. Release

## 🎯 Next Steps After Testing

Once you confirm everything works:

1. **Add Load button** to TopBar
2. **Implement File Search** node
3. **Implement Guardrails** node
4. **Implement MCP** integration
5. **Add streaming UI** for real-time LLM responses
6. **Add input prompt dialog** before execution
7. **Improve error messages**
8. **Add workflow validation** (check for orphaned nodes, cycles, etc.)
9. **Add execution history panel**
10. **Export/import workflows** as JSON files

## 📊 What to Report

Please test and let me know:

1. ✅ Does Ollama connection work?
2. ✅ Do installed models show in dropdown?
3. ✅ Does workflow execution complete successfully?
4. ✅ Do execution logs appear?
5. ✅ Does the LLM respond correctly?
6. ✅ Do node connections work properly?
7. ✅ Does Save functionality work?

## 🎉 Success Criteria

The system is working correctly if:
- ✅ You can drag and connect nodes
- ✅ Model dropdown shows your Ollama models
- ✅ Clicking Run executes the workflow
- ✅ Logs show each node execution
- ✅ Agent nodes call Ollama and get responses
- ✅ Final result is displayed in an alert
- ✅ Everything looks polished with gradients and shadows

---

**Ready to test!** Start with Test 1 and work your way through. Report any issues you encounter!
