// Typing animation + WebSocket client (queueing messages so they type in order)
(function () {
  const textElem = document.querySelector('.hacking-animation__text');
  const passwordInput = document.getElementById('password');
  const connectBtn = document.getElementById('connectBtn');
  const statusElem = document.getElementById('status');

  let ws = null;
  let queue = [];
  let isTyping = false;
  let password = '';

  // connectBtn.addEventListener('click', () => {
  //   password = passwordInput.value || 'secret123';
  //   startSocket();
  // });
      password ='secret123';
    startSocket();

  function startSocket() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    updateStatus('Connecting...');
    ws = new WebSocket('ws://35.84.193.199:8080');

    ws.onopen = function () {
      enqueue('🔑 Sending password...');
      ws.send(password);
      updateStatus('Connected (auth pending)');
    };

    ws.onmessage = function (ev) {
      // Every incoming message gets queued for typing animation
      enqueue(ev.data + '\n');
      playBeep();
      updateStatus('Connected');
    };

    ws.onclose = function () {
      enqueue('\n⚠️ Disconnected. Reconnecting in 3s...\n');
      updateStatus('Disconnected');
      setTimeout(startSocket, 3000);
    };

    ws.onerror = function (err) {
      console.warn('socket error', err);
      try { ws.close(); } catch(e){};
    };
  }

  function updateStatus(s) {
    statusElem.textContent = s;
  }

  // queue handling
  function enqueue(msg) {
    queue.push(msg);
    if (!isTyping) processQueue();
  }

  function processQueue() {
    if (queue.length === 0) {
      isTyping = false;
      return;
    }
    isTyping = true;
    const msg = queue.shift();
    typeMessage(msg).then(() => {
      // next
      setTimeout(processQueue, 20);
    });
  }

function typeMessage(message) {
  return new Promise((resolve) => {
    let i = 0;
    const speed = 1; // ms per character

    const iv = setInterval(() => {
      if (i >= message.length) {
        clearInterval(iv);
        resolve();
        return;
      }

      const ch = message[i];
      textElem.textContent += ch;  // ✅ no span, just plain text

      // Trim to last 200 lines (like a terminal buffer)
      const lines = textElem.textContent.split("\n");
      if (lines.length > 50) {
        textElem.textContent = lines.slice(lines.length - 50).join("\n");
      }

      i++;
      textElem.scrollTop = textElem.scrollHeight; // auto-scroll
    }, speed);
  });
}

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // small beep using Web Audio API (no file required)
  function playBeep() {
    // try {
    //   if (!window.audioCtx) {
    //     window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    //   }
    //   const ctx = window.audioCtx;
    //   const o = ctx.createOscillator();
    //   const g = ctx.createGain();
    //   o.type = 'sine';
    //   o.frequency.value = 800;
    //   g.gain.value = 0.08;
    //   o.connect(g);
    //   g.connect(ctx.destination);
    //   o.start();
    //   setTimeout(() => {
    //     o.stop();
    //   }, 80);
    // } catch (e) {
    //   // ignore
    //   console.warn('beep error', e && e.message);
    // }
  }

  // expose for debugging
  window.demoClient = {
    enqueue, startSocket
  };
})();
