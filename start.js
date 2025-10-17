#!/usr/bin/env node

/**
 * Local Agent Builder - Single Entry Point Launcher
 * Handles all setup, checks, and starts the application
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Check if a command exists
 */
function commandExists(command) {
  return new Promise((resolve) => {
    exec(`${command} --version`, (error) => {
      resolve(!error);
    });
  });
}

/**
 * Install Node.js on Linux
 */
function installNodeJS() {
  return new Promise((resolve, reject) => {
    logInfo('Installing Node.js...');
    logInfo('This requires sudo privileges. You may be prompted for your password.');
    
    // Use NodeSource repository for latest LTS
    const installScript = `
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&
      sudo apt-get install -y nodejs
    `;
    
    const install = spawn('bash', ['-c', installScript], {
      stdio: 'inherit',
      shell: true
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        logSuccess('Node.js installed successfully');
        resolve();
      } else {
        reject(new Error('Failed to install Node.js'));
      }
    });
  });
}

/**
 * Install Python on Linux
 */
function installPython() {
  return new Promise((resolve, reject) => {
    logInfo('Installing Python 3 and pip...');
    logInfo('This requires sudo privileges. You may be prompted for your password.');
    
    const installScript = 'sudo apt-get update && sudo apt-get install -y python3 python3-pip';
    
    const install = spawn('bash', ['-c', installScript], {
      stdio: 'inherit',
      shell: true
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        logSuccess('Python installed successfully');
        resolve();
      } else {
        reject(new Error('Failed to install Python'));
      }
    });
  });
}

/**
 * Prompt user for yes/no input
 */
function promptUser(question) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

/**
 * Check if Ollama is running
 */
function checkOllamaRunning() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:11434/api/tags', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Get installed Ollama models
 */
