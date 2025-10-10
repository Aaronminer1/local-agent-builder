# Implementation Plan - 30-Day Sprint (REVISED)
## From MVP to Production-Ready Agent Builder

*Created: October 9, 2025*  
*Revised: October 9, 2025 (Post-UI Audit)*

---

## 🚨 CRITICAL DISCOVERY: UI Audit Results

**Finding:** 47% of UI elements are non-functional placeholders!

**See:** `UI_AUDIT_REPORT.md` for complete analysis

**Key Issues:**
- "Add Tool" button: No onClick handler
- "More Options" button: No onClick handler
- "Include History" toggle: Not saved to node data
- "Reasoning Effort" dropdown: Not saved, Ollama doesn't support
- "Output Format" dropdown: Not saved or enforced
- MCP/File Search/Guardrails/User Approval: All stubbed

**Impact:** Users click buttons → nothing happens → trust broken

**New Priority:** **Honesty before features!** Hide broken UI, fix core functionality, then add advanced features.

---

## 🎯 Mission Statement (REVISED)

Transform our Local Agent Builder from a **visually-polished MVP with broken UI (4/10)** into a **production-ready system (9/10)** in 30 days:

1. **UI Honesty** (NEW PRIORITY) - Hide/disable non-functional elements
2. **Core Feature Implementation** - Fix stubbed execution methods
3. **Code Playground** - NEW killer feature for coding agents
4. **Testing & Quality** - Prevent regressions
5. **Security & Reliability** - Safe for production

---

## 📅 30-Day Sprint Overview (REVISED)

### **Week 1: UI Cleanup + Core Features** (Days 1-7)
Remove fake buttons, fix toggles, implement stubbed features

### **Week 2: Code Playground** (Days 8-14)
Build sandboxed code execution environment - our NEW killer feature

### **Week 3: Testing & Quality** (Days 15-21)
Add comprehensive testing and error handling

### **Week 4: Polish & Launch** (Days 22-30)
Security, performance, documentation, release

---

## 📊 Success Metrics (UPDATED)

| Metric | Current | Week 1 Target | Final Target | Priority |
|--------|---------|---------------|--------------|----------|
| **UI Honesty** | 47% broken | 100% honest | 100% | 🔴 CRITICAL |
| **Working Features** | 53% | 80% | 100% | 🔴 Critical |
| **Test Coverage** | 0% | 30% | 80% | 🔴 Critical |
| **Code Playground** | 0% | 0% | 100% | 🟡 High |
| **Documentation** | 40% | 60% | 90% | 🟢 Medium |
| **Security Score** | 5/10 | 6/10 | 9/10 | 🔴 Critical |
| **User Trust** | ⚠️ Low | ✅ Good | ✅ Excellent | � CRITICAL |

---

## Week 1: UI Cleanup + Core Features (Days 1-7)

**NEW FOCUS:** Build user trust by making UI honest about what works

### Day 1: UI Cleanup - Remove Fake Interactions (4 hours)

**Goal:** Build user trust by only showing working features

**File:** `src/components/Inspector.tsx`

**Tasks:**

1. **Hide Non-Functional Buttons**
   ```tsx
   // Lines 173-178: "Add Tool" button → Hide until Week 2
   {false && (
     <button className="...">
       <span>+</span>
       <span>Add tool</span>
     </button>
   )}
   
   // Lines 538-541: "More Options" button → Hide until Week 4
   {false && (
     <button className="...">More options</button>
   )}
   
   // Lines 526-533: "Add Variable" button → Hide until Week 4
   {false && (
     <button className="...">
       <span>+</span>
       <span>Add variable</span>
     </button>
   )}
   ```

2. **Fix Toggles That Don't Save State**
   ```tsx
   // Include Chat History toggle (lines 106-113)
   const [includeHistory, setIncludeHistory] = useState(
     (selectedNode.data as any).includeHistory ?? true
   );
   
   <input
     type="checkbox"
     checked={includeHistory}
     onChange={(e) => {
       const checked = e.target.checked;
       setIncludeHistory(checked);
       onUpdateNode?.(selectedNode.id, { includeHistory: checked });
     }}
     className="..."
   />
   ```

