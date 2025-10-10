import { Handle, Position } from '@xyflow/react';

export default function WhileNode({ data }: { data: any }) {
  const maxIterations = data.maxIterations || 100;
  
  return (
    <div className="group">
      <div className="px-6 py-5 shadow-xl rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 border border-indigo-400/50 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 min-w-[220px] max-w-[300px] backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5 filter drop-shadow-md">🔄</div>
          <div className="flex-1">
            <div className="text-white font-bold text-base leading-tight mb-1 drop-shadow-sm">
              {data.label}
            </div>
            <div className="text-indigo-100 text-xs font-semibold opacity-95 drop-shadow-sm">
              Loop · Max {maxIterations}
            </div>
            {data.condition && (
              <div className="text-indigo-50 text-xs mt-1 opacity-80 font-mono">
                {data.condition.length > 40 ? data.condition.substring(0, 40) + '...' : data.condition}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Top handle - entry point */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 !bg-indigo-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
      
      {/* Left handle - loop body (when condition is true) */}
      <Handle 
        type="source"
        position={Position.Left}
        id="body"
        className="w-4 h-4 !bg-green-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
        style={{ top: '50%' }}
      />
      
      {/* Right handle - exit (when condition is false) */}
      <Handle 
        type="source"
        position={Position.Right}
        id="exit"
        className="w-4 h-4 !bg-red-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
        style={{ top: '50%' }}
      />
    </div>
  );
}
