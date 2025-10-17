import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import type { Node, Edge, Connection, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState, useRef } from 'react';
import NodePalette from './components/NodePalette';
import Inspector from './components/Inspector';
import TopBar from './components/TopBar';
import AgentNode from './components/nodes/AgentNode';
import StartNode from './components/nodes/StartNode';
import EndNode from './components/nodes/EndNode';
import IfElseNode from './components/nodes/IfElseNode';
import TransformNode from './components/nodes/TransformNode';
import FileSearchNode from './components/nodes/FileSearchNode';
import NoteNode from './components/nodes/NoteNode';
import GuardrailsNode from './components/nodes/GuardrailsNode';
import MCPNode from './components/nodes/MCPNode';
import WhileNode from './components/nodes/WhileNode';
import UserApprovalNode from './components/nodes/UserApprovalNode';
import SetStateNode from './components/nodes/SetStateNode';
import VoiceNode from './components/nodes/VoiceNode';
import { WorkflowExecutor, type ExecutionLog } from './services/workflowExecutor';

// Define node types for React Flow
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  start: StartNode,
  end: EndNode,
  ifElse: IfElseNode,
  transform: TransformNode,
  fileSearch: FileSearchNode,
  note: NoteNode,
  guardrails: GuardrailsNode,
  mcp: MCPNode,
  while: WhileNode,
  userApproval: UserApprovalNode,
  setState: SetStateNode,
  voice: VoiceNode,
};

