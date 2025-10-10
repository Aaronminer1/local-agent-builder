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
  selectedNode: Node | null;
  onUpdateNode?: (nodeId: string, updates: any) => void;
  onDeleteNode?: (nodeId: string) => void;
  workflowVariables?: WorkflowVariable[];
  onAddVariable?: (variable: WorkflowVariable) => void;
  onRemoveVariable?: (variableName: string) => void;
}

export default function Inspector({ 
  selectedNode, 
  onUpdateNode, 
  onDeleteNode,
  workflowVariables = [],
  onAddVariable,
  onRemoveVariable 
}: InspectorProps) {
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [ollamaAvailable, setOllamaAvailable] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [showAddVariableDialog, setShowAddVariableDialog] = useState(false);
  const [newVariable, setNewVariable] = useState<WorkflowVariable>({
    name: '',
    type: 'string',
    defaultValue: '',
    description: '',
    required: false,
  });

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
      <div className="w-96 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500 mt-20">
          <p className="text-sm">Select a node from the canvas</p>
          <p className="text-xs mt-2">or add a new node from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{(selectedNode.data as any).label || 'Node'}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedNode.type === 'agent' && 'Call the model with your instructions and tools'}
              {selectedNode.type === 'start' && 'Workflow entry point'}
              {selectedNode.type === 'end' && 'Workflow termination'}
            </p>
          </div>
          {selectedNode.type !== 'start' && (
            <button
              onClick={() => onDeleteNode?.(selectedNode.id)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Delete node"
            >
              🗑️
            </button>
          )}
        </div>

        {/* Agent Node Configuration */}
        {selectedNode.type === 'agent' && (
          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                defaultValue={(selectedNode.data as any).label}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Agent name"
              />
            </div>

            {/* Instructions Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Model
                {!ollamaAvailable && <span className="text-red-500 ml-2">(Ollama not running)</span>}
                {loadingModels && <span className="text-gray-400 ml-2">(Loading...)</span>}
              </label>
              <select 
                value={(selectedNode.data as any).model || (ollamaModels[0]?.name || 'llama2')}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { model: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                {ollamaModels.length > 0 ? (
                  ollamaModels.map((model) => (
                    <option key={model.name} value={model.name}>
                      {model.name} ({(model.size / 1e9).toFixed(1)}GB)
                    </option>
                  ))
                ) : (
                  <>
                    <option value="llama2">llama2 (default)</option>
                    <option value="mistral">mistral</option>
                    <option value="codellama">codellama</option>
                  </>
                )}
              </select>
            </div>

            {/* Reasoning Effort */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Tools
              </label>
              <button className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium">
                <span>+</span>
                <span>Add tool</span>
              </button>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Voice Gender
              </label>
              <select
                value={(selectedNode.data as any).voice || 'male'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { voice: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="male">👨 Male Voice</option>
                <option value="female">👩 Female Voice</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Voice Name
              </label>
              <select
                value={(selectedNode.data as any).voiceName || 'en-US-GuyNeural'}
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).label || 'MCP Server'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { label: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="MCP server name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                MCP Server
              </label>
              <select
                value={(selectedNode.data as any).serverName || 'sequential-thinking'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { serverName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Operation
              </label>
              <input
                type="text"
                value={(selectedNode.data as any).operation || 'process'}
                onChange={(e) => onUpdateNode?.(selectedNode.id, { operation: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., search, analyze, fetch"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              <label className="block text-xs font-semibold text-gray-700 mb-2">
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

        {/* Start Node Configuration */}
        {selectedNode.type === 'start' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Input variables
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Define variables that will be available throughout the workflow
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

        {/* More Section */}
        <div className="pt-4 border-t border-gray-200">
          <button 
            onClick={() => {
              const nodeType = selectedNode.type;
              const nodeId = selectedNode.id;
              const nodeLabel = (selectedNode.data as any).label || 'Node';
              
              alert(`More Options\n\nNode: ${nodeLabel}\nType: ${nodeType}\nID: ${nodeId}\n\nAvailable actions:\n\n📋 Duplicate Node - Clone this node and its settings\n📤 Export Configuration - Save node settings as JSON\n📥 Import Configuration - Load settings from JSON\n🔗 Copy Node ID - Copy ID to clipboard\n📊 View Stats - See node execution history\n🎨 Change Color - Customize node appearance\n🔒 Lock Position - Prevent accidental movement\n\n✨ These features are coming soon!`);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            More options
          </button>
        </div>
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
    </div>
  );
}
