// Node.js WebSocket server (ws) + static file server (express)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8081;
const PASSWORD = process.env.TERMINAL_PASSWORD || 'secret123';
const MAX_HISTORY = 500;
const BROADCAST_INTERVAL = 1000; // ms

const app = express();
app.use(express.static('public'));

const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => console.log(`HTTP server on http://localhost:${HTTP_PORT}`));

const wss = new WebSocket.Server({ port: WS_PORT });
console.log(`WebSocket server on ws://localhost:${WS_PORT}`);

// message history (simple in-memory circular buffer)
let messageHistory = [];

function pushHistory(msg) {
  messageHistory.push(msg);
  if (messageHistory.length > MAX_HISTORY) messageHistory.shift();
}

// Broadcast a sample log every second (single broadcaster for all clients)
setInterval(() => {
  const ts = new Date().toLocaleString();
  const log = `Trade initiated app= olymp assest=EUR:USD | ${ts}`;
  pushHistory(log);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.isAuthenticated) {
      client.send(log);
    }
  });
}, BROADCAST_INTERVAL);

wss.on('connection', (ws, req) => {
  ws.isAuthenticated = false;
  console.log('New WS connection');

  ws.on('message', (data) => {
    const msg = data.toString().trim();
    // First message must be password for auth
    if (!ws.isAuthenticated) {
      if (msg === PASSWORD) {
        ws.isAuthenticated = true;
        ws.send('✅ Authenticated! Sending history...');
        // send history
        messageHistory.forEach(m => ws.send(m));
        return;
      } else {
        ws.send('❌ Invalid password. Closing connection.');
        ws.close();
        return;
      }
    }

    // Authenticated clients can send commands (optional)
    console.log('Client message (auth):', msg);
    // Echo back (optional)
    ws.send(`> ${msg}`);
  });

  ws.on('close', () => {
    console.log('WS connection closed');
  });

  ws.on('error', (err) => {
    console.error('WS error', err && err.message);
  });
});