function getOllamaModels() {
  return new Promise((resolve) => {
    http.get('http://localhost:11434/api/tags', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.models || []);
        } catch {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

/**
 * Check if dependencies are installed
 */
function checkDependencies(dir) {
  return fs.existsSync(path.join(dir, 'node_modules'));
}

/**
 * Install dependencies
 */
function installDependencies(dir, name) {
  return new Promise((resolve, reject) => {
    logInfo(`Installing ${name} dependencies...`);
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const install = spawn(npm, ['install'], { 
      cwd: dir,
      stdio: 'inherit',
      shell: true 
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        logSuccess(`${name} dependencies installed`);
        resolve();
      } else {
        reject(new Error(`Failed to install ${name} dependencies`));
      }
    });
  });
}

/**
 * Check if Python package is installed
 */
function checkPythonPackage(packageName) {
  return new Promise((resolve) => {
    const pip = process.platform === 'win32' ? 'pip' : 'pip3';
    // Try pip first, fall back to python -m pip
    exec(`${pip} show ${packageName}`, (error) => {
      if (!error) {
        resolve(true);
      } else {
        // Fallback to python -m pip
        const python = process.platform === 'win32' ? 'python' : 'python3';
        exec(`${python} -m pip show ${packageName}`, (fallbackError) => {
          resolve(!fallbackError);
        });
      }
    });
  });
}

/**
 * Install Python package
 */
function installPythonPackage(packageName) {
  return new Promise((resolve, reject) => {
    logInfo(`Installing ${packageName}...`);
    const python = process.platform === 'win32' ? 'python' : 'python3';
    const pip = process.platform === 'win32' ? 'pip' : 'pip3';
    
    // On Linux, try with --user flag first (works with managed environments)
    const installArgs = process.platform === 'win32' 
      ? ['install', packageName]
      : ['install', '--user', packageName];
    
    // Try using pip directly first
    const install = spawn(pip, installArgs, {
      stdio: 'inherit',
      shell: true
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        logSuccess(`${packageName} installed`);
        resolve();
      } else {
        // Fallback to python -m pip with --user
        logInfo(`Retrying with ${python} -m pip...`);
        const fallbackArgs = process.platform === 'win32'
          ? ['-m', 'pip', 'install', packageName]
          : ['-m', 'pip', 'install', '--user', packageName];
        
        const fallbackInstall = spawn(python, fallbackArgs, {
          stdio: 'inherit',
          shell: true
        });
        
        fallbackInstall.on('close', (fallbackCode) => {
          if (fallbackCode === 0) {
            logSuccess(`${packageName} installed`);
            resolve();
          } else {
            // Last resort: try with --break-system-packages (for newer Ubuntu)
            if (process.platform === 'linux') {
              logInfo('Retrying with --break-system-packages flag...');
              const lastResort = spawn(pip, ['install', '--break-system-packages', packageName], {
                stdio: 'inherit',
                shell: true
              });
              
              lastResort.on('close', (lastCode) => {
                if (lastCode === 0) {
                  logSuccess(`${packageName} installed`);
                  resolve();
                } else {
                  reject(new Error(`Failed to install ${packageName}`));
                }
              });
            } else {
              reject(new Error(`Failed to install ${packageName}`));
            }
          }
        });
      }
    });
  });
}

/**
 * Open browser
 */
function openBrowser(url) {
  const command = process.platform === 'win32' ? 'start' :
                  process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${command} ${url}`);
}

/**
 * Start the application servers
 */
async function startServers() {
  logSection('🚀 Starting Application Servers');
  
  return new Promise((resolve) => {
    // Start both servers using concurrently
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const servers = spawn(npm, ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Wait a bit for servers to start, then open browser
    setTimeout(() => {
      logSuccess('Servers started successfully');
      logInfo('Opening browser...');
      openBrowser('http://localhost:5173');
      resolve(servers);
    }, 3000);
  });
}

/**
 * Main startup sequence
 */
async function main() {
  console.clear();
  
  log('\n╔══════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                          ║', 'cyan');
  log('║        🤖 Local Agent Builder v2.0.0                    ║', 'cyan');
  log('║        Single Entry Point Launcher                      ║', 'cyan');
  log('║                                                          ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════╝', 'cyan');
  
  try {
    // Step 1: Check Node.js
    logSection('📋 Step 1: Checking Prerequisites');
    
    let hasNode = await commandExists('node');
    if (!hasNode) {
      logError('Node.js is not installed!');
      
      // Offer automatic installation on Linux
      if (process.platform === 'linux') {
        log('\n' + '─'.repeat(60), 'yellow');
        logInfo('Would you like to install Node.js automatically?');
        logInfo('This will use the official NodeSource repository (Node.js 20 LTS)');
        log('─'.repeat(60) + '\n', 'yellow');
        
        const answer = await promptUser('Install Node.js now? (y/n): ');
        
        if (answer === 'y' || answer === 'yes') {
          try {
            await installNodeJS();
            // Verify installation
            hasNode = await commandExists('node');
            if (!hasNode) {
              logError('Node.js installation completed but node command not found');
              logInfo('You may need to restart your terminal or run: source ~/.bashrc');
              process.exit(1);
            }
          } catch (error) {
            logError('Failed to install Node.js automatically');
            logInfo('Please install manually from: https://nodejs.org/');
            logInfo('Or run: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -');
            logInfo('         sudo apt-get install -y nodejs');
            process.exit(1);
          }
        } else {
          logInfo('Please install Node.js manually from: https://nodejs.org/');
          logInfo('Or run: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -');
          logInfo('         sudo apt-get install -y nodejs');
          process.exit(1);
        }
      } else {
        // Windows/Mac - provide download link
        logInfo('Please install Node.js from: https://nodejs.org/');
        if (process.platform === 'win32') {
          logInfo('Download the Windows installer and run it');
        } else if (process.platform === 'darwin') {
          logInfo('Download the macOS installer or use: brew install node');
        }
        process.exit(1);
      }
    }
    logSuccess('Node.js is installed');
    
    const hasNpm = await commandExists('npm');
    if (!hasNpm) {
      logError('npm is not installed!');
      logInfo('npm should come with Node.js. Please reinstall Node.js.');
      process.exit(1);
    }
    logSuccess('npm is installed');
    
    // Step 2: Check Python and edge-tts
    let hasPython = await commandExists(process.platform === 'win32' ? 'python' : 'python3');
    if (!hasPython) {
      logWarning('Python is not installed - TTS will not work');
      
      // Offer automatic installation on Linux
      if (process.platform === 'linux') {
        log('\n' + '─'.repeat(60), 'yellow');
        logInfo('Would you like to install Python 3 automatically?');
        logInfo('This is required for Text-to-Speech functionality');
        log('─'.repeat(60) + '\n', 'yellow');
        
        const answer = await promptUser('Install Python now? (y/n): ');
        
        if (answer === 'y' || answer === 'yes') {
          try {
            await installPython();
            // Verify installation
            hasPython = await commandExists('python3');
            if (!hasPython) {
              logWarning('Python installation completed but python3 command not found');
              logInfo('TTS functionality may not work');
            }
          } catch (error) {
            logWarning('Failed to install Python automatically');
            logInfo('Install manually: sudo apt-get install python3 python3-pip');
          }
        } else {
          logInfo('Skipping Python installation - TTS will not work');
          logInfo('Install later: sudo apt-get install python3 python3-pip');
        }
      } else {
        logInfo('Install Python from: https://www.python.org/downloads/');
      }
    } else {
      logSuccess('Python is installed');
    }
    
    // Install edge-tts if Python is available
    if (hasPython) {
      const hasEdgeTTS = await checkPythonPackage('edge-tts');
      if (!hasEdgeTTS) {
        logWarning('edge-tts is not installed - installing now...');
        try {
          await installPythonPackage('edge-tts');
        } catch (error) {
          logWarning('Failed to install edge-tts - TTS may not work');
        }
      } else {
        logSuccess('edge-tts is installed');
      }
    }
    
    // Step 3: Check Ollama
    logSection('📋 Step 2: Checking Ollama');
    
    const hasOllama = await commandExists('ollama');
    if (!hasOllama) {
      logError('Ollama is not installed!');
      logInfo('Please install Ollama from: https://ollama.ai/download');
      logInfo('After installation, run this script again.');
      process.exit(1);
    }
    logSuccess('Ollama is installed');
    
    const ollamaRunning = await checkOllamaRunning();
    if (!ollamaRunning) {
      logError('Ollama is not running!');
      logInfo('Please start Ollama:');
      logInfo('  Windows: Ollama starts automatically');
      logInfo('  Mac/Linux: Run "ollama serve" in another terminal');
      process.exit(1);
    }
    logSuccess('Ollama is running');
    
    // Step 4: Check for models
    logSection('📋 Step 3: Checking Ollama Models');
    
    const models = await getOllamaModels();
    if (models.length === 0) {
      logError('No Ollama models installed!');
      log('\n' + '─'.repeat(60), 'yellow');
      logWarning('You need to install at least one model to use the agent builder.');
      log('\n📚 Recommended models with tool support:', 'yellow');
      log('   • ollama pull llama3.1:8b     (Recommended - 4.9GB)', 'yellow');
      log('   • ollama pull llama3.2:latest (Smaller - 2.0GB)', 'yellow');
      log('   • ollama pull gpt-oss:latest  (Larger - 13.8GB)', 'yellow');
      log('\n💡 After installing a model, run this script again.', 'yellow');
      log('─'.repeat(60) + '\n', 'yellow');
      
      logInfo('Opening Ollama models page in browser...');
      openBrowser('https://ollama.ai/library');
      process.exit(1);
    }
    
    logSuccess(`Found ${models.length} installed model(s):`);
    models.forEach(model => {
      const size = (model.size / 1e9).toFixed(1);
      const hasTools = model.name.includes('llama3') || 
                       model.name.includes('gpt-oss') || 
                       model.name.includes('qwen') || 
                       model.name.includes('deepseek');
      const toolIcon = hasTools ? '🔧' : '  ';
      log(`   ${toolIcon} ${model.name} (${size}GB)`, hasTools ? 'green' : 'reset');
    });
    
    // Step 5: Check and install dependencies
    logSection('📋 Step 4: Checking Dependencies');
    
    // Check root dependencies
    if (!checkDependencies(__dirname)) {
      logWarning('Root dependencies not installed');
      await installDependencies(__dirname, 'root');
    } else {
      logSuccess('Root dependencies installed');
    }
    
    // Check app dependencies
    const appDir = path.join(__dirname, 'agent-builder');
    if (!checkDependencies(appDir)) {
      logWarning('Application dependencies not installed');
      await installDependencies(appDir, 'application');
    } else {
      logSuccess('Application dependencies installed');
    }
    
    // Step 6: Start the application
    logSection('📋 Step 5: Starting Application');
    
    logInfo('Starting frontend and TTS servers...');
    logInfo('This may take a few moments...');
    
    await startServers();
    
    // Success message
    log('\n' + '═'.repeat(60), 'green');
    logSuccess('Application is running!');
    log('═'.repeat(60), 'green');
    log('\n📍 Access the application at:', 'bright');
    log('   🌐 http://localhost:5173\n', 'cyan');
    log('💡 Tips:', 'yellow');
    log('   • Press Ctrl+C to stop the servers', 'reset');
    log('   • Check the browser for the agent builder interface', 'reset');
    log('   • Models with 🔧 icon support tools (Knowledge Base, Web Search)', 'reset');
    log('\n' + '═'.repeat(60) + '\n', 'green');
    
  } catch (error) {
    logError(`Startup failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log('\n\n👋 Shutting down...', 'yellow');
  process.exit(0);
});

// Run the main function
main();
