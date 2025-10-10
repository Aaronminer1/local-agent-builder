import { Handle, Position } from '@xyflow/react';

export default function StartNode() {
  return (
    <div className="group">
      <div className="px-6 py-4 shadow-xl rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border border-emerald-300/70 hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 min-w-[180px]">
        <div className="flex items-center gap-3 justify-center">
          <div className="text-2xl text-emerald-600 filter drop-shadow-md">●</div>
          <div className="text-emerald-800 font-bold text-sm drop-shadow-sm">
            Start
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 !bg-emerald-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
    </div>
  );
}
