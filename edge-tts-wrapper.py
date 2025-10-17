#!/usr/bin/env python3
"""
Wrapper for edge-tts that disables SSL verification
"""
import ssl
import sys
import os

# Disable SSL verification for Python
os.environ['PYTHONHTTPSVERIFY'] = '0'
os.environ['CURL_CA_BUNDLE'] = ''
os.environ['REQUESTS_CA_BUNDLE'] = ''

# Disable SSL verification globally
ssl._create_default_https_context = ssl._create_unverified_context

# Monkey-patch aiohttp to disable SSL verification
import aiohttp
original_init = aiohttp.TCPConnector.__init__

def patched_init(self, *args, **kwargs):
    kwargs['ssl'] = False
    original_init(self, *args, **kwargs)

aiohttp.TCPConnector.__init__ = patched_init

# Import edge-tts after patching
from edge_tts.util import main

if __name__ == '__main__':
    sys.exit(main())
