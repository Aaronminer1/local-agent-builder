import { useState } from 'react';

interface TopBarProps {
  onSave?: () => void;
  onExecute?: () => void;
  onStop?: () => void;
  isExecuting?: boolean;
  onEvaluate?: () => void;
  onShowCode?: () => void;
  onDeploy?: () => void;
  onBack?: () => void;
  workflowName?: string;
}

export default function TopBar({ onSave, onExecute, onStop, isExecuting, onEvaluate, onShowCode, onDeploy, onBack, workflowName }: TopBarProps) {
  const [audioReady, setAudioReady] = useState(false);
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const testAudio = async () => {
    try {
      // Create AudioContext and play a beep to wake up audio system
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      console.log('🔊 Testing audio system...');
      console.log(`Initial AudioContext state: ${audioContext.state}`);
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log(`AudioContext resumed: ${audioContext.state}`);
      }
      
      // Play a short beep (440Hz for 200ms)
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440; // A4 note
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      
      console.log('✅ Audio test complete - audio system is ready!');
      setAudioReady(true);
      
      setTimeout(() => setAudioReady(false), 3000);
    } catch (error) {
      console.error('❌ Audio test failed:', error);
    }
  };
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left Section - Navigation */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack || (() => window.location.href = '/workflows')}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors"
        >
          <span>←</span>
          <span>View all workflows</span>
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">{workflowName || 'Untitled Workflow'}</h1>
          <div className="relative">
            <button 
              onClick={() => setShowVersionMenu(!showVersionMenu)}
              className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md hover:bg-gray-200 font-medium transition-colors"
            >
              v1 · draft
            </button>
            {showVersionMenu && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px] z-50">
                <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>v1 · draft</span>
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-50">
                  v0.9 · published
                </button>
                <div className="border-t border-gray-200 mt-1 pt-1">
                  <button className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-gray-50">
                    + New version
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={testAudio}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm ${
            audioReady
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
          title="Click to wake up audio system"
        >
          <span>🔊</span>
          <span>{audioReady ? 'Audio Ready!' : 'Test Audio'}</span>
        </button>
        <button 
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <span>💾</span>
          <span>Save</span>
        </button>
        
        {/* Settings Button with Modal */}
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <span className="text-lg">⚙</span>
          </button>
          {showSettings && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Settings</div>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <span>🎨</span>
                <span>Appearance</span>
              </button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <span>⌨️</span>
                <span>Keyboard shortcuts</span>
              </button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <span>🔌</span>
                <span>Integrations</span>
              </button>
              <div className="border-t border-gray-200 mt-1 pt-1">
                <button className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-50">
                  About
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={onEvaluate || (() => alert('Evaluation will analyze workflow performance and suggest improvements'))}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          title="Evaluate workflow performance"
        >
          <span>📊</span>
          <span>Evaluate</span>
        </button>
        <button 
          onClick={onShowCode || (() => alert('Code view will show the workflow as executable code'))}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          title="View workflow code"
        >
          <span>{'</>'}</span>
          <span>Code</span>
        </button>
        
        {/* Run/Stop Button */}
        {isExecuting ? (
          <button 
            onClick={onStop}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm bg-red-600 text-white hover:bg-red-700"
            title="Stop workflow execution"
          >
            <span>⏹</span>
            <span>Stop</span>
          </button>
        ) : (
          <button 
            onClick={onExecute}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm text-white bg-green-600 hover:bg-green-700"
            title="Run workflow"
          >
            <span>▶</span>
            <span>Run</span>
          </button>
        )}
        
        <button 
          onClick={onDeploy || (() => alert('Deploy will publish your workflow to production'))}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          title="Deploy to production"
        >
          Deploy
        </button>
      </div>
    </div>
  );
}
