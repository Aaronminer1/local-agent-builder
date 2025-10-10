# 🔧 Tool-Capable Local Models (Ollama)

**Date:** October 10, 2025, 12:02 AM  
**Source:** https://ollama.com/search?c=tools

---

## 🎯 Recommended Models for Your System

### ⭐ Best Option: llama3.1:8b (ALREADY INSTALLED!)

**Surprise:** llama3.1:8b **DOES support tools** according to Ollama!

**Stats:**
- Size: 8B parameters (~4.9GB)
- Tools: ✅ YES
- Pulls: 104M (most popular)
- Updated: 10 months ago

**Why it's listed:**
Ollama added tool-calling support to llama3.1 models! But we need to use it correctly.

**How to use it:**
```typescript
// Ollama supports function calling via their API
const response = await ollama.chat({
  model: 'llama3.1:8b',
  messages: [{ role: 'user', content: 'Search the web for X' }],
  tools: [
    {
      type: 'function',
      function: {
        name: 'web_search',
        description: 'Search the web using Playwright',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' }
          }
        }
      }
    }
  ]
});

// Check if model requested a tool call
if (response.message.tool_calls) {
  const toolCall = response.message.tool_calls[0];
  // Execute the tool
  const result = await executeTool(toolCall);
  // Feed result back to model
}
```

---

## 📊 All Tool-Capable Models (Sorted by Size)

### Tiny Models (1-3B) - Run on any system

| Model | Size | Features | Pulls | Notes |
|-------|------|----------|-------|-------|
| **llama3.2** | 1b, 3b | tools | 39.2M | Smallest Llama with tools |
| **qwen3** | 0.6b, 1.7b | tools, thinking | 9.7M | Tiny but capable |
| **granite3-moe** | 1b, 3b | tools | 87.6K | IBM MoE models |
| **deepseek-r1** | 1.5b | tools, thinking | 65.3M | Reasoning + tools |

**Recommendation:** llama3.2:3b or qwen3:1.7b for low-end systems

---

### Small Models (4-8B) - Your current category

| Model | Size | Features | Pulls | Notes |
|-------|------|----------|-------|-------|
| **llama3.1** ⭐ | 8b | tools | 104M | **YOU HAVE THIS!** |
| **qwen3** | 4b, 8b | tools, thinking | 9.7M | Alternative |
| **deepseek-r1** | 7b, 8b | tools, thinking | 65.3M | Reasoning focused |
| **command-r7b** | 7b | tools | 63K | Cohere's efficient model |
| **aya-expanse** | 8b | tools | 85.8K | Multilingual (23 languages) |

**Recommendation:** Stick with llama3.1:8b (you already have it!)

---

### Medium Models (14-32B) - Need ~16GB+ RAM

| Model | Size | Features | Pulls | Notes |
|-------|------|----------|-------|-------|
| **qwen3** | 14b, 30b, 32b | tools, thinking | 9.7M | Excellent quality |
| **deepseek-r1** | 14b, 32b | tools, thinking | 65.3M | Strong reasoning |
| **mistral-large** | 123b | tools, thinking | 2.6M | Very capable |
| **aya-expanse** | 32b | tools | 85.8K | Multilingual |

**Recommendation:** qwen3:14b if you have 16GB+ RAM

---

### Large Models (70B+) - Need 32GB+ RAM

| Model | Size | Features | Pulls | Notes |
|-------|------|----------|-------|-------|
| **llama3.1** | 70b, 405b | tools | 104M | High quality |
| **deepseek-r1** | 70b | tools, thinking | 65.3M | Best reasoning |
| **firefunction-v2** | 70b | tools | 34.6K | Function calling specialist |
| **command-r** | 35b, 104b | tools | 6.7M | Cohere's flagship |
| **command-a** | 111b | tools | 57.9K | Enterprise grade |

**Recommendation:** deepseek-r1:70b for best tool use (if you have RAM)

---

### Extra Large (100B+) - Cloud/server only

| Model | Size | Features | Pulls | Notes |
|-------|------|----------|-------|-------|
| **gpt-oss** | 20b, 120b | tools, thinking | 3.3M | OpenAI open-weight |
| **mistral-large** | 123b | tools, thinking | 2.6M | Excellent quality |
| **qwen3** | 235b | tools, thinking | 9.7M | Massive MoE |
| **deepseek-r1** | 671b | tools, thinking | 65.3M | Extreme scale |

**Recommendation:** Only for cloud/server deployments

---

## 🚀 Quick Start: Enable Tools in Your System

### Step 1: Verify llama3.1:8b is installed

```bash
ollama list | grep llama3.1
```

