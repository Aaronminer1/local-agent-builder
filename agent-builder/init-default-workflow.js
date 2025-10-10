/**
 * Initialize Default Workflow
 * Run this once to create the "Advanced AI Research Assistant" workflow with actual data
 */

const defaultWorkflowData = {
  id: 'default',
  name: 'Advanced AI Research Assistant',
  description: 'Comprehensive research workflow with multi-path reasoning, validation, and voice output',
  savedAt: new Date().toISOString(),
  nodeCount: 2,
  version: '1.0',
  nodes: [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 400, y: 50 },
      data: { label: '🚀 Research Start' },
    },
    {
      id: 'agent-1',
      type: 'agent',
      position: { x: 400, y: 200 },
      data: { 
        label: '🤖 Research Agent',
        instructions: 'You are a research assistant. Analyze the input and provide comprehensive findings.',
        model: 'llama3.1:8b',
        reasoningEffort: 'high',
        includeHistory: false,
        tools: []
      },
    },
  ],
  edges: [
    { id: 'e1', source: 'start-1', target: 'agent-1' },
  ]
};

// Save to localStorage
if (typeof localStorage !== 'undefined') {
  // Save individual workflow
  localStorage.setItem(`agent-builder-workflow-default`, JSON.stringify(defaultWorkflowData));
  
  // Update workflows list
  const workflows = [{
    id: 'default',
    name: 'Advanced AI Research Assistant',
    description: 'Comprehensive research workflow with multi-path reasoning, validation, and voice output',
    savedAt: defaultWorkflowData.savedAt,
    nodeCount: 2,
    version: '1.0'
  }];
  
  localStorage.setItem('agent-builder-workflows', JSON.stringify(workflows));
  
  console.log('✅ Default workflow initialized!');
  console.log('Default workflow data:', defaultWorkflowData);
} else {
  console.log('❌ localStorage not available - run this in the browser console');
  console.log('Copy and paste this into browser console:');
  console.log(`
localStorage.setItem('agent-builder-workflow-default', '${JSON.stringify(defaultWorkflowData)}');
localStorage.setItem('agent-builder-workflows', '${JSON.stringify([{
    id: 'default',
    name: 'Advanced AI Research Assistant',
    description: 'Comprehensive research workflow with multi-path reasoning, validation, and voice output',
    savedAt: defaultWorkflowData.savedAt,
    nodeCount: 2,
    version: '1.0'
  }])}');
console.log('✅ Default workflow initialized!');
  `);
}
