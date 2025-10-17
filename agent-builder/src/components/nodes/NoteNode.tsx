import { Handle, Position } from '@xyflow/react';

export default function NoteNode({ data }: { data: any }) {
  return (
    <div className="group">
      <div className="px-6 py-5 shadow-xl rounded-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 border border-dashed border-yellow-400/70 hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 min-w-[220px] max-w-[300px]">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5 filter drop-shadow-md">📝</div>
          <div className="flex-1">
            <div className="text-gray-800 font-bold text-base leading-tight mb-1 drop-shadow-sm">
              {data.label}
            </div>
            <div className="text-gray-600 text-xs font-semibold opacity-95 drop-shadow-sm">
              Note
            </div>
          </div>
        </div>
      </div>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 !bg-gray-400 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 !bg-gray-400 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
    </div>
  );
}
