import { Handle, Position } from '@xyflow/react';

export default function ExternalInputNode({ data }: { data: any }) {
  return (
    <div className="group relative">
      <div className="px-6 py-5 shadow-xl rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 border border-green-400/50 hover:border-green-300 hover:shadow-2xl transition-all duration-300 min-w-[220px] max-w-[300px] backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-1 filter drop-shadow-md">📥</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-base leading-snug mb-1 drop-shadow-sm">
              {data.label || 'External Input'}
            </div>
            <div className="text-green-100 text-xs font-medium">
              Receives messages from external sources
            </div>
          </div>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-4 h-4 !bg-green-400 !border-2 !border-white !shadow-lg hover:!scale-125 transition-transform"
      />
    </div>
  );
}
