import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export default function AgentNode({ data, id }: { data: any; id?: string }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDuplicate = () => {
    if (data.onDuplicate) {
      data.onDuplicate();
    } else {
      alert(`Duplicate node: ${id}\nFeature coming soon!`);
    }
    setShowMenu(false);
  };

  const handleConfigure = () => {
    alert(`Configure node: ${id}\nClick on the node and use the Inspector panel on the right →`);
    setShowMenu(false);
  };

  const handleViewDetails = () => {
    alert(`Node Details:\n\nID: ${id}\nType: Agent\nLabel: ${data.label}\nModel: ${data.model || 'Not set'}`);
    setShowMenu(false);
  };

  return (
    <div className="group relative">
      <div className="px-6 py-5 shadow-xl rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border border-blue-400/50 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 min-w-[220px] max-w-[300px] backdrop-blur-sm">
        {/* Input Label */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white/80 bg-blue-800/50 px-2 py-0.5 rounded-full">
          IN
        </div>
        
        {/* Output Label */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white/80 bg-blue-800/50 px-2 py-0.5 rounded-full">
          OUT
        </div>
        
        {/* Knowledge Base Label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-purple-200 bg-purple-600/80 px-2 py-0.5 rounded-r-full">
          📚 KB
        </div>
        
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-1 filter drop-shadow-md">▶</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-base leading-snug mb-1 drop-shadow-sm">
              {data.label}
            </div>
            <div className="text-blue-100 text-xs font-medium">
              Agent
            </div>
          </div>
          {/* More Options Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg font-bold leading-none px-1"
            title="More options"
          >
            ⋮
          </button>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px] z-[9999]">
            <button
              onClick={handleConfigure}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <span>⚙️</span>
              <span>Configure</span>
            </button>
            <button
              onClick={handleDuplicate}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <span>📋</span>
              <span>Duplicate</span>
            </button>
            <button
              onClick={handleViewDetails}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <span>ℹ️</span>
              <span>View Details</span>
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={() => {
                alert(`Delete node: ${id}\nSelect the node and press Delete key, or use Inspector panel →`);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Input handle (top) - Sequential flow in */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="input"
        className="w-4 h-4 !bg-blue-400 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
      
      {/* Output handle (bottom) - Sequential flow out */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="output"
        className="w-4 h-4 !bg-blue-400 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
      
      {/* Knowledge Base handle (left side) - Tool/resource connection */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="knowledge-base"
        className="w-4 h-4 !bg-purple-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
        style={{ top: '50%' }}
      />
    </div>
  );
}
