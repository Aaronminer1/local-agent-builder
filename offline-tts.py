#!/usr/bin/env python3
"""
Offline TTS using pyttsx3 (Windows SAPI)
"""
import sys
import pyttsx3
import argparse
import os

def main():
    try:
        parser = argparse.ArgumentParser(description='Offline Text-to-Speech')
        parser.add_argument('--text', required=True, help='Text to speak')
        parser.add_argument('--voice', default='', help='Voice name (ignored, uses system default)')
        parser.add_argument('--rate', default='+0%', help='Speech rate')
        parser.add_argument('--write-media', required=True, help='Output file path')
        
        args = parser.parse_args()
        
        # Initialize TTS engine with error handling
        try:
            engine = pyttsx3.init()
        except Exception as e:
            print(f"❌ Failed to initialize TTS engine: {e}", file=sys.stderr)
            return 1
        
        # Set rate (convert from edge-tts format like "+10%" to pyttsx3 format)
        rate_str = args.rate.replace('%', '').replace('+', '')
        try:
            rate_change = int(rate_str)
            current_rate = engine.getProperty('rate')
            new_rate = current_rate + (current_rate * rate_change // 100)
            engine.setProperty('rate', new_rate)
        except:
            pass  # Use default rate if parsing fails
        
        # Save to file
        try:
            engine.save_to_file(args.text, args.write_media)
            engine.runAndWait()
        except Exception as e:
            print(f"❌ Failed to generate speech: {e}", file=sys.stderr)
            return 1
        
        # Verify file was created
        if not os.path.exists(args.write_media):
            print(f"❌ Output file was not created: {args.write_media}", file=sys.stderr)
            return 1
            
        print(f"✅ TTS generated: {args.write_media}")
        return 0
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}", file=sys.stderr)
        return 1

if __name__ == '__main__':
    sys.exit(main())
