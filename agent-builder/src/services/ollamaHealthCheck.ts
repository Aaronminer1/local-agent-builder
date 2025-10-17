/**
 * Ollama Health Check Service
 * Checks if Ollama is installed, running, and has models available
 * Auto-starts Ollama if needed
 */

import { ollamaService } from './ollamaService';

export interface OllamaHealthStatus {
  isInstalled: boolean;
  isRunning: boolean;
  hasModels: boolean;
  models: string[];
  error?: string;
}

class OllamaHealthCheckService {
  private healthCheckInterval: number | null = null;

  /**
   * Check if Ollama is installed by trying to connect to the API
   */
  async checkInstalled(): Promise<boolean> {
    try {
      // Try to fetch from the API - if it fails, Ollama might not be installed
      await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
      });
      return true; // If we can connect, it's installed
    } catch (error) {
      // Check if it's a connection error (not running) vs not installed
      // If the error is ECONNREFUSED, it's installed but not running
      return false;
    }
  }

  /**
   * Attempt to start Ollama server
   * Note: In a browser environment, we can't start processes
   * This is a placeholder that will be handled by the backend/Electron
   */
  async startOllama(): Promise<boolean> {
    console.log('⚠️ Cannot auto-start Ollama from browser. Please start it manually.');
    return false;
  }

  /**
   * Perform complete health check
   */
  async performHealthCheck(): Promise<OllamaHealthStatus> {
    const status: OllamaHealthStatus = {
      isInstalled: false,
      isRunning: false,
      hasModels: false,
      models: [],
    };

    try {
      // Check if Ollama is running
      const isRunning = await ollamaService.isAvailable();
      status.isRunning = isRunning;
      status.isInstalled = true; // If we can check, it's installed

      if (isRunning) {
        // Get available models
        try {
          const models = await ollamaService.listModels();
          status.models = models.map(m => m.name);
          status.hasModels = models.length > 0;
        } catch (error) {
          console.error('Error fetching models:', error);
          status.error = 'Failed to fetch models';
        }
      } else {
        status.error = 'Ollama is not running. Please start it manually.';
      }
    } catch (error: any) {
      console.error('Health check error:', error);
      status.isInstalled = false;
      status.error = error.message || 'Unknown error';
    }

    return status;
  }

  /**
   * Start periodic health checks
   */
  startPeriodicCheck(intervalMs: number = 30000) {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      const status = await this.performHealthCheck();
      if (!status.isRunning) {
        console.warn('⚠️ Ollama server is not running');
      }
    }, intervalMs);
  }

  /**
   * Stop periodic health checks
   */
  stopPeriodicCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Get user-friendly instructions based on health status
   */
  getInstructions(status: OllamaHealthStatus): string {
    if (!status.isInstalled) {
      return `
🚫 Ollama is not installed

To use this agent builder, you need to install Ollama:

1. Visit https://ollama.ai/download
2. Download and install Ollama for your operating system
3. After installation, restart this application

Ollama provides local AI models that power your agents.
      `.trim();
    }

    if (!status.isRunning) {
      return `
⚠️ Ollama is not running

To start Ollama:
1. Open a terminal/command prompt
2. Run: ollama serve
3. Keep the terminal open while using the agent builder
4. Refresh this page once Ollama is running

The Ollama server needs to be running for AI agents to work.
      `.trim();
    }

    if (!status.hasModels) {
      return `
📦 Ollama is running but no models are installed

To download models:

1. Open a terminal/command prompt
2. Run one of these commands:
   • ollama pull llama3.2:3b (small, fast)
   • ollama pull llama3.1:8b (balanced)
   • ollama pull gpt-oss:latest (larger, more capable)

3. Refresh this page after downloading

Available models will appear in the agent configuration.
      `.trim();
    }

    return `✅ Ollama is ready! ${status.models.length} model(s) available: ${status.models.join(', ')}`;
  }
}

export const ollamaHealthCheck = new OllamaHealthCheckService();
