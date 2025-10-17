import { useState } from 'react';

// MCP Server definitions
const mcpServers = {
  noAuth: [
    { id: 'sequential-thinking', name: 'Sequential Thinking', description: 'Step-by-step reasoning', icon: '🧠' },
    { id: 'playwright', name: 'Playwright', description: 'Browser automation', icon: '🎭' },
    { id: 'filesystem', name: 'Filesystem', description: 'File operations', icon: '📁' },
    { id: 'memory', name: 'Memory', description: 'Context storage', icon: '💭' },
    { id: 'fetch', name: 'Fetch', description: 'Web page fetching', icon: '🌐' },
  ],
  requiresAuth: [
    { id: 'brave-search', name: 'Brave Search', description: 'Web search', icon: '🔍', apiKey: 'BRAVE_API_KEY' },
    { id: 'google-maps', name: 'Google Maps', description: 'Location services', icon: '🗺️', apiKey: 'GOOGLE_MAPS_API_KEY' },
    { id: 'slack', name: 'Slack', description: 'Team communication', icon: '💬', apiKey: 'SLACK_TOKEN' },
    { id: 'github', name: 'GitHub', description: 'Repository access', icon: '🐙', apiKey: 'GITHUB_TOKEN' },
    { id: 'gmail', name: 'Gmail', description: 'Email integration', icon: '📧', apiKey: 'OAUTH' },
    { id: 'google-drive', name: 'Google Drive', description: 'Cloud storage', icon: '☁️', apiKey: 'OAUTH' },
    { id: 'google-calendar', name: 'Google Calendar', description: 'Calendar access', icon: '📅', apiKey: 'OAUTH' },
  ],
};

const nodeCategories = [
  {
    title: 'Core',
    nodes: [
      { type: 'agent', label: 'Agent', icon: '▶', color: 'text-blue-600' },
      { type: 'end', label: 'End', icon: '⬛', color: 'text-gray-600' },
      { type: 'note', label: 'Note', icon: '📝', color: 'text-gray-600' },
    ],
  },
  {
    title: 'Tools',
    nodes: [
      { type: 'knowledgeBase', label: 'Knowledge Base', icon: '📚', color: 'text-blue-600' },
      { type: 'database', label: 'Database', icon: '🗄️', color: 'text-green-600' },
      { type: 'fileSearch', label: 'File search', icon: '🔍', color: 'text-yellow-600' },
      { type: 'guardrails', label: 'Guardrails', icon: '🛡️', color: 'text-yellow-600' },
      { type: 'mcp', label: 'MCP', icon: '🔌', color: 'text-yellow-600' },
      { type: 'voice', label: 'Voice (TTS)', icon: '🔊', color: 'text-purple-600' },
    ],
  },
  {
    title: 'Logic',
    nodes: [
      { type: 'ifElse', label: 'If / else', icon: '⚡', color: 'text-orange-600' },
      { type: 'while', label: 'While', icon: '🔄', color: 'text-orange-600' },
      { type: 'userApproval', label: 'User approval', icon: '✋', color: 'text-orange-600' },
    ],
  },
  {
    title: 'Data',
    nodes: [
      { type: 'transform', label: 'Transform', icon: '🔀', color: 'text-purple-600' },
      { type: 'setState', label: 'Set state', icon: '💾', color: 'text-purple-600' },
      { type: 'prompt', label: 'Prompt', icon: '💬', color: 'text-purple-600' },
    ],
  },
  {
    title: 'External I/O',
    nodes: [
      { type: 'externalInput', label: 'External Input', icon: '📥', color: 'text-green-600' },
      { type: 'externalOutput', label: 'External Output', icon: '📤', color: 'text-purple-600' },
    ],
  },
];

interface NodePaletteProps {
  darkMode?: boolean;
}

