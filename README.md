Live Terminal Demo (WebSocket + Typing Animation)
================================================

What is included
- server.js         : Node.js server (express static + ws WebSocket server)
- package.json
- public/index.html : frontend (typing animation + connect/password UI)
- public/style.css
- public/script.js
- README.md

Run locally (your machine)
1. Install Node.js (v16+ recommended).
2. From the project root:
   npm install
   npm start
3. Open http://localhost:3000 in your browser.
   Enter password: 'secret123' (or set TERMINAL_PASSWORD env var before start)

Notes
- The WebSocket server listens on port 8080 by default, the HTTP server serves files on port 3000.
- The page has an auto-reconnect; messages are typed character-by-character.
- A short beep is played using the Web Audio API when messages arrive. The first user click (Connect) unlocks audio autoplay.
- This demo keeps an in-memory history; restarting the server clears history.

Troubleshooting
- If you see CORS or connection issues, verify ports are accessible and nothing else is using 8080/3000.
- To change password: set env TERMINAL_PASSWORD before running, e.g.:
  TERMINAL_PASSWORD=mysecret npm start
