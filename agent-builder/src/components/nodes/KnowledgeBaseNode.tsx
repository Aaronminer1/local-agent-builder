import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface KnowledgeBaseNodeProps {
  data: {
    label: string;
  };
}

function KnowledgeBaseNode({ data }: KnowledgeBaseNodeProps) {
  const documentCount = (data as any).documents?.length || 0;
  
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 min-w-[180px]">
      <div className="flex items-center gap-2">
        <div className="text-2xl">📚</div>
        <div className="flex-1">
          <div className="font-bold text-sm text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-600">
            {documentCount} {documentCount === 1 ? 'document' : 'documents'}
          </div>
        </div>
      </div>
      
      {/* Output handle (right side) - Connects to agent's knowledge base input */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="knowledge-output"
        className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
        style={{ top: '50%' }}
      />
    </div>
  );
}

export default memo(KnowledgeBaseNode);
