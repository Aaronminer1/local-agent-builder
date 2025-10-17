#!/usr/bin/env python3
"""
Edge TTS wrapper that disables SSL verification
This must be done BEFORE importing aiohttp
"""
import ssl
import sys

# Patch SSL context BEFORE any imports
_original_create_default_context = ssl.create_default_context

def _create_unverified_context(purpose=ssl.Purpose.SERVER_AUTH, *, cafile=None, capath=None, cadata=None):
    context = _original_create_default_context(purpose, cafile=cafile, capath=capath, cadata=cadata)
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    return context

ssl.create_default_context = _create_unverified_context
ssl._create_default_https_context = _create_unverified_context

# Now import and run edge-tts
from edge_tts.util import main

if __name__ == '__main__':
    sys.exit(main())