### Step 2: Test tool calling

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.1:8b",
  "messages": [
    {"role": "user", "content": "What is the weather?"}
  ],
  "stream": false,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get current weather",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {"type": "string"}
          }
        }
      }
    }
  ]
}'
```

### Step 3: Update workflowExecutor.ts

```typescript
// Update the Agent execution to use Ollama's tool API
private async executeAgent(node: Node): Promise<string> {
  const instructions = node.data?.instructions;
  const model = node.data?.model || 'llama3.1:8b';
  const tools = this.getAvailableTools(); // MCP, Playwright, etc.
  
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'user', content: instructions },
        { role: 'user', content: this.context.currentInput }
      ],
      tools: tools.map(tool => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }
      })),
      stream: false
    })
  });
  
  const result = await response.json();
  
  // Check if model requested tool calls
  if (result.message.tool_calls && result.message.tool_calls.length > 0) {
    // Execute each tool call
    for (const toolCall of result.message.tool_calls) {
      const toolResult = await this.executeTool(toolCall);
      
      // Feed result back to model
      const followUp = await this.continueWithToolResult(
        model,
        result.message,
        toolCall,
        toolResult
      );
      
      return followUp.message.content;
    }
  }
  
  return result.message.content;
}

private getAvailableTools() {
  return [
    {
      name: 'web_search',
      description: 'Search the web using Playwright',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          url: { type: 'string', description: 'URL to navigate to' }
        },
        required: ['query']
      }
    },
    {
      name: 'read_file',
      description: 'Read a file from the filesystem',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'File path' }
        },
        required: ['path']
      }
    }
  ];
}

private async executeTool(toolCall: any): Promise<string> {
  const { name, arguments: args } = toolCall.function;
  
  switch (name) {
    case 'web_search':
      // Use Playwright MCP to search
      return await this.usePlaywright(args);
      
    case 'read_file':
      // Use File Search node logic
      return await this.readFile(args.path);
      
    default:
      return `Error: Unknown tool ${name}`;
  }
}

private async usePlaywright(args: any): Promise<string> {
  // TODO: Integrate with Playwright MCP
  // For now, return placeholder
  return `Web search for: ${args.query}`;
}
```

---

## 🎓 Alternative Models Worth Trying

### 1. qwen3:8b (Alternative to llama3.1:8b)
```bash
ollama pull qwen3:8b
```
**Pros:** Newer, thinking capability  
**Cons:** Less popular (9.7M vs 104M pulls)

### 2. deepseek-r1:8b (Reasoning specialist)
```bash
ollama pull deepseek-r1:8b
```
**Pros:** Strong reasoning, tool use  
**Cons:** Larger size for same parameters

### 3. llama3.2:3b (Smaller, faster)
```bash
ollama pull llama3.2:3b
```
**Pros:** Faster, less RAM  
**Cons:** Lower quality

---

## 📊 System Requirements

| Model Size | RAM Needed | VRAM (GPU) | Speed | Quality |
|------------|------------|------------|-------|---------|
| 1-3B | 4GB | 2GB | Fast | Good |
| 4-8B | 8GB | 4GB | Medium | Very Good |
| 14-32B | 16GB | 8GB | Slow | Excellent |
| 70B+ | 32GB+ | 16GB+ | Very Slow | Best |

**Your system likely has:** 8-16GB RAM → Perfect for 8B models

---

## 🎯 Immediate Action

### Option 1: Use llama3.1:8b with Ollama's tool API
**Effort:** Medium (update workflowExecutor.ts)  
**Benefit:** Real tool use with model you already have

### Option 2: Try qwen3:8b
**Effort:** Low (just swap model name)  
**Benefit:** Newer model, thinking capability

### Option 3: Upgrade to qwen3:14b
**Effort:** Low (if you have 16GB+ RAM)  
**Benefit:** Better quality tool use

---

## 🔬 Testing Tool Use

### Test Script:
```bash
# Test if model can request tool calls
ollama run llama3.1:8b
>>> You are an agent with access to web_search(query). Search for "Ollama tool use"

# Look for structured output indicating tool call request
```

**Expected (if working):**
```json
{
  "tool_calls": [{
    "function": {
      "name": "web_search",
      "arguments": {"query": "Ollama tool use"}
    }
  }]
}
```

**Not working:**
```
"Based on my knowledge, here are search results..."
```

---

## 💡 Key Insight

**llama3.1:8b DOES support tools via Ollama's API!**

We just need to:
1. Use Ollama's chat API (not generate API)
2. Pass tools in the request
3. Handle tool_calls in the response
4. Execute tools and feed results back

This is MUCH easier than building a wrapper layer!

---

## 📚 References

- Ollama Tools Documentation: https://github.com/ollama/ollama/blob/main/docs/api.md#tools
- Ollama Search (Tools filter): https://ollama.com/search?c=tools
- Function Calling Examples: https://github.com/ollama/ollama/tree/main/examples

---

**Next Step:** Update `workflowExecutor.ts` to use Ollama's tool API with llama3.1:8b!

---

**Date:** October 10, 2025, 12:02 AM  
**Status:** ✅ **TOOL-CAPABLE MODELS IDENTIFIED**
