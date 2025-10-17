import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SavedWorkflow {
  id: string;
  name: string;
  description: string;
  savedAt: string;
  nodeCount: number;
  version: string;
}

export default function WorkflowsList() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>([]);

  useEffect(() => {
    // Load workflows from localStorage
    const loadWorkflows = () => {
      const saved = localStorage.getItem('agent-builder-workflows');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setWorkflows(data);
        } catch (e) {
          console.error('Failed to load workflows:', e);
        }
      } else {
        // Initialize with a default workflow
        const defaultWorkflow: SavedWorkflow = {
          id: 'default',
          name: 'Advanced AI Research Assistant',
          description: 'Comprehensive research workflow with multi-path reasoning, validation, and voice output',
          savedAt: new Date().toISOString(),
          nodeCount: 2,
          version: '1.0'
        };
        
        // Also save the actual workflow data
        const defaultWorkflowData = {
          id: 'default',
          name: 'Advanced AI Research Assistant',
          description: 'Comprehensive research workflow with multi-path reasoning, validation, and voice output',
          savedAt: defaultWorkflow.savedAt,
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
        
        localStorage.setItem('agent-builder-workflow-default', JSON.stringify(defaultWorkflowData));
        setWorkflows([defaultWorkflow]);
        localStorage.setItem('agent-builder-workflows', JSON.stringify([defaultWorkflow]));
      }
    };

    loadWorkflows();
  }, []);

  const handleCreateNew = () => {
    navigate('/builder/new');
  };

  const handleOpenWorkflow = (id: string) => {
    navigate(`/builder/${id}`);
  };

  const handleDeleteWorkflow = (id: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      const updated = workflows.filter(w => w.id !== id);
      setWorkflows(updated);
      localStorage.setItem('agent-builder-workflows', JSON.stringify(updated));
    }
  };

  const handleDuplicateWorkflow = (id: string) => {
    // Load the original workflow data
    const originalData = localStorage.getItem(`agent-builder-workflow-${id}`);
    if (!originalData) {
      alert('Could not find workflow data to duplicate');
      return;
    }

    try {
      const workflowData = JSON.parse(originalData);
      
      // Generate new unique ID
      const newId = `workflow-${Date.now()}`;
      
      // Create duplicate with new ID and updated name
      const duplicateData = {
        ...workflowData,
        id: newId,
        name: `${workflowData.name} (Copy)`,
        savedAt: new Date().toISOString(),
      };
      
      // Save the duplicate workflow data
      localStorage.setItem(`agent-builder-workflow-${newId}`, JSON.stringify(duplicateData));
      
      // Add to workflows list
      const newWorkflow: SavedWorkflow = {
        id: newId,
        name: duplicateData.name,
        description: duplicateData.description,
        savedAt: duplicateData.savedAt,
        nodeCount: duplicateData.nodeCount || duplicateData.nodes?.length || 0,
        version: duplicateData.version || '1.0'
      };
      
      const updatedWorkflows = [...workflows, newWorkflow];
      setWorkflows(updatedWorkflows);
      localStorage.setItem('agent-builder-workflows', JSON.stringify(updatedWorkflows));
      
      // Show success message
      alert(`Workflow duplicated successfully!\n\nNew workflow: "${newWorkflow.name}"`);
    } catch (e) {
      console.error('Failed to duplicate workflow:', e);
      alert('Failed to duplicate workflow. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Workflows</h1>
              <p className="mt-2 text-gray-600">Manage and organize your AI agent workflows</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <span>+</span>
              <span>Create New Workflow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {workflows.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No workflows yet</h3>
            <p className="text-gray-500 mb-6">Create your first AI agent workflow to get started</p>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <span>+</span>
              <span>Create Workflow</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleOpenWorkflow(workflow.id)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {workflow.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        v{workflow.version}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkflow(workflow.id);
                      }}
                      className="text-gray-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete workflow"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {workflow.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <span>🔷</span>
                      <span>{workflow.nodeCount} nodes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{new Date(workflow.savedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenWorkflow(workflow.id);
                      }}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded font-medium transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateWorkflow(workflow.id);
                      }}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium transition-colors"
                      title="Duplicate workflow"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
