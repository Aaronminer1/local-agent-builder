import type { Node, Edge } from '@xyflow/react';

// Initial default workflow with basic nodes
export const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 400, y: 50 },
    data: { label: '🚀 Start' },
  },
  {
    id: 'agent-1',
    type: 'agent',
    position: { x: 400, y: 200 },
    data: { 
      label: '🤖 AI Agent',
      instructions: 'Process the input and provide a helpful response.',
      model: 'llama3.1:8b',
      reasoningEffort: 'medium',
      includeHistory: false,
      tools: []
    },
  },
];

export const initialEdges: Edge[] = [
  { id: 'e1', source: 'start-1', target: 'agent-1' },
];
