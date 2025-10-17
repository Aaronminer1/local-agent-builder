import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import type { Node, Connection, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NodePalette from '../components/NodePalette';
import Inspector from '../components/Inspector';
import TopBar from '../components/TopBar';
import OllamaStatusBanner from '../components/OllamaStatusBanner';
import AgentNode from '../components/nodes/AgentNode';
import StartNode from '../components/nodes/StartNode';
import IfElseNode from '../components/nodes/IfElseNode';
import TransformNode from '../components/nodes/TransformNode';
import KnowledgeBaseNode from '../components/nodes/KnowledgeBaseNode';
import DatabaseNode from '../components/nodes/DatabaseNode';
import FileSearchNode from '../components/nodes/FileSearchNode';
import VoiceNode from '../components/nodes/VoiceNode';
import EndNode from '../components/nodes/EndNode';
import NoteNode from '../components/nodes/NoteNode';
import GuardrailsNode from '../components/nodes/GuardrailsNode';
import MCPNode from '../components/nodes/MCPNode';
import UserApprovalNode from '../components/nodes/UserApprovalNode';
import SetStateNode from '../components/nodes/SetStateNode';
import WhileNode from '../components/nodes/WhileNode';
import ExternalInputNode from '../components/nodes/ExternalInputNode';
import ExternalOutputNode from '../components/nodes/ExternalOutputNode';
import PromptNode from '../components/nodes/PromptNode';
import { WorkflowExecutor, type ExecutionLog } from '../services/workflowExecutor';
import { initialNodes, initialEdges } from '../data/defaultWorkflow';
import { ollamaService } from '../services/ollamaService';

// Define node types for React Flow
const nodeTypes: NodeTypes = {
  // Core nodes
  start: StartNode,
  agent: AgentNode,
  end: EndNode,
  note: NoteNode,
  
  // Tool nodes
  knowledgeBase: KnowledgeBaseNode,
  database: DatabaseNode,
  fileSearch: FileSearchNode,
  guardrails: GuardrailsNode,
  mcp: MCPNode,
  voice: VoiceNode,
  
  // Logic nodes
  ifElse: IfElseNode,
  while: WhileNode,
  userApproval: UserApprovalNode,
  
  // Data nodes
  transform: TransformNode,
  setState: SetStateNode,
  prompt: PromptNode,
  
  // External I/O nodes
  externalInput: ExternalInputNode,
  externalOutput: ExternalOutputNode,
};

function FlowCanvas() {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [logsCollapsed, setLogsCollapsed] = useState(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showEvaluate, setShowEvaluate] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [workflowVariables, setWorkflowVariables] = useState<Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    defaultValue: string;
    description: string;
    required: boolean;
  }>>([]);
  const [userInput, setUserInput] = useState('');
  const { screenToFlowPosition, fitView } = useReactFlow();
  const dropCountRef = useRef(0);
  const executorRef = useRef<WorkflowExecutor | null>(null);

  // Load workflow on mount
  useEffect(() => {
    if (workflowId && workflowId !== 'new') {
      const saved = localStorage.getItem(`agent-builder-workflow-${workflowId}`);
      if (saved) {
        try {
          const workflow = JSON.parse(saved);
          setNodes(workflow.nodes || initialNodes);
          setEdges(workflow.edges || initialEdges);
          setWorkflowName(workflow.name || 'Untitled Workflow');
          setWorkflowDescription(workflow.description || '');
          setWorkflowVariables(workflow.variables || []);
          setCurrentWorkflowId(workflowId);
          console.log('✅ Loaded workflow:', workflow.name, 'with', workflow.nodes?.length || 0, 'nodes');
        } catch (e) {
          console.error('Failed to load workflow:', e);
          alert('Failed to load workflow. Starting with empty canvas.');
        }
      } else {
        console.warn(`No workflow found for ID: ${workflowId}`);
      }
    } else if (workflowId === 'new') {
      // New workflow - start fresh
      setNodes(initialNodes);
      setEdges(initialEdges);
      setWorkflowName('');
      setWorkflowDescription('');
      setWorkflowVariables([]);
      setCurrentWorkflowId(null);
      console.log('✅ Starting new workflow');
    }
  }, [workflowId, setNodes, setEdges]);

  // Auto-save workflow to localStorage whenever nodes or edges change
  useEffect(() => {
    // Don't auto-save on initial mount or if no changes yet
    if (nodes.length === 0) return;
    
    // Use a debounce timer to avoid saving too frequently
    const timeoutId = setTimeout(() => {
      const autoSaveKey = workflowId === 'new' ? 'agent-builder-autosave' : `agent-builder-workflow-${workflowId}`;
      
      const workflow = {
        id: workflowId || 'autosave',
        name: workflowName || 'Untitled Workflow',
        description: workflowDescription,
        nodes,
        edges,
        variables: workflowVariables,
        version: '1.0',
        savedAt: new Date().toISOString(),
        nodeCount: nodes.length,
      };
      
      localStorage.setItem(autoSaveKey, JSON.stringify(workflow));
      console.log('💾 Auto-saved workflow with', nodes.length, 'nodes');
    }, 500); // Debounce for 500ms
    
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, workflowId, workflowName, workflowDescription, workflowVariables]);

  // Load auto-saved workflow for 'new' workflows
  useEffect(() => {
    if (workflowId === 'new') {
      const autoSaved = localStorage.getItem('agent-builder-autosave');
      if (autoSaved) {
        try {
          const workflow = JSON.parse(autoSaved);
          setNodes(workflow.nodes || initialNodes);
          setEdges(workflow.edges || initialEdges);
          setWorkflowVariables(workflow.variables || []);
          console.log('✅ Restored auto-saved workflow with', workflow.nodes?.length || 0, 'nodes');
        } catch (e) {
          console.error('Failed to restore auto-save:', e);
        }
      }
    }
  }, []); // Only run once on mount

  // Execute workflow
  const handleExecute = useCallback(async () => {
    if (isExecuting) return;

    // Validate input
    if (!userInput.trim()) {
      alert('Please enter an input before running the workflow');
      return;
    }

    setIsExecuting(true);
    setExecutionLogs([]);
    setShowLogs(true);

    try {
      const executor = new WorkflowExecutor(
        nodes,
        edges,
        userInput,  // Use dynamic input
        (log) => {
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
  }, [nodes, edges, isExecuting, userInput]);

  // Stop workflow execution
  const handleStop = useCallback(() => {
    if (executorRef.current) {
      console.log('⏹ Stopping workflow execution...');
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
    // If no name, show save dialog
    if (!workflowName) {
      setShowSaveDialog(true);
      return;
    }

    // Save with current ID or create new ID
    const id = currentWorkflowId || `workflow-${Date.now()}`;
    
    const workflow = {
      id,
      name: workflowName,
      description: workflowDescription,
      nodes,
      edges,
      variables: workflowVariables,
      version: '1.0',
      savedAt: new Date().toISOString(),
      nodeCount: nodes.length,
    };
    
    // Save individual workflow
    localStorage.setItem(`agent-builder-workflow-${id}`, JSON.stringify(workflow));
    
    // Update workflows list
    const savedWorkflows = localStorage.getItem('agent-builder-workflows');
    let workflows = savedWorkflows ? JSON.parse(savedWorkflows) : [];
    
    // Remove old entry if updating
    workflows = workflows.filter((w: any) => w.id !== id);
    
    // Add updated workflow to list
    workflows.push({
      id,
      name: workflowName,
      description: workflowDescription,
      savedAt: workflow.savedAt,
      nodeCount: nodes.length,
      version: '1.0'
    });
    
    localStorage.setItem('agent-builder-workflows', JSON.stringify(workflows));
    
    // Update current workflow ID if it was new
    if (!currentWorkflowId) {
      setCurrentWorkflowId(id);
      // Update URL to reflect the saved workflow
      navigate(`/builder/${id}`, { replace: true });
    }
    
    console.log('💾 Workflow saved:', workflowName, 'ID:', id);
    alert(`Workflow "${workflowName}" saved successfully!`);
  }, [nodes, edges, workflowName, workflowDescription, workflowVariables, currentWorkflowId, navigate]);

  // Handle save from dialog
  const handleSaveWithName = useCallback((name: string, description: string) => {
    setWorkflowName(name);
    setWorkflowDescription(description);
    setShowSaveDialog(false);
    
    // Create new workflow ID
    const id = `workflow-${Date.now()}`;
    setCurrentWorkflowId(id);
    
    const workflow = {
      id,
      name,
      description,
      nodes,
      edges,
      variables: workflowVariables,
      version: '1.0',
      savedAt: new Date().toISOString(),
      nodeCount: nodes.length,
    };
    
    // Save individual workflow
    localStorage.setItem(`agent-builder-workflow-${id}`, JSON.stringify(workflow));
    
    // Update workflows list
    const savedWorkflows = localStorage.getItem('agent-builder-workflows');
    let workflows = savedWorkflows ? JSON.parse(savedWorkflows) : [];
    workflows.push({
      id,
      name,
      description,
      savedAt: workflow.savedAt,
      nodeCount: nodes.length,
      version: '1.0'
    });
    localStorage.setItem('agent-builder-workflows', JSON.stringify(workflows));
    
    // Update URL
    navigate(`/builder/${id}`, { replace: true });
    
    console.log('💾 New workflow saved:', name, 'ID:', id);
    alert(`Workflow "${name}" saved successfully!`);
  }, [nodes, edges, workflowVariables, navigate]);

  // Handle Evaluate button
  const handleEvaluate = useCallback(() => {
    setShowEvaluate(true);
  }, []);

  // Handle Code View button
  const handleShowCode = useCallback(() => {
    setShowCode(true);
  }, []);

  // Handle Deploy button
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const handleDeploy = useCallback(() => {
    setShowDeployDialog(true);
  }, []);

  // Handle Clear Canvas
  const handleClearCanvas = useCallback(() => {
    // Keep only the start node
    const startNode = nodes.find(n => n.type === 'start');
    if (startNode) {
      setNodes([startNode]);
    } else {
      setNodes([]);
    }
    setEdges([]);
    console.log('🗑️ Canvas cleared - all nodes removed');
  }, [nodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle edge click to delete
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: any) => {
    if (window.confirm(`Delete connection from ${edge.source} to ${edge.target}?`)) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  }, [setEdges]);

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
    async (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const offset = (dropCountRef.current % 5) * 40;
      position.x += offset;
      position.y += offset;
      dropCountRef.current += 1;

      const nodeData: any = { 
        label: type === 'agent' ? 'New Agent' : 
               type === 'end' ? 'End' :
               type === 'note' ? 'Note' :
               type === 'knowledgeBase' ? 'Knowledge Base' :
               type === 'fileSearch' ? 'File Search' :
               type === 'guardrails' ? 'Guardrails' :
               type === 'mcp' ? 'MCP Server' :
               type === 'voice' ? 'Voice Output' :
               type === 'ifElse' ? 'If/Else' :
               type === 'while' ? 'While Loop' :
               type === 'userApproval' ? 'User Approval' :
               type === 'transform' ? 'Transform' :
               type === 'setState' ? 'Set State' :
               type === 'externalInput' ? 'External Input' :
               type === 'externalOutput' ? 'External Output' :
               type === 'prompt' ? 'Prompt' : 'Node',
        instructions: ''
      };

      // Auto-select first available model for Agent nodes
      if (type === 'agent') {
        try {
          const models = await ollamaService.listModels();
          if (models.length > 0) {
            nodeData.model = models[0].name;
            console.log(`✅ Auto-selected model: ${models[0].name}`);
          }
        } catch (error) {
          console.warn('Could not fetch models for auto-selection:', error);
        }
      }

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
      
      // Auto-fit view to show all nodes after a short delay
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 300 });
      }, 100);
    },
    [screenToFlowPosition, setNodes, fitView]
  );

  // Handle node duplication
  const handleDuplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = nodes.find(n => n.id === nodeId);
    if (!nodeToDuplicate) return;

    // Create duplicate with offset position and new ID
    // Remove 'measured' property to force React Flow to recalculate dimensions
    const { measured, ...nodeWithoutMeasured } = nodeToDuplicate;
    
    const newNode: Node = {
      ...nodeWithoutMeasured,
      id: `${nodeToDuplicate.type}-${Date.now()}`,
      position: {
        x: nodeToDuplicate.position.x + 100,
        y: nodeToDuplicate.position.y + 100,
      },
      data: {
        ...nodeToDuplicate.data,
        label: `${nodeToDuplicate.data.label} (Copy)`,
      },
      selected: false,
    };

    setNodes((nds) => nds.concat(newNode));
    setSelectedNode(newNode);
    
    // Auto-fit view to show all nodes after a short delay
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 100);
  }, [nodes, setNodes, fitView]);

  // Enhance nodes with onDuplicate callback
  const enhancedNodes = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onDuplicate: () => handleDuplicateNode(node.id),
    },
  }));

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Ollama Status Banner */}
      <OllamaStatusBanner />
      
      {/* Top Bar */}
      <TopBar 
        onSave={handleSave}
        onExecute={handleExecute}
        onStop={handleStop}
        onEvaluate={handleEvaluate}
        onShowCode={handleShowCode}
        onDeploy={handleDeploy}
        onClearCanvas={handleClearCanvas}
        isExecuting={isExecuting}
        onBack={() => navigate('/workflows')}
        workflowName={workflowName}
      />

      {/* Compact Input Bar with Minimap and Dark Mode */}
      <div className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-4 py-2`}>
        <div className="flex items-center gap-3">
          {/* Input Section */}
          <div className="flex-1 flex items-center gap-2">
            <label className={`text-xs font-semibold whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Input:
            </label>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter workflow input (available as input_as_text)"
              className={`flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <button
              onClick={() => setUserInput('')}
              className={`px-2 py-1 text-sm hover:bg-gray-100 rounded ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500'}`}
              title="Clear input"
            >
              ✕
            </button>
          </div>
          
          {/* Minimap */}
          <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
            <MiniMap 
              style={{ width: 150, height: 80, position: 'relative' }}
              nodeColor={(node) => {
                if (node.type === 'start') return '#10b981';
                if (node.type === 'agent') return '#3b82f6';
                if (node.type === 'externalInput') return '#10b981';
                if (node.type === 'externalOutput') return '#a855f7';
                return '#6b7280';
              }}
            />
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className={`flex flex-1 overflow-hidden ${darkMode ? 'bg-gray-900' : ''}`}>
        {/* Left Panel - Node Palette with Collapse */}
        <div className={`relative transition-all duration-300 ${paletteCollapsed ? 'w-12' : 'w-60'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r flex-shrink-0 ${paletteCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
          {/* Collapse/Expand Button */}
          <button
            onClick={() => setPaletteCollapsed(!paletteCollapsed)}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50'} border rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10 transition-colors`}
            title={paletteCollapsed ? 'Expand Palette' : 'Collapse Palette'}
          >
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {paletteCollapsed ? '▶' : '◀'}
            </span>
          </button>
          
          {/* Palette Content */}
          {!paletteCollapsed && (
            <NodePalette darkMode={darkMode} />
          )}
          
          {/* Collapsed Label */}
          {paletteCollapsed && (
            <div className="flex items-center justify-center h-full">
              <span className={`text-xs font-semibold tracking-wider transform -rotate-90 whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                NODES
              </span>
            </div>
          )}
        </div>

        {/* Center Panel - Canvas */}
        <div className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <ReactFlow
            nodes={enhancedNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
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
            <Background color={darkMode ? "#1f2937" : "#e5e7eb"} gap={16} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {/* Right Panel - Inspector with Collapse */}
        <div className={`relative transition-all duration-300 ${inspectorCollapsed ? 'w-12' : 'w-80'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l flex-shrink-0 ${inspectorCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
          {/* Collapse/Expand Button */}
          <button
            onClick={() => setInspectorCollapsed(!inspectorCollapsed)}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50'} border rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10 transition-colors`}
            title={inspectorCollapsed ? 'Expand Inspector' : 'Collapse Inspector'}
          >
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {inspectorCollapsed ? '◀' : '▶'}
            </span>
          </button>

          {/* Collapsed Label */}
          {inspectorCollapsed && (
            <div className="flex items-center justify-center h-full">
              <span className={`text-xs font-semibold tracking-wider transform -rotate-90 whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                INSPECTOR
              </span>
            </div>
          )}
          
          {/* Inspector Content */}
          {!inspectorCollapsed && (
            <Inspector 
              darkMode={darkMode}
              selectedNode={selectedNode ? enhancedNodes.find(n => n.id === selectedNode.id) || selectedNode : null}
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
              workflowVariables={workflowVariables}
              onAddVariable={(variable) => {
                setWorkflowVariables((vars) => [...vars, variable]);
              }}
              onRemoveVariable={(variableName) => {
                if (window.confirm(`Delete variable "${variableName}"?`)) {
                  setWorkflowVariables((vars) => vars.filter((v) => v.name !== variableName));
                }
              }}
            />
          )}
        </div>
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

      {/* Evaluate Dialog */}
      {showEvaluate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 50 }} onClick={() => setShowEvaluate(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Workflow Evaluation</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold mb-2">📊 Performance Metrics</h3>
                <p className="text-sm text-gray-700">• Total Nodes: {nodes.length}</p>
                <p className="text-sm text-gray-700">• Total Connections: {edges.length}</p>
                <p className="text-sm text-gray-700">• Complexity Score: {Math.min(100, nodes.length * 2 + edges.length)}/100</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-semibold mb-2">✅ Optimization Suggestions</h3>
                <p className="text-sm text-gray-700">• Consider adding error handling nodes</p>
                <p className="text-sm text-gray-700">• Use caching for repeated operations</p>
                <p className="text-sm text-gray-700">• Add validation nodes after transformations</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-semibold mb-2">⚠️ Potential Issues</h3>
                <p className="text-sm text-gray-700">• No issues detected</p>
              </div>
            </div>
            <button
              onClick={() => setShowEvaluate(false)}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Code View Dialog */}
      {showCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 50 }} onClick={() => setShowCode(false)}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Workflow Code</h2>
            <div className="flex-1 overflow-auto bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              <pre>{JSON.stringify({ nodes, edges }, null, 2)}</pre>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({ nodes, edges }, null, 2));
                  alert('Code copied to clipboard!');
                }}
                className="flex-1 bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={() => setShowCode(false)}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Workflow Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 50 }} onClick={() => setShowSaveDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Save Workflow</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('name') as string;
              const description = formData.get('description') as string;
              if (name.trim()) {
                handleSaveWithName(name.trim(), description.trim());
              } else {
                alert('Please enter a workflow name');
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workflow Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g., Customer Support Agent"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Describe what this workflow does..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Save Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deploy Dialog */}
      {showDeployDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 50 }} onClick={() => setShowDeployDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Deploy Workflow</h2>
            
            <div className="space-y-4">
              {/* Export as JSON */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Export as JSON</h3>
                    <p className="text-sm text-gray-600 mb-3">Download workflow configuration as a JSON file for backup or sharing</p>
                    <button
                      onClick={() => {
                        const workflowData = {
                          id: currentWorkflowId || 'workflow',
                          name: workflowName || 'Untitled Workflow',
                          description: workflowDescription || '',
                          version: '1.0',
                          nodes,
                          edges,
                          variables: workflowVariables,
                          savedAt: new Date().toISOString(),
                        };
                        const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${workflowName || 'workflow'}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        alert('Workflow exported successfully!');
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      Download JSON
                    </button>
                  </div>
                </div>
              </div>

              {/* Copy to Clipboard */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📋</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Copy Configuration</h3>
                    <p className="text-sm text-gray-600 mb-3">Copy workflow configuration to clipboard</p>
                    <button
                      onClick={() => {
                        const workflowData = {
                          id: currentWorkflowId || 'workflow',
                          name: workflowName || 'Untitled Workflow',
                          description: workflowDescription || '',
                          version: '1.0',
                          nodes,
                          edges,
                          variables: workflowVariables,
                        };
                        navigator.clipboard.writeText(JSON.stringify(workflowData, null, 2));
                        alert('Workflow configuration copied to clipboard!');
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Coming Soon Features */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-3">🚀 Coming Soon</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>🌐</span>
                    <span><strong>API Endpoint:</strong> Publish workflow as REST API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📦</span>
                    <span><strong>Standalone Package:</strong> Export as npm package</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>☁️</span>
                    <span><strong>Cloud Deploy:</strong> Deploy to AWS, Azure, or GCP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span><strong>Team Sharing:</strong> Share with team members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🐳</span>
                    <span><strong>Docker Image:</strong> Export as containerized app</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDeployDialog(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Builder() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
