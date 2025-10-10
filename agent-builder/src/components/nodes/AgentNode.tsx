import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export default function AgentNode({ data, id }: { data: any; id?: string }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDuplicate = () => {
    alert(`Duplicate node: ${id}\nFeature coming soon!`);
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
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px] z-50">
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
      
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 !bg-blue-400 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-4 h-4 !bg-blue-400 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
    </div>
  );
}
