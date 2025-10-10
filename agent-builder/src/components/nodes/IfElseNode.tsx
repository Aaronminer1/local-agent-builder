import { Handle, Position } from '@xyflow/react';

export default function IfElseNode({ data }: { data: any }) {
  return (
    <div className="group">
      <div className="px-6 py-5 shadow-xl rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 border border-orange-400/50 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 min-w-[220px] max-w-[300px] backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5 filter drop-shadow-md">⚡</div>
          <div className="flex-1">
            <div className="text-white font-bold text-base leading-tight mb-1 drop-shadow-sm">
              {data.label}
            </div>
            <div className="text-orange-100 text-xs font-semibold opacity-95 drop-shadow-sm">
              Logic
            </div>
          </div>
        </div>
      </div>
      
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 !bg-orange-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
      
      {/* TRUE output handle with label */}
      <div className="absolute bottom-0 left-[30%] -translate-x-1/2 -translate-y-full pb-2">
        <Handle 
          type="source" 
          position={Position.Bottom}
          id="true"
          className="w-4 h-4 !bg-green-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform relative"
        />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
          TRUE
        </div>
      </div>
      
      {/* FALSE output handle with label */}
      <div className="absolute bottom-0 left-[70%] -translate-x-1/2 -translate-y-full pb-2">
        <Handle 
          type="source" 
          position={Position.Bottom}
          id="false"
          className="w-4 h-4 !bg-red-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform relative"
        />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
          FALSE
        </div>
      </div>
    </div>
  );
}
