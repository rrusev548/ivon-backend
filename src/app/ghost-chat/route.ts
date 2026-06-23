export const dynamic = 'force-dynamic';

export function GET() {
  const html = `<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>GHOST CHAT • Анонимен P2P</title>
<link rel="manifest" href="/ghost-chat-manifest.json">
<script src="https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.2/peerjs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/libsodium.js/0.7.13/libsodium.min.js"></script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }

  :root {
    --bg: #080808;
    --surface: #0f0f0f;
    --border: #1a1a1a;
    --accent: #c8ff00;
    --accent-dim: rgba(200,255,0,0.08);
    --accent-glow: rgba(200,255,0,0.15);
    --text: #e8e8e8;
    --muted: #444;
    --danger: #ff3b3b;
    --premium-gold: #ffd700;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    touch-action: manipulation;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .app {
    width: 100%;
    max-width: 480px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
  }

  .screen {
    display: none;
    flex-direction: column;
    height: 100%;
    padding: 24px 20px;
  }
  .screen.active { display: flex; }

  /* ─── LANDING SCREEN ─── */
  .logo {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.3em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .headline {
    font-family: 'Space Mono', monospace;
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
    color: var(--accent);
    text-shadow: 0 0 40px var(--accent-glow);
    margin-bottom: 4px;
  }

  .tagline {
    font-size: 13px;
    color: var(--muted);
    letter-spacing: 0.05em;
    margin-bottom: 24px;
  }

  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.25em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .key-input-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .key-display {
    width: 72px;
    height: 72px;
    border: 1px solid var(--border);
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Mono', monospace;
    font-size: 36px;
    font-weight: 700;
    color: var(--accent);
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .key-display:hover { border-color: var(--accent); box-shadow: 0 0 20px var(--accent-glow); }
  .key-display input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    font-size: 36px;
    text-align: center;
    width: 100%;
    background: none;
    border: none;
    outline: none;
    color: transparent;
    caret-color: transparent;
  }
  .key-display.filled { border-color: var(--accent); box-shadow: 0 0 20px var(--accent-glow); }

  .key-desc {
    flex: 1;
  }
  .key-desc strong {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .key-desc span {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.5;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 16px 0;
    color: var(--muted);
    font-size: 11px;
    letter-spacing: 0.15em;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .connect-row {
    display: flex;
    gap: 10px;
    align-items: stretch;
  }

  .peer-input {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'Space Mono', monospace;
    font-size: 28px;
    text-align: center;
    height: 64px;
    outline: none;
    transition: border-color 0.2s;
    letter-spacing: 0.1em;
  }
  .peer-input::placeholder { color: var(--muted); font-size: 14px; letter-spacing: 0; font-family: 'Inter', sans-serif; }
  .peer-input:focus { border-color: var(--accent); }

  .btn-connect {
    background: var(--accent);
    color: #000;
    border: none;
    padding: 0 24px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    transition: opacity 0.2s, transform 0.1s;
    height: 64px;
    flex-shrink: 0;
  }
  .btn-connect:hover { opacity: 0.85; }
  .btn-connect:active { transform: scale(0.97); }
  .btn-connect:disabled { opacity: 0.3; cursor: not-allowed; }

  .btn-premium {
    background: var(--premium-gold);
    color: #000;
    border: none;
    padding: 12px 20px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    transition: opacity 0.2s, transform 0.1s;
    width: 100%;
    border-radius: 4px;
  }
  .btn-premium:hover { opacity: 0.85; }
  .btn-premium:active { transform: scale(0.97); }

  .status-bar {
    margin-top: auto;
    padding-top: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--muted);
    flex-shrink: 0;
  }
  .status-dot.ready { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  .status-dot.connecting { background: #ff9f00; animation: pulse 1s infinite; }
  .status-dot.error { background: var(--danger); }
  .status-dot.premium { background: var(--premium-gold); box-shadow: 0 0 12px var(--premium-gold); }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* ─── WAITING SCREEN ─── */
  #waitScreen {
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 24px;
  }
  .wait-key {
    width: 120px;
    height: 120px;
    border: 1px solid var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Mono', monospace;
    font-size: 64px;
    color: var(--accent);
    box-shadow: 0 0 60px var(--accent-glow), inset 0 0 30px var(--accent-dim);
    animation: breathe 3s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { box-shadow: 0 0 40px var(--accent-glow), inset 0 0 20px var(--accent-dim); }
    50% { box-shadow: 0 0 80px rgba(200,255,0,0.25), inset 0 0 40px rgba(200,255,0,0.12); }
  }
  .wait-title {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    letter-spacing: 0.2em;
    color: var(--muted);
    text-transform: uppercase;
  }
  .wait-hint {
    font-size: 13px;
    color: var(--muted);
    max-width: 260px;
    line-height: 1.6;
  }
  .btn-cancel {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 10px 24px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    margin-top: 12px;
  }
  .btn-cancel:hover { border-color: var(--muted); color: var(--text); }

  /* ─── CHAT SCREEN ─── */
  #chatScreen { padding: 0; }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .chat-peer {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .chat-peer-key {
    width: 36px;
    height: 36px;
    border: 1px solid var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Mono', monospace;
    font-size: 18px;
    color: var(--accent);
  }
  .chat-peer-info strong {
    display: block;
    font-size: 13px;
    font-weight: 500;
  }
  .chat-peer-info span {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }
  .live-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--accent);
  }
  .live-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 1.5s infinite;
  }
  .encryption-badge {
    display: inline-block;
    background: rgba(200,255,0,0.12);
    color: var(--accent);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 8px;
    letter-spacing: 0.1em;
    margin-left: 4px;
    border: 1px solid var(--accent-dim);
  }
  .ghost-badge {
    font-size: 8px;
    background: rgba(255,255,255,0.05);
    padding: 2px 8px;
    border-radius: 12px;
    border: 1px solid var(--accent-dim);
    color: var(--accent);
    animation: pulse 2s infinite;
    letter-spacing: 0.1em;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .msg {
    max-width: 78%;
    animation: fadeUp 0.2s ease;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .msg.me { align-self: flex-end; }
  .msg.them { align-self: flex-start; }

  .msg-bubble {
    padding: 10px 14px;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
  }
  .msg.me .msg-bubble {
    background: var(--accent);
    color: #000;
    font-weight: 500;
  }
  .msg.them .msg-bubble {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
  }

  .msg-meta {
    font-size: 10px;
    color: var(--muted);
    margin-top: 4px;
    letter-spacing: 0.05em;
  }
  .msg.me .msg-meta { text-align: right; }

  .system-msg {
    text-align: center;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--muted);
    padding: 6px 0;
    text-transform: uppercase;
  }

  .chat-input-area {
    display: flex;
    gap: 0;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .chat-input {
    flex: 1;
    background: var(--surface);
    border: none;
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    padding: 14px 16px;
    outline: none;
    resize: none;
    min-height: 48px;
    max-height: 100px;
  }
  .chat-input::placeholder { color: var(--muted); }
  .btn-send {
    background: var(--accent);
    border: none;
    color: #000;
    width: 48px;
    cursor: pointer;
    font-size: 18px;
    transition: opacity 0.2s;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn-send:hover { opacity: 0.85; }
  .btn-send:disabled { opacity: 0.3; cursor: not-allowed; }

  .btn-end {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 6px;
    font-size: 16px;
    transition: color 0.2s;
    line-height: 1;
  }
  .btn-end:hover { color: var(--danger); }

  /* ─── PREMIUM / SUBSCRIPTION ─── */
  .premium-section {
    margin-top: 8px;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--surface);
  }
  .premium-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 8px;
  }
  .premium-plan {
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .premium-plan:hover { border-color: var(--accent); background: var(--accent-dim); }
  .premium-plan .price { font-size: 18px; font-weight: 700; color: var(--accent); }
  .premium-plan .name { font-size: 11px; color: var(--muted); }
  .premium-plan .period { font-size: 10px; color: var(--muted); }

  .premium-plan.ultra { border-color: var(--premium-gold); }
  .premium-plan.ultra .price { color: var(--premium-gold); }

  .premium-promo {
    background: rgba(255,215,0,0.08);
    border: 1px solid var(--premium-gold);
    padding: 10px 14px;
    border-radius: 4px;
    font-size: 12px;
    color: var(--premium-gold);
    text-align: center;
    margin-top: 10px;
  }

  /* ─── QR MODAL ─── */
  #qrModal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    z-index: 999;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  #qrModal.active { display: flex; }
  .qr-box {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .qr-box img { width: 220px; height: 220px; }
  .qr-revtag {
    color: #fff;
    font-family: 'Space Mono', monospace;
    font-size: 14px;
  }
  .qr-revtag strong { color: var(--accent); }
  .btn-close-qr {
    background: none;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 10px 24px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    cursor: pointer;
  }

  /* ─── CODE ACTIVATION ─── */
  .code-row {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  .code-input {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .code-input:focus { border-color: var(--accent); }
  .btn-activate {
    background: var(--premium-gold);
    color: #000;
    border: none;
    padding: 10px 20px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
    text-transform: uppercase;
  }
  .btn-activate:hover { opacity: 0.85; }

  /* ─── DISCONNECT ─── */
  #disconnectScreen {
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
  .ghost-icon {
    font-size: 64px;
    opacity: 0.3;
    margin-bottom: 8px;
  }
  .disconnect-title {
    font-family: 'Space Mono', monospace;
    font-size: 20px;
    color: var(--text);
  }
  .disconnect-sub {
    font-size: 13px;
    color: var(--muted);
    max-width: 240px;
    line-height: 1.6;
  }
  .btn-restart {
    background: var(--accent);
    color: #000;
    border: none;
    padding: 14px 32px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    font-weight: 700;
    cursor: pointer;
    margin-top: 16px;
    text-transform: uppercase;
    transition: opacity 0.2s;
  }
  .btn-restart:hover { opacity: 0.85; }

  .messages::-webkit-scrollbar { width: 3px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: var(--border); }

  /* ─── GHOST FLOATING ─── */
  .ghost-float {
    position: fixed;
    font-size: 50px;
    opacity: 0.04;
    pointer-events: none;
    z-index: 0;
    animation: floatGhost 25s infinite linear;
    user-select: none;
  }
  @keyframes floatGhost {
    0% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(30px, -50px) rotate(5deg); }
    50% { transform: translate(-20px, -90px) rotate(-3deg); }
    75% { transform: translate(40px, -30px) rotate(4deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }

  /* Premium status indicator in header */
  .premium-badge {
    display: inline-block;
    background: var(--premium-gold);
    color: #000;
    font-size: 8px;
    padding: 1px 8px;
    border-radius: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-left: 6px;
    text-transform: uppercase;
  }
</style>
</head>
<body>

<!-- ─── GHOST FLOATING ─── -->
<div class="ghost-float" style="top:5%; left:3%;">👻</div>
<div class="ghost-float" style="bottom:15%; right:5%; animation-delay: -10s; font-size:40px;">👻</div>

<div class="app">

  <!-- ── SCREEN 1: SETUP ── -->
  <div class="screen active" id="setupScreen">
    <div class="logo">Ghost Chat • E2EE</div>
    <div class="headline">GHOST</div>
    <div class="tagline">no logs · no servers · no trace</div>

    <div class="section-label">Твоят ключ</div>
    <div class="key-input-wrap">
      <div class="key-display" id="myKeyDisplay">
        <span id="myKeyChar">_</span>
        <input type="text" id="myKeyInput" maxlength="1" autocomplete="off" spellcheck="false" placeholder=" ">
      </div>
      <div class="key-desc">
        <strong>1 символ = твой адрес</strong>
        <span>Другата страна трябва да знае този символ, за да те намери.</span>
      </div>
    </div>

    <div class="section-label">Свържи се с</div>
    <div class="connect-row">
      <input type="text" class="peer-input" id="peerKeyInput" maxlength="1" placeholder="символ" autocomplete="off" spellcheck="false">
      <button class="btn-connect" id="btnConnect" disabled>CONNECT</button>
    </div>

    <div class="divider">или</div>
    <div class="section-label">Чакай повикване</div>
    <div style="display:flex; gap:10px;">
      <button class="btn-connect" id="btnWait" disabled style="flex:1; height:52px; font-size:11px;">WAIT FOR CALL</button>
    </div>

    <!-- ─── PREMIUM SECTION ─── -->
    <div class="premium-section" style="margin-top:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:12px; color:var(--muted);">🌟 <span id="premiumStatus">Безплатен</span></span>
        <span id="premiumDays" style="font-size:11px; color:var(--muted);"></span>
      </div>
      <button class="btn-premium" id="btnShowPlans" style="margin-top:8px;">⭐ Стани Premium</button>

      <!-- Планове (скрити по подразбиране) -->
      <div id="plansContainer" style="display:none; margin-top:12px;">
        <div class="premium-grid">
          <div class="premium-plan" data-plan="daily">
            <div class="name">Дневен</div>
            <div class="price">$0.99</div>
            <div class="period">24 часа</div>
          </div>
          <div class="premium-plan" data-plan="weekly">
            <div class="name">Седмичен</div>
            <div class="price">$2.99</div>
            <div class="period">7 дни</div>
          </div>
          <div class="premium-plan" data-plan="monthly">
            <div class="name">Месечен</div>
            <div class="price">$5.99</div>
            <div class="period">30 дни</div>
          </div>
          <div class="premium-plan ultra" data-plan="ultra">
            <div class="name">🌟 Ултра</div>
            <div class="price">$49.99</div>
            <div class="period">30 дни + бонуси</div>
          </div>
        </div>
        <div class="premium-promo">
          🎁 Първите 100 абонати получават 1 МЕСЕЦ БЕЗПЛАТНО!
        </div>
        <div style="margin-top:8px;">
          <div class="code-row">
            <input type="text" class="code-input" id="premiumCode" placeholder="Въведи код GHOST-XXX" maxlength="12">
            <button class="btn-activate" id="btnActivate">Активирай</button>
          </div>
        </div>
      </div>
    </div>

    <div class="status-bar">
      <div class="status-dot" id="statusDot"></div>
      <span id="statusText">въведи ключ за да се активираш</span>
    </div>
  </div>

  <!-- ── SCREEN 2: WAITING ── -->
  <div class="screen" id="waitScreen">
    <div class="wait-key" id="waitKeyDisplay">?</div>
    <div class="wait-title">Чакаш връзка</div>
    <div class="wait-hint">Кажи на другия твоя символ и изчакай той да се свърже.</div>
    <button class="btn-cancel" id="btnCancelWait">ОТКАЗ</button>
  </div>

  <!-- ── SCREEN 3: CHAT ── -->
  <div class="screen" id="chatScreen">
    <div class="chat-header">
      <div class="chat-peer">
        <div class="chat-peer-key" id="chatPeerKey">?</div>
        <div class="chat-peer-info">
          <strong id="chatPeerLabel">— <span id="premiumChatBadge"></span></strong>
          <span>P2P · <span class="encryption-badge">🔒 E2EE</span> <span class="ghost-badge">👻 Ghost</span></span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <div class="live-indicator">
          <div class="live-dot"></div>
          LIVE
        </div>
        <button class="btn-end" id="btnEndChat">✕</button>
      </div>
    </div>
    <div class="messages" id="messages"></div>
    <div class="chat-input-area">
      <textarea class="chat-input" id="chatInput" placeholder="Напиши съобщение…" rows="1"></textarea>
      <button class="btn-send" id="btnSend">↑</button>
    </div>
  </div>

  <!-- ── SCREEN 4: DISCONNECTED ── -->
  <div class="screen" id="disconnectScreen">
    <div class="ghost-icon">👻</div>
    <div class="disconnect-title">Изчезна</div>
    <div class="disconnect-sub">Връзката е прекратена. Всички съобщения са изтрити.</div>
    <button class="btn-restart" id="btnRestart">НОВА СЕСИЯ</button>
  </div>

</div>

<!-- ─── QR MODAL ─── -->
<div id="qrModal">
  <div class="qr-box">
    <img id="qrImage" src="" alt="QR код за плащане">
    <div style="font-size:14px; color:#000; font-weight:600;">Сканирай с Revolut</div>
  </div>
  <div class="qr-revtag">или изпрати на <strong id="qrRevtagDisplay">@ghostchat</strong></div>
  <div style="color:#aaa; font-size:12px;">Сума: <strong id="qrAmount" style="color:#c8ff00;">$5.99</strong> · след плащане получи код</div>
  <button class="btn-close-qr" id="btnCloseQR">Затвори</button>
</div>

<script>
const REVTAG = '@ghostchat';
const REVOLUT_LINK = 'https://revolut.me/ghostchat';

const VALID_CODES = [
  'GHOST-001', 'GHOST-002', 'GHOST-003', 'GHOST-004', 'GHOST-005',
  'GHOST-006', 'GHOST-007', 'GHOST-008', 'GHOST-009', 'GHOST-010'
];

let sodium = null;
let cryptoReady = false;
let myIdentityKeys = null;
let myEphemeralKeys = null;
let theirIdentityPub = null;
let theirEphemeralPub = null;
let sendingKey = null;
let receivingKey = null;
let ratchetInitDone = false;

async function loadSodium() {
  if (window.sodium) {
    sodium = window.sodium;
    await sodium.ready;
    cryptoReady = true;
    generateKeys();
  } else {
    setTimeout(loadSodium, 500);
  }
}

function generateKeys() {
  myIdentityKeys = sodium.crypto_sign_keypair();
  myEphemeralKeys = sodium.crypto_box_keypair();
}

function performX3DH(ourEphemeralPriv, theirEphemeralPub, ourIdentityPriv, theirIdentityPub) {
  const dh1 = sodium.crypto_scalarmult(ourEphemeralPriv, theirEphemeralPub);
  const dh2 = sodium.crypto_scalarmult(ourIdentityPriv, theirEphemeralPub);
  const dh3 = sodium.crypto_scalarmult(ourEphemeralPriv, theirIdentityPub);
  const combined = new Uint8Array(dh1.length + dh2.length + dh3.length);
  combined.set(dh1, 0);
  combined.set(dh2, dh1.length);
  combined.set(dh3, dh1.length + dh2.length);
  return sodium.crypto_generichash(32, combined);
}

function initRatchet(sharedSecret, isInitiator) {
  const info = new TextEncoder().encode('GhostChat-Ratchet');
  const keys = sodium.crypto_kdf_derive_from_key(64, 1, info, sharedSecret);
  const send = keys.slice(0, 32);
  const recv = keys.slice(32, 64);
  if (isInitiator) { sendingKey = send; receivingKey = recv; }
  else { sendingKey = recv; receivingKey = send; }
  ratchetInitDone = true;
}

function encryptMessage(plaintext) {
  if (!sendingKey) throw new Error('Няма sending key');
  const nonce = sodium.randombytes_buf(24);
  const ciphertext = sodium.crypto_secretbox_easy(
    new TextEncoder().encode(plaintext),
    nonce,
    sendingKey
  );
  const newKey = sodium.crypto_generichash(32, new Uint8Array([...sendingKey, ...nonce]));
  sendingKey = newKey;
  return { ciphertext, nonce };
}

function decryptMessage(ciphertext, nonce) {
  if (!receivingKey) throw new Error('Няма receiving key');
  const plaintext = sodium.crypto_secretbox_open_easy(ciphertext, nonce, receivingKey);
  if (!plaintext) throw new Error('Грешка при декриптиране');
  const newKey = sodium.crypto_generichash(32, new Uint8Array([...receivingKey, ...nonce]));
  receivingKey = newKey;
  return new TextDecoder().decode(plaintext);
}

let peer = null;
let conn = null;
let myKey = '';
let peerKey = '';
let isInitiator = false;

const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function setStatus(state, text) {
  $('statusDot').className = 'status-dot ' + state;
  $('statusText').textContent = text;
}

function now() { return new Date().toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' }); }

function escapeHtml(t) { return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function playGhostSound(volume = 0.05) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
}

function addMessage(text, type, meta) {
  const msgs = $('messages');
  if (type === 'system') {
    const el = document.createElement('div');
    el.className = 'system-msg';
    el.textContent = text;
    msgs.appendChild(el);
  } else {
    const el = document.createElement('div');
    el.className = 'msg ' + type;
    el.innerHTML = '<div class="msg-bubble">' + escapeHtml(text) + '</div><div class="msg-meta">' + (meta || now()) + '</div>';
    msgs.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) {
        el.style.transition = 'opacity 0.6s ease';
        el.style.opacity = '0';
        setTimeout(() => { if (el.parentNode) el.remove(); }, 700);
      }
    }, 15000);
    playGhostSound(0.04);
  }
  msgs.scrollTop = msgs.scrollHeight;
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    const messages = document.querySelectorAll('.msg:not(.system-msg)');
    messages.forEach(msg => {
      msg.style.transition = 'opacity 0.3s ease';
      msg.style.opacity = '0';
      setTimeout(() => { if (msg.parentNode) msg.remove(); }, 400);
    });
    if (messages.length > 0) {
      addMessage('🔒 Съобщенията изчезнаха при заключване', 'system');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'VolumeDown' || e.key === 'Power' || e.key === 'Meta' || e.key === 'AudioVolumeDown') {
    setTimeout(() => {
      document.querySelectorAll('.msg:not(.system-msg)').forEach(el => {
        el.style.transition = 'opacity 0.3s ease';
        el.style.opacity = '0';
        setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
      });
      addMessage('📸 Скрийншот засечен! Съобщенията са изтрити.', 'system');
    }, 500);
  }
});

function getPremiumStatus() {
  try {
    const data = JSON.parse(localStorage.getItem('ghost_premium') || '{}');
    if (data.expiry && Date.now() < data.expiry) return { active: true, expiry: data.expiry };
    return { active: false };
  } catch { return { active: false }; }
}

function setPremium(code, days) {
  const expiry = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem('ghost_premium', JSON.stringify({ code, expiry }));
  updatePremiumUI();
}

function updatePremiumUI() {
  const status = getPremiumStatus();
  const statusEl = $('premiumStatus');
  const daysEl = $('premiumDays');
  const badge = $('premiumChatBadge');
  const dot = $('statusDot');
  if (status.active) {
    const remaining = Math.ceil((status.expiry - Date.now()) / (1000 * 60 * 60 * 24));
    statusEl.textContent = '⭐ Премиум';
    statusEl.style.color = 'var(--premium-gold)';
    daysEl.textContent = 'остават ' + remaining + ' дни';
    if (badge) badge.innerHTML = '<span class="premium-badge">⭐ PREMIUM</span>';
    dot.className = 'status-dot premium';
  } else {
    statusEl.textContent = 'Безплатен';
    statusEl.style.color = 'var(--muted)';
    daysEl.textContent = '';
    if (badge) badge.innerHTML = '';
  }
}

function activateCode() {
  const code = $('premiumCode').value.trim().toUpperCase();
  if (!code) { alert('Въведи код'); return; }
  const status = getPremiumStatus();
  if (status.active) {
    alert('✅ Вече си премиум. Остават ' + Math.ceil((status.expiry - Date.now()) / (1000 * 60 * 60 * 24)) + ' дни.');
    return;
  }
  if (VALID_CODES.includes(code)) {
    setPremium(code, 30);
    alert('🎉 Премиум активиран за 30 дни! Благодарим ти!');
    $('premiumCode').value = '';
    updatePremiumUI();
  } else {
    alert('❌ Невалиден код. Провери дали е правилен.');
  }
}

function showQR(amount) {
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(REVOLUT_LINK);
  $('qrImage').src = qrUrl;
  $('qrRevtagDisplay').textContent = REVTAG;
  $('qrAmount').textContent = '$' + amount;
  $('qrModal').classList.add('active');
}

$('myKeyInput').addEventListener('input', e => {
  const val = e.target.value.slice(-1).toUpperCase();
  myKey = val;
  $('myKeyChar').textContent = val || '_';
  $('myKeyDisplay').classList.toggle('filled', !!val);
  e.target.value = val;
  if (val) { initPeer(val); }
  else { destroyPeer(); $('btnConnect').disabled = true; $('btnWait').disabled = true; setStatus('', 'въведи ключ за да се активираш'); }
});
$('myKeyDisplay').addEventListener('click', () => $('myKeyInput').focus());

function initPeer(key) {
  if (!cryptoReady) { setStatus('error', 'Изчакай зареждане на крипто…'); return; }
  destroyPeer();
  setStatus('connecting', 'свързване с мрежата…');
  peer = new Peer('ghost-' + key, {
    config: { iceServers: [ { urls: 'stun:stun.l.google.com:19302' } ] }
  });
  peer.on('open', () => {
    setStatus('ready', 'готов · ключ: ' + key);
    $('btnConnect').disabled = false;
    $('btnWait').disabled = false;
    updatePremiumUI();
  });
  peer.on('error', err => {
    if (err.type === 'unavailable-id') {
      setStatus('error', 'символът "' + key + '" е зает — избери друг');
      $('btnConnect').disabled = true;
      $('btnWait').disabled = true;
    } else {
      setStatus('error', 'грешка: ' + err.message);
    }
  });
  peer.on('connection', incoming => {
    if (conn) { incoming.close(); return; }
    conn = incoming;
    peerKey = incoming.peer.replace('ghost-', '').toUpperCase();
    isInitiator = false;
    setupCryptoAndConnection();
  });
}

function destroyPeer() {
  if (conn) { conn.close(); conn = null; }
  if (peer) { peer.destroy(); peer = null; }
}

$('peerKeyInput').addEventListener('input', e => {
  const val = e.target.value.slice(-1).toUpperCase();
  e.target.value = val;
});
$('btnConnect').addEventListener('click', () => {
  const target = $('peerKeyInput').value.trim().toUpperCase();
  if (!target || !myKey) return;
  if (target === myKey) { setStatus('error', 'не можеш да се свържеш сам със себе си'); return; }
  peerKey = target;
  setStatus('connecting', 'свързване с "' + target + '"…');
  $('btnConnect').disabled = true;
  conn = peer.connect('ghost-' + target, { reliable: true });
  isInitiator = true;
  setupCryptoAndConnection();
});

$('btnWait').addEventListener('click', () => {
  $('waitKeyDisplay').textContent = myKey;
  showScreen('waitScreen');
});
$('btnCancelWait').addEventListener('click', () => { showScreen('setupScreen'); });

function setupCryptoAndConnection() {
  if (!conn.open) { conn.on('open', () => performHandshake()); }
  else { performHandshake(); }
  conn.on('close', () => { conn = null; showScreen('disconnectScreen'); });
  conn.on('error', () => { conn = null; showScreen('disconnectScreen'); });
}

function performHandshake() {
  const handshakeMsg = {
    type: 'handshake',
    identityPub: arrayToBase64(myIdentityKeys.publicKey),
    ephemeralPub: arrayToBase64(myEphemeralKeys.publicKey)
  };
  conn.send(JSON.stringify(handshakeMsg));

  const handler = (data) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'handshake') {
        theirIdentityPub = base64ToArray(parsed.identityPub);
        theirEphemeralPub = base64ToArray(parsed.ephemeralPub);
        const shared = performX3DH(myEphemeralKeys.privateKey, theirEphemeralPub, myIdentityKeys.privateKey, theirIdentityPub);
        initRatchet(shared, isInitiator);
        conn.send(JSON.stringify({ type: 'handshake_ack' }));
        enterChatMode();
        conn.off('data', handler);
        conn.on('data', encryptedMessageHandler);
      } else if (parsed.type === 'handshake_ack') {
        enterChatMode();
        conn.off('data', handler);
        conn.on('data', encryptedMessageHandler);
      }
    } catch(e) {}
  };
  conn.on('data', handler);
}

function encryptedMessageHandler(data) {
  try {
    const parsed = JSON.parse(data);
    if (parsed.type === 'cipher') {
      const ciphertext = base64ToArray(parsed.ciphertext);
      const nonce = base64ToArray(parsed.nonce);
      const plaintext = decryptMessage(ciphertext, nonce);
      addMessage(plaintext, 'them', now());
    }
  } catch(e) {}
}

function enterChatMode() {
  showChatScreen();
  addMessage('🔒 Криптирана връзка (Double Ratchet)', 'system');
  updatePremiumUI();
}

function sendMessage() {
  const text = $('chatInput').value.trim();
  if (!text || !conn || !ratchetInitDone) return;
  try {
    const { ciphertext, nonce } = encryptMessage(text);
    const payload = { type: 'cipher', ciphertext: arrayToBase64(ciphertext), nonce: arrayToBase64(nonce) };
    conn.send(JSON.stringify(payload));
    addMessage(text, 'me', now());
    $('chatInput').value = '';
    $('chatInput').style.height = 'auto';
  } catch(e) {
    addMessage('❌ Грешка при изпращане', 'system');
  }
}

function showChatScreen() {
  $('chatPeerKey').textContent = peerKey;
  $('chatPeerLabel').textContent = 'Символ "' + peerKey + '"';
  $('messages').innerHTML = '';
  showScreen('chatScreen');
  $('chatInput').focus();
  updatePremiumUI();
}

$('btnSend').addEventListener('click', sendMessage);
$('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
$('chatInput').addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});

$('btnEndChat').addEventListener('click', () => {
  if (conn) conn.close();
  conn = null;
  showScreen('disconnectScreen');
});

$('btnRestart').addEventListener('click', () => {
  destroyPeer();
  myKey = '';
  peerKey = '';
  $('myKeyChar').textContent = '_';
  $('myKeyInput').value = '';
  $('myKeyDisplay').classList.remove('filled');
  $('peerKeyInput').value = '';
  $('btnConnect').disabled = true;
  $('btnWait').disabled = true;
  setStatus('', 'въведи ключ за да се активираш');
  showScreen('setupScreen');
  generateKeys();
  updatePremiumUI();
});

function arrayToBase64(arr) { return btoa(String.fromCharCode(...arr)); }
function base64ToArray(str) {
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

$('btnShowPlans').addEventListener('click', () => {
  const container = $('plansContainer');
  container.style.display = container.style.display === 'none' ? 'block' : 'none';
});

$('btnActivate').addEventListener('click', activateCode);
$('premiumCode').addEventListener('keydown', e => { if (e.key === 'Enter') activateCode(); });

document.querySelectorAll('.premium-plan').forEach(el => {
  el.addEventListener('click', () => {
    const prices = { daily: '0.99', weekly: '2.99', monthly: '5.99', ultra: '49.99' };
    showQR(prices[el.dataset.plan] || '5.99');
  });
});

$('btnCloseQR').addEventListener('click', () => { $('qrModal').classList.remove('active'); });

loadSodium().then(() => {
  setStatus('', 'въведи ключ за да се активираш');
  updatePremiumUI();
}).catch(() => {
  setStatus('error', 'Неуспех при зареждане на крипто');
});

let hue = 90;
setInterval(() => {
  hue = (hue + 0.15) % 360;
  const color = 'hsl(' + hue + ', 100%, 50%)';
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-dim', 'hsla(' + hue + ', 100%, 50%, 0.08)');
  document.documentElement.style.setProperty('--accent-glow', 'hsla(' + hue + ', 100%, 50%, 0.15)');
}, 80);
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