// ADVANCED AI RESEARCH ASSISTANT - STRESS TEST ALL FEATURES
const initialNodes: Node[] = [
  // ============= PHASE 1: INITIALIZATION & PLANNING =============
  
  // Row 1: Start
  {
    id: 'start-1',
    type: 'start',
    position: { x: 800, y: 50 },
    data: { label: '🚀 Research Start' },
  },
  
  // Row 2: Initialize Research State
  {
    id: 'setState-init',
    type: 'setState',
    position: { x: 800, y: 180 },
    data: { 
      label: 'Initialize Research',
      stateKey: 'researchPhase',
      stateValue: 'planning'
    },
  },
  
  // Row 3: Research Planning Agent
  {
    id: 'agent-planner',
    type: 'agent',
    position: { x: 800, y: 310 },
    data: { 
      label: '🧠 Research Planner',
      instructions: `You are a research planning expert. Analyze this topic and create a research plan.

Topic: {input}

Create a JSON research plan with:
1. Main questions to answer (3-5 questions)
2. Key areas to investigate
3. Expected insights

Respond ONLY with valid JSON in this format:
{
  "questions": ["Q1", "Q2", "Q3"],
  "areas": ["Area1", "Area2"],
  "insights": ["Expected insight 1", "Expected insight 2"]
}`,
      model: 'llama3.1:8b',
      reasoningEffort: 'high',
      includeHistory: false,
      tools: []
    },
  },
  
  // Row 4: Validate Plan (Guardrails)
  {
    id: 'guardrails-plan',
    type: 'guardrails',
    position: { x: 800, y: 470 },
    data: { 
      label: '✅ Validate Plan',
      rules: [
        'Must be valid JSON',
        'Must contain questions array',
        'Professional and factual only',
        'No speculation'
      ]
    },
  },
  
  // ============= PHASE 2: MULTI-PATH RESEARCH =============
  
  // Row 5: Research Coordinator (Transform to prepare parallel research)
  {
    id: 'transform-coordinator',
    type: 'transform',
    position: { x: 800, y: 600 },
    data: { 
      label: '🎯 Research Coordinator',
      code: `// Extract research questions and prepare for parallel processing
try {
  const plan = typeof input === 'string' ? JSON.parse(input) : input;
  return {
    plan: plan,
    questions: plan.questions || [],
    questionCount: (plan.questions || []).length,
    timestamp: new Date().toISOString()
  };
} catch (e) {
  return { error: 'Invalid plan', questions: ['What is this topic about?'] };
}`
    },
  },
  
  // Row 6: Branch - Decide research depth
  {
    id: 'ifElse-depth',
    type: 'ifElse',
    position: { x: 800, y: 760 },
    data: { 
      label: '🔍 Deep Research?',
      condition: `// Deep research if 3+ questions
const data = typeof input === 'object' ? input : { questionCount: 1 };
return (data.questionCount || 0) >= 3;`
    },
  },
  
  // === TRUE BRANCH: Deep Research Path ===
  
  // Row 7a: Sequential Thinking MCP - Break down complex problems
  {
    id: 'mcp-sequential-1',
    type: 'mcp',
    position: { x: 400, y: 920 },
    data: { 
      label: '🧠 Sequential Thinking MCP',
      serverName: 'sequential-thinking',
      operation: 'analyze',
      config: {
        requiresAuth: false,
        description: 'Step-by-step analysis of research questions'
      }
    },
  },
  
  // Row 8a: File Search - Search codebase for relevant info
  {
    id: 'fileSearch-docs',
    type: 'fileSearch',
    position: { x: 400, y: 1080 },
    data: { 
      label: '📁 Search Documentation',
      searchQuery: '{input}',
      searchPath: '.'
    },
  },
  
  // Row 9a: Memory MCP - Store findings
  {
    id: 'mcp-memory-store',
    type: 'mcp',
    position: { x: 400, y: 1240 },
    data: { 
      label: '💭 Memory Store',
      serverName: 'memory',
      operation: 'store',
      config: {
        requiresAuth: false,
        description: 'Store research findings in memory'
      }
    },
  },
  
  // Row 10a: Deep Research Agent
  {
    id: 'agent-deep',
    type: 'agent',
    position: { x: 400, y: 1400 },
    data: { 
      label: '🔬 Deep Research Agent',
      instructions: `You are a thorough research analyst. Based on the analysis and documentation:

Context: {input}

Provide comprehensive findings with:
1. Key insights (3-5 points)
2. Supporting evidence
3. Potential limitations

Be thorough and cite specific details.`,
      model: 'llama3.1:8b',
      reasoningEffort: 'high',
      includeHistory: true,
      tools: []
    },
  },
  
  // === FALSE BRANCH: Quick Research Path ===
  
  // Row 7b: Filesystem MCP - Quick file analysis
  {
    id: 'mcp-filesystem',
    type: 'mcp',
    position: { x: 1200, y: 920 },
    data: { 
      label: '📂 Filesystem MCP',
      serverName: 'filesystem',
      operation: 'search',
      config: {
        requiresAuth: false,
        description: 'Quick filesystem search'
      }
    },
  },
  
  // Row 8b: Quick Research Agent
  {
    id: 'agent-quick',
    type: 'agent',
    position: { x: 1200, y: 1080 },
    data: { 
      label: '⚡ Quick Research Agent',
      instructions: `Provide a concise summary of this topic:

{input}

Focus on the most important points in 2-3 sentences.`,
      model: 'llama3.2:3b',
      reasoningEffort: 'low',
      includeHistory: false,
      tools: []
    },
  },
  
  // ============= PHASE 3: VALIDATION & ITERATION =============
  
  // Row 11: Merge Research Paths
  {
    id: 'transform-merge',
    type: 'transform',
    position: { x: 800, y: 1560 },
    data: { 
      label: '🔄 Merge Findings',
      code: `// Combine research findings
return {
  findings: String(input),
  phase: state.researchPhase || 'research',
  timestamp: new Date().toISOString(),
  iteration: (state.researchIteration || 0)
};`
    },
  },
  
  // Row 12: Quality Check (Guardrails)
  {
    id: 'guardrails-quality',
    type: 'guardrails',
    position: { x: 800, y: 1720 },
    data: { 
      label: '🛡️ Quality Check',
      rules: [
        'Must be factual and evidence-based',
        'No unsupported claims',
        'Professional tone required',
        'Minimum 50 characters'
      ]
    },
  },
  
  // Row 13: Iteration Loop (While)
  {
    id: 'while-iterate',
    type: 'while',
    position: { x: 800, y: 1880 },
    data: { 
      label: '🔁 Refinement Loop',
      condition: `// Iterate max 2 times for refinement
const iteration = state.researchIteration || 0;
const needsRefinement = state.needsRefinement || false;
return iteration < 2 && needsRefinement;`,
      maxIterations: 3
    },
  },
  
  // Row 14a: Inside Loop - Increment Iteration
  {
    id: 'setState-iterate',
    type: 'setState',
    position: { x: 550, y: 2040 },
    data: { 
      label: '📊 Track Iteration',
      stateKey: 'researchIteration',
      stateValue: '{state.researchIteration + 1}'
    },
  },
  
  // Row 15a: Inside Loop - Refine with Reasoning
  {
    id: 'agent-refine',
    type: 'agent',
    position: { x: 550, y: 2200 },
    data: { 
      label: '✨ Refine Research',
      instructions: `Improve this research finding. Make it clearer and more comprehensive:

{input}

Add more specific details and examples.`,
      model: 'phi3:3.8b',
      reasoningEffort: 'medium',
      includeHistory: true,
      tools: []
    },
  },
  
  // ============= PHASE 4: SYNTHESIS & WEB RESEARCH =============
  
  // Row 14b: After Loop - Playwright MCP for web research
  {
    id: 'mcp-playwright',
    type: 'mcp',
    position: { x: 1050, y: 2040 },
    data: { 
      label: '🎭 Playwright Web Research',
      serverName: 'playwright',
      operation: 'search-docs',
      config: {
        requiresAuth: false,
        description: 'Browser automation for additional context'
      }
    },
  },
  
  // Row 15b: Fetch MCP - Additional web data
  {
    id: 'mcp-fetch',
    type: 'mcp',
    position: { x: 1050, y: 2200 },
    data: { 
      label: '🌐 Fetch Additional Data',
      serverName: 'fetch',
      operation: 'fetch',
      config: {
        requiresAuth: false,
        description: 'Fetch web pages for context'
      }
    },
  },
  
  // Row 16: Synthesis Agent (Combine all sources)
  {
    id: 'agent-synthesis',
    type: 'agent',
    position: { x: 800, y: 2360 },
    data: { 
      label: '🎨 Synthesis Agent',
      instructions: `You are a synthesis expert. Combine all research findings into a coherent analysis:

Research Data: {input}

Create a comprehensive synthesis that:
1. Summarizes key findings
2. Identifies patterns and connections  
3. Provides actionable insights

Be thorough but concise.`,
      model: 'llama3.1:8b',
      reasoningEffort: 'high',
      includeHistory: true,
      tools: []
    },
  },
  
  // ============= PHASE 5: VALIDATION & APPROVAL =============
  
  // Row 17: Transform for Analysis
  {
    id: 'transform-analyze',
    type: 'transform',
    position: { x: 800, y: 2520 },
    data: { 
      label: '📈 Analyze Results',
      code: `// Analyze the synthesis quality
const text = String(input);
const wordCount = text.split(/\\s+/).length;
const hasStructure = text.includes('1.') || text.includes('•');
const isComprehensive = wordCount > 100;

return {
  synthesis: text,
  quality: {
    wordCount: wordCount,
    hasStructure: hasStructure,
    isComprehensive: isComprehensive,
    score: (hasStructure ? 50 : 0) + (isComprehensive ? 50 : 0)
  }
};`
    },
  },
  
  // Row 18: Quality Branch
  {
    id: 'ifElse-quality',
    type: 'ifElse',
    position: { x: 800, y: 2680 },
    data: { 
      label: '✅ Quality Check',
      condition: `// Check if quality score >= 50
const data = typeof input === 'object' ? input : { quality: { score: 0 } };
return (data.quality?.score || 0) >= 50;`
    },
  },
  
  // Row 19a: TRUE - High Quality Path
  {
    id: 'userApproval-final',
    type: 'userApproval',
    position: { x: 600, y: 2840 },
    data: { 
      label: '👤 Human Review',
      approvalMessage: 'Review the research synthesis. Approve to continue to report generation.'
    },
  },
  
  // Row 19b: FALSE - Low Quality - Re-synthesize
  {
    id: 'transform-retry',
    type: 'transform',
    position: { x: 1000, y: 2840 },
    data: { 
      label: '🔄 Mark for Retry',
      code: `// Mark for retry
state.needsRefinement = true;
return input;`
    },
  },
  
  // ============= PHASE 6: REPORT GENERATION =============
  
  // Row 20: Update Phase State
  {
    id: 'setState-report',
    type: 'setState',
    position: { x: 800, y: 3000 },
    data: { 
      label: '📋 Report Phase',
      stateKey: 'researchPhase',
      stateValue: 'reporting'
    },
  },
  
  // Row 21: Executive Summary Agent
  {
    id: 'agent-executive',
    type: 'agent',
    position: { x: 800, y: 3160 },
    data: { 
      label: '📊 Executive Summary',
      instructions: `Create a concise executive summary of this research:

{input}

Format:
- Title (one line)
- Key Findings (3 bullet points)
- Recommendation (1-2 sentences)

Be clear and actionable.`,
      model: 'llama3.2:3b',
      reasoningEffort: 'medium',
      includeHistory: false,
      tools: []
    },
  },
  
  // Row 22: Report Formatter (Transform)
  {
    id: 'transform-format',
    type: 'transform',
    position: { x: 800, y: 3320 },
    data: { 
      label: '📄 Format Report',
      code: `// Format final report
const summary = String(input);
const fullReport = {
  title: 'AI Research Report',
  generated: new Date().toLocaleString(),
  executiveSummary: summary,
  iterations: state.researchIteration || 0,
  phase: state.researchPhase,
  status: 'Complete'
};

return JSON.stringify(fullReport, null, 2);`
    },
  },
  
  // Row 23: Memory Store Final Results
  {
    id: 'mcp-memory-final',
    type: 'mcp',
    position: { x: 800, y: 3480 },
    data: { 
      label: '💾 Archive Report',
      serverName: 'memory',
      operation: 'store-final',
      config: {
        requiresAuth: false,
        description: 'Archive final research report'
      }
    },
  },
  
  // Row 24: Final Guardrails
  {
    id: 'guardrails-final',
    type: 'guardrails',
    position: { x: 800, y: 3640 },
    data: { 
      label: '🔒 Final Validation',
      rules: [
        'Must be valid JSON',
        'Must contain executive summary',
        'Professional language only',
        'Complete report structure'
      ]
    },
  },
  
  // ============= PHASE 7: OUTPUT & VOICE =============
  
  // Row 25: Create Voice Script
  {
    id: 'agent-voice-script',
    type: 'agent',
    position: { x: 800, y: 3800 },
    data: { 
      label: '🎤 Voice Script Writer',
      instructions: `Convert this research report into a natural voice script:

{input}

Create a 2-3 sentence narration that sounds natural when spoken aloud. 
Focus on the most important findings.`,
      model: 'llama3.2:3b',
      reasoningEffort: 'low',
      includeHistory: false,
      tools: []
    },
  },
  
  // Row 26: Voice Output (Multiple voices for comparison)
  {
    id: 'voice-male',
    type: 'voice',
    position: { x: 600, y: 3960 },
    data: { 
      label: '🗣️ Male Voice',
      voice: 'male',
      voiceName: 'en-US-GuyNeural',
      speed: 1.0,
      outputFile: 'research-male.mp3'
    },
  },
  
  // Row 26b: Female Voice
  {
    id: 'voice-female',
    type: 'voice',
    position: { x: 1000, y: 3960 },
    data: { 
      label: '🗣️ Female Voice',
      voice: 'female',
      voiceName: 'en-US-AriaNeural',
      speed: 1.1,
      outputFile: 'research-female.mp3'
    },
  },
  
  // Row 27: Final Summary Transform
  {
    id: 'transform-final',
    type: 'transform',
    position: { x: 800, y: 4120 },
    data: { 
      label: '📊 Generate Statistics',
      code: `// Generate final statistics
return {
  message: 'Research Complete!',
  stats: {
    totalNodes: 27,
    mcpServersUsed: 5,
    agentsDeployed: 7,
    iterations: state.researchIteration || 0,
    phase: state.researchPhase,
    timestamp: new Date().toISOString()
  }
};`
    },
  },
  
  // ============= DOCUMENTATION & END =============
  
  // Row 28: Documentation Note (Left Side)
  {
    id: 'note-system',
    type: 'note',
    position: { x: 100, y: 100 },
    data: { 
      label: '🎯 System Architecture',
      content: `AI RESEARCH ASSISTANT

PHASES:
1️⃣ Planning - Strategic research plan
2️⃣ Multi-Path Research - Parallel investigation
3️⃣ Validation - Quality checks & iteration
4️⃣ Web Research - Browser & fetch MCPs
5️⃣ Synthesis - Combine all findings
6️⃣ Approval - Human review gate
7️⃣ Report - Executive summary & voice

FEATURES TESTED:
✅ 7 Agent nodes (4 models)
✅ 5 MCP servers (no auth)
✅ 2 While loops
✅ 3 If/Else branches
✅ 6 Transform nodes
✅ 4 Set State nodes
✅ 4 Guardrails nodes
✅ 2 Voice outputs
✅ 1 User approval
✅ 1 File search

COMPLEXITY:
• Multi-path reasoning
• Iterative refinement
• Quality validation
• Memory persistence
• Voice narration`
    },
  },
  
  // Row 29: MCP Servers Note (Right Side)
  {
    id: 'note-mcp',
    type: 'note',
    position: { x: 1500, y: 100 },
    data: { 
      label: '🔌 MCP Servers Used',
      content: `NO-AUTH MCP SERVERS:

1. 🧠 Sequential Thinking
   • Deep problem analysis
   • Step-by-step reasoning
   • Used in deep research path

2. 💭 Memory
   • Store research findings
   • Archive final reports
   • Persistence layer

3. 📂 Filesystem
   • Quick file searches
   • Document analysis
   • Used in quick path

4. 🎭 Playwright
   • Browser automation
   • Web scraping
   • Dynamic content

5. 🌐 Fetch
   • HTTP requests
   • API integration
   • Data retrieval

ALL WORKING WITHOUT API KEYS!`
    },
  },
  
  // Row 30: End Node
  {
    id: 'end-1',
    type: 'end',
    position: { x: 800, y: 4280 },
    data: { label: '🎉 Research Complete!' },
  },
];