export default function NodePalette({ darkMode = false }: NodePaletteProps) {
  const [mcpExpanded, setMcpExpanded] = useState(false);
  
  const onDragStart = (event: React.DragEvent, nodeType: string, mcpServerData?: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    if (mcpServerData) {
      event.dataTransfer.setData('mcpServer', JSON.stringify(mcpServerData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 space-y-6">
      {nodeCategories.map((category) => (
        <div key={category.title}>
          <h3 className={`text-xs font-bold uppercase tracking-wide mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {category.title}
          </h3>
            <div className="space-y-1.5">
              {category.nodes.map((node) => {
                // Special handling for MCP node - show expandable section
                if (node.type === 'mcp') {
                  return (
                    <div key={node.type}>
                      {/* MCP Generic Node */}
                      <div
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 border ${
                          darkMode 
                            ? 'hover:bg-gray-700 hover:border-gray-600 border-transparent' 
                            : 'hover:bg-white hover:shadow-sm hover:border-gray-200 border-transparent'
                        }`}
                      >
                        <span className="text-lg">{node.icon}</span>
                        <span className={`text-sm font-medium flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{node.label}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMcpExpanded(!mcpExpanded);
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <span className={`transform transition-transform ${mcpExpanded ? 'rotate-90' : ''}`}>
                            ▶
                          </span>
                        </button>
                      </div>
                      
                      {/* Expandable MCP Servers List */}
                      {mcpExpanded && (
                        <div className={`ml-4 mt-2 space-y-2 border-l-2 pl-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                          {/* No Auth Required */}
                          <div className="text-xs font-semibold text-green-600 uppercase mb-1.5">
                            ✅ Ready to Use
                          </div>
                          {mcpServers.noAuth.map((server) => (
                            <div
                              key={server.id}
                              draggable
                              onDragStart={(e) => onDragStart(e, 'mcp', {
                                serverName: server.id,
                                label: server.name,
                                operation: 'process',
                              })}
                              className={`flex items-start gap-2 px-2 py-2 rounded-md cursor-grab active:cursor-grabbing transition-all duration-150 border group ${
                                darkMode
                                  ? 'hover:bg-gray-700 hover:border-green-600 border-transparent'
                                  : 'hover:bg-white hover:shadow-sm hover:border-green-200 border-transparent'
                              }`}
                              title={`Drag to add ${server.name}`}
                            >
                              <span className="text-base mt-0.5">{server.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className={`text-xs font-medium ${darkMode ? 'text-gray-300 group-hover:text-green-400' : 'text-gray-700 group-hover:text-green-700'}`}>
                                  {server.name}
                                </div>
                                <div className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {server.description}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Auth Required */}
                          <div className="text-xs font-semibold text-amber-600 uppercase mb-1.5 mt-3">
                            🔑 Requires API Key
                          </div>
                          {mcpServers.requiresAuth.map((server) => (
                            <div
                              key={server.id}
                              draggable
                              onDragStart={(e) => onDragStart(e, 'mcp', {
                                serverName: server.id,
                                label: server.name,
                                operation: 'process',
                              })}
                              className={`flex items-start gap-2 px-2 py-2 rounded-md cursor-grab active:cursor-grabbing transition-all duration-150 border group ${
                                darkMode
                                  ? 'hover:bg-gray-700 hover:border-amber-600 border-transparent'
                                  : 'hover:bg-white hover:shadow-sm hover:border-amber-200 border-transparent'
                              }`}
                              title={`Drag to add ${server.name} (requires ${server.apiKey})`}
                            >
                              <span className="text-base mt-0.5">{server.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className={`text-xs font-medium ${darkMode ? 'text-gray-300 group-hover:text-amber-400' : 'text-gray-700 group-hover:text-amber-700'}`}>
                                  {server.name}
                                </div>
                                <div className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {server.description}
                                </div>
                                <div className="text-xs text-amber-600 font-mono mt-0.5">
                                  {server.apiKey}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Regular nodes
                return (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 border ${
                      darkMode 
                        ? 'hover:bg-gray-700 hover:border-gray-600 border-transparent' 
                        : 'hover:bg-white hover:shadow-sm hover:border-gray-200 border-transparent'
                    }`}
                  >
                    <span className="text-lg">{node.icon}</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{node.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
