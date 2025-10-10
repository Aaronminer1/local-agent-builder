import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import type { Node, Connection, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NodePalette from '../components/NodePalette';
import Inspector from '../components/Inspector';
import TopBar from '../components/TopBar';
import AgentNode from '../components/nodes/AgentNode';
import StartNode from '../components/nodes/StartNode';
import IfElseNode from '../components/nodes/IfElseNode';
import TransformNode from '../components/nodes/TransformNode';
import FileSearchNode from '../components/nodes/FileSearchNode';
import VoiceNode from '../components/nodes/VoiceNode';
import { WorkflowExecutor, type ExecutionLog } from '../services/workflowExecutor';
import { initialNodes, initialEdges } from '../data/defaultWorkflow';

// Define node types for React Flow
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  start: StartNode,
  ifElse: IfElseNode,
  transform: TransformNode,
  fileSearch: FileSearchNode,
  voice: VoiceNode,
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
  const { screenToFlowPosition } = useReactFlow();
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
        'My score is 75 points',
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
  }, [nodes, edges, isExecuting]);

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
  const handleDeploy = useCallback(() => {
    alert('Deploy feature coming soon! This will allow you to:\n\n• Publish workflow as API endpoint\n• Export as standalone package\n• Deploy to cloud platforms\n• Share with team members');
  }, []);

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
    (event: React.DragEvent) => {
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
               type === 'fileSearch' ? 'File Search' :
               type === 'ifElse' ? 'If/Else' :
               type === 'transform' ? 'Transform' :
               type === 'voice' ? 'Voice Output' : 'Node',
        instructions: ''
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
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
        onEvaluate={handleEvaluate}
        onShowCode={handleShowCode}
        onDeploy={handleDeploy}
        isExecuting={isExecuting}
        onBack={() => navigate('/workflows')}
        workflowName={workflowName}
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
