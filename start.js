const { spawn } = require('child_process');
const path = require('path');

// Set environment to production
process.env.NODE_ENV = 'production';

// Start the server
const serverPath = path.join(__dirname, 'server', 'dist', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
}); 