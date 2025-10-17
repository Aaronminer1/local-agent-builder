import { Handle, Position } from '@xyflow/react';

export default function SetStateNode({ data }: { data: any }) {
  return (
    <div className="group">
      <div className="px-6 py-5 shadow-xl rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 border border-cyan-400/50 hover:border-cyan-300 hover:shadow-2xl transition-all duration-300 min-w-[220px] max-w-[300px] backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5 filter drop-shadow-md">💾</div>
          <div className="flex-1">
            <div className="text-white font-bold text-base leading-tight mb-1 drop-shadow-sm">
              {data.label}
            </div>
            <div className="text-cyan-100 text-xs font-semibold opacity-95 drop-shadow-sm">
              Data
            </div>
          </div>
        </div>
      </div>
      
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 !bg-cyan-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-4 h-4 !bg-cyan-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
    </div>
  );
}
