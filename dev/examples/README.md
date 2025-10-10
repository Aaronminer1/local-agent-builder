# 🎯 Example Agentic Systems

This directory contains example workflows demonstrating the power and scalability of the local agent builder.

---

## 📚 Available Examples

### 1. 🧪 Simple Test Workflow (12 nodes)
**File:** `/dev/testing/test-workflow-comprehensive.json`  
**Purpose:** Test all node types  
**Complexity:** Low  
**Use Case:** System validation and testing

**Features:**
- Tests all 12 node types
- Linear flow
- Simple data transformations
- Execution time: ~40 seconds

---

### 2. 🧠 Advanced Research Agent (28 nodes)
**File:** `/dev/testing/advanced-research-agent.json`  
**Documentation:** `ADVANCED-RESEARCH-AGENT.md`  
**Purpose:** Autonomous research and content creation  
**Complexity:** High  
**Use Case:** Research reports, articles, documentation

**Features:**
- 12 specialized agents
- 2 nested loops (research + improvement)
- Quality gates and validation
- Iterative refinement
- State management
- Execution time: 2-5 minutes

**Highlights:**
- ✅ Multi-agent collaboration
- ✅ Iterative loops with accumulation
- ✅ Quality-based branching
- ✅ Bounded iteration (prevents infinite loops)
- ✅ Human-in-the-loop approval
- ✅ Production-ready output

---

### 3. 🌐 Multi-Domain Expert System (50-100+ nodes)
**Documentation:** `MULTI-DOMAIN-EXPERT-SYSTEM.md`  
**Purpose:** Complex decision analysis from multiple expert perspectives  
**Complexity:** Very High  
**Use Case:** Business decisions, strategic planning, crisis response

**Features:**
- 20+ specialized expert agents
- Parallel processing (5+ branches)
- Cross-domain validation
- Conflict detection and resolution
- Scenario modeling
- Consensus building
- Execution time: 10-30 minutes

**Highlights:**
- ✅ Parallel agent execution
- ✅ Domain expertise specialization
- ✅ Automated debate and consensus
- ✅ Hierarchical expert structures
- ✅ Confidence-weighted synthesis
- ✅ Enterprise-grade decisions

---

## 🎯 Complexity Comparison

| Example | Nodes | Agents | Loops | Branches | Time | Complexity |
|---------|-------|--------|-------|----------|------|------------|
| Simple Test | 12 | 1 | 1 | 0 | 40s | Low |
| Research Agent | 28 | 12 | 2 | 2 | 2-5m | High |
| Expert System | 100+ | 20+ | 5+ | 10+ | 10-30m | Very High |

---

## 🚀 Scaling Patterns

### Pattern 1: Linear Pipeline (Simple)
```
A → B → C → D → E
```
**Use:** Simple transformations, testing

---

### Pattern 2: Loop with Accumulation (Medium)
```
Init → While [ Process → Validate → Store ] → Synthesize
```
**Use:** Iterative processing, data collection

---

### Pattern 3: Quality Gates (Medium-High)
```
Process → Score → Gate → (Pass: Continue | Fail: Retry)
```
**Use:** Quality assurance, validation

---

### Pattern 4: Parallel Processing (High)
```
        ┌─→ Expert A ─┐
Split ──┼─→ Expert B ─┼─→ Synthesize
        └─→ Expert C ─┘
```
**Use:** Multi-perspective analysis, speed

---

### Pattern 5: Hierarchical Experts (Very High)
```
Problem → Domain Router → 
  Financial ─┬─→ Cost Analyst
             ├─→ Revenue Analyst
             └─→ Tax Specialist → Synthesize
```
**Use:** Deep expertise, complex domains

---

### Pattern 6: Iterative Consensus (Very High)
```
While (no consensus) {
  Experts Analyze → Detect Conflicts → 
  Debate → Refine → Check Consensus
}
```
**Use:** Critical decisions, conflict resolution

---

## 💡 How to Use These Examples

### 1. Load Example Workflow
```javascript
// In browser console or via Playwright
const workflow = await fetch('/path/to/workflow.json').then(r => r.json());
localStorage.setItem('agent-builder-autosave', JSON.stringify(workflow));
location.reload();
```

### 2. Customize for Your Use Case
- Modify agent instructions
- Adjust loop iterations
- Change quality thresholds
- Add/remove nodes
- Adjust branching logic

### 3. Test and Iterate
- Start with simple input
- Monitor execution logs
- Adjust based on results
- Scale up complexity

