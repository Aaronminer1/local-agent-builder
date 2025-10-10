import { Handle, Position } from '@xyflow/react';

export default function EndNode() {
  return (
    <div className="group">
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 !bg-red-500 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
      
      <div className="px-6 py-4 shadow-xl rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-red-700 border border-red-400/50 hover:border-red-300 hover:shadow-2xl transition-all duration-300 min-w-[180px]">
        <div className="flex items-center gap-3 justify-center">
          <div className="text-2xl text-white filter drop-shadow-md">■</div>
          <div className="text-white font-bold text-sm drop-shadow-sm">
            End
          </div>
        </div>
      </div>
    </div>
  );
}
