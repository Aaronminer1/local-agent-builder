#!/usr/bin/env python3
"""
Edge TTS Service - Text-to-Speech using Edge TTS
Accepts JSON input and generates audio files
"""

import sys
import json
import asyncio
import edge_tts
import os

async def text_to_speech(text: str, voice: str, rate: str, output_file: str):
    """
    Convert text to speech using Edge TTS
    
    Args:
        text: Text to convert to speech
        voice: Voice name (e.g., en-US-JennyNeural)
        rate: Speech rate (e.g., +20% for 1.2x speed)
        output_file: Output MP3 file path
    """
    try:
        communicate = edge_tts.Communicate(text, voice, rate=rate)
        await communicate.save(output_file)
        return True
    except Exception as e:
        print(f"Error generating speech: {e}", file=sys.stderr)
        return False

def speed_to_rate(speed: float) -> str:
    """Convert speed multiplier to Edge TTS rate format"""
    if speed == 1.0:
        return "+0%"
    
    # Convert to percentage (1.2x = +20%, 0.8x = -20%)
    percentage = int((speed - 1.0) * 100)
    return f"{percentage:+d}%"

async def main():
    """Main entry point - reads JSON from stdin"""
    try:
        # Read JSON from stdin
        input_data = json.load(sys.stdin)
        
        text = input_data.get('text', '')
        voice = input_data.get('voice', 'en-US-JennyNeural')
        speed = float(input_data.get('speed', 1.0))
        output_file = input_data.get('outputFile', 'output.mp3')
        
        # Convert speed to rate
        rate = speed_to_rate(speed)
        
        # Ensure output directory exists
        output_dir = os.path.dirname(output_file)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # Generate speech
        success = await text_to_speech(text, voice, rate, output_file)
        
        if success:
            result = {
                "success": True,
                "outputFile": output_file,
                "voice": voice,
                "speed": speed,
                "textLength": len(text)
            }
        else:
            result = {
                "success": False,
                "error": "Failed to generate speech"
            }
        
        # Output JSON result
        print(json.dumps(result))
        sys.exit(0 if success else 1)
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