const initialEdges: Edge[] = [
  // ===== PHASE 1: INITIALIZATION & PLANNING =====
  // Start → Initialize State
  { id: 'e1', source: 'start-1', target: 'setState-init' },
  
  // Initialize State → Strategic Planner Agent
  { id: 'e2', source: 'setState-init', target: 'agent-planner' },
  
  // Strategic Planner → Quality Guardrails
  { id: 'e3', source: 'agent-planner', target: 'guardrails-plan' },
  
  // Quality Guardrails → Research Coordinator Transform
  { id: 'e4', source: 'guardrails-plan', target: 'transform-coordinator' },
  
  // Research Coordinator → Depth Branch
  { id: 'e4b', source: 'transform-coordinator', target: 'ifElse-depth' },
  
  // ===== PHASE 2: MULTI-PATH RESEARCH =====
  // DEEP RESEARCH PATH (true branch - 3+ questions)
  { id: 'e5', source: 'ifElse-depth', sourceHandle: 'true', target: 'mcp-sequential-1' },
  { id: 'e6', source: 'mcp-sequential-1', target: 'fileSearch-docs' },
  { id: 'e7', source: 'fileSearch-docs', target: 'mcp-memory-store' },
  { id: 'e8', source: 'mcp-memory-store', target: 'agent-deep' },
  
  // QUICK RESEARCH PATH (false branch - fewer questions)
  { id: 'e9', source: 'ifElse-depth', sourceHandle: 'false', target: 'mcp-filesystem' },
  { id: 'e10', source: 'mcp-filesystem', target: 'agent-quick' },
  
  // Both paths converge → Merge Transform
  { id: 'e11', source: 'agent-deep', target: 'transform-merge' },
  { id: 'e12', source: 'agent-quick', target: 'transform-merge' },
  
  // ===== PHASE 3: VALIDATION & ITERATION =====
  // Merge → Initial Quality Check
  { id: 'e13', source: 'transform-merge', target: 'guardrails-quality' },
  
  // Quality Check → Iteration Loop
  { id: 'e14', source: 'guardrails-quality', target: 'while-iterate' },
  
  // WHILE LOOP BODY (iterate if needed)
  { id: 'e15', source: 'while-iterate', sourceHandle: 'body', target: 'setState-iterate' },
  { id: 'e16', source: 'setState-iterate', target: 'agent-refine' },
  { id: 'e17', source: 'agent-refine', target: 'while-iterate' }, // Loop back
  
  // WHILE LOOP EXIT (done iterating)
  { id: 'e18', source: 'while-iterate', sourceHandle: 'exit', target: 'mcp-playwright' },
  
  // ===== PHASE 4: WEB RESEARCH & SYNTHESIS =====
  // Web Research with Playwright
  { id: 'e19', source: 'mcp-playwright', target: 'mcp-fetch' },
  { id: 'e20', source: 'mcp-fetch', target: 'agent-synthesis' },
  
  // ===== PHASE 5: VALIDATION & APPROVAL =====
  // Synthesis → Analysis Transform
  { id: 'e21', source: 'agent-synthesis', target: 'transform-analyze' },
  
  // Analysis → Final Quality Branch
  { id: 'e22', source: 'transform-analyze', target: 'ifElse-quality' },
  
  // HIGH QUALITY (≥8) → User Approval
  { id: 'e23', source: 'ifElse-quality', sourceHandle: 'true', target: 'userApproval-final' },
  
  // LOW QUALITY (<8) → Retry Transform
  { id: 'e24', source: 'ifElse-quality', sourceHandle: 'false', target: 'transform-retry' },
  { id: 'e25', source: 'transform-retry', target: 'mcp-playwright' }, // Back to web research
  
  // ===== PHASE 6: REPORT GENERATION =====
  // User Approval → Set Report State
  { id: 'e26', source: 'userApproval-final', target: 'setState-report' },
  
  // Report State → Executive Summary Agent
  { id: 'e27', source: 'setState-report', target: 'agent-executive' },
  
  // Executive Summary → Format Transform
  { id: 'e28', source: 'agent-executive', target: 'transform-format' },
  
  // Format → Memory Storage
  { id: 'e29', source: 'transform-format', target: 'mcp-memory-final' },
  
  // Memory Storage → Final Guardrails
  { id: 'e30', source: 'mcp-memory-final', target: 'guardrails-final' },
  
  // ===== PHASE 7: OUTPUT & VOICE NARRATION =====
  // Final Guardrails → Voice Script Agent
  { id: 'e31', source: 'guardrails-final', target: 'agent-voice-script' },
  
  // Voice Script → Split for Dual Narration
  { id: 'e32', source: 'agent-voice-script', target: 'voice-male' },
  { id: 'e33', source: 'agent-voice-script', target: 'voice-female' },
  
  // Voice outputs → Final Stats Transform
  { id: 'e34', source: 'voice-male', target: 'transform-final' },
  { id: 'e35', source: 'voice-female', target: 'transform-final' },
  
  // Stats → End
  { id: 'e36', source: 'transform-final', target: 'end-1' },
];

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [logsCollapsed, setLogsCollapsed] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const dropCountRef = useRef(0);
  const executorRef = useRef<WorkflowExecutor | null>(null);

  // Execute workflow
  const handleExecute = useCallback(async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    setExecutionLogs([]);
    setShowLogs(true);

    try {
      const executor = new WorkflowExecutor(
        nodes,
        edges,
        'My score is 75 points', // Initial input with score
        (log) => {
          // Real-time log callback
          setExecutionLogs(prev => [...prev, log]);
        }
      );
      
      executorRef.current = executor;

      const { result, logs } = await executor.execute();
      console.log('✅ Execution complete:', result);
      setExecutionLogs(logs);
      alert(`Workflow completed!\n\nResult: ${result}`);
    } catch (error) {
      console.error('❌ Execution failed:', error);
      alert(`Workflow failed:\n\n${error}`);
    } finally {
      setIsExecuting(false);
      executorRef.current = null;
    }
  }, [nodes, edges, isExecuting]);

  // Stop workflow execution
  const handleStop = useCallback(() => {
    if (executorRef.current) {
      console.log('⏹ Stopping workflow execution...');
      // For now, just set executing to false
      // TODO: Implement proper cancellation in WorkflowExecutor
      setIsExecuting(false);
      executorRef.current = null;
      setExecutionLogs(prev => [...prev, {
        timestamp: Date.now(),
        nodeId: 'system',
        nodeType: 'system',
        nodeName: 'System',
        input: null,
        output: 'Execution stopped by user',
        duration: 0,
        error: 'Workflow execution stopped by user'
      }]);
      alert('Workflow execution stopped');
    }
  }, []);

  // Save workflow
  const handleSave = useCallback(() => {
    const workflow = {
      nodes,
      edges,
      version: '1.0',
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('agent-builder-workflow', JSON.stringify(workflow));
    console.log('💾 Workflow saved');
    alert('Workflow saved successfully!');
  }, [nodes, edges]);

  // Load workflow
  const handleLoad = useCallback(() => {
    try {
      const saved = localStorage.getItem('agent-builder-workflow');
      if (!saved) {
        alert('No saved workflow found');
        return;
      }
      const workflow = JSON.parse(saved);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      console.log('📂 Workflow loaded');
      alert('Workflow loaded successfully!');
    } catch (error) {
      console.error('Failed to load workflow:', error);
      alert('Failed to load workflow');
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Drag and drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      // Check if this is an MCP server with pre-configured data
      const mcpServerDataStr = event.dataTransfer.getData('mcpServer');
      let mcpServerData = null;
      if (mcpServerDataStr) {
        try {
          mcpServerData = JSON.parse(mcpServerDataStr);
        } catch (e) {
          console.error('Failed to parse MCP server data:', e);
        }
      }

      // Use React Flow's screenToFlowPosition for accurate positioning
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Add smart offset to prevent stacking
      const offset = (dropCountRef.current % 5) * 40;
      position.x += offset;
      position.y += offset;
      dropCountRef.current += 1;

      // Prepare node data
      let nodeData: any = {};
      
      if (type === 'mcp' && mcpServerData) {
        // Pre-configure MCP node with server details
        nodeData = {
          label: mcpServerData.label || 'MCP Server',
          serverName: mcpServerData.serverName,
          operation: mcpServerData.operation || 'process',
          config: {
            requiresAuth: mcpServerData.requiresAuth || false,
            description: mcpServerData.description || ''
          }
        };
      } else {
        // Default node data
        nodeData = { 
          label: type === 'agent' ? 'New Agent' : 
                 type === 'end' ? 'End' :
                 type === 'note' ? 'Note' :
                 type === 'fileSearch' ? 'File Search' :
                 type === 'guardrails' ? 'Guardrails' :
                 type === 'mcp' ? 'MCP' :
                 type === 'ifElse' ? 'If/Else' :
                 type === 'while' ? 'While' :
                 type === 'userApproval' ? 'User Approval' :
                 type === 'transform' ? 'Transform' :
                 type === 'setState' ? 'Set State' : 
                 type === 'voice' ? 'Voice Output' : 'Node',
          instructions: ''
        };
      }

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
      // Auto-select the new node
      setSelectedNode(newNode);
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Top Bar */}
      <TopBar 
        onSave={handleSave}
        onExecute={handleExecute}
        onStop={handleStop}
        isExecuting={isExecuting}
      />

      {/* Main Content - 3 Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Node Palette */}
        <NodePalette />

        {/* Center Panel - Canvas */}
        <div className="flex-1 bg-gray-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            minZoom={0.01}
            maxZoom={4}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#b1b1b7', strokeWidth: 2 },
            }}
          >
            <Background color="#e5e7eb" gap={16} />
            <Controls showInteractive={false} />
            <MiniMap />
          </ReactFlow>
        </div>

        {/* Right Panel - Inspector */}
        <Inspector 
          selectedNode={selectedNode ? nodes.find(n => n.id === selectedNode.id) || selectedNode : null}
          onUpdateNode={(nodeId: string, updates: any) => {
            setNodes((nds) => 
              nds.map((node) => 
                node.id === nodeId 
                  ? { ...node, data: { ...node.data, ...updates } }
                  : node
              )
            );
          }}
          onDeleteNode={(nodeId: string) => {
            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
            setSelectedNode(null);
          }}
        />
      </div>

      {/* Execution Logs Panel */}
      {showLogs && (
        <div className={`fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-700 transition-all duration-300 ${logsCollapsed ? 'h-12' : 'h-64'}`} style={{ zIndex: 40 }}>
          <div className="flex justify-between items-center p-4">
            <h3 className="text-lg font-semibold">Execution Logs</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setLogsCollapsed(!logsCollapsed)}
                className="text-gray-400 hover:text-white px-2"
                title={logsCollapsed ? 'Expand logs' : 'Collapse logs'}
              >
                {logsCollapsed ? '▲' : '▼'}
              </button>
              <button
                onClick={() => setShowLogs(false)}
                className="text-gray-400 hover:text-white"
                title="Close logs"
              >
                ✕
              </button>
            </div>
          </div>
          {!logsCollapsed && (
            <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(16rem - 4rem)' }}>
              <div className="space-y-2 font-mono text-sm">
                {executionLogs.map((log, i) => (
                  <div key={i} className={`p-2 rounded ${log.error ? 'bg-red-900/30' : 'bg-gray-800'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="font-semibold">{log.nodeName}</span>
                      <span className="text-gray-500">({log.duration}ms)</span>
                    </div>
                    {log.error && <div className="text-red-400 mt-1">Error: {log.error}</div>}
                    {log.output && <div className="text-green-400 mt-1">Output: {String(log.output).substring(0, 200)}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}

export default App;
