/**
 * Edge TTS Server
 * Provides text-to-speech API using edge-tts
 */

const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Temporary directory for audio files
const TEMP_DIR = path.join(__dirname, 'temp-audio');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Clean up old audio files (older than 5 minutes)
 */
function cleanupOldFiles() {
  try {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    files.forEach(file => {
      const filePath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Cleaned up old file: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning up files:', error);
  }
}

// Clean up every 2 minutes
setInterval(cleanupOldFiles, 2 * 60 * 1000);

/**
 * POST /api/tts
 * Generate speech from text
 */
app.post('/api/tts', async (req, res) => {
  const { text, voice, speed } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const voiceName = voice || 'en-US-JennyNeural';
  const rate = speed || '+0%';
  
  // Generate unique filename
  const filename = `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
  const outputPath = path.join(TEMP_DIR, filename);

  console.log(`🔊 Generating TTS: ${text.substring(0, 50)}... (voice: ${voiceName}, rate: ${rate})`);

  try {
    // Call edge-tts wrapper with SSL verification disabled
    const edgeTTS = spawn('python', [
      path.join(__dirname, 'edge-tts-nossl.py'),
      '--voice', voiceName,
      '--rate', rate,
      '--text', text,
      '--write-media', outputPath
    ]);

    let stderr = '';
    
    edgeTTS.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    edgeTTS.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        console.log(`✅ TTS generated: ${filename}`);
        
        // Read the file and send as response
        const audioBuffer = fs.readFileSync(outputPath);
        
        // Send the audio file (edge-tts generates MP3 files)
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Length', audioBuffer.length);
          res.send(audioBuffer);
        }
        
        // Clean up immediately after sending
        setTimeout(() => {
          try {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
              console.log(`🗑️  Cleaned up: ${filename}`);
            }
          } catch (err) {
            console.error('Error deleting file:', err);
          }
        }, 1000); // Wait 1 second before cleanup
        
      } else {
        console.error('edge-tts failed:', stderr);
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false,
            error: 'TTS generation failed',
            details: stderr
          });
        }
      }
    });

    edgeTTS.on('error', (error) => {
      console.error('Failed to start edge-tts:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false,
          error: 'Failed to start TTS service',
          details: error.message
        });
      }
    });

  } catch (error) {
    console.error('TTS error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        error: 'TTS service error',
        details: error?.message || String(error)
      });
    }
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'edge-tts-server' });
});

app.listen(PORT, () => {
  console.log(`🎙️  Edge TTS Server running on http://localhost:${PORT}`);
  console.log(`📁 Temp directory: ${TEMP_DIR}`);
  console.log(`🔊 Ready to generate speech!`);
});
