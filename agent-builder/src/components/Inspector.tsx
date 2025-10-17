import type { Node } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { ollamaService, type OllamaModel } from '../services/ollamaService';

interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  defaultValue: string;
  description: string;
  required: boolean;
}

interface InspectorProps {
  darkMode?: boolean;
  selectedNode: Node | null;
  onUpdateNode?: (nodeId: string, updates: any) => void;
  onDeleteNode?: (nodeId: string) => void;
  workflowVariables?: WorkflowVariable[];
  onAddVariable?: (variable: WorkflowVariable) => void;
  onRemoveVariable?: (variableName: string) => void;
}

export default function Inspector({ 
  darkMode = false,
  selectedNode, 
  onUpdateNode, 
  onDeleteNode,
  workflowVariables = [],
  onAddVariable,
  onRemoveVariable 
}: InspectorProps) {
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [ollamaAvailable, setOllamaAvailable] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [showAddVariableDialog, setShowAddVariableDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [newVariable, setNewVariable] = useState<WorkflowVariable>({
    name: '',
    type: 'string',
    defaultValue: '',
    description: '',
    required: false,
  });

  // Helper function to get tool info
  const getToolInfo = (toolId: string) => {
    const tools: Record<string, { name: string; icon: string }> = {
      'client-tool': { name: 'Client tool', icon: '🔧' },
      'mcp-server': { name: 'MCP server', icon: '🔌' },
      'knowledge-base': { name: 'Knowledge Base', icon: '📚' },
      'file-search': { name: 'File search', icon: '📄' },
      'web-search': { name: 'Web search', icon: '🌐' },
      'code-interpreter': { name: 'Code Interpreter', icon: '💻' },
      'function': { name: 'Function', icon: '⚡' },
      'custom': { name: 'Custom', icon: '⚙️' },
    };
    return tools[toolId] || { name: toolId, icon: '🔧' };
  };

  // Helper function to add a tool
  const addTool = (toolId: string) => {
    if (!selectedNode) return;
    const updated = [...selectedTools, toolId];
    setSelectedTools(updated);
    onUpdateNode?.(selectedNode.id, { tools: updated });
    setShowToolMenu(false);
  };

  // Load tools from node data when node changes
  useEffect(() => {
    if (selectedNode?.data?.tools && Array.isArray(selectedNode.data.tools)) {
      setSelectedTools(selectedNode.data.tools);
    } else {
      setSelectedTools([]);
    }
  }, [selectedNode?.id]);

  // Fetch Ollama models on mount
  useEffect(() => {
    async function checkOllama() {
      try {
        const available = await ollamaService.isAvailable();
        setOllamaAvailable(available);
        
        if (available) {
          const models = await ollamaService.listModels();
          setOllamaModels(models);
        }
      } catch (error) {
        console.error('Failed to fetch Ollama models:', error);
      } finally {
        setLoadingModels(false);
      }
    }
    
    checkOllama();
  }, []);

  if (!selectedNode) {
    return (
      <div className={`w-full h-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`text-center mt-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-sm">Select a node from the canvas</p>
          <p className="text-sm">or add a new node from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full overflow-y-auto overflow-x-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-6 space-y-6">
        {/* Header with Node Info and Quick Actions */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{(selectedNode.data as any).label || 'Node'}</h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedNode.type === 'agent' && 'Call the model with your instructions and tools'}
                {selectedNode.type === 'start' && 'Workflow entry point'}
                {selectedNode.type === 'end' && 'Workflow termination'}
              </p>
            </div>
            {selectedNode.type !== 'start' && (
              <button
                onClick={() => onDeleteNode?.(selectedNode.id)}
                className={`p-2 rounded-md transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
                title="Delete node"
              >
                🗑️
              </button>
            )}
          </div>

          {/* Node Info */}
          <div className={`text-xs space-y-1 p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="font-semibold">Type:</span>
              <code className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>{selectedNode.type}</code>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="font-semibold">ID:</span>
              <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>{selectedNode.id}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedNode.id);
                  alert('Node ID copied to clipboard!');
                }}
                className={`ml-auto px-2 py-1 rounded text-xs transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title="Copy ID"
              >
                📋
              </button>
            </div>
          </div>

          {/* Quick Actions - Row 1 */}
          <div className={`space-y-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const config = JSON.stringify(selectedNode, null, 2);
                  navigator.clipboard.writeText(config);
                  alert('Node configuration copied to clipboard!');
                }}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
                title="Export configuration as JSON"
              >
                📤 Export
              </button>
              <button
                onClick={() => setShowImportDialog(true)}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
                title="Import configuration from JSON"
              >
                📥 Import
              </button>
              <button
                onClick={() => {
                  const details = `Node Details:\n\nID: ${selectedNode.id}\nType: ${selectedNode.type}\nLabel: ${(selectedNode.data as any).label || 'N/A'}\nPosition: (${Math.round(selectedNode.position.x)}, ${Math.round(selectedNode.position.y)})\n\nData:\n${JSON.stringify(selectedNode.data, null, 2)}`;
                  alert(details);
                }}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
                title="View complete node information"
              >
                ℹ️ Details
              </button>
            </div>
            
            {/* Quick Actions - Row 2 */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if ((selectedNode.data as any).onDuplicate) {
                    (selectedNode.data as any).onDuplicate();
                  } else {
                    alert('Duplicate function not available');
                  }
                }}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
                title="Clone this node and its settings"
              >
                📋 Duplicate
              </button>
              <button
                onClick={() => setShowStatsDialog(true)}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
                title="View execution statistics"
              >
                📊 Stats
              </button>
              <button
                onClick={() => setShowColorPicker(true)}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
                title="Change node color"
              >
                🎨 Color
              </button>
            </div>
          </div>
        </div>

        {/* Agent Node Configuration */}
        {selectedNode.type === 'agent' && (
          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                defaultValue={(selectedNode.data as any).label}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Agent name"
              />
            </div>

            {/* Instructions Field */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Instructions
              </label>
              <textarea
                rows={6}
                defaultValue={(selectedNode.data as any).instructions || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { instructions: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y transition-all"
                placeholder="You are a helpful assistant..."
              />
            </div>

            {/* Include Chat History Toggle */}
            <div className="flex items-center justify-between py-1">
              <label className="text-sm font-medium text-gray-700">Include chat history</label>
              <input
                type="checkbox"
                defaultChecked
                className="w-10 h-5 rounded-full appearance-none bg-blue-600 relative cursor-pointer
                         before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full 
                         before:bg-white before:top-0.5 before:left-0.5 before:transition-transform
                         checked:before:translate-x-5"
              />
            </div>

            {/* Model Dropdown */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Model
                {!ollamaAvailable && <span className="text-red-500 ml-2">(Ollama not running)</span>}
                {loadingModels && <span className="text-gray-400 ml-2">(Loading...)</span>}
              </label>
              <select 
                value={(selectedNode.data as any).model || (ollamaModels[0]?.name || '')}
                onChange={(e) => {
                  onUpdateNode?.(selectedNode.id, { model: e.target.value });
                  // Auto-set model if not already set
                  if (!(selectedNode.data as any).model && ollamaModels.length > 0) {
                    onUpdateNode?.(selectedNode.id, { model: ollamaModels[0].name });
                  }
                }}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                {ollamaModels.length > 0 ? (
                  ollamaModels.map((model) => {
                    const supportsTools = model.name.includes('gpt-oss') || 
                                         model.name.includes('llama3') || 
                                         model.name.includes('qwen') || 
                                         model.name.includes('deepseek');
                    return (
                      <option key={model.name} value={model.name}>
                        {model.name} ({(model.size / 1e9).toFixed(1)}GB){supportsTools ? ' 🔧' : ''}
                      </option>
                    );
                  })
                ) : (
                  <option value="" disabled>No models available - Please install Ollama models</option>
                )}
              </select>
              {(() => {
                const currentModel = (selectedNode.data as any).model || '';
                const supportsTools = currentModel.includes('gpt-oss') || 
                                     currentModel.includes('llama3') || 
                                     currentModel.includes('qwen') || 
                                     currentModel.includes('deepseek');
                return currentModel && !supportsTools ? (
                  <p className="text-xs text-yellow-600 mt-1">
                    ⚠️ This model may not support tool calling (Knowledge Base, Web Search, etc.)
                  </p>
                ) : null;
              })()}
            </div>

            {/* Reasoning Effort */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Reasoning effort
              </label>
              <select 
                defaultValue="medium"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>

            {/* Tools */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tools
              </label>
              
              {/* Selected tools list */}
              {selectedTools.length > 0 && (
                <div className="mb-2 space-y-1">
                  {selectedTools.map(toolId => {
                    const toolInfo = getToolInfo(toolId);
                    return (
                      <div key={toolId} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200">
                        <span className="text-sm flex items-center gap-2">
                          <span>{toolInfo.icon}</span>
                          <span>{toolInfo.name}</span>
                        </span>
                        <button
                          onClick={() => {
                            const updated = selectedTools.filter(id => id !== toolId);
                            setSelectedTools(updated);
                            onUpdateNode?.(selectedNode.id, { tools: updated });
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add tool button with dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowToolMenu(!showToolMenu)}
                  className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <span>+</span>
                  <span>Add tool</span>
                </button>

                {/* Tool dropdown menu */}
                {showToolMenu && (
                  <>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                      {/* ChatKit section */}
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                        ChatKit
                      </div>
                      <button
                        onClick={() => addTool('client-tool')}
                        disabled={selectedTools.includes('client-tool')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>🔧</span>
                        <span>Client tool</span>
                      </button>

                      <div className="border-t my-2"></div>

                      {/* Hosted section */}
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                        Hosted
                      </div>
                      <button
                        onClick={() => addTool('mcp-server')}
                        disabled={selectedTools.includes('mcp-server')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>🔌</span>
                        <span>MCP server</span>
                      </button>
                      <button
                        onClick={() => addTool('knowledge-base')}
                        disabled={selectedTools.includes('knowledge-base')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>📚</span>
                        <span>Knowledge Base</span>
                      </button>
                      <button
                        onClick={() => addTool('file-search')}
                        disabled={selectedTools.includes('file-search')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>📄</span>
                        <span>File Search</span>
                      </button>
                      <button
                        onClick={() => addTool('web-search')}
                        disabled={selectedTools.includes('web-search')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>🌐</span>
                        <span>Web Search</span>
                      </button>
                      <button
                        onClick={() => addTool('code-interpreter')}
                        disabled={selectedTools.includes('code-interpreter')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>💻</span>
                        <span>Code Interpreter</span>
                      </button>

                      <div className="border-t my-2"></div>

                      {/* Local section */}
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                        Local
                      </div>
                      <button
                        onClick={() => addTool('function')}
                        disabled={selectedTools.includes('function')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>⚡</span>
                        <span>Function</span>
                      </button>
                      <button
                        onClick={() => addTool('custom')}
                        disabled={selectedTools.includes('custom')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>⚙️</span>
                        <span>Custom</span>
                      </button>
                    </div>
                    {/* Click outside to close */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowToolMenu(false)}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Output Format */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Output format
              </label>
              <select 
                defaultValue="Text"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="Text">Text</option>
                <option value="JSON">JSON</option>
              </select>
            </div>
          </div>
        )}

        {/* Transform Node Configuration */}
        {selectedNode.type === 'transform' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).label || 'Transform'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="Transform name"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                JavaScript Code
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Return the transformed value. Input available as <code className="bg-gray-100 px-1 rounded">input</code>
              </p>
              <textarea
                value={(selectedNode.data as any).code || '// Return transformed data\nreturn input;'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { code: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                rows={8}
                placeholder="// Your code here&#10;return input;"
              />
            </div>
          </div>
        )}

        {/* If/Else Node Configuration */}
        {selectedNode.type === 'ifElse' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).label || 'If/Else'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Condition name"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Condition
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Return true/false. Input available as <code className="bg-gray-100 px-1 rounded">input</code>
              </p>
              <textarea
                value={(selectedNode.data as any).condition || '// Return true or false\nreturn input > 50;'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { condition: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                rows={6}
                placeholder="// Your condition&#10;return true;"
              />
            </div>
          </div>
        )}

        {/* While Loop Node Configuration */}
        {selectedNode.type === 'while' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).label || 'While Loop'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Loop name"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Condition
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Return true to continue loop. Access: <code className="bg-gray-100 px-1 rounded">input</code>, <code className="bg-gray-100 px-1 rounded">state</code>, <code className="bg-gray-100 px-1 rounded">variables</code>
              </p>
              <textarea
                value={(selectedNode.data as any).condition || '// Continue while condition is true\nreturn state.counter < 10;'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { condition: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                rows={6}
                placeholder="// Loop condition&#10;return state.counter < 10;"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Max Iterations
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Safety limit to prevent infinite loops
              </p>
              <input
                type="number"
                value={(selectedNode.data as any).maxIterations || 100}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { maxIterations: parseInt(e.target.value) || 100 })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                min={1}
                max={1000}
              />
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <p className="text-xs text-indigo-800">
                <strong>Loop Structure:</strong><br/>
                • Left handle (green) → Loop body<br/>
                • Right handle (red) → Exit when false<br/>
                • Body must connect back to loop input
              </p>
            </div>
          </div>
        )}

        {/* Voice/TTS Node Configuration */}
        {selectedNode.type === 'voice' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).label || 'Voice Output'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="Voice output name"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Voice Gender
              </label>
              <select
                value={(selectedNode.data as any).voice || 'male'}
                onChange={(e) => {
                  const newGender = e.target.value;
                  // Update gender and set appropriate default voice
                  const defaultVoice = newGender === 'female' ? 'en-US-JennyNeural' : 'en-US-GuyNeural';
                  onUpdateNode?.(selectedNode.id, { 
                    voice: newGender,
                    voiceName: defaultVoice
                  });
                }}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="male">👨 Male Voice</option>
                <option value="female">👩 Female Voice</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Voice Name
              </label>
              <select
                value={(selectedNode.data as any).voiceName || ((selectedNode.data as any).voice === 'female' ? 'en-US-JennyNeural' : 'en-US-GuyNeural')}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { voiceName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                {(selectedNode.data as any).voice === 'female' ? (
                  <>
                    <optgroup label="US English - Female">
                      <option value="en-US-JennyNeural">Jenny (US) - Friendly</option>
                      <option value="en-US-AriaNeural">Aria (US) - News</option>
                      <option value="en-US-MichelleNeural">Michelle (US) - Clear</option>
                      <option value="en-US-AnaNeural">Ana (US) - Calm</option>
                    </optgroup>
                    <optgroup label="UK English - Female">
                      <option value="en-GB-SoniaNeural">Sonia (UK) - Professional</option>
                      <option value="en-GB-LibbyNeural">Libby (UK) - Warm</option>
                      <option value="en-GB-MiaNeural">Mia (UK) - Young</option>
                    </optgroup>
                    <optgroup label="Australian - Female">
                      <option value="en-AU-NatashaNeural">Natasha (AU) - Expressive</option>
                      <option value="en-AU-FreyaNeural">Freya (AU) - Friendly</option>
                    </optgroup>
                  </>
                ) : (
                  <>
                    <optgroup label="US English - Male">
                      <option value="en-US-GuyNeural">Guy (US) - Conversational</option>
                      <option value="en-US-EricNeural">Eric (US) - News</option>
                      <option value="en-US-DavisNeural">Davis (US) - Professional</option>
                      <option value="en-US-TonyNeural">Tony (US) - Energetic</option>
                    </optgroup>
                    <optgroup label="UK English - Male">
                      <option value="en-GB-RyanNeural">Ryan (UK) - Authoritative</option>
                      <option value="en-GB-ThomasNeural">Thomas (UK) - Calm</option>
                    </optgroup>
                    <optgroup label="Australian - Male">
                      <option value="en-AU-WilliamNeural">William (AU) - Casual</option>
                      <option value="en-AU-NeilNeural">Neil (AU) - Friendly</option>
                    </optgroup>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Speed
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={(selectedNode.data as any).speed || 1}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { speed: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center mt-1">
                {((selectedNode.data as any).speed || 1).toFixed(1)}x
              </div>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Output File
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).outputFile || 'output.mp3'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { outputFile: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-mono"
                placeholder="output.mp3"
              />
            </div>
          </div>
        )}

        {/* MCP Node Configuration */}
        {selectedNode.type === 'mcp' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).label || 'MCP Server'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="MCP server name"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                MCP Server
              </label>
              <select
                value={(selectedNode.data as any).serverName || 'sequential-thinking'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { serverName: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <optgroup label="✅ No API Key Required">
                  <option value="sequential-thinking">Sequential Thinking - Step-by-step reasoning</option>
                  <option value="playwright">Playwright - Browser automation</option>
                  <option value="filesystem">Filesystem - File operations</option>
                  <option value="memory">Memory - Context storage</option>
                  <option value="fetch">Fetch - Web page fetching</option>
                </optgroup>
                <optgroup label="🔑 API Key Required">
                  <option value="brave-search">Brave Search - Web search (BRAVE_API_KEY)</option>
                  <option value="google-maps">Google Maps - Location services (GOOGLE_MAPS_API_KEY)</option>
                  <option value="slack">Slack - Team communication (SLACK_TOKEN)</option>
                  <option value="github">GitHub - Repository access (GITHUB_TOKEN)</option>
                  <option value="gmail">Gmail - Email integration (OAUTH)</option>
                  <option value="google-drive">Google Drive - Cloud storage (OAUTH)</option>
                  <option value="google-calendar">Google Calendar - Calendar (OAUTH)</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Operation
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).operation || 'process'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { operation: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="e.g., search, analyze, fetch"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                API Key/Token (if required)
              </label>
              <input
                type="password"
                value={(selectedNode.data as any).apiKey || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { apiKey: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Leave empty for no-auth servers"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Only needed for servers marked with 🔑
              </p>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Additional Config (JSON)
              </label>
              <textarea
                value={(selectedNode.data as any).config ? JSON.stringify((selectedNode.data as any).config, null, 2) : '{}'}
                onChange={(e) => {
                  try {
                    const config = JSON.parse(e.target.value);
                    onUpdateNode?.(selectedNode.id, { config });
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                rows={4}
                placeholder='{"timeout": 30000}'
              />
            </div>
          </div>
        )}

        {/* External Input Node Configuration */}
        {selectedNode.type === 'externalInput' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).label || 'External Input'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="External Input name"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Input Source
              </label>
              <select
                value={(selectedNode.data as any).inputSource || 'api'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { inputSource: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              >
                <option value="api">REST API</option>
                <option value="websocket">WebSocket</option>
                <option value="webhook">Webhook</option>
                <option value="chat">Chat Widget</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                API Endpoint
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).endpoint || '/api/chat'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { endpoint: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="/api/chat"
              />
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-xs text-green-700">
                💡 This node receives messages from external sources and passes them to the workflow.
              </p>
            </div>
          </div>
        )}

        {/* External Output Node Configuration */}
        {selectedNode.type === 'externalOutput' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).label || 'External Output'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="External Output name"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Output Destination
              </label>
              <select
                value={(selectedNode.data as any).outputDestination || 'api'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { outputDestination: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="api">REST API Response</option>
                <option value="websocket">WebSocket Emit</option>
                <option value="webhook">Webhook POST</option>
                <option value="chat">Chat Widget</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Response Format
              </label>
              <select
                value={(selectedNode.data as any).responseFormat || 'json'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { responseFormat: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="json">JSON</option>
                <option value="text">Plain Text</option>
                <option value="html">HTML</option>
              </select>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <p className="text-xs text-purple-700">
                💡 This node sends the workflow result to external systems via API or other channels.
              </p>
            </div>
          </div>
        )}

        {/* Start Node Configuration */}
        {selectedNode.type === 'start' && (
          <div className="space-y-4">
            {/* Input Variables Section */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Input variables
              </label>
              
              {/* System variable: input_as_text (always present) */}
              <div className="mb-3 bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">📝</span>
                  <span className="font-mono text-sm font-semibold text-green-700">input_as_text</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">string</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">system</span>
                </div>
                <p className="text-xs text-green-700 mt-1 ml-6">
                  User input automatically available to all nodes
                </p>
              </div>
            </div>

            {/* State Variables Section */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                State variables
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Define custom variables for your workflow
              </p>
              
              {/* List existing variables */}
              {workflowVariables.length > 0 && (
                <div className="mb-3 space-y-2">
                  {workflowVariables.map((variable) => (
                    <div key={variable.name} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-blue-600">{variable.name}</span>
                          <span className="text-xs text-gray-500">({variable.type})</span>
                          {variable.required && <span className="text-xs text-red-500">*</span>}
                        </div>
                        {variable.description && (
                          <p className="text-xs text-gray-600 mt-1">{variable.description}</p>
                        )}
                        {variable.defaultValue && (
                          <p className="text-xs text-gray-500 mt-1">Default: {variable.defaultValue}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveVariable?.(variable.name)}
                        className="text-gray-400 hover:text-red-600 px-2"
                        title="Remove variable"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <button 
                onClick={() => setShowAddVariableDialog(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
              >
                <span>+</span>
                <span>Add variable</span>
              </button>
              <div className="mt-3 text-xs text-gray-400">
                <p>💡 Tip: Variables allow you to pass dynamic data into your workflow</p>
              </div>
            </div>
          </div>
        )}

        {/* Note Node Configuration */}
        {selectedNode.type === 'note' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Note Content
              </label>
              <textarea
                rows={8}
                value={(selectedNode.data as any).content || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { content: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all resize-y ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Add your notes here..."
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Use notes to document your workflow or add reminders
              </p>
            </div>
          </div>
        )}

        {/* Knowledge Base Node Configuration */}
        {selectedNode.type === 'knowledgeBase' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Documents
              </label>
              <div className={`space-y-2 p-3 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                {((selectedNode.data as any).documents || []).length === 0 ? (
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No documents added yet</p>
                ) : (
                  ((selectedNode.data as any).documents || []).map((doc: any, index: number) => (
                    <div key={index} className={`flex items-center justify-between p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{doc.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updatedDocs = ((selectedNode.data as any).documents || []).filter((_: any, i: number) => i !== index);
                          onUpdateNode?.(selectedNode.id, { documents: updatedDocs });
                        }}
                        className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-500 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                        title="Remove document"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-2">
                <input
                  type="file"
                  id={`kb-file-input-${selectedNode.id}`}
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.xml"
                  onChange={async (e) => {
                    console.log('File input onChange triggered', e.target.files);
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      console.log('Files selected:', files.map(f => f.name));
                      
                      // Read file contents
                      const newDocs = await Promise.all(files.map(async (file) => {
                        // Read file content
                        let content = '';
                        try {
                          content = await new Promise<string>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (event) => resolve(event.target?.result as string || '');
                            reader.onerror = reject;
                            reader.readAsText(file);
                          });
                          console.log(`✅ Read ${file.name}: ${content.length} characters`);
                        } catch (error) {
                          console.error(`Error reading ${file.name}:`, error);
                        }
                        
                        return {
                          name: file.name,
                          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                          path: file.webkitRelativePath || file.name,
                          lastModified: new Date(file.lastModified).toLocaleDateString(),
                          content: content // Store the actual file content
                        };
                      }));
                      
                      const currentDocs = (selectedNode.data as any).documents || [];
                      onUpdateNode?.(selectedNode.id, { documents: [...currentDocs, ...newDocs] });
                      console.log('Documents updated with content:', newDocs.map(d => `${d.name} (${d.content.length} chars)`));
                      // Reset the input
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor={`kb-file-input-${selectedNode.id}`}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  📁 Browse & Select Documents
                </label>
                <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Supports: PDF, DOC, DOCX, TXT, MD, CSV, JSON, XML
                </p>
              </div>
            </div>
            
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Retrieval Strategy
              </label>
              <select
                value={(selectedNode.data as any).retrievalStrategy || 'semantic'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { retrievalStrategy: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="semantic">Semantic Search (Embeddings)</option>
                <option value="keyword">Keyword Search</option>
                <option value="hybrid">Hybrid (Semantic + Keyword)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Max Results
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={(selectedNode.data as any).maxResults || 5}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { maxResults: parseInt(e.target.value) })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Number of relevant document chunks to retrieve</p>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                💡 <strong>Tip:</strong> Documents will be embedded and indexed for semantic search. The agent will automatically retrieve relevant information when answering queries.
              </p>
            </div>
          </div>
        )}

        {/* Database Node Configuration */}
        {selectedNode.type === 'database' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Database Type
              </label>
              <select
                value={(selectedNode.data as any).dbType || 'sqlite'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { dbType: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="sqlite">SQLite</option>
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mongodb">MongoDB</option>
                <option value="mssql">Microsoft SQL Server</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Connection String
              </label>
              <textarea
                value={(selectedNode.data as any).connectionString || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { connectionString: e.target.value })}
                placeholder="e.g., sqlite:///path/to/database.db or mysql://user:pass@localhost/dbname"
                rows={3}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Schema/Tables
              </label>
              <textarea
                value={(selectedNode.data as any).schema || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { schema: e.target.value })}
                placeholder="Describe your database schema (tables, columns, relationships)"
                rows={4}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Example: customers (id, name, email, phone), orders (id, customer_id, total, date)
              </p>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Query Context
              </label>
              <textarea
                value={(selectedNode.data as any).queryContext || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { queryContext: e.target.value })}
                placeholder="Instructions for the agent on how to query this database"
                rows={3}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Example: Use this database to look up customer information by name, email, or phone number
              </p>
            </div>

            <div>
              <button
                onClick={() => {
                  // Test connection logic would go here
                  alert('Connection test not yet implemented');
                }}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                🔌 Test Connection
              </button>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                💡 <strong>Tip:</strong> The agent will automatically generate SQL queries based on user questions and retrieve relevant data from your database.
              </p>
            </div>
          </div>
        )}

        {/* File Search Node Configuration */}
        {selectedNode.type === 'fileSearch' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                File Path/Pattern
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).filePath || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { filePath: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="e.g., *.txt or /path/to/files/**/*.md"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search Query
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).searchQuery || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { searchQuery: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Search term or regex pattern"
              />
            </div>
          </div>
        )}

        {/* Guardrails Node Configuration */}
        {selectedNode.type === 'guardrails' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Validation Rules
              </label>
              <textarea
                rows={6}
                value={(selectedNode.data as any).rules || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { rules: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all resize-y ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="// Define validation rules&#10;// Return true if valid, false if invalid&#10;return input.length > 0;"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Error Message
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).errorMessage || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { errorMessage: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Message to show when validation fails"
              />
            </div>
          </div>
        )}

        {/* User Approval Node Configuration */}
        {selectedNode.type === 'userApproval' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Approval Message
              </label>
              <textarea
                rows={4}
                value={(selectedNode.data as any).approvalMessage || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { approvalMessage: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-y ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Message to show to the user for approval"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Timeout (seconds)
              </label>
              <input
                type="number"
                value={(selectedNode.data as any).timeout || 300}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { timeout: parseInt(e.target.value) || 300 })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                min="0"
                placeholder="300"
              />
              <p className="text-xs text-gray-500 mt-1">
                How long to wait for approval (0 = no timeout)
              </p>
            </div>
          </div>
        )}

        {/* Set State Node Configuration */}
        {selectedNode.type === 'setState' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Variable Name
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).variableName || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { variableName: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="e.g., counter, user_data, result"
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Value (JavaScript Expression)
              </label>
              <textarea
                rows={4}
                value={(selectedNode.data as any).value || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { value: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-y ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="// JavaScript expression&#10;return input.count + 1;"
              />
              <p className="text-xs text-gray-500 mt-1">
                Access: <code className={`px-1 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>input</code>, <code className={`px-1 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>state</code>, <code className={`px-1 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>variables</code>
              </p>
            </div>
          </div>
        )}

        {/* Prompt Node Configuration */}
        {selectedNode.type === 'prompt' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Prompt Text
              </label>
              <textarea
                rows={8}
                value={(selectedNode.data as any).promptText || ''}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { promptText: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-y ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Enter the prompt to inject at this point in the workflow...&#10;&#10;You can use variables: {input}, {state.variableName}"
              />
              <p className="text-xs text-gray-500 mt-1">
                This prompt will be passed as input to the next node in the workflow
              </p>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900/20 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
              <p className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                💡 <strong>Use Cases:</strong> Inject instructions for loops, add context between agents, or modify the flow dynamically based on previous results.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Add Variable Dialog */}
      {showAddVariableDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 50 }}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Workflow Variable</h2>
            
            <div className="space-y-4">
              {/* Variable Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variable Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                  placeholder="e.g., user_query, api_key, context"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Use lowercase with underscores (snake_case)</p>
              </div>

              {/* Data Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newVariable.type}
                  onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="string">String (text)</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean (true/false)</option>
                  <option value="object">Object (JSON)</option>
                  <option value="array">Array (list)</option>
                </select>
              </div>

              {/* Default Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Value
                </label>
                <input
                  type="text"
                  value={newVariable.defaultValue}
                  onChange={(e) => setNewVariable({ ...newVariable, defaultValue: e.target.value })}
                  placeholder={
                    newVariable.type === 'string' ? 'Enter default text' :
                    newVariable.type === 'number' ? 'Enter default number' :
                    newVariable.type === 'boolean' ? 'true or false' :
                    newVariable.type === 'object' ? '{"key": "value"}' :
                    '["item1", "item2"]'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newVariable.description}
                  onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                  placeholder="What is this variable used for?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Required Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={newVariable.required}
                  onChange={(e) => setNewVariable({ ...newVariable, required: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="required" className="text-sm text-gray-700">
                  Required (workflow cannot run without this variable)
                </label>
              </div>

              {/* Usage Hint */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-800">
                  <strong>💡 Usage:</strong> Reference this variable in any node using{' '}
                  <code className="bg-blue-100 px-1 rounded">{'{' + newVariable.name + '}'}</code>
                </p>
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddVariableDialog(false);
                  setNewVariable({
                    name: '',
                    type: 'string',
                    defaultValue: '',
                    description: '',
                    required: false,
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newVariable.name.trim()) {
                    alert('Please enter a variable name');
                    return;
                  }
                  
                  // Check for duplicate names
                  if (workflowVariables.some(v => v.name === newVariable.name)) {
                    alert('A variable with this name already exists');
                    return;
                  }
                  
                  onAddVariable?.(newVariable);
                  setShowAddVariableDialog(false);
                  setNewVariable({
                    name: '',
                    type: 'string',
                    defaultValue: '',
                    description: '',
                    required: false,
                  });
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Add Variable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Configuration Dialog */}
      {showImportDialog && selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 50 }}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-[500px]">
            <h2 className="text-xl font-bold mb-4">Import Configuration</h2>
            <p className="text-sm text-gray-600 mb-4">Paste the JSON configuration to import node settings</p>
            
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='{"data": {"label": "My Node", ...}}'
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportJson('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    const config = JSON.parse(importJson);
                    if (config.data && onUpdateNode) {
                      onUpdateNode(selectedNode.id, config.data);
                      alert('Configuration imported successfully!');
                      setShowImportDialog(false);
                      setImportJson('');
                    } else {
                      alert('Invalid configuration format. Must include "data" object.');
                    }
                  } catch (e) {
                    alert('Invalid JSON format. Please check your input.');
                  }
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Execution Stats Dialog */}
      {showStatsDialog && selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 50 }}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-[500px]">
            <h2 className="text-xl font-bold mb-4">Execution Statistics</h2>
            <p className="text-sm text-gray-600 mb-4">Node: {(selectedNode.data as any).label || 'Node'}</p>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Total Executions</span>
                  <span className="text-lg font-bold text-blue-600">0</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Successful</span>
                  <span className="text-lg font-bold text-green-600">0</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Failed</span>
                  <span className="text-lg font-bold text-red-600">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Avg. Duration</span>
                  <span className="text-lg font-bold text-purple-600">0ms</span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>Note:</strong> Statistics will be collected when you run this workflow. Data is reset when the workflow is modified.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowStatsDialog(false)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Dialog */}
      {showColorPicker && selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 50 }}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-[400px]">
            <h2 className="text-xl font-bold mb-4">Change Node Color</h2>
            <p className="text-sm text-gray-600 mb-4">Select a color for this node</p>
            
            <div className="grid grid-cols-6 gap-2 mb-4">
              {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
                '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#A855F7'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-lg transition-all ${selectedColor === color ? 'ring-4 ring-offset-2 ring-gray-400' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Color</label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-xs text-yellow-800">
                💡 <strong>Note:</strong> Node colors are visual only and don't affect workflow execution. This feature requires additional implementation in the node rendering logic.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowColorPicker(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onUpdateNode) {
                    onUpdateNode(selectedNode.id, { ...selectedNode.data, customColor: selectedColor });
                    alert(`Node color set to ${selectedColor}`);
                    setShowColorPicker(false);
                  }
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Apply Color
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
