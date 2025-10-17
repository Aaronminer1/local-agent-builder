import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface PromptNodeProps {
  data: {
    label: string;
  };
}

function PromptNode({ data }: PromptNodeProps) {
  const promptText = (data as any).promptText || 'No prompt configured';
  const previewLength = 50;
  const preview = promptText.length > previewLength 
    ? promptText.substring(0, previewLength) + '...' 
    : promptText;

  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 min-w-[200px] max-w-[250px]">
      <div className="flex items-start gap-2">
        <div className="text-2xl">💬</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-600 mt-1 break-words">
            {preview}
          </div>
        </div>
      </div>

      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
        style={{ top: 0 }}
      />

      {/* Output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
        style={{ bottom: 0 }}
      />
    </div>
  );
}

export default memo(PromptNode);
