(function() {
    'use strict';

    // =========================================================================
    // 1. ENGINE DE TEMA
    // =========================================================================
    const DEFAULT_THEME = {
        primary: '#3b82f6', bg: '#0f0f14', text: '#ffffff',
        font: 'Inter, system-ui, sans-serif', size: '13px',
        opacity: '0.95', radius: '12px'
    };

    let theme = DEFAULT_THEME;
    try {
        const saved = localStorage.getItem('vin_dt_theme');
        if (saved) theme = { ...DEFAULT_THEME, ...JSON.parse(saved) };
    } catch (e) {}

    const getAlpha = (hex, op) => hex + Math.floor(parseFloat(op) * 255).toString(16).padStart(2, '0');

    // =========================================================================
    // 2. ESTILOS (Ajustado para injeção nativa)
    // =========================================================================
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

        :root {
            --v-primary: ${theme.primary};
            --v-bg-glass: ${getAlpha(theme.bg, theme.opacity)};
            --v-panel: rgba(255, 255, 255, 0.03);
            --v-border: rgba(255, 255, 255, 0.08);
            --v-text: ${theme.text};
            --v-rad: ${theme.radius};
            --v-rad-s: calc(${theme.radius} / 2);
            --v-font: ${theme.font};
            --v-mono: 'Fira Code', monospace;
            --v-size: ${theme.size};
        }

        #vin-sidebar {
            position: fixed; top: 0; right: -480px; width: 460px; height: 100vh;
            background: var(--v-bg-glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border-left: 1px solid var(--v-border); box-shadow: -10px 0 50px rgba(0,0,0,0.5);
            z-index: 2147483647; display: flex; flex-direction: column;
            transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: var(--v-font); font-size: var(--v-size); color: var(--v-text);
        }

        #vin-sidebar.open { right: 0; }

        .vin-header { padding: 20px; border-bottom: 1px solid var(--v-border); }
        .vin-brand { font-size: calc(var(--v-size) + 4px); font-weight: 700; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
        .vin-close { cursor: pointer; opacity: 0.6; transition: 0.2s; font-size: 18px; }
        .vin-close:hover { opacity: 1; color: var(--v-primary); transform: scale(1.1); }

        .vin-search {
            width: 100%; background: rgba(0,0,0,0.3);
            border: 1px solid var(--v-border); color: var(--v-text);
            padding: 10px; border-radius: var(--v-rad-s);
            font-family: var(--v-font); font-size: var(--v-size);
            box-sizing: border-box; transition: 0.2s;
        }

        .vin-search:focus {
            border-color: var(--v-primary);
            outline: none;
            background: rgba(0,0,0,0.5);
        }

        .vin-tabs {
            display: flex;
            padding: 0 10px;
            border-bottom: 1px solid var(--v-border);
            margin-top: 5px;
        }

        .vin-tab {
            flex: 1;
            text-align: center;
            padding: 14px 0;
            cursor: pointer;
            color: #a1a1aa;
            font-weight: 600;
            transition: 0.3s;
        }

        .vin-tab:hover {
            color: var(--v-text);
            background: rgba(255,255,255,0.02);
        }

        .vin-tab.active {
            color: var(--v-primary);
            position: relative;
        }

        .vin-tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--v-primary);
            box-shadow: 0 -2px 8px var(--v-primary);
        }

        .vin-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: none;
            flex-direction: column;
            gap: 16px;
            scroll-behavior: smooth;
        }

        .vin-content.active {
            display: flex;
            animation: vinFade 0.3s ease;
        }

        @keyframes vinFade {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .vin-card {
            background: var(--v-panel);
            border: 1px solid var(--v-border);
            border-radius: var(--v-rad);
            padding: 16px;
        }

        .vin-label {
            font-size: calc(var(--v-size) - 2px);
            font-weight: 700;
            color: #a1a1aa;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 5px;
            display: block;
        }

        .vin-sub {
            font-size: 10px;
            color: #666;
            margin: 10px 0 5px;
            font-weight: 600;
            display: block;
        }

        .vin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .vin-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .vin-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
        .vin-grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 4px; }

        .vin-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
        }

        .vin-grow {
            flex: 1;
            font-size: var(--v-size);
        }

        .vin-btn {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            color: var(--v-text);
            padding: 9px 12px;
            border-radius: var(--v-rad-s);
            cursor: pointer;
            transition: all 0.2s;
            font-size: var(--v-size);
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            overflow: hidden;
            user-select: none;
        }

        .vin-btn:hover {
            background: rgba(255,255,255,0.08);
            border-color: rgba(255,255,255,0.25);
            transform: translateY(-1px);
        }

        .vin-btn:active {
            transform: translateY(0);
        }

        .vin-btn.active-state {
            background: rgba(16, 185, 129, 0.15);
            border-color: #10b981;
            color: #10b981;
            box-shadow: 0 0 12px rgba(16, 185, 129, 0.15);
        }

        .vin-btn.active-state::before {
            content: '●';
            font-size: 8px;
            margin-right: 6px;
            color: #10b981;
        }

        .vin-btn.primary {
            background: var(--v-primary);
            border: none;
            color: white;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .vin-btn.primary:hover {
            filter: brightness(1.2);
        }

        .vin-btn.danger {
            color: #f87171;
            border-color: rgba(239,68,68,0.3);
        }

        .vin-btn.sm {
            padding: 6px 10px;
            font-size: calc(var(--v-size) - 1px);
        }

        .vin-btn.hidden {
            display: none !important;
        }

        .vin-input,
        .vin-textarea,
        .vin-select {
            width: 100%;
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--v-border);
            color: var(--v-text);
            padding: 10px;
            border-radius: var(--v-rad-s);
            font-family: var(--v-mono);
            font-size: var(--v-size);
            box-sizing: border-box;
            margin-bottom: 8px;
        }

        .vin-input:focus,
        .vin-textarea:focus {
            border-color: var(--v-primary);
            outline: none;
        }

        input[type="color"] {
            -webkit-appearance: none;
            border: none;
            width: 24px;
            height: 24px;
            padding: 0;
            background: none;
            cursor: pointer;
            border-radius: 4px;
            border: 1px solid var(--v-border);
        }

        input[type="range"] {
            width: 100%;
            accent-color: var(--v-primary);
        }

        .vin-table-wrap {
            border: 1px solid var(--v-border);
            border-radius: var(--v-rad-s);
            max-height: 250px;
            overflow: auto;
            background: rgba(0,0,0,0.2);
        }

        .vin-table {
            width: 100%;
            border-collapse: collapse;
            font-family: var(--v-mono);
            font-size: 11px;
        }

        .vin-table th {
            position: sticky;
            top: 0;
            background: #1f1f23;
            text-align: left;
            padding: 8px;
            color: #fff;
            z-index: 1;
        }

        .vin-table td {
            padding: 6px 8px;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            color: #a1a1aa;
            word-break: break-all;
        }

        .jv-container {
            font-family: var(--v-mono);
            font-size: 11px;
            background: rgba(0,0,0,0.4);
            padding: 12px;
            border-radius: var(--v-rad-s);
            overflow: auto;
            border: 1px solid var(--v-border);
            max-height: 350px;
            color: #d4d4d8;
            cursor: text;
            white-space: pre-wrap;
            word-break: break-all;
            line-height: 1.5;
        }

        .jv-node {
            font-family: 'Fira Code', monospace;
            line-height: 1.5;
        }

        details.jv-details {
            margin-left: 20px;
        }

        summary.jv-summary {
            cursor: pointer;
            outline: none;
            list-style: none;
        }

        summary.jv-summary::-webkit-details-marker {
            display: none;
        }

        summary.jv-summary::before {
            content: '▶';
            display: inline-block;
            font-size: 8px;
            width: 15px;
            color: var(--v-primary);
            transition: transform 0.2s;
        }

        details[open] > summary.jv-summary::before {
            transform: rotate(90deg);
        }

        .jv-bracket {
            color: #a1a1aa;
            font-weight: bold;
        }

        .jv-comma { color: #71717a; }

        .string { color: #f472b6; }
        .number { color: #4ade80; }
        .boolean { color: #a78bfa; }
        .null { color: #fbbf24; }
        .key { color: #60a5fa; }

        #vin-toggle {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: var(--v-primary);
            border-radius: 8px 0 0 8px;
            cursor: pointer;
            z-index: 2147483646;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: -5px 0 20px rgba(0,0,0,0.3);
            color: white;
            font-weight: bold;
            font-size: 18px;
            transition: 0.3s;
        }

        #vin-toggle:hover {
            width: 50px;
        }

        #vin-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 13px;
            opacity: 0;
            pointer-events: none;
            transition: 0.4s;
            z-index: 2147483647;
            transform: translateY(20px) scale(0.9);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        #vin-toast.show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        #vin-toast.error {
            background: #ef4444;
        }

        .vin-inspecting * {
            cursor: crosshair !important;
        }

        .vin-targeting * {
            cursor: text !important;
            outline: 2px dashed #fbbf24 !important;
            background: rgba(251, 191, 36, 0.1) !important;
        }

        .vin-dragging-mode * {
            cursor: grab !important;
            user-select: none !important;
        }

        #vin-color-in {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }

        .vin-fx-outline * {
            outline: 1px solid rgba(239, 68, 68, 0.5) !important;
        }

        .vin-fx-grayscale {
            filter: grayscale(1) !important;
        }

        .vin-fx-hidden * {
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
        }

        .jwt-valid {
            color: #10b981;
            font-weight: 700;
            margin-top: 5px;
            display: block;
        }

        .jwt-exp {
            color: #ef4444;
            font-weight: 700;
            margin-top: 5px;
            display: block;
        }

        #vin-inspector-label {
            position: fixed;
            background: #fbbf24;
            color: #000;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            z-index: 2147483647;
            pointer-events: none;
            display: none;
        }
    `;
    document.head.appendChild(styleEl);

    // =========================================================================
    // 3. UI BUILDER
    // =========================================================================
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'vin-toggle';
    toggleBtn.innerHTML = '⚡';
    document.body.appendChild(toggleBtn);

    const sidebar = document.createElement('div');
    sidebar.id = 'vin-sidebar';

    sidebar.innerHTML = `
        <div class="vin-header">
            <div class="vin-brand">
                <span>Dev Tools <span style="color:var(--v-primary)">By Erick</span></span>
                <span id="vin-close" class="vin-close">✕</span>
            </div>
            <input type="text" class="vin-search" id="vin-search" placeholder="🔍 Buscar (Switch Auto)...">
        </div>

        <div class="vin-tabs">
            <div class="vin-tab active" data-t="p-front">🎨 FRONT</div>
            <div class="vin-tab" data-t="p-back">🚀 BACK</div>
            <div class="vin-tab" data-t="p-json">📄 JSON</div>
            <div class="vin-tab" data-t="p-cfg">⚙️ CONFIG</div>
        </div>

        <div id="p-front" class="vin-content active">

            <div class="vin-card">
                <div class="vin-label">Visual Prototyping</div>

                <div class="vin-grid">
                    <button class="vin-btn primary" id="ui-move">🖱️ Move & Arrange</button>
                    <button class="vin-btn" id="ui-picker" style="position:relative">
                        🎨 Pick Color
                        <input type="color" id="vin-color-in">
                    </button>

                    <button class="vin-btn" id="ui-design">✏️ Edit Mode</button>
                    <button class="vin-btn" id="ui-reset-drag">↺ Reset Pos</button>
                </div>
            </div>

            <div class="vin-card">
                <div class="vin-label">Forms & Data</div>

                <div class="vin-grid">
                    <button class="vin-btn" id="fr-fill">✨ Smart Fill</button>
                    <button class="vin-btn" id="fr-lorem-p">📝 Lorem Input</button>
                    <button class="vin-btn" id="fr-unlock">🔓 Unlock All</button>
                    <button class="vin-btn" id="fr-pass">👁️ Show Pass</button>
                    <button class="vin-btn primary" id="fr-form-json">📤 Page > JSON</button>
                    <button class="vin-btn" id="a11y-alt">🖼️ Check Alt</button>
                </div>
            </div>

            <div class="vin-card">
                <div class="vin-label">Debug & Layout</div>

                <div class="vin-grid">
                    <button class="vin-btn" id="ui-inspect">🔍 Inspector</button>
                    <button class="vin-btn" id="ui-outline">📐 Outlines</button>
                    <button class="vin-btn" id="ui-grid">📏 Grid Overlay</button>
                    <button class="vin-btn" id="ui-zindex">📚 Z-Index 3D</button>
                    <button class="vin-btn" id="ui-viewport">📱 Viewport</button>
                    <button class="vin-btn" id="fr-print">🖨️ Simular Print</button>
                    <button class="vin-btn" id="fr-gray">🌗 Grayscale</button>
                    <button class="vin-btn" id="fr-kill">📌 Kill Sticky</button>
                    <button class="vin-btn" id="fr-hidden">👻 Show Hidden</button>
                </div>
            </div>

            <div class="vin-card">
                <div class="vin-label">Storage Manager</div>

                <div style="display:flex; gap:5px; margin-bottom:10px;">
                    <button class="vin-btn sm active" id="st-local">Local</button>
                    <button class="vin-btn sm" id="st-session">Session</button>
                    <button class="vin-btn sm" id="st-cookie">Cookie</button>
                    <button class="vin-btn sm primary" id="st-refresh">↻</button>
                </div>

                <div class="vin-table-wrap">
                    <table class="vin-table">
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                                <th>Del</th>
                            </tr>
                        </thead>
                        <tbody id="st-tbody"></tbody>
                    </table>
                </div>

                <div style="display:flex; gap:5px; margin-top:8px;">
                    <button class="vin-btn sm" id="st-export">📤 Export</button>
                    <button class="vin-btn sm" id="st-import">📥 Import</button>
                    <div style="flex:1"></div>
                    <button class="vin-btn sm danger" id="st-nuke">🗑️ Clear</button>
                </div>
            </div>

        </div>

        <div id="p-back" class="vin-content">

            <div class="vin-card">
                <div class="vin-label">🔐 JWT Decoder</div>

                <textarea
                    id="jwt-manual-in"
                    class="vin-textarea"
                    style="height:40px;"
                    placeholder="Paste Token here..."
                ></textarea>

                <div class="vin-grid">
                    <button class="vin-btn primary" id="jwt-manual-btn">🔓 Decode</button>
                    <button class="vin-btn" id="jwt-auto-btn">Load Storage</button>
                </div>

                <div id="jwt-msg" style="font-size:11px; margin-top:5px;"></div>

                <div style="display:flex; gap:8px; margin-top:8px;">
                    <div class="jv-container" id="jwt-head" style="flex:1; height:80px;">Header</div>
                    <div class="jv-container" id="jwt-pay" style="flex:1; height:80px;">Payload</div>
                </div>
            </div>

            <div class="vin-card">
                <div class="vin-label">Generators (Click to Copy)</div>

                <div class="vin-grid-3">
                    <button class="vin-btn" id="gn-cpf">CPF</button>
                    <button class="vin-btn" id="gn-cnpj">CNPJ</button>
                    <button class="vin-btn" id="gn-rg">RG (Rand)</button>
                    <button class="vin-btn" id="gn-uuid">UUID</button>
                    <button class="vin-btn" id="gn-pass">Pass</button>
                    <button class="vin-btn" id="gn-email">Email</button>
                    <button class="vin-btn" id="sys-ip">My IP</button>
                    <button class="vin-btn" id="gn-cc">CC (Visa)</button>
                    <button class="vin-btn" id="gn-cep">CEP (Rand)</button>
                    <button class="vin-btn" id="gn-date">Date ISO</button>
                </div>
            </div>

            <div class="vin-card">
                <div class="vin-label">📡 API & SQL</div>

                <div style="display:flex; gap:5px; margin-bottom:8px;">
                    <input
                        id="sw-url"
                        class="vin-input"
                        style="margin:0"
                        placeholder=".../swagger.json"
                    >
                    <button id="sw-load" class="vin-btn primary" style="width:auto">
                        Load
                    </button>
                </div>

                <select id="sw-list" class="vin-select"></select>

                <div class="vin-grid">
                    <button id="sw-gen" class="vin-btn primary">Mock JSON</button>
                    <button id="sw-copy" class="vin-btn">Copy</button>
                </div>

                <div class="vin-grid-4" style="margin-top:8px;">
                    <button class="vin-btn sm" id="sql-create">SQL Create</button>
                    <button class="vin-btn sm" id="sql-insert">SQL Insert</button>
                    <button class="vin-btn sm" id="sql-update">SQL Upd</button>
                    <button class="vin-btn sm" id="sw-cs">C# Class</button>
                </div>

                <div
                    id="sw-preview"
                    class="jv-container"
                    style="margin-top:8px;"
                ></div>
            </div>

            <div class="vin-card">
                <div class="vin-label">🔄 Encoders / Decoders</div>

                <textarea
                    id="cv-in"
                    class="vin-textarea"
                    style="height:40px; margin-bottom:10px"
                    placeholder="Input text..."
                ></textarea>

                <span class="vin-sub">Standard</span>

                <div class="vin-grid-2">
                    <button class="vin-btn" id="btn-b64-e">Base64 Enc</button>
                    <button class="vin-btn" id="btn-b64-d">Base64 Dec</button>
                </div>

                <span class="vin-sub">URL, Hex & Binary</span>

                <div class="vin-grid-4">
                    <button class="vin-btn sm" id="btn-url-e">URL E</button>
                    <button class="vin-btn sm" id="btn-url-d">URL D</button>
                    <button class="vin-btn sm" id="btn-hex-e">Hex E</button>
                    <button class="vin-btn sm" id="btn-hex-d">Hex D</button>
                </div>

                <div class="vin-grid-3" style="margin-top:4px">
                    <button class="vin-btn sm" id="btn-bin-e">Bin Enc</button>
                    <button class="vin-btn sm" id="btn-bin-d">Bin Dec</button>
                    <button class="vin-btn sm" id="btn-rot13">ROT13</button>
                </div>

                <div class="vin-grid-2" style="margin-top:4px">
                    <button class="vin-btn sm" id="btn-html-e">Html E</button>
                    <button class="vin-btn sm" id="btn-html-d">Html D</button>
                </div>

                <div class="vin-grid-3" style="margin-top:10px;">
                    <button class="vin-btn" id="btn-sha256">SHA-256</button>
                    <button class="vin-btn" id="btn-rev">Reverse</button>
                    <button class="vin-btn" id="cv-slug">Slugify</button>
                </div>
            </div>

        </div>

        <div id="p-json" class="vin-content">
            <div
                class="vin-card"
                style="height:100%; display:flex; flex-direction:column;"
            >
                <div class="vin-label">
                    JSON Studio (Interactive Tree)
                </div>

                <textarea
                    id="js-in"
                    class="vin-textarea"
                    style="height:80px;"
                    placeholder="Paste JSON here..."
                ></textarea>

                <div class="vin-grid-3">
                    <button class="vin-btn primary" id="js-view">Visualize</button>
                    <button class="vin-btn" id="js-min">Minify</button>
                    <button class="vin-btn" id="js-copy-btn">Copy</button>
                </div>

                <div
                    id="js-out"
                    class="jv-container"
                    style="flex:1; margin-top:10px; max-height:none;"
                ></div>
            </div>
        </div>

        <div id="p-cfg" class="vin-content">

            <div class="vin-card">
                <div class="vin-label">Customize Theme</div>

                <div class="vin-row">
                    <span class="vin-grow">Primary Color</span>
                    <input type="color" id="cfg-p" value="${theme.primary}">
                </div>

                <div class="vin-row">
                    <span class="vin-grow">Background</span>
                    <input type="color" id="cfg-b" value="${theme.bg}">
                </div>

                <div class="vin-row">
                    <span class="vin-grow">Text Color</span>
                    <input type="color" id="cfg-t" value="${theme.text}">
                </div>
            </div>

            <div class="vin-card">
                <div class="vin-label">Typography & UI</div>

                <span class="vin-sub">Font Family</span>

                <select id="cfg-f" class="vin-select">
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="'Fira Code', monospace">Fira Code</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                </select>

                <span class="vin-sub">Size & Radius</span>

                <input
                    type="range"
                    id="cfg-s"
                    min="11"
                    max="16"
                    value="${parseInt(theme.size)}"
                >

                <input
                    type="range"
                    id="cfg-r"
                    min="0"
                    max="20"
                    value="${parseInt(theme.radius)}"
                >

                <span class="vin-sub">Opacity</span>

                <input
                    type="range"
                    id="cfg-o"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value="${theme.opacity}"
                >
            </div>

            <div class="vin-grid">
                <button class="vin-btn primary" id="cfg-save">Save Theme</button>
                <button class="vin-btn danger" id="cfg-reset">Reset</button>
            </div>

        </div>

        <div id="vin-toast">Notification</div>
        <div id="vin-inspector-label"></div>
    `;

    document.body.appendChild(sidebar);

    // =========================================================================
    // 4. CORE LOGIC
    // =========================================================================
    const panel = document.getElementById('vin-sidebar');

    const toast = (msg, isErr = false) => {
        const t = document.getElementById('vin-toast');

        t.innerText = msg;
        t.className = isErr ? 'error' : '';
        t.classList.add('show');

        setTimeout(() => t.classList.remove('show'), 2500);
    };

    // Ajustado para API Nativa
    const copy = (txt) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(txt).catch(err => fallbackCopy(txt));
        } else {
            fallbackCopy(txt);
        }
        toast('Copiado!');
    };

    const fallbackCopy = (txt) => {
        const temp = document.createElement('textarea');
        temp.value = txt;
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        temp.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(temp);
    };

    const toggleState = (id) =>
        document.getElementById(id).classList.toggle('active-state');

    const toggleBodyClass = (btnId, className) => {
        if (toggleState(btnId)) {
            document.body.classList.add(className);
        } else {
            document.body.classList.remove(className);
        }
    };

    document.getElementById('vin-toggle').onclick = () =>
        panel.classList.add('open');

    document.getElementById('vin-close').onclick = () =>
        panel.classList.remove('open');

    // =========================================================================
    // TAB SWITCHING
    // =========================================================================
    const switchTab = (tid) => {
        document
            .querySelectorAll('.vin-tab, .vin-content')
            .forEach(el => el.classList.remove('active'));

        document
            .querySelector(`[data-t="${tid}"]`)
            .classList.add('active');

        document
            .getElementById(tid)
            .classList.add('active');
    };

    document
        .querySelectorAll('.vin-tab')
        .forEach(t => {
            t.onclick = () => switchTab(t.dataset.t);
        });

    // =========================================================================
    // OMNI SEARCH
    // =========================================================================
    document
        .getElementById('vin-search')
        .addEventListener('input', (e) => {

            const v = e.target.value.toLowerCase();

            let foundTab = null;
            let foundAny = false;

            document
                .querySelectorAll('.vin-btn')
                .forEach(b => {

                    const match =
                        b.innerText
                            .toLowerCase()
                            .includes(v);

                    if (v === '') {

                        b.classList.remove('hidden');

                    } else if (match) {

                        b.classList.remove('hidden');

                        if (!foundTab) {

                            const contentDiv =
                                b.closest('.vin-content');

                            if (contentDiv) {
                                foundTab = contentDiv.id;
                            }
                        }

                        foundAny = true;

                    } else {

                        b.classList.add('hidden');

                    }
                });

            if (
                v.length > 1 &&
                foundTab &&
                !document
                    .getElementById(foundTab)
                    .classList.contains('active')
            ) {
                switchTab(foundTab);
            }
        });

    // =========================================================================
    // 5. JSON ENGINE
    // =========================================================================
    const mkSpan = (cls, txt) => {
        const s = document.createElement('span');
        s.className = cls;
        s.innerText = txt;
        return s;
    };

    function createJsonNode(data, key = null, isLast = true) {

        const type =
            data === null
                ? 'null'
                : typeof data;

        if (
            type === 'object' &&
            data !== null
        ) {

            const isArr =
                Array.isArray(data);

            const isEmpty =
                Object.keys(data).length === 0;

            const openChar =
                isArr ? '[' : '{';

            const closeChar =
                isArr ? ']' : '}';

            if (isEmpty) {

                const div =
                    document.createElement('div');

                div.className =
                    'jv-node';

                if (key) {
                    div.appendChild(
                        mkSpan(
                            'key',
                            `"${key}": `
                        )
                    );
                }

                div.appendChild(
                    mkSpan(
                        'jv-bracket',
                        `${openChar}${closeChar}`
                    )
                );

                if (!isLast) {
                    div.appendChild(
                        mkSpan(
                            'jv-comma',
                            ','
                        )
                    );
                }

                return div;

            } else {

                const details =
                    document.createElement('details');

                details.className =
                    'jv-details';

                details.open = true;

                const summary =
                    document.createElement('summary');

                summary.className =
                    'jv-summary';

                if (key) {

                    summary.appendChild(
                        mkSpan(
                            'key',
                            `"${key}": `
                        )
                    );
                }

                summary.appendChild(
                    mkSpan(
                        'jv-bracket',
                        openChar
                    )
                );

                details.appendChild(summary);

                const keys =
                    Object.keys(data);

                keys.forEach(
                    (k, index) => {

                        const childIsLast =
                            index === keys.length - 1;

                        const childNode =
                            createJsonNode(
                                data[k],
                                isArr ? null : k,
                                childIsLast
                            );

                        details.appendChild(
                            childNode
                        );
                    }
                );

                const divClose =
                    document.createElement('div');

                divClose.appendChild(
                    mkSpan(
                        'jv-bracket',
                        closeChar
                    )
                );

                if (!isLast) {

                    divClose.appendChild(
                        mkSpan(
                            'jv-comma',
                            ','
                        )
                    );
                }

                details.appendChild(
                    divClose
                );

                return details;
            }

        } else {

            const div =
                document.createElement('div');

            div.className =
                'jv-node';

            div.style.marginLeft =
                '15px';

            if (key) {

                div.appendChild(
                    mkSpan(
                        'key',
                        `"${key}": `
                    )
                );
            }

            let valStr =
                String(data);

            let cls =
                'string';

            if (type === 'number') {
                cls = 'number';
            } else if (type === 'boolean') {
                cls = 'boolean';
            } else if (data === null) {
                cls = 'null';
            }

            if (type === 'string') {
                valStr =
                    `"${data}"`;
            }

            div.appendChild(
                mkSpan(
                    cls,
                    valStr
                )
            );

            if (!isLast) {

                div.appendChild(
                    mkSpan(
                        'jv-comma',
                        ','
                    )
                );
            }

            return div;
        }
    }

    function renderJson(container, data) {

        container.innerHTML = '';

        if (typeof data === 'string') {

            try {
                data = JSON.parse(data);
            } catch (e) {
                container.innerText =
                    'Invalid JSON';

                return;
            }
        }

        const root =
            createJsonNode(
                data,
                null,
                true
            );

        container.appendChild(root);
    }

    document
        .getElementById('js-view')
        .onclick = () => {

            try {

                const txt =
                    document
                        .getElementById('js-in')
                        .value;

                if (!txt.trim()) {
                    return toast(
                        'Empty',
                        true
                    );
                }

                const v =
                    JSON.parse(txt);

                renderJson(
                    document
                        .getElementById('js-out'),
                    v
                );

                toast('Rendered!');

            } catch (e) {

                toast(
                    'Invalid JSON',
                    true
                );
            }
        };

    document
        .getElementById('js-min')
        .onclick = () => {

            try {

                const v =
                    JSON.parse(
                        document
                            .getElementById('js-in')
                            .value
                    );

                document
                    .getElementById('js-in')
                    .value =
                    JSON.stringify(v);

            } catch (e) {

                toast(
                    'Invalid JSON',
                    true
                );
            }
        };

    document
        .getElementById('js-copy-btn')
        .onclick = () =>
            copy(
                document
                    .getElementById('js-in')
                    .value
            );

    // =========================================================================
    // 6. FEATURES: GENERATORS
    // =========================================================================
    const bindGen = (id, fn) => {

        const el =
            document.getElementById(id);

        if (el) {

            el.onclick = () => {

                const val =
                    typeof fn === 'function'
                        ? fn()
                        : fn;

                copy(val);
            };
        }
    };

    const genCPF = () => {

        const n = () =>
            Math.floor(
                Math.random() * 10
            );

        const d = (arr) => {

            let v =
                arr.reduce(
                    (t, x, i) =>
                        t +
                        (
                            x *
                            (
                                (arr.length + 1) - i
                            )
                        ),
                    0
                ) % 11;

            return v < 2
                ? 0
                : 11 - v;
        };

        let a =
            Array.from(
                { length: 9 },
                n
            );

        a.push(d(a));
        a.push(d(a));

        return a.join('');
    };

    const genCNPJ = () => {

        const chars =
            '0123456789ABCDEGHJKLMNPRSTVWXYZ';

        const getChar = () =>
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];

        let a =
            Array.from(
                { length: 12 },
                getChar
            );

        const val = (c) =>
            typeof c === 'number'
                ? c
                : c.charCodeAt(0) - 48;

        const d = (arr, p) => {

            let v =
                arr.reduce(
                    (t, x, i) =>
                        t +
                        (
                            val(x) *
                            p[i]
                        ),
                    0
                ) % 11;

            return v < 2
                ? 0
                : 11 - v;
        };

        let p1 = [
            5, 4, 3, 2,
            9, 8, 7, 6,
            5, 4, 3, 2
        ];

        let p2 = [
            6, 5, 4, 3,
            2, 9, 8, 7,
            6, 5, 4, 3, 2
        ];

        a.push(
            d(a, p1)
        );

        a.push(
            d(a, p2)
        );

        return a.join('');
    };

    const genCC = () => {

        let pos =
            Math.floor(
                Math.random() *
                100000000000
            )
                .toString()
                .padStart(
                    11,
                    '0'
                );

        let str =
            '4' + pos;

        let sum = 0;

        let final =
            str
                .split('')
                .map(Number);

        let flip = true;

        for (
            let i =
                final.length - 1;
            i >= 0;
            i--
        ) {

            let n =
                final[i];

            if (flip) {
                n *= 2;
            }

            if (n > 9) {
                n -= 9;
            }

            sum += n;
            flip = !flip;
        }

        return (
            str +
            (
                (sum * 9) % 10
            )
        );
    };

    bindGen(
        'gn-cpf',
        genCPF
    );

    bindGen(
        'gn-cnpj',
        genCNPJ
    );

    bindGen(
        'gn-uuid',
        () =>
            crypto.randomUUID()
    );

    bindGen(
        'gn-pass',
        () =>
            Math.random()
                .toString(36)
                .slice(-8) +
            'A1@'
    );

    bindGen(
        'gn-email',
        () =>
            `user${Math.floor(Math.random() * 1000)}@example.com`
    );

    bindGen(
        'gn-cc',
        genCC
    );

    bindGen(
        'gn-cep',
        () =>
            Math.floor(
                Math.random() *
                89999 +
                10000
            ) +
            '-' +
            Math.floor(
                Math.random() *
                899 +
                100
            )
    );

    bindGen(
        'gn-rg',
        () =>
            Math.floor(
                Math.random() *
                89999999 +
                10000000
            ).toString()
    );

    bindGen(
        'gn-date',
        () =>
            new Date()
                .toISOString()
                .split('T')[0]
    );

    // Ajustado para API Nativa
    document.getElementById('sys-ip').onclick = () => {
        toast('Fetching IP...');
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => copy(data.ip))
            .catch(err => {
                toast('Erro ao buscar IP', true);
            });
    };

    // =========================================================================
    // 7. FEATURES: ENCODERS
    // =========================================================================
    const getE = () =>
        document
            .getElementById('cv-in')
            .value;

    const setE = (v) => {

        document
            .getElementById('cv-in')
            .value = v;

        copy(v);
    };

    document
        .getElementById('btn-b64-e')
        .onclick = () => {

            if (getE()) {
                setE(
                    btoa(
                        getE()
                    )
                );
            }
        };

    document
        .getElementById('btn-b64-d')
        .onclick = () => {

            try {

                setE(
                    atob(
                        getE()
                    )
                );

            } catch {

                toast(
                    'Error',
                    1
                );
            }
        };

    document
        .getElementById('btn-url-e')
        .onclick = () =>
            setE(
                encodeURIComponent(
                    getE()
                )
            );

    document
        .getElementById('btn-url-d')
        .onclick = () =>
            setE(
                decodeURIComponent(
                    getE()
                )
            );

    document
        .getElementById('btn-hex-e')
        .onclick = () =>
            setE(
                getE()
                    .split('')
                    .map(
                        c =>
                            c
                                .charCodeAt(0)
                                .toString(16)
                    )
                    .join('')
            );

    document
        .getElementById('btn-hex-d')
        .onclick = () => {

            try {

                setE(
                    getE()
                        .match(/.{1,2}/g)
                        .map(
                            b =>
                                String.fromCharCode(
                                    parseInt(
                                        b,
                                        16
                                    )
                                )
                        )
                        .join('')
                );

            } catch {

                toast(
                    'Error',
                    1
                );
            }
        };

    document
        .getElementById('btn-html-e')
        .onclick = () =>
            setE(
                getE()
                    .replace(
                        /[\u00A0-\u9999<>\&]/gim,
                        i =>
                            '&#' +
                            i.charCodeAt(0) +
                            ';'
                    )
            );

    document
        .getElementById('btn-html-d')
        .onclick = () => {

            const t =
                document.createElement(
                    'textarea'
                );

            t.innerHTML =
                getE();

            setE(
                t.value
            );
        };

    document
        .getElementById('btn-sha256')
        .onclick = async () => {

            if (getE()) {

                const h =
                    await crypto
                        .subtle
                        .digest(
                            'SHA-256',
                            new TextEncoder()
                                .encode(
                                    getE()
                                )
                        );

                setE(
                    Array.from(
                        new Uint8Array(h)
                    )
                        .map(
                            b =>
                                b
                                    .toString(16)
                                    .padStart(
                                        2,
                                        '0'
                                    )
                        )
                        .join('')
                );
            }
        };

    document
        .getElementById('btn-rev')
        .onclick = () =>
            setE(
                getE()
                    .split('')
                    .reverse()
                    .join('')
            );

    document
        .getElementById('cv-slug')
        .onclick = () =>
            setE(
                getE()
                    .toLowerCase()
                    .replace(
                        / /g,
                        '-'
                    )
                    .replace(
                        /[^\w-]+/g,
                        ''
                    )
            );

    document
        .getElementById('btn-bin-e')
        .onclick = () =>
            setE(
                getE()
                    .split('')
                    .map(
                        c =>
                            c
                                .charCodeAt(0)
                                .toString(2)
                                .padStart(
                                    8,
                                    '0'
                                )
                    )
                    .join(' ')
            );

    document
        .getElementById('btn-bin-d')
        .onclick = () => {

            try {

                setE(
                    getE()
                        .trim()
                        .split(/\s+/)
                        .map(
                            b =>
                                String.fromCharCode(
                                    parseInt(
                                        b,
                                        2
                                    )
                                )
                        )
                        .join('')
                );

            } catch (e) {

                toast(
                    'Binary Inválido',
                    true
                );
            }
        };

    document
        .getElementById('btn-rot13')
        .onclick = () =>
            setE(
                getE()
                    .replace(
                        /[a-zA-Z]/g,
                        c =>
                            String.fromCharCode(
                                (
                                    c <= 'Z'
                                        ? 90
                                        : 122
                                ) >=
                                (
                                    c =
                                        c.charCodeAt(0) +
                                        13
                                )
                                    ? c
                                    : c - 26
                            )
                    )
            );

    // =========================================================================
    // JWT
    // =========================================================================
    const decodeJwt = (t) => {

        if (!t) {
            return toast(
                'Empty',
                1
            );
        }

        t =
            t
                .replace(
                    /['"]+/g,
                    ''
                )
                .trim();

        if (
            t.includes(
                'Bearer '
            )
        ) {

            t =
                t.split(
                    'Bearer '
                )[1];
        }

        try {

            const [h, p] =
                t
                    .split('.')
                    .slice(0, 2)
                    .map(
                        x =>
                            JSON.parse(
                                atob(
                                    x
                                        .replace(
                                            /-/g,
                                            '+'
                                        )
                                        .replace(
                                            /_/g,
                                            '/'
                                        )
                                )
                            )
                    );

            renderJson(
                document
                    .getElementById('jwt-head'),
                h
            );

            renderJson(
                document
                    .getElementById('jwt-pay'),
                p
            );

            const exp =
                new Date(
                    p.exp *
                    1000
                );

            document
                .getElementById('jwt-msg')
                .innerHTML =
                (
                    new Date() >
                    exp
                )
                    ? `<span class="jwt-exp">Expired: ${exp.toLocaleString()}</span>`
                    : `<span class="jwt-valid">Valid: ${exp.toLocaleString()}</span>`;

            toast(
                'Decoded'
            );

        } catch (e) {

            toast(
                'Invalid JWT',
                1
            );
        }
    };

    document
        .getElementById('jwt-manual-btn')
        .onclick = () =>
            decodeJwt(
                document
                    .getElementById('jwt-manual-in')
                    .value
            );

    document
        .getElementById('jwt-auto-btn')
        .onclick = () => {

            let t =
                localStorage
                    .getItem(
                        'access_token'
                    ) ||
                localStorage
                    .getItem(
                        'token'
                    );

            if (
                t &&
                t.includes('{')
            ) {

                try {

                    t =
                        JSON.parse(
                            t
                        ).token;

                } catch {}
            }

            if (t) {

                document
                    .getElementById('jwt-manual-in')
                    .value = t;

                decodeJwt(t);

            } else {

                toast(
                    'Not Found in Storage',
                    1
                );
            }
        };

    // =========================================================================
    // 8. STORAGE MANAGER & CONFIG
    // =========================================================================
    const updateVar = (k, v) =>
        document
            .documentElement
            .style
            .setProperty(
                k,
                v
            );

    if (theme) {

        document
            .getElementById('cfg-p')
            .value =
            theme.primary;

        document
            .getElementById('cfg-b')
            .value =
            theme.bg;

        document
            .getElementById('cfg-t')
            .value =
            theme.text;

        document
            .getElementById('cfg-f')
            .value =
            theme.font;
    }

    document
        .getElementById('cfg-p')
        .addEventListener(
            'input',
            e =>
                updateVar(
                    '--v-primary',
                    e.target.value
                )
        );

    document
        .getElementById('cfg-t')
        .addEventListener(
            'input',
            e =>
                updateVar(
                    '--v-text',
                    e.target.value
                )
        );

    document
        .getElementById('cfg-b')
        .addEventListener(
            'input',
            e => {

                updateVar(
                    '--v-bg-glass',
                    getAlpha(
                        e.target.value,
                        document
                            .getElementById('cfg-o')
                            .value
                    )
                );
            }
        );

    document
        .getElementById('cfg-o')
        .addEventListener(
            'input',
            e => {

                updateVar(
                    '--v-bg-glass',
                    getAlpha(
                        document
                            .getElementById('cfg-b')
                            .value,
                        e.target.value
                    )
                );
            }
        );

    document
        .getElementById('cfg-s')
        .addEventListener(
            'input',
            e =>
                updateVar(
                    '--v-size',
                    e.target.value +
                    'px'
                )
        );

    document
        .getElementById('cfg-r')
        .addEventListener(
            'input',
            e => {

                updateVar(
                    '--v-rad',
                    e.target.value +
                    'px'
                );

                updateVar(
                    '--v-rad-s',
                    `calc(${e.target.value}px / 2)`
                );
            }
        );

    document
        .getElementById('cfg-save')
        .onclick = () => {

            const newTheme = {

                primary:
                    document
                        .getElementById('cfg-p')
                        .value,

                bg:
                    document
                        .getElementById('cfg-b')
                        .value,

                text:
                    document
                        .getElementById('cfg-t')
                        .value,

                font:
                    document
                        .getElementById('cfg-f')
                        .value,

                size:
                    document
                        .getElementById('cfg-s')
                        .value +
                    'px',

                opacity:
                    document
                        .getElementById('cfg-o')
                        .value,

                radius:
                    document
                        .getElementById('cfg-r')
                        .value +
                    'px'
            };

            localStorage.setItem(
                'vin_dt_theme',
                JSON.stringify(
                    newTheme
                )
            );

            toast(
                'Theme Saved!'
            );
        };

    document
        .getElementById('cfg-reset')
        .onclick = () => {

            if (
                confirm(
                    'Reset Theme?'
                )
            ) {

                localStorage.removeItem(
                    'vin_dt_theme'
                );

                location.reload();
            }
        };

    let stMode =
        'local';

    const renSt = () => {

        const tb =
            document
                .getElementById(
                    'st-tbody'
                );

        tb.innerHTML =
            '';

        let data =
            {};

        try {

            if (
                stMode ===
                'local'
            ) {

                data = {
                    ...localStorage
                };

            } else if (
                stMode ===
                'session'
            ) {

                data = {
                    ...sessionStorage
                };

            } else {

                document
                    .cookie
                    .split(';')
                    .forEach(
                        c => {

                            if (
                                !c.includes('=')
                            ) {
                                return;
                            }

                            const [k, v] =
                                c.split('=');

                            if (k) {

                                data[
                                    k.trim()
                                ] =
                                    v;
                            }
                        }
                    );
            }

        } catch (e) {}

        document
            .getElementById('st-local')
            .classList
            .toggle(
                'active',
                stMode ===
                'local'
            );

        document
            .getElementById('st-session')
            .classList
            .toggle(
                'active',
                stMode ===
                'session'
            );

        document
            .getElementById('st-cookie')
            .classList
            .toggle(
                'active',
                stMode ===
                'cookie'
            );

        Object
            .keys(data)
            .forEach(
                k => {

                    const tr =
                        document
                            .createElement(
                                'tr'
                            );

                    tr.innerHTML =
                        `<td style="color:var(--v-primary)">${k.slice(0,10)}</td>` +
                        `<td style="color:var(--v-text-muted)">${(data[k] || '').slice(0,15)}...</td>` +
                        `<td><button class="vin-btn sm danger">×</button></td>`;

                    tr
                        .querySelector(
                            'button'
                        )
                        .onclick =
                        () => {

                            if (
                                stMode ===
                                'cookie'
                            ) {

                                document.cookie =
                                    `${k}=;Max-Age=0`;

                            } else {

                                (
                                    stMode ===
                                    'local'
                                        ? localStorage
                                        : sessionStorage
                                )
                                    .removeItem(
                                        k
                                    );
                            }

                            renSt();
                        };

                    tb.appendChild(
                        tr
                    );
                }
            );

        if (
            Object
                .keys(data)
                .length ===
            0
        ) {

            const tr =
                document
                    .createElement(
                        'tr'
                    );

            tr.innerHTML =
                `<td colspan="3" style="text-align:center; opacity:0.5; padding:10px;">Vazio / Empty</td>`;

            tb.appendChild(
                tr
            );
        }
    };

    document
        .getElementById('st-local')
        .onclick = () => {

            stMode =
                'local';

            renSt();
        };

    document
        .getElementById('st-session')
        .onclick = () => {

            stMode =
                'session';

            renSt();
        };

    document
        .getElementById('st-cookie')
        .onclick = () => {

            stMode =
                'cookie';

            renSt();
        };

    document
        .getElementById('st-refresh')
        .onclick =
        renSt;

    document
        .getElementById('st-nuke')
        .onclick = () => {

            if (
                confirm(
                    'Clear All Storage?'
                )
            ) {

                if (
                    stMode ===
                    'local'
                ) {
                    localStorage.clear();
                }

                if (
                    stMode ===
                    'session'
                ) {
                    sessionStorage.clear();
                }

                renSt();
            }
        };

    document
        .getElementById('st-export')
        .onclick = () => {

            copy(
                JSON.stringify(
                    stMode ===
                    'local'
                        ? localStorage
                        : sessionStorage
                )
            );
        };

    document
        .getElementById('st-import')
        .onclick = () => {

            const j =
                prompt(
                    'JSON:'
                );

            if (j) {

                try {

                    const d =
                        JSON.parse(
                            j
                        );

                    Object
                        .keys(d)
                        .forEach(
                            k =>
                                (
                                    stMode ===
                                    'local'
                                        ? localStorage
                                        : sessionStorage
                                )
                                    .setItem(
                                        k,
                                        d[k]
                                    )
                        );

                    renSt();

                } catch (e) {

                    toast(
                        'Error',
                        1
                    );
                }
            }
        };

    renSt();

    // =========================================================================
    // FORMS
    // =========================================================================
    function setNative(el, v) {

        const p =
            Object.getPrototypeOf(
                el
            );

        const d =
            Object
                .getOwnPropertyDescriptor(
                    p,
                    'value'
                );

        if (
            d &&
            d.set
        ) {

            d.set.call(
                el,
                v
            );

        } else {

            el.value =
                v;
        }

        el.dispatchEvent(
            new Event(
                'input',
                {
                    bubbles:
                        true
                }
            )
        );

        el.dispatchEvent(
            new Event(
                'change',
                {
                    bubbles:
                        true
                }
            )
        );

        el.dispatchEvent(
            new Event(
                'blur',
                {
                    bubbles:
                        true
                }
            )
        );
    }

    document
        .getElementById('fr-fill')
        .onclick = () => {

            let c = 0;

            document
                .querySelectorAll(
                    'input:not([type=hidden]), textarea, select'
                )
                .forEach(
                    e => {

                        let v =
                            'Teste';

                        if (
                            e.type ===
                            'number'
                        ) {

                            v =
                                '10';

                        } else if (
                            e.name.includes(
                                'mail'
                            )
                        ) {

                            v =
                                'u@t.com';

                        } else if (
                            e.type ===
                            'checkbox'
                        ) {

                            e.checked =
                                true;
                        }

                        if (
                            e.type !==
                            'checkbox'
                        ) {

                            setNative(
                                e,
                                v
                            );

                        } else {

                            e.dispatchEvent(
                                new Event(
                                    'click'
                                )
                            );
                        }

                        c++;
                    }
                );

            toast(
                `${c} Filled`
            );
        };

    document
        .getElementById('fr-lorem-p')
        .onclick = () => {

            toast(
                'Click input...'
            );

            toggleState(
                'fr-lorem-p'
            );

            document
                .body
                .classList
                .add(
                    'vin-targeting'
                );

            const h =
                (e) => {

                    if (
                        e.target.tagName.match(
                            /INPUT|TEXTAREA/
                        )
                    ) {

                        e.preventDefault();

                        setNative(
                            e.target,
                            'Lorem ipsum.'
                        );

                        toast(
                            'Inserted'
                        );

                        document
                            .body
                            .classList
                            .remove(
                                'vin-targeting'
                            );

                        toggleState(
                            'fr-lorem-p'
                        );

                        document
                            .removeEventListener(
                                'click',
                                h,
                                true
                            );
                    }
                };

            document
                .addEventListener(
                    'click',
                    h,
                    true
                );
        };

    document
        .getElementById('fr-form-json')
        .onclick = () => {

            const o =
                {};

            document
                .querySelectorAll(
                    'input,select,textarea'
                )
                .forEach(
                    x => {

                        if (
                            x.name ||
                            x.id
                        ) {

                            o[
                                x.name ||
                                x.id
                            ] =
                                x.value;
                        }
                    }
                );

            document
                .getElementById('js-in')
                .value =
                JSON.stringify(
                    o,
                    null,
                    2
                );

            switchTab(
                'p-json'
            );

            renderJson(
                document
                    .getElementById('js-out'),
                o
            );

            toast(
                'Converted'
            );
        };

    // =========================================================================
    // MOVE / DRAG
    // =========================================================================
    let drag = false;
    let dEl;
    let sX;
    let sY;
    let iX;
    let iY;

    document
        .getElementById('ui-move')
        .onclick = () => {

            drag =
                !drag;

            toggleState(
                'ui-move'
            );

            if (drag) {

                document
                    .body
                    .classList
                    .add(
                        'vin-dragging-mode'
                    );

                window
                    .addEventListener(
                        'mousedown',
                        initDrag,
                        true
                    );

                toast(
                    'Drag ON'
                );

            } else {

                document
                    .body
                    .classList
                    .remove(
                        'vin-dragging-mode'
                    );

                window
                    .removeEventListener(
                        'mousedown',
                        initDrag,
                        true
                    );
            }
        };

    function initDrag(e) {

        if (
            e.target.closest(
                '#vin-sidebar'
            )
        ) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        dEl =
            e.target;

        const m =
            new WebKitCSSMatrix(
                window
                    .getComputedStyle(
                        dEl
                    )
                    .transform
            );

        iX =
            m.m41;

        iY =
            m.m42;

        sX =
            e.clientX;

        sY =
            e.clientY;

        window
            .addEventListener(
                'mousemove',
                doDrag,
                true
            );

        window
            .addEventListener(
                'mouseup',
                stopDrag,
                true
            );
    }

    function doDrag(e) {

        if (!dEl) {
            return;
        }

        e.preventDefault();

        dEl.style.transform =
            `translate(${iX + e.clientX - sX}px, ${iY + e.clientY - sY}px)`;
    }

    function stopDrag() {

        if (dEl) {

            dEl =
                null;

            window
                .removeEventListener(
                    'mousemove',
                    doDrag,
                    true
                );

            window
                .removeEventListener(
                    'mouseup',
                    stopDrag,
                    true
                );
        }
    }

    document
        .getElementById('ui-reset-drag')
        .onclick = () => {

            document
                .querySelectorAll('*')
                .forEach(
                    e =>
                        e.style.transform =
                            ''
                );

            toast(
                'Reset'
            );
        };

    document
        .getElementById('ui-picker')
        .onclick = () => {

            if (
                window.EyeDropper
            ) {

                new EyeDropper()
                    .open()
                    .then(
                        r => {

                            copy(
                                r.sRGBHex
                            );

                            toast(
                                r.sRGBHex
                            );
                        }
                    )
                    .catch(
                        () => {}
                    );

            } else {

                document
                    .getElementById('vin-color-in')
                    .click();
            }
        };

    document
        .getElementById('vin-color-in')
        .oninput =
        (e) => {

            copy(
                e.target.value
            );

            toast(
                e.target.value
            );
        };

    document
        .getElementById('ui-design')
        .onclick = () => {

            document.designMode =
                document.designMode ===
                'on'
                    ? 'off'
                    : 'on';

            toggleState(
                'ui-design'
            );
        };

    document
        .getElementById('ui-outline')
        .onclick = () => {

            toggleBodyClass(
                'ui-outline',
                'vin-fx-outline'
            );
        };

    document
        .getElementById('fr-gray')
        .onclick = () => {

            toggleBodyClass(
                'fr-gray',
                'vin-fx-grayscale'
            );
        };

    document
        .getElementById('fr-hidden')
        .onclick = () => {

            toggleBodyClass(
                'fr-hidden',
                'vin-fx-hidden'
            );
        };

    document
        .getElementById('fr-kill')
        .onclick = () => {

            toggleBodyClass(
                'fr-kill',
                'vin-fx-sticky'
            );
        };

    document
        .getElementById('fr-print')
        .onclick = () => {

            toggleBodyClass(
                'fr-print',
                'vin-fx-print'
            );

            window.print();
        };

    document
        .getElementById('ui-inspect')
        .onclick = () => {

            if (
                toggleState(
                    'ui-inspect'
                )
            ) {

                document
                    .body
                    .classList
                    .add(
                        'vin-inspecting'
                    );

                toast(
                    'Inspector ON'
                );

                document
                    .addEventListener(
                        'mouseover',
                        hovInsp
                    );

            } else {

                document
                    .body
                    .classList
                    .remove(
                        'vin-inspecting'
                    );

                document
                    .removeEventListener(
                        'mouseover',
                        hovInsp
                    );

                document
                    .getElementById('vin-inspector-label')
                    .style
                    .display =
                    'none';
            }
        };

    function hovInsp(e) {

        if (
            e.target.closest(
                '#vin-sidebar'
            )
        ) {
            return;
        }

        const l =
            document
                .getElementById(
                    'vin-inspector-label'
                );

        l.style.display =
            'block';

        l.style.top =
            (
                e.clientY +
                10
            ) +
            'px';

        l.style.left =
            (
                e.clientX +
                10
            ) +
            'px';

        l.innerText =
            `<${e.target.tagName.toLowerCase()} ${e.target.className} | ${e.target.offsetWidth}x${e.target.offsetHeight}`;

        e.target.style.outline =
            '1px solid cyan';

        setTimeout(
            () =>
                e.target.style.outline =
                    '',
            1000
        );
    }

    document
        .getElementById('fr-unlock')
        .onclick = () => {

            document
                .querySelectorAll(
                    '[disabled]'
                )
                .forEach(
                    e =>
                        e.disabled =
                            false
                );

            toast(
                'Unlocked'
            );
        };

    document
        .getElementById('fr-pass')
        .onclick = () => {

            document
                .querySelectorAll(
                    'input[type=password]'
                )
                .forEach(
                    e =>
                        e.type =
                            'text'
                );

            toast(
                'Passwords Shown'
            );
        };

    // =========================================================================
    // SWAGGER / API / SQL / C#
    // =========================================================================
    document
        .getElementById('sw-url')
        .value =
        localStorage
            .getItem(
                'v_sw_url'
            ) ||
        location.origin +
        '/swagger/v1/swagger.json';

    let swS =
        null;

    let curM =
        null;

    let sN =
        'Dto';

    // Ajustado para API Nativa
    document.getElementById('sw-load').onclick = () => {
        fetch(document.getElementById('sw-url').value)
            .then(res => res.json())
            .then(data => {
                swS = data;
                const s = document.getElementById('sw-list');
                s.innerHTML = '';

                Object.keys(swS.paths).forEach(p =>
                    Object.keys(swS.paths[p]).forEach(m => {
                        if (m !== 'get') {
                            const o = document.createElement('option');
                            o.text = `[${m.toUpperCase()}] ${p}`;
                            let sc = swS.paths[p][m].requestBody?.content?.['application/json']?.schema;
                            let n = 'Dto';

                            if (sc && sc.$ref) {
                                n = sc.$ref.split('/').pop();
                            }
                            o.value = JSON.stringify({ sc, n });
                            s.add(o);
                        }
                    })
                );
                toast('Loaded');
            })
            .catch(() => {
                toast('JSON Error', true);
            });
    };

    const getMock =
        (k, t) => {

            if (!k) {

                return (
                    t ===
                    'integer'
                )
                    ? 0
                    : 'str';
            }

            const l =
                k.toLowerCase();

            if (
                t ===
                'string'
            ) {

                if (
                    l.includes(
                        'email'
                    )
                ) {
                    return 'u@t.com';
                }

                if (
                    l.includes(
                        'id'
                    )
                ) {
                    return 'guid';
                }

                return 'str';
            }

            return 0;
        };

    const resD =
        (s, k) => {

            if (!s) {
                return null;
            }

            if (
                s.$ref
            ) {

                let r =
                    swS;

                s.$ref
                    .replace(
                        '#/',
                        ''
                    )
                    .split('/')
                    .forEach(
                        x =>
                            r =
                            r?.[x]
                    );

                return resD(
                    r,
                    k
                );
            }

            if (
                s.properties
            ) {

                const o =
                    {};

                Object
                    .keys(
                        s.properties
                    )
                    .forEach(
                        x =>
                            o[x] =
                                resD(
                                    s.properties[x],
                                    x
                                )
                    );

                return o;
            }

            return getMock(
                k,
                s.type
            );
        };

    document
        .getElementById('sw-gen')
        .onclick = () => {

            const v =
                document
                    .getElementById('sw-list')
                    .value;

            if (v) {

                const p =
                    JSON.parse(
                        v
                    );

                curM =
                    resD(
                        p.sc,
                        ''
                    );

                sN =
                    p.n;

                renderJson(
                    document
                        .getElementById('sw-preview'),
                    curM
                );
            }
        };

    document
        .getElementById('sw-copy')
        .onclick = () => {

            if (curM) {

                copy(
                    JSON.stringify(
                        curM,
                        null,
                        2
                    )
                );
            }
        };

    const fS =
        v =>
            v === null
                ? 'NULL'
                : (
                    typeof v ===
                    'string'
                        ? `'${v}'`
                        : v
                            ? 1
                            : 0
                );

    const getM =
        () =>
            curM ||
            JSON.parse(
                document
                    .getElementById('js-in')
                    .value ||
                'null'
            );

    document
        .getElementById('sw-cs')
        .onclick = () => {

            try {

                const data =
                    getM();

                if (!data) {

                    return toast(
                        'Sem dados!',
                        true
                    );
                }

                const target =
                    Array.isArray(
                        data
                    )
                        ? data[0]
                        : data;

                const className =
                    sN ||
                    'Root';

                let code =
                    `public class ${className}\n{\n`;

                Object
                    .keys(
                        target
                    )
                    .forEach(
                        k => {

                            const val =
                                target[k];

                            let type =
                                'string';

                            if (
                                val ===
                                null
                            ) {

                                type =
                                    'object';

                            } else if (
                                typeof val ===
                                'number'
                            ) {

                                type =
                                    Number.isInteger(
                                        val
                                    )
                                        ? 'int'
                                        : 'double';

                            } else if (
                                typeof val ===
                                'boolean'
                            ) {

                                type =
                                    'bool';

                            } else if (
                                Array.isArray(
                                    val
                                )
                            ) {

                                type =
                                    'List<object>';

                            } else if (
                                typeof val ===
                                'object'
                            ) {

                                type =
                                    'object';
                            }

                            if (
                                typeof val ===
                                    'string' &&
                                /^\d{4}-\d{2}-\d{2}/
                                    .test(
                                        val
                                    )
                            ) {

                                type =
                                    'DateTime';
                            }

                            const prop =
                                k
                                    .charAt(0)
                                    .toUpperCase() +
                                k.slice(1);

                            code +=
                                `    public ${type} ${prop} { get; set; }\n`;
                        }
                    );

                code +=
                    '}';

                copy(
                    code
                );

            } catch (e) {

                toast(
                    'Erro C#',
                    true
                );
            }
        };

    document
        .getElementById('sql-create')
        .onclick = () => {

            const d =
                getM();

            if (d) {

                const a =
                    Array.isArray(
                        d
                    )
                        ? d[0]
                        : d;

                let s =
                    'CREATE TABLE T (\n';

                Object
                    .keys(
                        a
                    )
                    .forEach(
                        k =>
                            s +=
                                `  ${k} NVARCHAR(MAX),\n`
                    );

                copy(
                    s
                        .slice(
                            0,
                            -2
                        ) +
                    '\n);'
                );
            }
        };

    document
        .getElementById('sql-insert')
        .onclick = () => {

            const d =
                getM();

            if (d) {

                const a =
                    Array.isArray(
                        d
                    )
                        ? d[0]
                        : d;

                copy(
                    `INSERT INTO T (${Object.keys(a).join(',')}) VALUES (${Object.values(a).map(fS).join(',')})`
                );
            }
        };

    document
        .getElementById('sql-update')
        .onclick = () => {

            const d =
                getM();

            if (d) {

                const a =
                    Array.isArray(
                        d
                    )
                        ? d[0]
                        : d;

                const id =
                    Object
                        .keys(
                            a
                        )[0];

                const s =
                    Object
                        .keys(
                            a
                        )
                        .filter(
                            k =>
                                k !==
                                id
                        )
                        .map(
                            k =>
                                `${k}=${fS(a[k])}`
                        )
                        .join(
                            ', '
                        );

                copy(
                    `UPDATE T SET ${s} WHERE ${id}=${fS(a[id])}`
                );
            }
        };

})();