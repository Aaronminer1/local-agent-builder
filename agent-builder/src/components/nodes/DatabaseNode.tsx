import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface DatabaseNodeProps {
  data: {
    label: string;
  };
}

function DatabaseNode({ data }: DatabaseNodeProps) {
  const connectionStatus = (data as any).connectionStatus || 'disconnected';
  const dbType = (data as any).dbType || 'Not configured';
  
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-green-500 bg-gradient-to-br from-green-50 to-green-100 min-w-[180px]">
      <div className="flex items-center gap-2">
        <div className="text-2xl">🗄️</div>
        <div className="flex-1">
          <div className="font-bold text-sm text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-600">
            {dbType}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-xs text-gray-500">
              {connectionStatus === 'connected' ? 'Connected' : 'Not connected'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Output handle (right side) - Connects to agent's knowledge base input */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="database-output"
        className="w-3 h-3 !bg-green-500 !border-2 !border-white"
        style={{ top: '50%' }}
      />
    </div>
  );
}

export default memo(DatabaseNode);
