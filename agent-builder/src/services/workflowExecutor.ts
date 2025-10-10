/**
 * Workflow Execution Engine
 * Executes agent workflows node by node
 */

import type { Node, Edge } from '@xyflow/react';
import { ollamaService } from './ollamaService';

export interface ExecutionContext {
  state: Record<string, any>;
  history: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  currentInput: string;
  variables: Record<string, any>;
}

export interface ExecutionLog {
  timestamp: number;
  nodeId: string;
  nodeType: string;
  nodeName: string;
  input: any;
  output: any;
  duration: number;
  error?: string;
}

export class WorkflowExecutor {
  private nodes: Node[];
  private edges: Edge[];
  private context: ExecutionContext;
  private logs: ExecutionLog[];
  private onLog?: (log: ExecutionLog) => void;

  constructor(
    nodes: Node[],
    edges: Edge[],
    initialInput: string = '',
    onLog?: (log: ExecutionLog) => void
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.logs = [];
    this.onLog = onLog;
    this.context = {
      state: {},
      history: [],
      currentInput: initialInput,
      variables: {},
    };
  }

  /**
   * Execute the entire workflow
   */
  async execute(): Promise<{ result: any; logs: ExecutionLog[] }> {
    console.log('🚀 Starting workflow execution...');

    // Find the start node
    const startNode = this.nodes.find((n) => n.type === 'start');
    if (!startNode) {
      throw new Error('No start node found in workflow');
    }

    try {
      // Execute from start node
      const result = await this.executeNode(startNode.id);
      console.log('✅ Workflow execution completed');
      return { result, logs: this.logs };
    } catch (error) {
      console.error('❌ Workflow execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute a single node and follow connections
   */
  private async executeNode(nodeId: string): Promise<any> {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    // Highlight this node as executing
    this.highlightNode(nodeId, 'executing');

    console.log(`📍 Executing node: ${node.data.label || node.type} (${node.type})`);

    const startTime = Date.now();
    let output: any;
    let error: string | undefined;

    try {
      // Execute node based on type
      switch (node.type) {
        case 'start':
          output = await this.executeStart(node);
          break;
        case 'agent':
          output = await this.executeAgent(node);
          break;
        case 'ifElse':
          output = await this.executeIfElse(node);
          break;
        case 'transform':
          output = await this.executeTransform(node);
          break;
        case 'fileSearch':
          output = await this.executeFileSearch(node);
          break;
        case 'guardrails':
          output = await this.executeGuardrails(node);
          break;
        case 'mcp':
          output = await this.executeMCP(node);
          break;
        case 'while':
          output = await this.executeWhile(node);
          break;
        case 'userApproval':
          output = await this.executeUserApproval(node);
          break;
        case 'setState':
          output = await this.executeSetState(node);
          break;
        case 'voice':
          output = await this.executeVoice(node);
          break;
        case 'note':
          output = this.context.currentInput; // Notes don't modify data
          break;
        case 'end':
          output = await this.executeEnd(node);
          return output; // End node terminates execution
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }

      // Update context with output
      this.context.currentInput = output;
      
      // Mark node as completed successfully
      this.highlightNode(nodeId, 'completed');
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      
      // Mark node as failed
      this.highlightNode(nodeId, 'error');
      throw err;
    } finally {
      // Log execution
      const log: ExecutionLog = {
        timestamp: Date.now(),
        nodeId: node.id,
        nodeType: node.type || 'unknown',
        nodeName: (node.data?.label as string) || node.type || 'unknown',
        input: this.context.currentInput,
        output,
        duration: Date.now() - startTime,
        error,
      };
      this.logs.push(log);
      this.onLog?.(log);
    }

    // Find next node(s) to execute
    const nextNodes = this.getNextNodes(nodeId, output);

    // If no next nodes, we're done
    if (nextNodes.length === 0) {
      return output;
    }

    // Execute next node (for now, just take the first one)
    // TODO: Handle multiple branches properly
    return this.executeNode(nextNodes[0]);
  }

  /**
   * Get next nodes to execute based on current node and output
   */
  private getNextNodes(nodeId: string, output: any): string[] {
    const outgoingEdges = this.edges.filter((e) => e.source === nodeId);

    // For If/Else nodes, check the output to determine which branch
    const node = this.nodes.find((n) => n.id === nodeId);
    if (node?.type === 'ifElse') {
      const condition = this.evaluateCondition(output);
      const targetEdge = outgoingEdges.find((e) =>
        condition ? e.sourceHandle === 'true' : e.sourceHandle === 'false'
      );
      return targetEdge ? [targetEdge.target] : [];
    }

    // For While loops, only follow the exit edge (the body is handled internally)
    if (node?.type === 'while') {
      const exitEdge = outgoingEdges.find((e) => e.sourceHandle === 'exit');
      return exitEdge ? [exitEdge.target] : [];
    }

    // For other nodes, follow all outgoing edges (but skip named handles)
    return outgoingEdges
      .filter(e => !e.sourceHandle || e.sourceHandle === 'source')
      .map((e) => e.target);
  }

  /**
   * Execute Start node
   */
  private async executeStart(_node: Node): Promise<string> {
    return this.context.currentInput || 'Workflow started';
  }

  /**
   * Execute Agent node - Call LLM
   */
  private async executeAgent(node: Node): Promise<string> {
    const instructions = (node.data?.instructions as string) || 'You are a helpful assistant.';
    const model = (node.data?.model as string) || 'llama3.2:3b';
    const includeChatHistory = node.data?.includeChatHistory as boolean;
    const temperature = (node.data?.temperature as number) || 0.7;

    console.log(`🤖 Calling LLM: ${model}`);

    // Build prompt - replace {input} placeholder with actual input
    const systemPrompt = (instructions || 'You are a helpful assistant.').replace(/{input}/g, String(this.context.currentInput));
    const userPrompt = String(this.context.currentInput);

    try {
      let response: string;

      if (includeChatHistory && this.context.history.length > 0) {
        // Use chat completion with history
        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...this.context.history,
          { role: 'user' as const, content: userPrompt },
        ];

        response = await ollamaService.chat(model || 'llama3.2:3b', messages);

        // Update history
        this.context.history.push(
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: response }
        );
      } else {
        // Simple generation without history
        response = await ollamaService.generate({
          model: model || 'llama3.2:3b',
          prompt: userPrompt,
          system: systemPrompt,
          temperature: temperature || 0.7,
        });
      }

      return response;
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new Error(`LLM call failed: ${error}`);
    }
  }

  /**
   * Execute If/Else node - Conditional logic
   */
  private async executeIfElse(node: Node): Promise<boolean> {
    const condition = node.data?.condition as string | undefined;
    return this.evaluateCondition(String(this.context.currentInput), condition);
  }

  /**
   * Evaluate condition for If/Else
   */
  private evaluateCondition(input: any, condition?: string): boolean {
    if (!condition) {
      // Default: check if input is truthy
      return !!input && input !== '' && input !== 'false' && input !== '0';
    }

    try {
      // Simple condition evaluation
      // TODO: Implement more sophisticated condition parser
      return eval(condition);
    } catch {
      return false;
    }
  }

  /**
   * Execute Transform node - Data transformation
   */
  private async executeTransform(node: Node): Promise<any> {
    const transformCode = node.data?.transformCode as string | undefined;

    if (!transformCode) {
      return this.context.currentInput;
    }

    try {
      // Create a function from the transform code
      const transformFn = new Function('input', 'context', transformCode);
      return transformFn(this.context.currentInput, this.context);
    } catch (error) {
      console.error('Transform error:', error);
      throw new Error(`Transform failed: ${error}`);
    }
  }

  /**
   * Execute File Search node
   */
  private async executeFileSearch(_node: Node): Promise<string> {
    // TODO: Implement file search
    console.log('📂 File search not yet implemented');
    return this.context.currentInput;
  }

  /**
   * Execute Guardrails node - Content filtering
   */
  private async executeGuardrails(_node: Node): Promise<string> {
    // TODO: Implement guardrails
    console.log('🛡️ Guardrails not yet implemented');
    return this.context.currentInput;
  }

  /**
   * Execute MCP node - Model Context Protocol
   */
  private async executeMCP(_node: Node): Promise<string> {
    // TODO: Implement MCP
    console.log('🔌 MCP not yet implemented');
    return this.context.currentInput;
  }

  /**
   * Execute Voice/TTS node - Text-to-Speech with auto-cleanup
   */
  private async executeVoice(node: Node): Promise<string> {
    const voice = (node.data?.voice as string) || 'male';
    const voiceName = (node.data?.voiceName as string) || 'en-US-GuyNeural';
    const speed = (node.data?.speed as number) || 1;
    const outputFile = (node.data?.outputFile as string) || 'output.mp3';
    
    const textToSpeak = String(this.context.currentInput);
    
    console.log(`🔊 Voice TTS: ${voice} (${voiceName}) at ${speed}x speed -> ${outputFile}`);
    console.log(`📝 Text to speak (${textToSpeak.length} chars): ${textToSpeak.substring(0, 100)}...`);
    
    try {
      // Convert speed to rate format (+/-N%)
      const rate = this.speedToRate(speed);
      
      // Call TTS server
      const response = await fetch('http://localhost:3001/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSpeak,
          voice: voiceName,
          speed: rate,
        })
      });