---

## 🎓 Learning Path

### Beginner: Start with Simple Test
1. Load the 12-node test workflow
2. Run with simple input
3. Observe execution flow
4. Understand each node type

### Intermediate: Study Research Agent
1. Load the 28-node research workflow
2. Understand loop patterns
3. Study quality gates
4. Learn state management
5. Modify for your domain

### Advanced: Build Expert System
1. Study multi-domain patterns
2. Implement parallel processing
3. Add conflict resolution
4. Build consensus mechanisms
5. Scale to 100+ nodes

---

## 🔧 Customization Guide

### Add More Agents
```json
{
  "id": "new-expert",
  "type": "agent",
  "data": {
    "label": "Domain Expert",
    "instructions": "Your specialized instructions",
    "model": "llama3.1:8b"
  }
}
```

### Add Quality Gates
```json
{
  "id": "quality-check",
  "type": "ifElse",
  "data": {
    "condition": "return parseFloat(input) >= threshold;"
  }
}
```

### Add Loops
```json
{
  "id": "processing-loop",
  "type": "while",
  "data": {
    "condition": "return state.counter < max;",
    "maxIterations": 10
  }
}
```

### Add State Management
```json
{
  "id": "store-data",
  "type": "setState",
  "data": {
    "key": "accumulated_data",
    "value": "{{input}}"
  }
}
```

---

## 📊 Real-World Applications

### 1. Content Creation
- Research Agent → Blog posts, articles, reports
- Expert System → Multi-perspective analysis

### 2. Business Intelligence
- Research Agent → Market research, competitor analysis
- Expert System → Strategic planning, decision support

### 3. Technical Documentation
- Research Agent → API docs, tutorials, guides
- Expert System → Architecture reviews, tech decisions

### 4. Customer Support
- Research Agent → Knowledge base articles
- Expert System → Complex issue resolution

### 5. Legal & Compliance
- Research Agent → Case research, precedent analysis
- Expert System → Multi-attorney case review

### 6. Healthcare
- Research Agent → Medical literature review
- Expert System → Multi-specialist diagnosis

### 7. Finance
- Research Agent → Investment research
- Expert System → Portfolio analysis, risk assessment

---

## 🚀 Next Steps

### To Build Your Own Complex System:

1. **Start Simple**
   - Begin with 5-10 nodes
   - Test basic flow
   - Validate each node

2. **Add Complexity Gradually**
   - Add one loop at a time
   - Add one branch at a time
   - Test after each addition

3. **Use Patterns**
   - Copy proven patterns
   - Adapt to your domain
   - Combine patterns

4. **Scale Up**
   - Add more agents
   - Add more loops
   - Add more branches
   - Add more validation

5. **Optimize**
   - Remove bottlenecks
   - Parallelize where possible
   - Cache repeated work
   - Tune quality thresholds

---

## 📈 Performance Tips

### 1. Parallel Processing
- Use multiple branches for independent tasks
- Reduces total execution time
- Increases throughput

### 2. Smart Caching
- Store expensive computations in state
- Reuse across iterations
- Avoid redundant LLM calls

### 3. Quality Thresholds
- Set realistic thresholds (not too high)
- Limit retry iterations (2-3 max)
- Accept "good enough" results

### 4. Model Selection
- Use smaller models for simple tasks
- Use larger models for complex reasoning
- Balance speed vs quality

### 5. Loop Bounds
- Always set max iterations
- Use reasonable limits (5-10)
- Prevent infinite loops

---

## 🎯 Success Metrics

### Simple Workflow (12 nodes)
- ✅ Execution time: < 1 minute
- ✅ Success rate: > 95%
- ✅ All nodes execute

### Complex Workflow (28 nodes)
- ✅ Execution time: 2-5 minutes
- ✅ Success rate: > 90%
- ✅ Quality score: > 7/10

### Enterprise Workflow (100+ nodes)
- ✅ Execution time: 10-30 minutes
- ✅ Success rate: > 85%
- ✅ Consensus reached: > 80%

---

## 📚 Additional Resources

- `/dev/testing/` - Test workflows and results
- `/dev/bugs/` - Known issues and fixes
- `/dev/examples/` - This directory
- `/docs/` - System documentation

---

**Start with the simple test, learn from the research agent, and scale to the expert system!** 🚀

**These examples demonstrate that the local agent builder can handle production-grade, complex agentic systems with 100+ nodes!** 🎉
