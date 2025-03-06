#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// All arguments after the script name are passed to the server
const args = process.argv.slice(2);

// Start the server process
const serverProcess = spawn('node', [join(__dirname, 'dist', 'index.js'), ...args], {
  stdio: 'inherit' // Pipe all stdio to parent process
});

// Handle process events
serverProcess.on('error', (err) => {
  console.error('Failed to start server process:', err);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => serverProcess.kill('SIGINT'));
process.on('SIGTERM', () => serverProcess.kill('SIGTERM')); 