      if (!response.ok) {
        throw new Error(`TTS server returned ${response.status}`);
      }
      
      // Get the audio as a blob with explicit MIME type
      const arrayBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('🔊 Generated speech audio');
      console.log(`📊 Audio blob size: ${audioBlob.size} bytes (${(audioBlob.size / 1024).toFixed(1)} KB)`);
      console.log(`📊 Audio type: ${audioBlob.type}`);
      console.log(`📊 Blob URL: ${audioUrl}`);
      
      // Play audio in background without modal
      await this.playAudioInBackground(audioUrl, textToSpeak.substring(0, 100));
      
      // Clean up blob URL after playback
      URL.revokeObjectURL(audioUrl);
      
      console.log('✅ Voice playback complete');
      return this.context.currentInput;
      
    } catch (error) {
      console.warn('⚠️ TTS service not available, skipping voice generation');
      console.log('💡 To enable voice: Run `node tts-server.js` in the project root');
      return this.context.currentInput;
    }
  }

  /**
   * Convert speed multiplier to Edge TTS rate format
   */
  private speedToRate(speed: number): string {
    // Edge TTS rate format: +/-N% where N is 0-100
    const percent = Math.round((speed - 1) * 100);
    if (percent === 0) return '+0%';
    return percent > 0 ? `+${percent}%` : `${percent}%`;
  }

  /**
   * Play audio in background without UI
   */
  private async playAudioInBackground(audioUrl: string, textPreview: string): Promise<void> {
    return new Promise(async (resolve) => {
      console.log('🔊 Starting background audio playback...');
      console.log(`📝 Speaking: "${textPreview}..."`);
      
      try {
        // Use simple HTML5 audio element for better compatibility
        const audio = new Audio(audioUrl);
        audio.volume = 1.0;
        audio.playbackRate = 1.0; // Ensure normal playback speed
        
        console.log('🎵 Created audio element');
        console.log(`🔗 Audio source: ${audioUrl}`);
        console.log(`⚙️ Playback rate: ${audio.playbackRate}x`);
        
        // Handle playback events
        audio.onloadeddata = () => {
          console.log(`✅ Audio loaded! Duration: ${audio.duration.toFixed(1)}s`);
        };
        
        audio.onplay = () => {
          console.log('▶️ Audio playback started');
        };
        
        audio.onplaying = () => {
          console.log('✅ Audio is now playing!');
        };
        
        audio.onended = () => {
          console.log('🎵 Audio playback finished');
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (e) => {
          console.error('❌ Audio playback error:', e);
          console.error('Error details:', audio.error);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        // Attempt to play
        console.log('� Attempting to play audio...');
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Play promise resolved - audio is playing');
            })
            .catch((error) => {
              console.error('❌ Play promise rejected:', error);
              console.log('⚠️ Browser may be blocking autoplay. Showing audio controls...');
              
              // If autoplay is blocked, show visible controls
              audio.controls = true;
              audio.style.cssText = 'position: fixed; bottom: 10px; right: 10px; width: 300px; z-index: 9999; background: white; padding: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
              document.body.appendChild(audio);
              
              // Auto-remove after playback
              audio.onended = () => {
                console.log('🎵 Audio playback finished (with controls)');
                if (document.body.contains(audio)) {
                  document.body.removeChild(audio);
                }
                URL.revokeObjectURL(audioUrl);
                resolve();
              };
            });
        }
        
      } catch (error) {
        console.error('❌ Audio playback error:', error);
        
        // Fallback with visible controls
        console.log('🔄 Falling back to visible audio element...');
        const audio = document.createElement('audio');
        audio.src = audioUrl;
        audio.volume = 1.0;
        audio.playbackRate = 1.0; // Ensure normal playback speed
        audio.controls = true;
        audio.autoplay = true;
        audio.style.cssText = 'position: fixed; bottom: 10px; right: 10px; width: 300px; z-index: 9999; background: white; padding: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
        document.body.appendChild(audio);
        
        audio.onended = () => {
          console.log('🎵 Audio playback finished (fallback)');
          if (document.body.contains(audio)) {
            document.body.removeChild(audio);
          }
          resolve();
        };
        
        console.log('🎵 Attempting fallback playback...');
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('✅ Audio playback started successfully (fallback)!');
          }).catch((playError) => {
            console.error('❌ Failed to auto-play audio:', playError.name, playError.message);
            console.warn('⚠️ Audio playback failed completely');
            resolve();
          });
        }
      }
    });
  }

  /**
   * Show a small toast notification when autoplay is blocked
   */
  private showAudioToast(audioUrl: string, textPreview: string): void {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 350px;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      gap: 12px;
    `;
    
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;
    
    toast.innerHTML = `
      <div style="font-size: 24px;">🔊</div>
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">Voice Output Ready</div>
        <div style="font-size: 13px; opacity: 0.9;">${textPreview}...</div>
      </div>
      <button id="play-audio-btn" style="
        background: white;
        color: #667eea;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
      ">▶️ Play</button>
    `;
    
    document.body.appendChild(toast);
    
    const playBtn = toast.querySelector('#play-audio-btn');
    playBtn?.addEventListener('click', () => {
      audio.play();
      toast.remove();
    });
    
    audio.onended = () => {
      if (document.body.contains(toast)) {
        toast.remove();
      }
      URL.revokeObjectURL(audioUrl);
    };
    
    // Auto-remove after 10 seconds if not played
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.remove();
      }
    }, 10000);
  }

  /**
   * Play audio and wait for completion (deprecated - kept for compatibility)
   */
  private async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      
      // Set volume to maximum to ensure it's audible
      audio.volume = 1.0;
      
      console.log('🔊 STARTING AUDIO PLAYBACK - You should hear speech now!');
      console.log(`🔊 Audio URL: ${audioUrl.substring(0, 50)}...`);
      console.log(`🔊 Audio duration will be logged when finished`);
      
      audio.onended = () => {
        console.log('🎵 Audio playback finished');
        resolve();
      };
      
      audio.onerror = (error) => {
        console.error('❌ Audio playback error:', error);
        console.error('❌ This means the audio file could not be loaded or played');
        reject(error);
      };

      audio.onloadedmetadata = () => {
        console.log(`🎵 Audio loaded! Duration: ${audio.duration.toFixed(1)} seconds`);
      };

      audio.onplay = () => {
        console.log('▶️ Audio is now playing!');
      };
      
      audio.play().catch((error) => {
        console.error('❌ Failed to start audio playback:', error);
        console.error('❌ Error type:', error.name);
        console.error('❌ Error message:', error.message);
        // Some browsers block autoplay, but we'll continue anyway
        console.log('💡 Audio may have been blocked by browser. Check:');
        console.log('   1. Browser tab is not muted (check tab icon)');
        console.log('   2. System volume is turned up');
        console.log('   3. Browser has permission to play audio');
        resolve(); // Don't fail the workflow
      });
    });
  }

  /**
   * Show a visual audio player with controls
   */
  private async showAudioPlayer(title: string, text: string, audioUrl: string): Promise<void> {
    return new Promise((resolve) => {
      // Create a modal audio player
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
      `;
      
      const player = document.createElement('div');
      player.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 24px;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      `;
      
      // Create audio element with controls
      const audio = document.createElement('audio');
      audio.src = audioUrl;
      audio.controls = true;
      audio.autoplay = false; // Don't autoplay - require user interaction
      audio.volume = 1.0; // Maximum volume
      audio.preload = 'auto'; // Preload the audio
      audio.style.cssText = 'width: 100%; margin-top: 16px;';
      
      console.log(`🎵 Created audio element with src: ${audioUrl}`);
      console.log(`🎵 Audio element created, waiting for user to click play...`);
      
      player.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="font-size: 32px;">🔊</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 18px; color: #1a1a1a;">${title}</div>
            <div style="font-size: 14px; color: #666; margin-top: 4px;">${text}...</div>
          </div>
        </div>
        <div style="padding: 16px; background: #dc2626; color: white; border-radius: 8px; font-size: 15px; margin-bottom: 12px; text-align: center; font-weight: 600;">
          ⚠️ CLICK THE PLAY BUTTON BELOW TO HEAR AUDIO!
        </div>
      `;
      
      player.appendChild(audio);
      
      const cleanup = () => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
        URL.revokeObjectURL(audioUrl);
        console.log('🧹 Audio player cleaned up, blob URL revoked');
        resolve();
      };
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕ Close';
      closeBtn.style.cssText = `
        margin-top: 16px;
        width: 100%;
        padding: 12px;
        background: #f5f5f5;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      `;
      closeBtn.onmouseover = () => closeBtn.style.background = '#e5e5e5';
      closeBtn.onmouseout = () => closeBtn.style.background = '#f5f5f5';
      closeBtn.onclick = () => {
        audio.pause();
        cleanup();
      };
      player.appendChild(closeBtn);
      
      // Audio event listeners for debugging
      audio.onloadstart = () => console.log('🎵 Audio loading...');
      audio.onloadedmetadata = () => console.log(`🎵 Audio metadata loaded. Duration: ${audio.duration.toFixed(1)}s`);
      audio.oncanplay = () => console.log('🎵 Audio can play');
      audio.onplay = () => console.log('▶️  Audio started playing!');
      audio.onpause = () => console.log('⏸️  Audio paused');
      audio.onerror = (e) => {
        console.error('❌ Audio error:', e);
        console.error('❌ Audio error code:', audio.error?.code);
        console.error('❌ Audio error message:', audio.error?.message);
        console.error('❌ Audio src:', audio.src);
      };
      
      // Close when audio ends
      audio.onended = () => {
        console.log('🎵 Audio playback finished');
        setTimeout(cleanup, 1000);
      };
      
      modal.appendChild(player);
      
      // Add animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(modal);
      
      // Store reference to clean up later
      setTimeout(() => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, 10000);
    });
  }

  /**
   * Show a visual notification when audio is playing
   */
  private showAudioNotification(title: string, text: string): void {
    // Create a toast notification element
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 350px;
      font-family: system-ui, -apple-system, sans-serif;
      animation: slideIn 0.3s ease-out;
    `;
    
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 24px;">🔊</div>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
          <div style="font-size: 13px; opacity: 0.9;">${text}...</div>
        </div>
      </div>
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        document.body.removeChild(toast);
        document.head.removeChild(style);
      }, 300);
    }, 5000);
  }

  /**
   * Highlight a node during execution
   */
  private highlightNode(nodeId: string, state: 'executing' | 'completed' | 'error'): void {
    // Find the node element in the DOM (React Flow nodes have class 'react-flow__node')
    const nodeElement = document.querySelector(`.react-flow__node[data-id="${nodeId}"]`);
    if (!nodeElement) {
      console.warn(`Node element not found for ${nodeId}`);
      return;
    }

    // Remove previous states
    nodeElement.classList.remove('node-executing', 'node-completed', 'node-error');

    // Add new state - use filter and border effects instead of transform to avoid layout issues
    switch (state) {
      case 'executing':
        nodeElement.classList.add('node-executing');
        break;
      case 'completed':
        nodeElement.classList.add('node-completed');
        // Remove completed highlight after 2 seconds
        setTimeout(() => {
          nodeElement.classList.remove('node-completed');
        }, 2000);
        break;
      case 'error':
        nodeElement.classList.add('node-error');
        break;
    }

    // Add animation CSS if not already added
    if (!document.querySelector('#workflow-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'workflow-animation-styles';
      style.textContent = `
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(99, 102, 241, 1));
          }
        }
        
        .react-flow__node.node-executing {
          filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.8));
          animation: pulse-glow 1.5s ease-in-out infinite;
          z-index: 100 !important;
          border: 2px solid #6366f1 !important;
        }
        
        .react-flow__node.node-completed {
          filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.7));
          border: 2px solid #22c55e !important;
          z-index: 50 !important;
        }
        
        .react-flow__node.node-error {
          filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.8));
          border: 2px solid #ef4444 !important;
          z-index: 75 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Execute While loop node
   */
  /**
   * Execute While loop node
   */
  private async executeWhile(node: Node): Promise<any> {
    const condition = (node.data?.condition as string) || 'return false;';
    const maxIterations = (node.data?.maxIterations as number) || 100;
    
    console.log(`🔄 While loop: max ${maxIterations} iterations`);
    
    let iterations = 0;
    let shouldContinue = true;
    
    // Find the loop body edge (goes to body handle)
    const bodyEdge = this.edges.find(
      e => e.source === node.id && e.sourceHandle === 'body'
    );
    
    if (!bodyEdge) {
      console.warn('⚠️ While loop has no body edge');
      return this.context.currentInput;
    }
    
    // Execute loop
    while (shouldContinue && iterations < maxIterations) {
      // Evaluate condition
      try {
        const conditionFunc = new Function('input', 'state', 'variables', condition);
        shouldContinue = conditionFunc(
          this.context.currentInput,
          this.context.state,
          this.context.variables
        );
      } catch (error) {
        console.error('❌ Error evaluating while condition:', error);
        shouldContinue = false;
        break;
      }
      
      if (!shouldContinue) {
        console.log(`🔄 Loop condition false after ${iterations} iterations`);
        break;
      }
      
      iterations++;
      console.log(`🔄 Loop iteration ${iterations}/${maxIterations}`);
      
      // Execute loop body - find the body node
      const bodyNode = this.nodes.find(n => n.id === bodyEdge.target);
      if (bodyNode) {
        // Execute the body subflow
        await this.executeNodeChain(bodyNode.id, node.id);
      }
      
      // Safety check
      if (iterations >= maxIterations) {
        console.warn(`⚠️ While loop hit max iterations (${maxIterations})`);
        break;
      }
    }
    
    console.log(`✅ While loop completed: ${iterations} iterations`);
    return this.context.currentInput;
  }

  /**
   * Execute a chain of nodes until we hit a stopping point
   */
  private async executeNodeChain(startNodeId: string, stopNodeId: string): Promise<void> {
    let currentNodeId: string | undefined = startNodeId;
    const visited = new Set<string>();
    
    while (currentNodeId && currentNodeId !== stopNodeId) {
      // Prevent infinite loops in chain
      if (visited.has(currentNodeId)) {
        console.warn('⚠️ Circular reference detected in node chain');
        break;
      }
      visited.add(currentNodeId);
      
      const node = this.nodes.find(n => n.id === currentNodeId);
      if (!node) break;
      
      // Execute this node using the node ID
      const startTime = Date.now();
      let output: any;
      
      try {
        // Execute based on node type (simplified for loop body)
        switch (node.type) {
          case 'transform':
            output = await this.executeTransform(node);
            break;
          case 'setState':
            output = await this.executeSetState(node);
            break;
          case 'agent':
            output = await this.executeAgent(node);
            break;
          default:
            console.log(`⚠️ Skipping node type ${node.type} in loop body`);
            output = this.context.currentInput;
        }
        
        this.context.currentInput = output;
        
        // Log execution
        this.logExecution(node, this.context.currentInput, output, startTime);
      } catch (err) {
        console.error(`❌ Error in loop body node ${node.id}:`, err);
        throw err;
      }
      
      // Find next node in chain (excluding the stop node connection)
      const nextEdge: Edge | undefined = this.edges.find(
        e => e.source === currentNodeId && e.target !== stopNodeId
      );
      
      currentNodeId = nextEdge?.target;
    }
  }

  /**
   * Helper to log node execution
   */
  private logExecution(node: Node, input: any, output: any, startTime: number): void {
    const log: ExecutionLog = {
      timestamp: Date.now(),
      nodeId: node.id,
      nodeType: node.type || 'unknown',
      nodeName: (node.data?.label as string) || node.type || 'unknown',
      input,
      output,
      duration: Date.now() - startTime,
    };
    
    this.logs.push(log);
    if (this.onLog) {
      this.onLog(log);
    }
  }


  /**
   * Execute User Approval node - Human in the loop
   */
  private async executeUserApproval(_node: Node): Promise<string> {
    // TODO: Implement user approval UI
    console.log('✋ User approval not yet implemented - auto-approving');
    return this.context.currentInput;
  }

  /**
   * Execute Set State node - Update workflow state
   */
  private async executeSetState(node: Node): Promise<any> {
    const key = node.data?.key as string | undefined;
    const value = node.data?.value;

    if (key) {
      this.context.state[key] = value || this.context.currentInput;
    }

    return this.context.currentInput;
  }

  /**
   * Execute End node - Workflow termination
   */
  private async executeEnd(_node: Node): Promise<any> {
    console.log('🏁 Workflow completed');
    return this.context.currentInput;
  }

  /**
   * Get execution logs
   */
  getLogs(): ExecutionLog[] {
    return this.logs;
  }

  /**
   * Get execution context
   */
  getContext(): ExecutionContext {
    return this.context;
  }
}
