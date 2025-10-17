import { Handle, Position } from '@xyflow/react';

interface VoiceNodeData {
  label: string;
  voice?: 'male' | 'female';
  voiceName?: string;
  speed?: number;
}

interface VoiceNodeProps {
  data: VoiceNodeData;
}

export default function VoiceNode({ data }: VoiceNodeProps) {
  return (
    <div className="px-6 py-5 shadow-xl rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 border border-indigo-400/50 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 min-w-[220px] max-w-[300px] backdrop-blur-sm">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-indigo-400 border-2 border-white"
      />
      
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl">🔊</div>
        <div className="flex-1">
          <div className="font-bold text-white text-lg leading-tight">
            {data.label || 'Voice Output'}
          </div>
          <div className="text-indigo-100 text-xs mt-0.5">
            Tool
          </div>
        </div>
      </div>

      {data.voice && (
        <div className="mt-3 pt-3 border-t border-indigo-400/30">
          <div className="text-xs text-indigo-100 flex items-center gap-2">
            <span className="font-semibold">
              {data.voice === 'male' ? '👨 Male' : '👩 Female'}
            </span>
            {data.voiceName && (
              <span className="text-indigo-200/80">• {data.voiceName}</span>
            )}
          </div>
          {data.speed && data.speed !== 1 && (
            <div className="text-xs text-indigo-200/70 mt-1">
              Speed: {data.speed}x
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-indigo-400 border-2 border-white"
      />
    </div>
  );
}