3. **Fix Dropdowns That Don't Save State**
   ```tsx
   // Output Format dropdown (lines 182-198)
   const [outputFormat, setOutputFormat] = useState(
     (selectedNode.data as any).outputFormat || 'Text'
   );
   
   <select 
     value={outputFormat}
     onChange={(e) => {
       setOutputFormat(e.target.value);
       onUpdateNode?.(selectedNode.id, { outputFormat: e.target.value });
     }}
   >
     <option value="Text">Text</option>
     <option value="JSON">JSON</option>
   </select>
   ```

4. **Remove "Reasoning Effort" Dropdown** (Ollama doesn't support)
   ```tsx
   {/* Reasoning effort not supported by Ollama - removed */}
   {false && (
     <div>
       <label>Reasoning effort</label>
       <select>...</select>
     </div>
   )}
   ```

5. **Add Delete Confirmation**
   ```tsx
   <button
     onClick={() => {
       const label = selectedNode.data.label || selectedNode.type;
       if (confirm(`Delete "${label}" node?`)) {
         onDeleteNode?.(selectedNode.id);
       }
     }}
     className="text-red-600 hover:text-red-800 p-1"
   >
     🗑️
   </button>
   ```

**Testing:**
- ✅ Click previously fake buttons → Verify hidden
- ✅ Toggle "Include History" → Check node data saved
- ✅ Change "Output Format" → Check node data saved
- ✅ Delete node → Verify confirmation dialog
- ✅ Save workflow → Verify settings persist

**Deliverable:** Honest UI where every visible button actually works

---

### Day 2: MCP Integration (6-8 hours)

**Tasks:**
- [ ] Create MCP client service (`src/services/mcpService.ts`)
- [ ] Implement server registry (12 configured servers)
- [ ] Add request/response handling
- [ ] Implement error handling & retries
- [ ] Test with 5 no-auth servers

**Deliverable:** MCP nodes execute successfully

---

### Day 3: Guardrails Implementation
**Goal:** Add real content filtering

**Tasks:**
- [ ] Implement PII detection (regex patterns)
- [ ] Add profanity filter (word list)
- [ ] Create tone analyzer (simple sentiment)
- [ ] Add configurable rule system
- [ ] Test with various inputs

**Deliverable:** Guardrails block inappropriate content

---

### Day 4: File Search
**Goal:** Enable local file searching

**Tasks:**
- [ ] Integrate ripgrep or grep
- [ ] Add glob pattern support
- [ ] Format search results
- [ ] Add file preview
- [ ] Test with large codebases

**Deliverable:** File search returns relevant results

---

### Day 5: User Approval UI
**Goal:** Add human-in-the-loop interaction

**Tasks:**
- [ ] Create modal dialog component
- [ ] Add approve/reject buttons
- [ ] Show context preview
- [ ] Add keyboard shortcuts
- [ ] Test workflow pause/resume

**Deliverable:** User approval pauses workflow for input

---

### Day 6: Error Recovery
**Goal:** Handle failures gracefully

**Tasks:**
- [ ] Add retry logic with exponential backoff
- [ ] Implement checkpoint/resume
- [ ] Add partial results saving
- [ ] Create error recovery UI
- [ ] Test failure scenarios

**Deliverable:** Workflows recover from errors

---

### Day 7: Workflow Validation
**Goal:** Prevent invalid workflows

**Tasks:**
- [ ] Create validator service
- [ ] Check for start/end nodes
- [ ] Detect disconnected nodes
- [ ] Find cycles (infinite loops)
- [ ] Validate node configurations
- [ ] Add pre-execution validation UI

**Deliverable:** Users get helpful validation errors

**Week 1 Milestone:** ✅ All core features work, no more TODOs

---

## Week 2: Code Playground (Days 8-14)

### Overview: The Game-Changer Feature

**Vision:** Enable coding agents to write, test, and execute code in a safe sandbox

**Use Cases:**
- Python script generation & testing
- JavaScript/TypeScript development
- Bug fixing workflows
- Algorithm implementation
- Code review automation
- Unit test generation

---

### Day 8-9: Sandbox Architecture
**Goal:** Design secure code execution environment

**Tasks:**
- [ ] Research sandboxing options (Docker, vm2, isolate)
- [ ] Design sandbox API
- [ ] Create security model (what's allowed/blocked)
- [ ] Define resource limits (CPU, memory, time)
- [ ] Plan multi-language support

**Deliverable:** Sandbox architecture document

---

### Day 10-11: Code Execution Node
**Goal:** Build the code playground node

**Tasks:**
- [ ] Create `CodeExecutionNode` component
- [ ] Add language selector (Python, JavaScript, Bash)
- [ ] Build code editor (Monaco Editor)
- [ ] Add output console
- [ ] Implement execution service
- [ ] Add timeout & resource limits

**Deliverable:** Code execution node in palette

---

### Day 12: Python Sandbox
**Goal:** Safe Python execution

**Tasks:**
- [ ] Set up Python virtual environment
- [ ] Install `RestrictedPython` or Docker container
- [ ] Implement stdin/stdout capture
- [ ] Add package installation support
- [ ] Test malicious code blocking

**Deliverable:** Python code executes safely

---

### Day 13: JavaScript/TypeScript Sandbox
**Goal:** Safe JS/TS execution

**Tasks:**
- [ ] Use vm2 or isolated-vm
- [ ] Add TypeScript compilation
- [ ] Implement module loading
- [ ] Add npm package support
- [ ] Test security boundaries

**Deliverable:** JS/TS code executes safely

---

### Day 14: Code Playground UI
**Goal:** Beautiful coding environment

**Tasks:**
- [ ] Integrate Monaco Editor (VS Code editor)
- [ ] Add syntax highlighting
- [ ] Add auto-completion
- [ ] Create output viewer with ANSI colors
- [ ] Add file system browser
- [ ] Create package manager UI

**Deliverable:** Professional code editing experience

**Week 2 Milestone:** 🎯 Code Playground working - agents can code!

---

## Week 3: Testing & Quality (Days 15-21)

### Day 15-16: Unit Testing
**Goal:** 80% test coverage

**Tasks:**
- [ ] Set up Vitest testing framework
- [ ] Write executor tests (20+ tests)
- [ ] Write node execution tests (15+ tests)
- [ ] Write service tests (10+ tests)
- [ ] Achieve 50% coverage minimum

**Deliverable:** 45+ unit tests passing

---

### Day 17: Integration Testing
**Goal:** Test complete workflows

**Tasks:**
- [ ] Create workflow test fixtures
- [ ] Test simple workflows (3-5 nodes)
- [ ] Test complex workflows (10+ nodes)
- [ ] Test error scenarios
- [ ] Test MCP integration

**Deliverable:** 10+ integration tests passing

---

### Day 18: E2E Testing
**Goal:** Test user journeys

**Tasks:**
- [ ] Set up Playwright for E2E
- [ ] Test workflow creation
- [ ] Test node configuration
- [ ] Test execution flow
- [ ] Test code playground

**Deliverable:** 5+ E2E tests passing

---

### Day 19: Performance Testing
**Goal:** Measure and optimize

**Tasks:**
- [ ] Add performance monitoring
- [ ] Create metrics dashboard
- [ ] Load test with large workflows
- [ ] Optimize bottlenecks
- [ ] Add performance budgets

**Deliverable:** Performance baseline established

---

### Day 20: State Management Refactor
**Goal:** Better data handling

**Tasks:**
- [ ] Add type safety to context
- [ ] Implement state versioning
- [ ] Add history trimming (prevent memory leaks)
- [ ] Create state snapshot system
- [ ] Add state debugging tools

**Deliverable:** Robust state management

---

### Day 21: Error Handling Polish
**Goal:** User-friendly errors

**Tasks:**
- [ ] Add detailed error messages
- [ ] Create error recovery suggestions
- [ ] Add error reporting UI
- [ ] Implement error analytics
- [ ] Test all error paths

**Deliverable:** Clear, actionable errors

**Week 3 Milestone:** ✅ 80% test coverage, reliable execution

---

## Week 4: Polish & Launch (Days 22-30)

### Day 22-23: Security Hardening
**Goal:** Production-ready security

**Tasks:**
- [ ] Replace `new Function()` with safe sandbox
- [ ] Add input sanitization
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Security audit & penetration testing

**Deliverable:** Security score 9/10

---

### Day 24: Input System
**Goal:** Flexible workflow inputs

**Tasks:**
- [ ] Create input configuration UI
- [ ] Add input validation
- [ ] Support multiple input types (text, file, JSON)
- [ ] Add input templates
- [ ] Test with various workflows

**Deliverable:** Customizable workflow inputs

---

### Day 25: Export/Import
**Goal:** Share workflows easily

**Tasks:**
- [ ] Implement workflow export (JSON)
- [ ] Add import validation
- [ ] Create workflow gallery UI
- [ ] Add example workflows
- [ ] Test cross-platform compatibility

**Deliverable:** Users can share workflows

---

### Day 26: Documentation
**Goal:** Comprehensive guides

**Tasks:**
- [ ] Write user guide (quickstart, tutorials)
- [ ] Create API documentation
- [ ] Add architecture diagrams
- [ ] Write code playground guide
- [ ] Create troubleshooting guide

**Deliverable:** 90% documentation coverage

---

### Day 27: UI/UX Polish
**Goal:** Delightful experience

**Tasks:**
- [ ] Add loading states & spinners
- [ ] Improve node highlighting
- [ ] Add undo/redo
- [ ] Create onboarding tour
- [ ] Polish animations

**Deliverable:** Polished, professional UI

---

### Day 28: Performance Optimization
**Goal:** Fast & smooth

**Tasks:**
- [ ] Optimize React re-renders
- [ ] Add code splitting
- [ ] Optimize bundle size
- [ ] Add lazy loading
- [ ] Benchmark improvements

**Deliverable:** <3s load time, 60fps canvas

---

### Day 29: Final Testing
**Goal:** Ship-ready quality

**Tasks:**
- [ ] Full regression testing
- [ ] Cross-browser testing
- [ ] Accessibility testing
- [ ] Mobile responsive testing
- [ ] Bug fixing marathon

**Deliverable:** Zero critical bugs

---

### Day 30: Launch Preparation
**Goal:** Release v1.0

**Tasks:**
- [ ] Create release notes
- [ ] Build demo video
- [ ] Write blog post
- [ ] Update README
- [ ] Tag v1.0 release

**Deliverable:** 🚀 Version 1.0 Released!

---

## 🎯 Key Deliverables Summary

### End of Week 1:
✅ MCP execution working  
✅ Guardrails filtering content  
✅ File search operational  
✅ User approval UI complete  
✅ Error recovery functional  
✅ Workflow validation active  

### End of Week 2:
✅ Code Playground fully functional  
✅ Python sandbox secure  
✅ JavaScript sandbox secure  
✅ Monaco Editor integrated  
✅ Multi-language support  

### End of Week 3:
✅ 80% test coverage  
✅ 45+ unit tests  
✅ 10+ integration tests  
✅ 5+ E2E tests  
✅ Performance monitoring  
✅ State management solid  

### End of Week 4:
✅ Security hardened (9/10)  
✅ Documentation complete (90%)  
✅ Export/Import working  
✅ UI/UX polished  
✅ Performance optimized  
✅ Version 1.0 released  

---

## 📈 Progress Tracking

Use this checklist to track weekly progress:

### Week 1 Progress: [ ] Complete
- [ ] Day 1-2: MCP Integration
- [ ] Day 3: Guardrails
- [ ] Day 4: File Search
- [ ] Day 5: User Approval
- [ ] Day 6: Error Recovery
- [ ] Day 7: Validation

### Week 2 Progress: [ ] Complete
- [ ] Day 8-9: Sandbox Design
- [ ] Day 10-11: Code Node
- [ ] Day 12: Python Sandbox
- [ ] Day 13: JS Sandbox
- [ ] Day 14: Playground UI

### Week 3 Progress: [ ] Complete
- [ ] Day 15-16: Unit Tests
- [ ] Day 17: Integration Tests
- [ ] Day 18: E2E Tests
- [ ] Day 19: Performance
- [ ] Day 20: State Refactor
- [ ] Day 21: Error Polish

### Week 4 Progress: [ ] Complete
- [ ] Day 22-23: Security
- [ ] Day 24: Input System
- [ ] Day 25: Export/Import
- [ ] Day 26: Documentation
- [ ] Day 27: UI Polish
- [ ] Day 28: Performance
- [ ] Day 29: Final Testing
- [ ] Day 30: Launch

---

## 🚀 Next Steps

1. **Read detailed implementation guides:**
   - `CODE_PLAYGROUND_SPEC.md` - Complete code execution design
   - `WEEK1_IMPLEMENTATION.md` - Detailed day-by-day tasks
   - `TESTING_STRATEGY.md` - Testing framework & patterns

2. **Start Day 1:**
   - Create MCP service file
   - Design server registry
   - Begin implementation

3. **Daily Standup:**
   - What did I complete yesterday?
   - What am I working on today?
   - Any blockers?

---

**Let's ship v1.0 in 30 days! 🎯**
