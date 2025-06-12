const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

// Start the backend server
const backendPath = path.join(__dirname, 'api', 'index.js');
console.log('Starting backend server from:', backendPath);

const backend = spawn('node', [backendPath], {
  env: { ...process.env, NODE_ENV: 'production', PORT: 3000 },
  stdio: 'inherit',
  cwd: path.join(__dirname, 'api')
});

backend.on('error', (err) => {
  console.error('Failed to start backend:', err);
});

// Serve static files from dist
app.use(express.static(path.join(__dirname)));

// Proxy API requests to backend
app.use('/api', (req, res) => {
  const backendUrl = `http://localhost:3000${req.originalUrl}`;
  console.log('Proxying request to:', backendUrl);
  
  // Simple proxy - in production you'd use http-proxy-middleware
  res.redirect(307, backendUrl);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log('Backend server should be running on port 3000');
}); 