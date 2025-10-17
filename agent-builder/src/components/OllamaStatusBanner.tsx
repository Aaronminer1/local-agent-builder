import { useState, useEffect } from 'react';
import { ollamaHealthCheck, type OllamaHealthStatus } from '../services/ollamaHealthCheck';

export default function OllamaStatusBanner() {
  const [status, setStatus] = useState<OllamaHealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Perform initial health check
    const checkHealth = async () => {
      setIsChecking(true);
      const healthStatus = await ollamaHealthCheck.performHealthCheck();
      setStatus(healthStatus);
      setIsChecking(false);
    };

    checkHealth();

    // Start periodic checks
    ollamaHealthCheck.startPeriodicCheck(30000); // Check every 30 seconds

    return () => {
      ollamaHealthCheck.stopPeriodicCheck();
    };
  }, []);

  // Don't show banner if everything is OK or user dismissed it
  if (isDismissed || !status || (status.isRunning && status.hasModels)) {
    return null;
  }

  const instructions = ollamaHealthCheck.getInstructions(status);
  const isError = !status.isInstalled || !status.isRunning;
  const isWarning = status.isRunning && !status.hasModels;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${
      isError ? 'bg-red-600' : isWarning ? 'bg-yellow-600' : 'bg-blue-600'
    } text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {isChecking ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span className="font-medium">Checking Ollama status...</span>
              </div>
            ) : (
              <div>
                <div className="font-bold text-lg mb-2">
                  {!status.isInstalled && '🚫 Ollama Not Installed'}
                  {status.isInstalled && !status.isRunning && '⚠️ Ollama Not Running'}
                  {status.isRunning && !status.hasModels && '📦 No Models Installed'}
                </div>
                <pre className="text-sm whitespace-pre-wrap font-mono bg-black/20 p-3 rounded">
                  {instructions}
                </pre>
                {status.isRunning && !status.hasModels && (
                  <div className="mt-3">
                    <a
                      href="https://ollama.ai/library"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-white text-yellow-700 font-medium rounded hover:bg-gray-100 transition-colors"
                    >
                      Browse Available Models →
                    </a>
                  </div>
                )}
                {!status.isInstalled && (
                  <div className="mt-3">
                    <a
                      href="https://ollama.ai/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-white text-red-700 font-medium rounded hover:bg-gray-100 transition-colors"
                    >
                      Download Ollama →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            title="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
