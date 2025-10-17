#!/usr/bin/env node
/**
 * TTS Backend Server
 * Provides HTTP API for Edge TTS text-to-speech generation
 */

import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve generated audio files
const OUTPUT_DIR = path.join(__dirname, 'tts-output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
app.use('/audio', express.static(OUTPUT_DIR));

// TTS Generation Endpoint
app.post('/api/tts', async (req, res) => {
  const { text, voice, speed, outputFile } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, error: 'Text is required' });
  }

  console.log(`🔊 TTS Request: ${voice || 'en-US-JennyNeural'} @ ${speed || 1}x`);
  console.log(`📝 Text (${text.length} chars): ${text.substring(0, 100)}...`);

  try {
    // Prepare output file path
    const fileName = outputFile || `tts-${Date.now()}.mp3`;
    const filePath = path.join(OUTPUT_DIR, path.basename(fileName));

    // Prepare input for Python script
    const input = JSON.stringify({
      text,
      voice: voice || 'en-US-JennyNeural',
      speed: speed || 1.0,
      outputFile: filePath
    });

    // Spawn Python TTS service
    const python = spawn('python3', [path.join(__dirname, 'tts-service.py')], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Send input to Python script
    python.stdin.write(input);
    python.stdin.end();

    python.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          
          if (result.success) {
            console.log(`✅ TTS generated: ${path.basename(filePath)}`);
            
            // Return URL to audio file
            const audioUrl = `/audio/${path.basename(filePath)}`;
            res.json({
              success: true,
              outputFile: audioUrl,
              localPath: filePath,
              voice: result.voice,
              speed: result.speed,
              textLength: result.textLength
            });
          } else {
            console.error('❌ TTS generation failed:', result.error);
            res.status(500).json(result);
          }
        } catch (parseError) {
          console.error('❌ Failed to parse Python output:', stdout);
          res.status(500).json({
            success: false,
            error: 'Failed to parse TTS service response',
            output: stdout
          });
        }
      } else {
        console.error('❌ Python script failed:', stderr);
        res.status(500).json({
          success: false,
          error: 'TTS service error',
          details: stderr
        });
      }
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Edge TTS Backend' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎤 Edge TTS Backend running on http://localhost:${PORT}`);
  console.log(`📁 Audio files will be saved to: ${OUTPUT_DIR}`);
  console.log(`🔊 Ready to generate speech!`);
});
