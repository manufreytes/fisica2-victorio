/* Laboratorio: simuladores interactivos en canvas (sin dependencias) */
(function () {
  const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const pal = () => ({ ink: cssv('--ink'), mute: cssv('--mute'), line: cssv('--line'), bg: cssv('--bg2'), g: cssv('--trace'), a: cssv('--trace2'), c: cssv('--trace3'), m: cssv('--trace4'), y: cssv('--trace5'), bad: cssv('--bad') });
  function layout(box) {
    box.innerHTML = '<div class="simL"></div><div class="ctrl card"></div>';
    return { left: box.firstChild, right: box.lastChild };
  }
  function mkCanvas(parent, W, H) {
    const c = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1);
    c.className = 'sim'; c.width = W * dpr; c.height = H * dpr; parent.appendChild(c);
    const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
    return { c, ctx, pos, W, H };
  }
  const arrow = (ctx, x1, y1, x2, y2, hs = 8) => {
    const a = Math.atan2(y2 - y1, x2 - x1); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - hs * Math.cos(a - .4), y2 - hs * Math.sin(a - .4)); ctx.lineTo(x2 - hs * Math.cos(a + .4), y2 - hs * Math.sin(a + .4)); ctx.closePath(); ctx.fill();
  };
  const ro = (right, html) => { let el = $('.readout', right); if (!el) { el = document.createElement('div'); el.className = 'readout'; right.appendChild(el); } el.innerHTML = html; };
  function wl2rgb(w) { // 380–780 nm → rgb
    let r = 0, g = 0, b = 0;
    if (w < 440) { r = -(w - 440) / 60; b = 1; } else if (w < 490) { g = (w - 440) / 50; b = 1; } else if (w < 510) { g = 1; b = -(w - 510) / 20; }
    else if (w < 580) { r = (w - 510) / 70; g = 1; } else if (w < 645) { r = 1; g = -(w - 645) / 65; } else { r = 1; }
    const f = w < 420 ? .3 + .7 * (w - 380) / 40 : w > 700 ? .3 + .7 * (780 - w) / 80 : 1;
    return [r, g, b].map(x => Math.round(255 * Math.pow(Math.max(0, x) * f, .8)));
  }

  /* =========================================================
     1 · Campo eléctrico y equipotenciales
     ========================================================= */
  function simField(box) {
    const { left, right } = layout(box); const { c, ctx, pos, W, H } = mkCanvas(left, 720, 440);
    let ch = [{ x: 250, y: 220, q: 1 }, { x: 470, y: 220, q: -1 }], mode = 'pos', mag = 1, lines = true, eq = true, heat = true, drag = null, mouse = null;
    right.innerHTML = `<div><label>Al tocar el lienzo</label>${segs('fm', [['pos', '+ carga'], ['neg', '− carga'], ['del', 'borrar']], 'pos')}</div>
      <div><label>Magnitud de la carga</label>${segs('fq', [['1', '1'], ['2', '2'], ['3', '3']], '1')}</div>
      <div><label>Mostrar</label><div class="row"><label class="chip"><input type="checkbox" id="fl" checked> líneas</label><label class="chip"><input type="checkbox" id="fe" checked> equipotenciales</label><label class="chip"><input type="checkbox" id="fh" checked> mapa de V</label></div></div>
      <div><label>Configuraciones</label><div class="row"><button class="btn sm ghost" data-p="dip">Dipolo</button><button class="btn sm ghost" data-p="eq">Dos iguales</button><button class="btn sm ghost" data-p="cap">Condensador</button><button class="btn sm ghost" data-p="clr">Limpiar</button></div></div>`;
    const V = (x, y) => ch.reduce((s, k) => s + k.q * 60 / Math.max(6, Math.hypot(x - k.x, y - k.y)), 0);
    const E = (x, y) => { let ex = 0, ey = 0; for (const k of ch) { const dx = x - k.x, dy = y - k.y, r2 = Math.max(36, dx * dx + dy * dy), r = Math.sqrt(r2), f = k.q * 60 / r2; ex += f * dx / r; ey += f * dy / r; } return [ex, ey]; };
    function draw() {
      const P = pal(); ctx.clearRect(0, 0, W, H); ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      if (heat) { const s = 8; for (let x = 0; x < W; x += s) for (let y = 0; y < H; y += s) { const v = V(x + s / 2, y + s / 2), t = Math.tanh(v / 3); ctx.globalAlpha = Math.abs(t) * .38; ctx.fillStyle = t > 0 ? P.a : P.c; ctx.fillRect(x, y, s, s); } ctx.globalAlpha = 1; }
      if (eq && ch.length) {
        const s = 6, nx = Math.ceil(W / s) + 1, ny = Math.ceil(H / s) + 1, g = new Float32Array(nx * ny);
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) g[j * nx + i] = V(i * s, j * s);
        const lv = [-8, -6, -4, -3, -2, -1.5, -1, -.6, -.3, 0, .3, .6, 1, 1.5, 2, 3, 4, 6, 8];
        ctx.lineWidth = 1;
        for (const L of lv) {
          ctx.strokeStyle = L === 0 ? P.ink : L > 0 ? P.a : P.c; ctx.globalAlpha = L === 0 ? .8 : .65; ctx.setLineDash(L === 0 ? [5, 4] : []); ctx.beginPath();
          for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
            const a = g[j * nx + i], b = g[j * nx + i + 1], cc = g[(j + 1) * nx + i + 1], d = g[(j + 1) * nx + i], pts = [];
            const cr = (v1, v2, x1, y1, x2, y2) => { if ((v1 < L) !== (v2 < L)) { const t = (L - v1) / (v2 - v1); pts.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]); } };
            const x0 = i * s, y0 = j * s;
            cr(a, b, x0, y0, x0 + s, y0); cr(b, cc, x0 + s, y0, x0 + s, y0 + s); cr(d, cc, x0, y0 + s, x0 + s, y0 + s); cr(a, d, x0, y0, x0, y0 + s);
            if (pts.length >= 2) { ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); if (pts.length === 4) { ctx.moveTo(pts[2][0], pts[2][1]); ctx.lineTo(pts[3][0], pts[3][1]); } }
          }
          ctx.stroke();
        }
        ctx.setLineDash([]); ctx.globalAlpha = 1;
      }
      if (lines && ch.length) {
        ctx.lineWidth = 1.4; ctx.strokeStyle = P.g; ctx.fillStyle = P.g;
        const pos_ = ch.filter(k => k.q > 0), src = pos_.length ? pos_ : ch, dir = pos_.length ? 1 : -1, per = ch.length > 8 ? 6 : 12;
        for (const k of src) {
          const n = per * Math.abs(k.q);
          for (let a = 0; a < n; a++) {
            const th = (a + .5) * 2 * Math.PI / n; let x = k.x + 9 * Math.cos(th), y = k.y + 9 * Math.sin(th), len = 0, nextArrow = 60;
            ctx.beginPath(); ctx.moveTo(x, y);
            for (let st = 0; st < 1200; st++) {
              const [ex, ey] = E(x, y), m = Math.hypot(ex, ey); if (m < 1e-6) break;
              const nx = dir * ex / m, ny = dir * ey / m; x += nx * 3; y += ny * 3; len += 3; ctx.lineTo(x, y);
              if (len > nextArrow) { nextArrow += 130; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - nx * 3, y - ny * 3); ctx.lineTo(x, y); ctx.stroke(); const an = Math.atan2(ny, nx); ctx.beginPath(); ctx.moveTo(x + nx * 4, y + ny * 4); ctx.lineTo(x - 5 * Math.cos(an - .5), y - 5 * Math.sin(an - .5)); ctx.lineTo(x - 5 * Math.cos(an + .5), y - 5 * Math.sin(an + .5)); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(x, y); }
              if (x < -10 || x > W + 10 || y < -10 || y > H + 10) break;
              if (ch.some(o => (o.q * dir < 0 || (!pos_.length && o.q > 0)) && Math.hypot(x - o.x, y - o.y) < 8)) break;
            }
            ctx.stroke();
          }
        }
      }
      for (const k of ch) { ctx.beginPath(); ctx.arc(k.x, k.y, 9 + 2 * Math.abs(k.q), 0, 7); ctx.fillStyle = k.q > 0 ? P.a : P.c; ctx.fill(); ctx.strokeStyle = P.bg; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = P.bg; ctx.font = '700 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(k.q > 0 ? '+' : '−', k.x, k.y + 1); }
      if (mouse) { const [ex, ey] = E(...mouse), m = Math.hypot(ex, ey); ro(right, `En el cursor:<br>|E| = <b>${m.toFixed(2)}</b> u.a.<br>V = <b>${V(...mouse).toFixed(2)}</b> u.a.<br>${ch.length} carga${ch.length === 1 ? '' : 's'} · Q neta = <b>${ch.reduce((s, k) => s + k.q, 0)}</b>`); }
      else ro(right, 'Pasá el cursor por el lienzo para leer E y V.<br>Arrastrá las cargas para moverlas.');
    }
    c.addEventListener('pointerdown', e => {
      const [x, y] = pos(e), hit = ch.findIndex(k => Math.hypot(k.x - x, k.y - y) < 16);
      if (mode === 'del') { if (hit >= 0) ch.splice(hit, 1); draw(); return; }
      if (hit >= 0) { drag = ch[hit]; c.setPointerCapture(e.pointerId); }
      else if (ch.length < 24) { ch.push({ x, y, q: (mode === 'neg' ? -1 : 1) * mag }); draw(); }
    });
    c.addEventListener('pointermove', e => { const [x, y] = pos(e); mouse = [x, y]; if (drag) { drag.x = x; drag.y = y; } draw(); });
    c.addEventListener('pointerup', () => drag = null); c.addEventListener('pointerleave', () => { mouse = null; draw(); });
    bindSegs(right, 'fm', k => mode = k); bindSegs(right, 'fq', k => mag = +k);
    $('#fl', right).onchange = e => { lines = e.target.checked; draw(); }; $('#fe', right).onchange = e => { eq = e.target.checked; draw(); }; $('#fh', right).onchange = e => { heat = e.target.checked; draw(); };
    right.addEventListener('click', e => {
      const b = e.target.closest('[data-p]'); if (!b) return; const p = b.dataset.p;
      if (p === 'dip') ch = [{ x: 260, y: 220, q: 1 }, { x: 460, y: 220, q: -1 }]; if (p === 'eq') ch = [{ x: 260, y: 220, q: 1 }, { x: 460, y: 220, q: 1 }]; if (p === 'clr') ch = [];
      if (p === 'cap') { ch = []; for (let i = 0; i < 9; i++) { ch.push({ x: 160 + i * 50, y: 150, q: 1 }); ch.push({ x: 160 + i * 50, y: 290, q: -1 }); } } draw();
    });
    draw(); return () => { };
  }

  /* =========================================================
     2 · Partícula en E y B
     ========================================================= */
  function simLorentz(box) {
    const { left, right } = layout(box); const { c, ctx, W, H } = mkCanvas(left, 720, 440);
    const S = 20; let q = 1, m = 1, v0 = 5, B = 1, Ex = 0, st, trail = [], raf, t = 0, last = performance.now();
    right.innerHTML = `<div><label>Carga</label>${segs('lq', [['1', 'positiva'], ['-1', 'negativa']], '1')}</div>${slider('lv', 'Velocidad inicial v (→)', 1, 10, .5, 5)}${slider('lb', 'Campo B (⊙ saliente +)', -5, 5, .25, 1)}${slider('le', 'Campo E (↑ +)', -30, 30, .5, 0)}${slider('lm', 'Masa m', .5, 4, .5, 1)}<div class="row"><button class="btn sm" id="lr">Reiniciar</button></div>`;
    const reset = () => { st = [1.5, 11, v0, 0]; trail = []; t = 0; };
    const acc = (vx, vy) => [q * (vy * B) / m, q * (Ex - vx * B) / m];
    const step = dt => { // RK4 sobre (x,y,vx,vy)
      const f = s => { const a = acc(s[2], s[3]); return [s[2], s[3], a[0], a[1]]; };
      const add = (s, k, h) => s.map((v, i) => v + k[i] * h);
      const k1 = f(st), k2 = f(add(st, k1, dt / 2)), k3 = f(add(st, k2, dt / 2)), k4 = f(add(st, k3, dt));
      st = st.map((v, i) => v + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    };
    function info() {
      const vsel = B !== 0 ? Ex / B : NaN, r = B !== 0 ? m * v0 / (Math.abs(q) * Math.abs(B)) : Infinity, T = B !== 0 ? 2 * Math.PI * m / (Math.abs(q) * Math.abs(B)) : Infinity;
      const straight = Math.abs(Ex - v0 * B) < .06 && B !== 0;
      ro(right, `r = m v / |q|B = <b>${isFinite(r) ? r.toFixed(2) : '∞'}</b> u<br>T = 2π m / |q|B = <b>${isFinite(T) ? T.toFixed(2) : '∞'}</b> s<br>Selector: v = E/B = <b>${isFinite(vsel) ? vsel.toFixed(2) : '—'}</b><br>${straight ? '<b style="color:var(--good)">E = vB: trayectoria recta ✓</b>' : Ex !== 0 && B !== 0 ? 'Deriva E×B: v<sub>d</sub> = E/B' : B === 0 ? 'Sin B: parábola (sólo E)' : 'Sólo B: circunferencia'}<br>Energía cinética: <b>${(.5 * m * (st[2] ** 2 + st[3] ** 2)).toFixed(1)}</b> ${Ex === 0 ? '(constante: B no trabaja)' : ''}`);
    }
    function draw() {
      const P = pal(); ctx.clearRect(0, 0, W, H); ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const op = Math.min(.9, Math.abs(B) / 4 + .12); ctx.strokeStyle = P.c; ctx.fillStyle = P.c; ctx.globalAlpha = Math.abs(B) < .01 ? 0 : op; ctx.lineWidth = 1.2;
      for (let x = 40; x < W; x += 60) for (let y = 40; y < H; y += 60) { ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.stroke(); if (B > 0) { ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fill(); } else { ctx.beginPath(); ctx.moveTo(x - 5, y - 5); ctx.lineTo(x + 5, y + 5); ctx.moveTo(x + 5, y - 5); ctx.lineTo(x - 5, y + 5); ctx.stroke(); } }
      ctx.globalAlpha = 1;
      if (Ex !== 0) { ctx.strokeStyle = P.a; ctx.fillStyle = P.a; ctx.lineWidth = 2; for (let x = 70; x < W; x += 120) { const y0 = H / 2 + (Ex > 0 ? 20 : -20), y1 = H / 2 - (Ex > 0 ? 20 : -20) - Math.sign(Ex) * Math.min(40, Math.abs(Ex)); ctx.globalAlpha = .55; arrow(ctx, x, y0 + Math.sign(Ex) * 0, x, H / 2 - Math.sign(Ex) * (20 + Math.min(40, Math.abs(Ex))), 8); } ctx.globalAlpha = 1; }
      ctx.lineWidth = 2.4; ctx.strokeStyle = P.g; ctx.beginPath(); trail.forEach((p, i) => i ? ctx.lineTo(p[0] * S, H - p[1] * S) : ctx.moveTo(p[0] * S, H - p[1] * S)); ctx.stroke();
      ctx.beginPath(); ctx.arc(st[0] * S, H - st[1] * S, 8, 0, 7); ctx.fillStyle = q > 0 ? P.a : P.c; ctx.fill(); ctx.fillStyle = P.bg; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(q > 0 ? '+' : '−', st[0] * S, H - st[1] * S + 1);
      const [ax, ay] = acc(st[2], st[3]); ctx.strokeStyle = P.m; ctx.fillStyle = P.m; ctx.lineWidth = 2; const am = Math.hypot(ax, ay) || 1; arrow(ctx, st[0] * S, H - st[1] * S, st[0] * S + ax / am * 30, H - st[1] * S - ay / am * 30, 7);
      ctx.fillStyle = P.mute; ctx.font = '12px monospace'; ctx.textAlign = 'left'; ctx.fillText('flecha violeta: fuerza total   ⊙ / ⊗: B saliente / entrante   ↑↓: E', 12, 18);
    }
    function loop(now) { const dt = Math.min(.05, (now - last) / 1000) * 1.4; last = now; const n = 8; for (let i = 0; i < n; i++) step(dt / n); t += dt; trail.push([st[0], st[1]]); if (trail.length > 2500) trail.shift();
      if (st[0] < -2 || st[0] > 38 || st[1] < -2 || st[1] > 24 || t > 45) reset(); draw(); info(); raf = requestAnimationFrame(loop); }
    bindSegs(right, 'lq', k => { q = +k; reset(); }); bindSlider(right, 'lv', x => { v0 = x; reset(); }); bindSlider(right, 'lb', x => { B = x; reset(); }); bindSlider(right, 'le', x => { Ex = x; reset(); }); bindSlider(right, 'lm', x => { m = x; reset(); });
    $('#lr', right).onclick = reset; reset(); raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }

  /* =========================================================
     3 · Transitorios RC / RL
     ========================================================= */
  function simTrans(box) {
    const { left, right } = layout(box); const { c, ctx, W, H } = mkCanvas(left, 720, 440);
    let mode = 'rcc', R = 100, C = 100, L = 100, semilog = false, pts = false, prog = 0, raf, last = performance.now(), noisy = [];
    right.innerHTML = `<div><label>Circuito</label>${segs('tm', [['rcc', 'RC carga'], ['rcd', 'RC descarga']], 'rcc')}<div style="height:6px"></div>${segs('tm2', [['rlc', 'RL cierre'], ['rld', 'RL apertura']], '')}</div>
      ${slider('tr', 'R (Ω)', 10, 1000, 10, 100)}${slider('tc', 'C (µF)', 10, 1000, 10, 100)}${slider('tl', 'L (mH)', 10, 1000, 10, 100)}
      <div class="row"><label class="chip"><input type="checkbox" id="tp"> puntos de laboratorio</label><label class="chip"><input type="checkbox" id="ts"> escala semilog</label></div><div class="row"><button class="btn sm" id="tn">Medir de nuevo</button></div>`;
    const tau = () => mode.startsWith('rc') ? R * C * 1e-6 : (L * 1e-3) / R; // s
    const decay = t => Math.exp(-t / tau());
    const prim = t => mode === 'rcc' ? 1 - decay(t) : mode === 'rcd' ? decay(t) : mode === 'rlc' ? 1 - decay(t) : decay(t);
    const lab = () => ({ rcc: ['v_C/ε', '|i|/I₀'], rcd: ['v_C/ε', '|i|/I₀'], rlc: ['i/I₀', 'v_L/ε'], rld: ['i/I₀', '|v_L|/ε'] }[mode]);
    const measure = () => { const T = tau(); noisy = Array.from({ length: 12 }, (_, i) => { const t = (i + 1) * .4 * T, g = Math.sqrt(-2 * Math.log(Math.random() || 1e-9)) * Math.cos(2 * Math.PI * Math.random()); return { t, v: prim(t) * (1 + .03 * g) }; }); };
    const dec = p => (mode === 'rcc' || mode === 'rlc') ? 1 - p.v : p.v;
    function draw() {
      const P = pal(), T = tau(), tmax = 5 * T, m = { l: 56, r: 16, t: 24, b: 40 }, pw = W - m.l - m.r, ph = H - m.t - m.b;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const X = t => m.l + pw * t / tmax, Y = semilog ? (v => m.t + ph * (1 - (Math.log10(Math.max(v, 1e-3)) + 3) / 3)) : (v => m.t + ph * (1 - v));
      ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.fillStyle = P.mute; ctx.font = '11px monospace'; ctx.textAlign = 'right';
      const yt = semilog ? [1e-3, 1e-2, .1, 1] : [0, .25, .5, .75, 1];
      yt.forEach(v => { ctx.beginPath(); ctx.moveTo(m.l, Y(v)); ctx.lineTo(W - m.r, Y(v)); ctx.stroke(); ctx.fillText(semilog ? v : v.toFixed(2), m.l - 6, Y(v) + 4); });
      ctx.textAlign = 'center'; for (let k = 0; k <= 5; k++) { ctx.beginPath(); ctx.moveTo(X(k * T), m.t); ctx.lineTo(X(k * T), H - m.b); ctx.stroke(); ctx.fillText(k + 'τ', X(k * T), H - m.b + 16); }
      ctx.fillText('t  (τ = ' + (T * 1000).toPrecision(3) + ' ms)', m.l + pw / 2, H - 6);
      const N = 200, tcur = tmax * prog;
      const curve = (fn, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); for (let i = 0; i <= N; i++) { const t = tmax * i / N; if (t > tcur) break; const v = fn(t); i ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v)); } ctx.stroke(); };
      if (semilog) curve(decay, P.g, 2.5); else { curve(prim, P.g, 2.6); curve(t => (mode === 'rlc' || mode === 'rld') ? (mode === 'rlc' ? decay(t) : decay(t)) : decay(t), P.a, 2); }
      ctx.setLineDash([4, 4]); ctx.strokeStyle = P.m; ctx.beginPath(); ctx.moveTo(X(T), m.t); ctx.lineTo(X(T), H - m.b); ctx.stroke();
      const lvl = semilog ? Math.exp(-1) : (mode === 'rcc' || mode === 'rlc') ? 1 - Math.exp(-1) : Math.exp(-1); ctx.beginPath(); ctx.moveTo(m.l, Y(lvl)); ctx.lineTo(X(T), Y(lvl)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = P.m; ctx.textAlign = 'left'; ctx.fillText(semilog ? '37 % en t = τ' : (lvl > .5 ? '63 % en t = τ' : '37 % en t = τ'), X(T) + 6, Y(lvl) - 6);
      let est = '';
      if (pts) { ctx.fillStyle = P.y; noisy.forEach(p => { const y = semilog ? dec(p) : p.v; if (y <= 0) return; ctx.beginPath(); ctx.arc(X(p.t), Y(y), 4, 0, 7); ctx.fill(); });
        const use = noisy.filter(p => dec(p) > ((mode === 'rcc' || mode === 'rlc') ? .12 : .02)); if (use.length > 2) { let sx = 0, sy = 0, sxx = 0, sxy = 0; use.forEach(p => { const y = Math.log(dec(p)); sx += p.t; sy += y; sxx += p.t * p.t; sxy += p.t * y; }); const n = use.length, slope = (n * sxy - sx * sy) / (n * sxx - sx * sx); const te = -1 / slope; est = `τ estimado (ln y vs t) = <b>${(te * 1000).toPrecision(3)} ms</b> (${use.length} puntos) · error ${(100 * (te - T) / T).toFixed(1)} %`; } }
      ctx.fillStyle = P.g; ctx.textAlign = 'left'; ctx.fillText('— ' + (semilog ? 'ln de la magnitud que decae' : lab()[0]), m.l + 8, m.t + 12); if (!semilog) { ctx.fillStyle = P.a; ctx.fillText('— ' + lab()[1], m.l + 150, m.t + 12); }
      const info = mode.startsWith('rc') ? `τ = RC = <b>${(T * 1000).toPrecision(3)} ms</b>` : `τ = L/R = <b>${(T * 1000).toPrecision(3)} ms</b>`;
      ro(right, `${info}<br>Valores relativos a ε (tensiones) o a ε/R (corrientes).<br>${est || (pts ? '' : 'Activá “puntos de laboratorio” y la escala semilog: el ajuste de la recta da τ, como en el TPL 7.')}`);
    }
    const loop = now => { prog = Math.min(1, prog + (now - last) / 1800); last = now; draw(); if (prog < 1) raf = requestAnimationFrame(loop); }; const restart = () => { cancelAnimationFrame(raf); prog = 0; last = performance.now(); measure(); raf = requestAnimationFrame(loop); };
    bindSegs(right, 'tm', k => { mode = k; $$('#tm2 button', right).forEach(b => b.classList.remove('on')); $$('#tm button', right).forEach(b => b.classList.toggle('on', b.dataset.k === k)); restart(); });
    bindSegs(right, 'tm2', k => { mode = k; $$('#tm button', right).forEach(b => b.classList.remove('on')); $$('#tm2 button', right).forEach(b => b.classList.toggle('on', b.dataset.k === k)); restart(); });
    bindSlider(right, 'tr', x => { R = x; restart(); }); bindSlider(right, 'tc', x => { C = x; restart(); }); bindSlider(right, 'tl', x => { L = x; restart(); });
    $('#tp', right).onchange = e => { pts = e.target.checked; draw(); }; $('#ts', right).onchange = e => { semilog = e.target.checked; draw(); }; $('#tn', right).onclick = restart;
    restart(); return () => cancelAnimationFrame(raf);
  }

  /* =========================================================
     4 · Alternador (Faraday)
     ========================================================= */
  function simAlt(box) {
    const { left, right } = layout(box); const { c, ctx, W, H } = mkCanvas(left, 720, 440);
    let w = 6, N = 50, B = .3, A = 100, th = 0, raf, last = performance.now(), hist = [];
    right.innerHTML = `${slider('aw', 'Velocidad angular ω (rad/s)', 1, 20, .5, 6)}${slider('an', 'Espiras N', 1, 200, 1, 50)}${slider('ab', 'Campo B (T)', .05, 1, .05, .3)}${slider('aa', 'Área A (cm²)', 10, 500, 10, 100)}`;
    function draw() {
      const P = pal(); ctx.clearRect(0, 0, W, H); ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const cx = 170, cy = 220;
      ctx.strokeStyle = P.c; ctx.fillStyle = P.c; ctx.lineWidth = 1.5; ctx.globalAlpha = .6; for (let y = 60; y <= 380; y += 40) arrow(ctx, 30, y, 310, y, 8); ctx.globalAlpha = 1;
      ctx.fillStyle = P.c; ctx.font = '13px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('B →', 30, 44);
      const Lh = 90, dx = Lh * Math.sin(th), dy = -Lh * Math.cos(th); // espira vista de canto: su normal n forma ángulo th con B (eje x)
      ctx.strokeStyle = P.a; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - dx, cy - dy); ctx.lineTo(cx + dx, cy + dy); ctx.stroke(); ctx.lineWidth = 2;
      ctx.fillStyle = P.g; ctx.strokeStyle = P.g; arrow(ctx, cx, cy, cx + 60 * Math.cos(th), cy + 60 * Math.sin(th), 8); ctx.fillText('n', cx + 66 * Math.cos(th), cy + 66 * Math.sin(th));
      ctx.strokeStyle = P.mute; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, th); ctx.stroke(); ctx.fillStyle = P.mute; ctx.fillText('θ = ' + ((th * 180 / Math.PI) % 360).toFixed(0) + '°', cx - 20, cy + 128);
      ctx.fillStyle = P.mute; ctx.fillText('vista superior de la espira', 30, 420);
      // gráfico
      const m = { l: 350, r: 16, t: 28, b: 36 }, pw = W - m.l - m.r, ph = H - m.t - m.b, T = 2 * Math.PI / w, emax = N * (A * 1e-4) * B * w, phi0 = N * (A * 1e-4) * B;
      ctx.strokeStyle = P.line; ctx.beginPath(); ctx.moveTo(m.l, m.t + ph / 2); ctx.lineTo(W - m.r, m.t + ph / 2); ctx.stroke(); ctx.strokeRect(m.l, m.t, pw, ph);
      const tw = 2 * T, X = t => m.l + pw * (t / tw), now = th / w, ref = now - (now % T); // ventana móvil de dos períodos
      const curve = (fn, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); for (let i = 0; i <= 200; i++) { const t = tw * i / 200; i ? ctx.lineTo(X(t), m.t + ph / 2 - fn(t + ref) * ph / 2.2) : ctx.moveTo(X(t), m.t + ph / 2 - fn(t + ref) * ph / 2.2); } ctx.stroke(); };
      curve(t => Math.cos(w * t), P.g); curve(t => Math.sin(w * t), P.a);
      ctx.fillStyle = P.mute; ctx.font = '11px monospace'; ctx.textAlign = 'left'; ctx.fillText('Φ(t) = Φ₀ cos ωt', m.l + 6, m.t + 14); ctx.fillStyle = P.a; ctx.fillText('ε(t) = −dΦ/dt = Φ₀ω sen ωt', m.l + 6, m.t + 28);
      const cxp = X(now - ref); ctx.setLineDash([4, 4]); ctx.strokeStyle = P.ink; ctx.beginPath(); ctx.moveTo(cxp, m.t); ctx.lineTo(cxp, m.t + ph); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = P.g; ctx.beginPath(); ctx.arc(cxp, m.t + ph / 2 - Math.cos(th) * ph / 2.2, 5, 0, 7); ctx.fill(); ctx.fillStyle = P.a; ctx.beginPath(); ctx.arc(cxp, m.t + ph / 2 - Math.sin(th) * ph / 2.2, 5, 0, 7); ctx.fill();
      ro(right, `Φ₀ = N·B·A = <b>${phi0.toFixed(3)}</b> Wb<br>ε<sub>máx</sub> = NABω = <b>${emax.toFixed(2)}</b> V<br>ε<sub>ef</sub> = ε<sub>máx</sub>/√2 = <b>${(emax / Math.SQRT2).toFixed(2)}</b> V<br>f = ω/2π = <b>${(w / 2 / Math.PI).toFixed(2)}</b> Hz<br>ε = 0 cuando Φ es máximo; ε es máxima cuando Φ cruza por cero.`);
    }
    const loop = now => { th += w * Math.min(.05, (now - last) / 1000) * .6; last = now; draw(); raf = requestAnimationFrame(loop); };
    bindSlider(right, 'aw', x => w = x); bindSlider(right, 'an', x => N = x); bindSlider(right, 'ab', x => B = x); bindSlider(right, 'aa', x => A = x); raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }

  /* =========================================================
     5 · RLC serie: fasores y resonancia
     ========================================================= */
  function simRLC(box) {
    const { left, right } = layout(box); const { c, ctx, W, H } = mkCanvas(left, 720, 440);
    let R = 20, L = 10, C = 10, fi = 50, spin = false, ang = 0, raf, last = performance.now(); const V0 = 10;
    const fOf = i => 10 * Math.pow(500, i / 100);
    right.innerHTML = `${slider('rr', 'R (Ω)', 1, 200, 1, 20)}${slider('rl', 'L (mH)', 1, 100, 1, 10)}${slider('rc', 'C (µF)', 1, 100, 1, 10)}${slider('rf', 'Frecuencia f', 0, 100, 1, 50, i => fOf(i).toFixed(0) + ' Hz')}<div class="row"><label class="chip"><input type="checkbox" id="rs"> girar fasores</label><button class="btn sm ghost" id="rres">Ir a resonancia</button></div>`;
    const calc = f => { const w = 2 * Math.PI * f, XL = w * L * 1e-3, XC = 1 / (w * C * 1e-6), X = XL - XC, Z = Math.hypot(R, X); return { w, XL, XC, X, Z, phi: Math.atan2(X, R), I: V0 / Z }; };
    function draw() {
      const P = pal(), f = fOf(fi), k = calc(f), f0 = 1 / (2 * Math.PI * Math.sqrt(L * 1e-3 * C * 1e-6)), Qf = (2 * Math.PI * f0 * L * 1e-3) / R;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      // fasores (corriente como referencia → horizontal)
      const ox = 70, oy = 230, VR = R * k.I, VL = k.XL * k.I, VC = k.XC * k.I, mx = Math.max(V0, VR, VL, VC), sc = 180 / mx;
      ctx.save(); ctx.translate(ox, oy); if (spin) ctx.rotate(-ang); ctx.lineWidth = 2.6;
      const col = (c0, a, b, c2, d) => { ctx.strokeStyle = c0; ctx.fillStyle = c0; arrow(ctx, a, b, c2, d, 9); };
      col(P.ink, 0, 0, 40 * 1.2, 0); ctx.fillStyle = P.ink; ctx.font = '12px sans-serif'; ctx.fillText('I', 52, 14);
      col(P.g, 0, 0, VR * sc, 0); col(P.a, VR * sc, 0, VR * sc, -VL * sc); col(P.c, VR * sc, -VL * sc, VR * sc, -(VL - VC) * sc); col(P.m, 0, 0, VR * sc, -(VL - VC) * sc);
      ctx.restore();
      ctx.font = '12px sans-serif'; ctx.fillStyle = P.g; ctx.fillText('V_R', 4, 40); ctx.fillStyle = P.a; ctx.fillText('V_L (+90°)', 4, 58); ctx.fillStyle = P.c; ctx.fillText('V_C (−90°)', 4, 76); ctx.fillStyle = P.m; ctx.fillText('V fuente', 4, 94);
      ctx.fillStyle = P.mute; ctx.font = '11px monospace'; ctx.fillText('diagrama fasorial (I de referencia)', 4, H - 12);
      // curva de resonancia
      const m = { l: 330, r: 16, t: 30, b: 44 }, pw = W - m.l - m.r, ph = H - m.t - m.b, X = i => m.l + pw * i / 100, Imax = V0 / R * 1.08, Y = I => m.t + ph * (1 - I / Imax);
      ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.strokeRect(m.l, m.t, pw, ph);
      ctx.strokeStyle = P.g; ctx.lineWidth = 2.6; ctx.beginPath(); for (let i = 0; i <= 100; i += .5) { const I = V0 / calc(fOf(i)).Z; i ? ctx.lineTo(X(i), Y(I)) : ctx.moveTo(X(i), Y(I)); } ctx.stroke();
      const i0 = 100 * Math.log(f0 / 10) / Math.log(500); if (i0 >= 0 && i0 <= 100) { ctx.setLineDash([4, 4]); ctx.strokeStyle = P.a; ctx.beginPath(); ctx.moveTo(X(i0), m.t); ctx.lineTo(X(i0), m.t + ph); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = P.a; ctx.font = '11px monospace'; ctx.fillText('f₀', X(i0) + 4, m.t + 12); }
      ctx.fillStyle = P.m; ctx.beginPath(); ctx.arc(X(fi), Y(k.I), 6, 0, 7); ctx.fill();
      ctx.fillStyle = P.mute; ctx.font = '11px monospace'; ctx.textAlign = 'center'; [10, 100, 1000, 5000].forEach(ff => { const i = 100 * Math.log(ff / 10) / Math.log(500); ctx.fillText(ff + ' Hz', X(i), H - m.b + 16); }); ctx.fillText('I(f) con V = 10 V', m.l + pw / 2, m.t - 10); ctx.textAlign = 'left';
      const tipo = Math.abs(k.X) < .02 * k.Z ? 'resistivo (resonancia)' : k.X > 0 ? 'inductivo (i atrasa)' : 'capacitivo (i adelanta)';
      ro(right, `f₀ = 1/(2π√LC) = <b>${f0.toFixed(0)}</b> Hz · Q = <b>${Qf.toFixed(2)}</b><br>X<sub>L</sub> = <b>${k.XL.toFixed(1)}</b> Ω · X<sub>C</sub> = <b>${k.XC.toFixed(1)}</b> Ω<br>|Z| = <b>${k.Z.toFixed(1)}</b> Ω · φ = <b>${(k.phi * 180 / Math.PI).toFixed(1)}°</b><br>Carácter: <b>${tipo}</b><br>I<sub>m</sub> = <b>${(k.I * 1000).toFixed(0)}</b> mA · cos φ = <b>${Math.cos(k.phi).toFixed(2)}</b><br>P = ½ I<sub>m</sub>²R = <b>${(.5 * k.I * k.I * R).toFixed(2)}</b> W`);
    }
    const loop = now => { if (spin) ang += (now - last) / 1000 * 1.2; last = now; draw(); raf = requestAnimationFrame(loop); };
    bindSlider(right, 'rr', x => R = x); bindSlider(right, 'rl', x => L = x); bindSlider(right, 'rc', x => C = x); bindSlider(right, 'rf', x => fi = x, i => fOf(i).toFixed(0) + ' Hz');
    $('#rs', right).onchange = e => spin = e.target.checked;
    $('#rres', right).onclick = () => { const f0 = 1 / (2 * Math.PI * Math.sqrt(L * 1e-3 * C * 1e-6)); fi = clamp(100 * Math.log(f0 / 10) / Math.log(500), 0, 100); const s = $('#rf', right); s.value = fi; $('#rfv', right).textContent = fOf(fi).toFixed(0) + ' Hz'; };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }

  /* =========================================================
     6 · Lente delgada
     ========================================================= */
  function simLens(box) {
    const { left, right } = layout(box); const { c, ctx, pos, W, H } = mkCanvas(left, 720, 440);
    let conv = true, f = 100, s = 180, h = 50, drag = false; const X0 = 360, Y0 = 220;
    right.innerHTML = `<div>${segs('ln', [['1', 'Convergente'], ['0', 'Divergente']], '1')}</div>${slider('lf', 'Distancia focal |f| (cm)', 4, 16, .5, 10)}${slider('ls', 'Distancia al objeto s (cm)', 2, 34, .5, 18)}${slider('lh', 'Altura del objeto (cm)', 2, 8, .5, 5)}<p class="small mute">También podés arrastrar el objeto con el mouse o el dedo.</p>`;
    function draw() {
      const P = pal(), F = conv ? f : -f; ctx.clearRect(0, 0, W, H); ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, Y0); ctx.lineTo(W, Y0); ctx.stroke();
      // lente
      ctx.strokeStyle = P.c; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(X0, Y0 - 150); ctx.lineTo(X0, Y0 + 150); ctx.stroke();
      ctx.fillStyle = P.c; const tip = conv ? 1 : -1; [-1, 1].forEach(sg => { const y = Y0 + sg * 150; ctx.beginPath(); ctx.moveTo(X0, y); ctx.lineTo(X0 - 9, y - sg * 12 * tip); ctx.lineTo(X0 + 9, y - sg * 12 * tip); ctx.closePath(); ctx.fill(); });
      ctx.fillStyle = P.mute; ctx.font = '11px monospace'; ctx.textAlign = 'center';
      [[-f, 'F'], [f, "F'"], [-2 * f, '2F'], [2 * f, "2F'"]].forEach(([d, l]) => { ctx.beginPath(); ctx.arc(X0 + d, Y0, 3, 0, 7); ctx.fill(); ctx.fillText(l, X0 + d, Y0 + 16); });
      const hh = h, so = s;
      // imagen
      let sp = Infinity, inf = Math.abs(so - F) < .5;
      if (!inf) sp = so * F / (so - F);
      const hi = inf ? 0 : -hh * sp / so; // altura (arriba +)
      // objeto
      ctx.lineWidth = 3; ctx.strokeStyle = P.a; ctx.fillStyle = P.a; arrow(ctx, X0 - so, Y0, X0 - so, Y0 - hh, 9);
      ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('objeto', X0 - so - 22, Y0 - hh - 10);
      if (!inf) {
        // rayos
        const Tx = X0 - so, Ty = Y0 - hh, Ix = X0 + sp, Iy = Y0 - hi;
        const ray = (y3, col, mid) => { // rayo desde la punta, golpea la lente en y3 (px, hacia arriba +), sale hacia la imagen
          ctx.strokeStyle = col; ctx.lineWidth = 1.7; ctx.beginPath(); ctx.moveTo(Tx, Ty); ctx.lineTo(X0, Y0 - y3); ctx.stroke();
          let dx = Ix - X0, dy = Iy - (Y0 - y3); if (sp < 0) { dx = -dx; dy = -dy; } const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n; const k = (W - X0) / Math.max(dx, .01);
          ctx.beginPath(); ctx.moveTo(X0, Y0 - y3); ctx.lineTo(Math.min(W, X0 + dx * k), Y0 - y3 + dy * k); ctx.stroke();
          if (sp < 0) { ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X0, Y0 - y3); ctx.lineTo(Ix, Iy); ctx.stroke(); ctx.setLineDash([]); }
        };
        ray(hh, P.g); // paralelo al eje
        const y3 = -hh * F / (so - F); ray(y3, P.c); // pasa por el foco
        // rayo por el centro
        ctx.strokeStyle = P.m; ctx.lineWidth = 1.7; ctx.beginPath(); ctx.moveTo(Tx, Ty); const kx = (W - Tx) / (X0 - Tx), ey = Ty + (Y0 - Ty) * kx; ctx.lineTo(W, ey); ctx.stroke();
        if (sp < 0) { ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(Ix, Iy); ctx.stroke(); ctx.setLineDash([]); }
        ctx.strokeStyle = P.y; ctx.fillStyle = P.y; ctx.lineWidth = 3; if (sp < 0) ctx.setLineDash([6, 4]); arrow(ctx, Ix, Y0, Ix, Iy, 9); ctx.setLineDash([]); ctx.font = '12px sans-serif'; ctx.fillText('imagen', Ix - 20, Y0 + (hi > 0 ? 20 : -hi + 20));
      }
      const real = sp > 0, mm = inf ? NaN : -sp / so;
      ro(right, inf ? 'El objeto está en el foco: <b>los rayos salen paralelos</b>, la imagen se forma en el infinito.' : `1/s + 1/s′ = 1/f → s′ = <b>${(sp / 10).toFixed(1)}</b> cm<br>Aumento m = −s′/s = <b>${mm.toFixed(2)}</b><br>Imagen: <b>${real ? 'real' : 'virtual'}</b>, <b>${mm < 0 ? 'invertida' : 'derecha'}</b>, <b>${Math.abs(mm) > 1 ? 'aumentada' : Math.abs(mm) < 1 ? 'reducida' : 'igual tamaño'}</b><br>f = <b>${(F / 10).toFixed(1)}</b> cm (${conv ? 'f > 0' : 'f < 0'})<br><span style="color:var(--trace)">verde</span>: paralelo → foco · <span style="color:var(--trace3)">celeste</span>: por el foco → paralelo · <span style="color:var(--trace4)">violeta</span>: por el centro`);
    }
    c.addEventListener('pointerdown', e => { const [x] = pos(e); if (Math.abs(x - (X0 - s)) < 40) { drag = true; c.setPointerCapture(e.pointerId); } });
    c.addEventListener('pointermove', e => { if (!drag) return; const [x] = pos(e); s = clamp(X0 - x, 20, 340); const el = $('#ls', right); el.value = s / 10; $('#lsv', right).textContent = (s / 10).toFixed(1); draw(); });
    c.addEventListener('pointerup', () => drag = false);
    bindSegs(right, 'ln', k => { conv = k === '1'; draw(); }); bindSlider(right, 'lf', x => { f = x * 10; draw(); }); bindSlider(right, 'ls', x => { s = x * 10; draw(); }); bindSlider(right, 'lh', x => { h = x * 10; draw(); });
    draw(); return () => { };
  }

  /* =========================================================
     7 · Young y difracción
     ========================================================= */
  function simYoung(box) {
    const { left, right } = layout(box); const { c, ctx, W, H } = mkCanvas(left, 720, 440);
    let lam = 600, d = .25, a = .06, N = 2; const Lm = 1, YR = 25; // y en mm, L en m
    right.innerHTML = `${slider('yl', 'Longitud de onda λ (nm)', 400, 700, 5, 600)}${slider('yd', 'Separación entre rendijas d (mm)', .1, .6, .01, .25)}${slider('ya', 'Ancho de rendija a (mm)', .02, .15, .01, .06)}<div><label>Número de rendijas</label>${segs('yn', [['1', '1'], ['2', '2'], ['3', '3'], ['5', '5'], ['10', '10']], '2')}</div>`;
    function I(y) { const th = y * 1e-3 / Lm, lm = lam * 1e-9, be = Math.PI * a * 1e-3 * th / lm, ga = Math.PI * d * 1e-3 * th / lm; const env = be === 0 ? 1 : Math.pow(Math.sin(be) / be, 2); let itf = 1; if (N > 1) { const s = Math.sin(ga); itf = Math.abs(s) < 1e-9 ? 1 : Math.pow(Math.sin(N * ga) / (N * s), 2); } return { env, v: env * itf }; }
    function draw() {
      const P = pal(), rgb = wl2rgb(lam), col = `rgb(${rgb})`; ctx.clearRect(0, 0, W, H); ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const m = { l: 56, r: 16, t: 26, b: 130 }, pw = W - m.l - m.r, ph = H - m.t - m.b, X = y => m.l + pw * (y + YR) / (2 * YR), Y = v => m.t + ph * (1 - v);
      ctx.strokeStyle = P.line; ctx.lineWidth = 1; ctx.strokeRect(m.l, m.t, pw, ph); ctx.fillStyle = P.mute; ctx.font = '11px monospace'; ctx.textAlign = 'center';
      for (let y = -20; y <= 20; y += 10) { ctx.beginPath(); ctx.moveTo(X(y), m.t); ctx.lineTo(X(y), m.t + ph); ctx.stroke(); ctx.fillText(y + ' mm', X(y), m.t + ph + 14); }
      ctx.textAlign = 'right'; ctx.fillText('I/I₀', m.l - 6, m.t + 10);
      ctx.setLineDash([5, 4]); ctx.strokeStyle = P.a; ctx.beginPath(); for (let i = 0; i <= 400; i++) { const y = -YR + 2 * YR * i / 400, v = I(y).env; i ? ctx.lineTo(X(y), Y(v)) : ctx.moveTo(X(y), Y(v)); } ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); for (let i = 0; i <= 900; i++) { const y = -YR + 2 * YR * i / 900, v = I(y).v; i ? ctx.lineTo(X(y), Y(v)) : ctx.moveTo(X(y), Y(v)); } ctx.stroke();
      // franjas
      const sy = H - 100, sh = 70; ctx.fillStyle = '#000'; ctx.fillRect(m.l, sy, pw, sh);
      for (let px = 0; px < pw; px++) { const y = -YR + 2 * YR * px / pw, v = Math.pow(I(y).v, .55); ctx.fillStyle = `rgb(${rgb.map(k => Math.round(k * v))})`; ctx.fillRect(m.l + px, sy, 1.2, sh); }
      ctx.fillStyle = P.mute; ctx.textAlign = 'left'; ctx.fillText('— envolvente de difracción (rendija simple)', m.l + 8, m.t + 14);
      const dy = lam * 1e-9 * Lm / (d * 1e-3) * 1e3, y1 = lam * 1e-9 * Lm / (a * 1e-3) * 1e3, miss = N > 1 ? d / a : null;
      ro(right, `Pantalla a L = 1 m<br>${N > 1 ? `Separación entre franjas Δy = λL/d = <b>${dy.toFixed(2)}</b> mm<br>` : ''}1.er mínimo de difracción: y = λL/a = <b>${y1.toFixed(1)}</b> mm<br>${N > 1 ? `Franjas en el máximo central ≈ <b>${Math.max(1, Math.round(2 * d / a - 1))}</b><br>${Math.abs(miss - Math.round(miss)) < .03 ? `<b style="color:var(--warn)">d/a = ${Math.round(miss)}: faltan los órdenes m = ±${Math.round(miss)}, ±${2 * Math.round(miss)}…</b>` : ''}` : 'Una sola rendija: sólo difracción.'}<br>${N > 2 ? `Con N = ${N} hay ${N - 2} máximos secundarios entre principales y los picos se afinan (poder de resolución).` : ''}`);
    }
    bindSlider(right, 'yl', x => { lam = x; draw(); }); bindSlider(right, 'yd', x => { d = x; draw(); }); bindSlider(right, 'ya', x => { a = x; draw(); }); bindSegs(right, 'yn', k => { N = +k; draw(); });
    draw(); return () => { };
  }

  /* ---------- registro ---------- */
  const G = {
    field: '<svg viewBox="0 0 160 78"><circle cx="50" cy="39" r="7" fill="var(--pos)"/><circle cx="110" cy="39" r="7" fill="var(--neg)"/><g fill="none" stroke="var(--trace)" stroke-width="1.3"><path d="M57 36C75 18 90 18 103 36"/><path d="M57 42C75 60 90 60 103 42"/><path d="M57 39H103"/><path d="M45 32C35 10 10 20 6 30"/><path d="M115 32C130 10 150 20 154 30"/></g></svg>',
    lorentz: '<svg viewBox="0 0 160 78"><g fill="none" stroke="var(--trace3)" opacity=".5"><circle cx="30" cy="20" r="5"/><circle cx="80" cy="20" r="5"/><circle cx="130" cy="20" r="5"/><circle cx="30" cy="60" r="5"/><circle cx="80" cy="60" r="5"/><circle cx="130" cy="60" r="5"/></g><path d="M8 62C20 62 40 56 50 36S85 6 108 22 126 56 100 50" fill="none" stroke="var(--trace)" stroke-width="2"/></svg>',
    trans: '<svg viewBox="0 0 160 78"><path d="M10 68C40 68 60 20 150 14" fill="none" stroke="var(--trace)" stroke-width="2"/><path d="M10 14C40 14 60 62 150 68" fill="none" stroke="var(--trace2)" stroke-width="2"/><path d="M10 74H150M10 6V74" stroke="var(--line)"/></svg>',
    alt: '<svg viewBox="0 0 160 78"><path d="M8 39C25 -5 45 -5 62 39S98 83 115 39 140 -5 152 20" fill="none" stroke="var(--trace)" stroke-width="2"/><path d="M8 20C25 60 45 60 62 20S98 -20 115 20" fill="none" stroke="var(--trace2)" stroke-width="2" opacity=".8"/></svg>',
    rlc: '<svg viewBox="0 0 160 78"><path d="M14 66H70" stroke="var(--trace)" stroke-width="2.5"/><path d="M70 66V16" stroke="var(--trace2)" stroke-width="2.5"/><path d="M70 66L70 40" stroke="var(--trace3)" stroke-width="2.5"/><path d="M14 66L70 40" stroke="var(--trace4)" stroke-width="2.5"/><path d="M92 72C100 72 104 8 120 8S140 72 150 72" fill="none" stroke="var(--trace)" stroke-width="2"/></svg>',
    lens: '<svg viewBox="0 0 160 78"><path d="M80 6V72" stroke="var(--trace3)" stroke-width="2.5"/><path d="M8 39H152" stroke="var(--line)"/><path d="M30 39V22M30 22L28 27M30 22L32 27" stroke="var(--trace2)" stroke-width="2" fill="none"/><path d="M30 22H80L128 56" stroke="var(--trace)" fill="none" stroke-width="1.5"/><path d="M30 22L128 56" stroke="var(--trace4)" fill="none" stroke-width="1.5"/></svg>',
    young: '<svg viewBox="0 0 160 78"><path d="M6 70C14 70 14 10 22 10S30 70 38 70 46 30 54 30 62 70 70 70 78 40 86 40 94 70 102 70 110 56 118 56 126 70 134 70 142 66 154 66" fill="none" stroke="var(--trace2)" stroke-width="2"/></svg>'
  };
  F2.sims.push(
    { id: 'campo', title: 'Campo y equipotenciales', units: [1, 2], glyph: G.field, mount: simField, desc: 'Colocá cargas, arrastralas y mirá cómo se ven el campo (líneas) y el potencial (mapa y curvas de nivel) a la vez.',
      predict: 'Antes de tocar: ¿cómo creés que son las equipotenciales de un dipolo? ¿Y dónde vale V = 0?', retos: ['Armá un dipolo y ubicá la equipotencial V = 0. ¿Es una recta o una curva? Relacionalo con $V=kp\\cos\\theta/r^2$.', 'Poné dos cargas iguales: en el punto medio $E=0$ pero $V\\neq0$. Verificalo con el cursor.', 'Con “Condensador”, ¿dónde es uniforme el campo y dónde no? ¿Qué pasa en los bordes?'] },
    { id: 'lorentz', title: 'Partícula en E y B', units: [7], glyph: G.lorentz, mount: simLorentz, desc: 'Una carga con velocidad inicial en campos eléctrico y magnético cruzados: circunferencias, hélices planas, selector de velocidad y deriva E×B.',
      predict: 'Si duplico la velocidad, ¿qué le pasa al radio? ¿Y al período?', retos: ['Con E = 0, comprobá que el período no cambia al variar v, pero sí con B y con m.', 'Encontrá E tal que la trayectoria sea recta (selector de velocidad). ¿Depende del signo de la carga?', 'Fijá E ≠ 0 y B ≠ 0: la partícula deriva. ¿Con qué velocidad media?'] },
    { id: 'transitorios', title: 'Transitorios RC y RL', units: [5, 8], glyph: G.trans, mount: simTrans, desc: 'Carga y descarga del capacitor y cierre y apertura del inductor. Activá los puntos de laboratorio con ruido y estimá τ ajustando una recta en escala semilog, como en el TPL 7.',
      predict: 'Si duplico R en un RC, ¿qué le pasa a τ y a la corriente inicial?', retos: ['Medí τ con puntos de laboratorio + semilog. ¿Qué error tiene respecto del valor teórico?', 'Compará RC y RL: ¿qué magnitud es continua en t = 0 en cada uno (v_C, i_L)?', 'Hacé que τ valga exactamente 20 ms con valores razonables de R y C.'] },
    { id: 'alternador', title: 'Alternador (Faraday)', units: [8, 10], glyph: G.alt, mount: simAlt, desc: 'Una espira rotante en un campo uniforme: el flujo es un coseno, la fem es su derivada. Es el origen de la corriente alterna.',
      predict: '¿En qué posición de la espira la fem inducida es máxima: cuando el flujo es máximo o cuando es cero?', retos: ['Duplicá ω: ¿cómo cambian ε_máx y la frecuencia?', 'Calculá el valor eficaz para N = 100, B = 0,5 T, A = 200 cm², ω = 10 rad/s y verificalo.', 'Explicá con Lenz por qué ε y Φ están desfasadas 90°.'] },
    { id: 'rlc', title: 'RLC serie: fasores y resonancia', units: [10], glyph: G.rlc, mount: simRLC, desc: 'Diagrama fasorial y curva de resonancia al mismo tiempo. Cambiá R, L, C y la frecuencia y mirá la fase y la impedancia.',
      predict: 'Si aumento R manteniendo L y C, ¿cambia la frecuencia de resonancia? ¿Y el pico de corriente?', retos: ['Llevá el circuito a resonancia y verificá que V_L y V_C son iguales y opuestas.', 'Por debajo de f₀, ¿el circuito es inductivo o capacitivo? ¿Por qué?', 'Buscá un caso donde V_L y V_C sean mayores que la tensión de la fuente.'] },
    { id: 'lente', title: 'Lente delgada', units: [12], glyph: G.lens, mount: simLens, desc: 'Objeto, rayos principales e imagen. Arrastrá el objeto a través del foco y observá cómo la imagen pasa de real a virtual.',
      predict: '¿Dónde tenés que poner el objeto para que la imagen sea del mismo tamaño? ¿Y para que sea virtual?', retos: ['Ubicá el objeto en 2f y comprobá que la imagen queda en 2f′ con m = −1.', 'Pasá el objeto de s > f a s < f: ¿qué ocurre con la imagen?', 'Con la lente divergente, ¿puede formarse una imagen real?'] },
    { id: 'young', title: 'Young y difracción', units: [12], glyph: G.young, mount: simYoung, desc: 'Interferencia de N rendijas con anchura finita: franjas de interferencia moduladas por la envolvente de difracción.',
      predict: 'Si aumento la separación d entre rendijas, ¿las franjas se separan o se juntan?', retos: ['Medí el espaciado de franjas y comprobá Δy = λL/d. ¿Qué pasa si cambiás a luz azul?', 'Hacé d = 2a: ¿qué órdenes faltan? ¿Por qué?', 'Aumentá N de 2 a 10: ¿qué pasa con el ancho de los picos principales?'] }
  );

  /* ---------- rutas del laboratorio ---------- */
  route('/lab', 'lab', (p, app) => {
    app.innerHTML = `<header class="pagehead"><div class="eyebrow">Laboratorio</div><h1>Experimentá <em>antes</em> de demostrar</h1><p>Siete simuladores para ver en vivo lo que dicen las fórmulas. La idea: primero <strong>adiviná</strong> qué va a pasar, después movelo y explicá en voz alta por qué dio distinto (o igual). Es justo lo que mira la rúbrica (CG4: “verifica que la solución coincide con las predicciones”).</p></header>
    <div class="grid g3" style="margin-top:40px;row-gap:44px">${F2.sims.map(s => `<a class="card simcard" href="#/lab/${s.id}"><div class="glyph">${s.glyph}</div><div class="eyebrow">Simulador ${F2.sims.indexOf(s) + 1}</div><h3>${s.title}</h3><div class="row">${s.units.map(u => `<span class="chip" style="color:${unitColor(u)}">U. ${U(u).rom}</span>`).join('')}</div><p class="small mute" style="margin:0">${s.desc}</p></a>`).join('')}</div>`;
  });
  route('/lab/:id', 'lab', ({ id }, app) => {
    const s = F2.sims.find(x => x.id === id); if (!s) { location.hash = '#/lab'; return; }
    const i = F2.sims.indexOf(s), nx = F2.sims[(i + 1) % F2.sims.length];
    app.innerHTML = `<div class="row"><a class="chip" href="#/lab">← Laboratorio</a>${s.units.map(u => `<a class="chip" style="color:${unitColor(u)}" href="#/unidad/${u}">U. ${U(u).rom} · ${esc(U(u).short)}</a>`).join('')}</div>
    <h1 style="margin-top:10px">${s.title}</h1><p class="mute" style="max-width:68ch">${s.desc}</p>
    <div class="callout good" style="margin-bottom:16px"><b>Predecí</b><br>${s.predict}</div><div class="simbox" id="sb"></div>
    <div class="sectionhead"><h2>Retos</h2></div><div class="card"><ol style="margin:0;padding-left:1.3em">${s.retos.map(r => `<li style="margin:.4em 0">${r}</li>`).join('')}</ol></div>
    <div class="row" style="margin-top:20px"><span class="sp"></span><a class="btn ghost" href="#/lab/${nx.id}">${nx.title} →</a></div>`;
    const stop = s.mount($('#sb', app)); onLeave(() => stop && stop());
  });
})();
