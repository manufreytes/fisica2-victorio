/* Vistas: inicio (constelación), unidades, detalle de unidad, progreso */

const TPL = [
  { n: 1, t: 'Electrostática', u: [1, 3], q: '¿Cómo cargaste por frotamiento, por inducción y por conducción, y qué mostró la jaula de Faraday sobre el campo dentro de un conductor?' },
  { n: 2, t: 'Capacitores (simulador)', u: [3], q: '¿Cómo cambia C al variar el área y la separación de las placas, y cómo se reparte la carga Q?' },
  { n: 3, t: 'Ley de Ohm', u: [4], q: '¿Cómo obtuviste R de la tabla V–I (pendiente), y con qué incertidumbre?' },
  { n: 4, t: 'Reglas de Kirchhoff', u: [5], q: 'Con tus mediciones, ¿cuánto dio ΣI en un nudo y ΣV en las mallas? ¿A qué atribuís la diferencia?' },
  { n: 5, t: 'Puente de Wheatstone', u: [5], q: '¿Por qué en el equilibrio no importa la fem ni la resistencia del galvanómetro?' },
  { n: 6, t: 'Circuito potenciométrico (simulador)', u: [4, 5], q: '¿Por qué el potenciómetro mide la fem sin extraer corriente en el equilibrio?' },
  { n: 7, t: 'Circuito RC', u: [5], q: '¿Cómo estimaste τ de las gráficas de V(t) e I(t) y lo comparaste con RC nominal? ¿Cómo calculaste Q(t)?' },
  { n: 8, t: 'Ley de Faraday–Lenz', u: [8], q: '¿Qué observaste al acercar y alejar el imán y cómo lo explica Lenz?' },
  { n: 9, t: 'Galvanómetro de tangentes', u: [6], q: '¿Qué verifica este TPL sobre el campo de una bobina (N e I) y cómo se usa la brújula?' },
  { n: 10, t: 'Reflexión y refracción', u: [12], q: '¿Cómo obtuviste n y el ángulo crítico, y cómo expresás el resultado con su incertidumbre?' },
  { n: 11, t: 'Interferencia y difracción', u: [12], q: '¿Cómo determinaste λ del láser con rendija simple, doble y red? ¿Qué patrón esperabas?' }
];

/* ---------- constelación ---------- */
let constelDrawn = false;
const POS = { 1: [95, 175], 2: [235, 80], 3: [235, 265], 4: [385, 175], 5: [385, 360], 6: [545, 95], 7: [545, 255], 8: [545, 420], 9: [705, 340], 10: [705, 480], 11: [800, 175], 12: [925, 310] };
function constellation() {
  const edges = F2.bridges.map((b, i) => {
    const [x1, y1] = POS[b.a], [x2, y2] = POS[b.b];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    let nx = -dy / len, ny = dx / len;
    if (ny > 0 || (Math.abs(ny) < .2 && nx > 0)) { nx = -nx; ny = -ny; }
    const o = len * .22, cx = mx + nx * o, cy = my + ny * o;
    const d = `M${x1} ${y1} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;
    return `<path class="edge" data-i="${i}" data-a="${b.a}" data-b="${b.b}" d="${d}" pathLength="1" style="--k:${i}"/><path class="edge hit" data-i="${i}" d="${d}"><title>${esc(U(b.a).short + ' ↔ ' + U(b.b).short + ': ' + b.t)}</title></path>`;
  }).join('');
  const nodes = F2.units.map((u, k) => {
    const [x, y] = POS[u.id], m = Store.mastery(u.id), C = 2 * Math.PI * 35, col = unitColor(u);
    return `<g class="node" data-u="${u.id}" transform="translate(${x} ${y})" tabindex="0" role="link" aria-label="Unidad ${u.rom}: ${esc(u.title)}" style="color:${col}"><g style="--k:${k}">
      <circle r="35" fill="none" stroke="var(--line)" stroke-width="2.5"/>
      <circle r="35" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="${(m || 0) * C} ${C}" transform="rotate(-90)"/>
      <circle class="disc" r="27" stroke="${col}"/><text class="n">${u.rom}</text><text class="l" y="56">${esc(u.short)}</text></g></g>`;
  }).join('');
  const intro = !constelDrawn && !reducedMotion(); constelDrawn = true;
  return `<div class="constel${intro ? ' drawin' : ''}"><svg viewBox="0 0 1000 560" role="img" aria-label="Mapa de conexiones entre las doce unidades">${edges}${nodes}</svg>
    <div class="legend">${Object.entries(BLOCK).map(([k, v]) => `<span><i style="background:${v}"></i>${k}</span>`).join('')}<span class="sp"></span><span>El anillo muestra tu dominio de cada unidad</span></div></div>
    <div class="card bridgebox" id="bridgebox"><span class="mute">Cada línea es una conexión que el tribunal puede pedirte: “relacioná X con Y”. Tocá una para ver qué se espera.</span></div>`;
}

/* ---------- campo de un dipolo (portada) ---------- */
function mountField(fig) {
  const cv = $('canvas', fig), ctx = cv.getContext('2d');
  const Q = [{ x: .3, y: .46, q: 2 }, { x: .72, y: .5, q: -1 }];
  const RC = 14, N = 18, STEP = 2.6;
  let W = 0, H = 0, lines = [], C = {}, t0 = performance.now(), raf = 0, visible = true, ptr = null, drag = null;
  const still = reducedMotion();
  const readColors = () => { const s = getComputedStyle(document.documentElement), g = n => s.getPropertyValue(n).trim(); C = { ink: g('--ink'), mute: g('--mute'), pos: g('--pos'), neg: g('--neg'), on: g('--on-accent'), panel: g('--panel') }; };
  const E = (x, y) => {
    let ex = 0, ey = 0;
    for (const c of Q) { const dx = x - c.x * W, dy = y - c.y * H, r2 = dx * dx + dy * dy + 1e-3, k = c.q / (r2 * Math.sqrt(r2)); ex += k * dx; ey += k * dy; }
    return [ex, ey];
  };
  function build() {
    lines = [];
    Q.filter(c => c.q > 0).forEach(src => {
      for (let i = 0; i < N; i++) {
        const a = (i + .5) / N * 2 * Math.PI; let x = src.x * W + RC * Math.cos(a), y = src.y * H + RC * Math.sin(a);
        const pts = [x, y];
        for (let s = 0; s < 1400; s++) {
          let [ex, ey] = E(x, y), m = Math.hypot(ex, ey); if (!m) break;
          const mx = x + ex / m * STEP / 2, my = y + ey / m * STEP / 2;
          [ex, ey] = E(mx, my); m = Math.hypot(ex, ey); if (!m) break;
          x += ex / m * STEP; y += ey / m * STEP; pts.push(x, y);
          if (Q.some(c => c.q < 0 && Math.hypot(x - c.x * W, y - c.y * H) < RC - 2)) break;
          if (x < -30 || x > W + 30 || y < -30 || y > H + 30) break;
        }
        lines.push(pts);
      }
    });
  }
  function size() {
    const r = fig.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build(); draw(performance.now());
  }
  function path(pts, upto) {
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for (let j = 2; j < upto; j += 2) ctx.lineTo(pts[j], pts[j + 1]);
  }
  function charge(c) {
    const x = c.x * W, y = c.y * H, col = c.q > 0 ? C.pos : C.neg;
    ctx.fillStyle = col; ctx.globalAlpha = .13; ctx.beginPath(); ctx.arc(x, y, RC + 9, 0, 7); ctx.fill();
    ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(x, y, RC, 0, 7); ctx.fill();
    ctx.strokeStyle = C.on; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y); if (c.q > 0) { ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); } ctx.stroke();
    ctx.fillStyle = C.mute; ctx.font = '500 12px PlexMono, monospace'; ctx.textAlign = 'center';
    ctx.fillText(c.q > 0 ? '+2q' : '−q', x, y + RC + 22);
  }
  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    const intro = still ? 1 : Math.min(1, (now - t0) / 1700);
    ctx.lineWidth = 1.15; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    lines.forEach((pts, i) => {
      const f = still ? 1 : Math.max(0, Math.min(1, ((now - t0) - i * 45) / 1100));
      const e = 1 - Math.pow(1 - f, 3), upto = Math.max(2, Math.floor(pts.length / 2 * e) * 2);
      ctx.strokeStyle = C.ink; ctx.globalAlpha = .26; ctx.setLineDash([]); path(pts, upto); ctx.stroke();
      if (intro >= 1 && !still) { // el sentido del campo: de + hacia −
        ctx.globalAlpha = .75; ctx.strokeStyle = C.neg; ctx.setLineDash([1.5, 22]); ctx.lineDashOffset = -now / 38; ctx.lineWidth = 2.2;
        path(pts, pts.length); ctx.stroke(); ctx.lineWidth = 1.15;
      }
    });
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    if (ptr && !drag && !nearCharge(ptr)) { // carga de prueba en el cursor
      const [ex, ey] = E(ptr[0], ptr[1]), m = Math.hypot(ex, ey) || 1, L = 30, ux = ex / m, uy = ey / m;
      const x2 = ptr[0] + ux * L, y2 = ptr[1] + uy * L;
      ctx.strokeStyle = C.ink; ctx.fillStyle = C.ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(ptr[0], ptr[1]); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 7 * ux + 4 * uy, y2 - 7 * uy - 4 * ux); ctx.lineTo(x2 - 7 * ux - 4 * uy, y2 - 7 * uy + 4 * ux); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(ptr[0], ptr[1], 3.5, 0, 7); ctx.fillStyle = C.panel; ctx.fill(); ctx.stroke();
    }
    Q.forEach(charge);
  }
  const loop = now => { draw(now); raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0; };
  const kick = () => { if (!raf && !still) raf = requestAnimationFrame(loop); else if (still) draw(performance.now()); };
  const local = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const nearCharge = p => Q.find(c => Math.hypot(p[0] - c.x * W, p[1] - c.y * H) < RC + 10);
  cv.addEventListener('pointermove', e => {
    ptr = local(e);
    if (drag) { drag.x = clamp(ptr[0], 24, W - 24) / W; drag.y = clamp(ptr[1], 24, H - 44) / H; build(); }
    else cv.style.cursor = nearCharge(ptr) ? 'grab' : 'crosshair';
    kick();
  });
  cv.addEventListener('pointerdown', e => { const c = nearCharge(local(e)); if (c) { drag = c; fig.classList.add('grab'); cv.setPointerCapture(e.pointerId); } });
  const up = () => { drag = null; fig.classList.remove('grab'); kick(); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('pointerleave', () => { ptr = null; kick(); });
  readColors();
  const ro = new ResizeObserver(() => size()); ro.observe(fig);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); }); io.observe(fig);
  const vis = () => { if (!document.hidden) kick(); }; document.addEventListener('visibilitychange', vis);
  size(); kick();
  onLeave(() => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis); });
}
function bindConstellation(root) {
  const box = $('#bridgebox', root), cons = $('.constel', root);
  let sel = null;
  const clearOn = () => $$('.edge.on', root).forEach(e => e.classList.remove('on'));
  const restoreSel = () => { clearOn(); if (sel != null) $(`.edge[data-i="${sel}"]:not(.hit)`, root).classList.add('on'); };
  if (cons) cons.addEventListener('animationend', e => { if (e.target.matches('.edge') && e.target.style.getPropertyValue('--k') == F2.bridges.length - 1) cons.classList.remove('drawin'); });
  root.addEventListener('click', e => {
    const n = e.target.closest('.node'); if (n) { location.hash = '#/unidad/' + n.dataset.u; return; }
    const ed = e.target.closest('.edge'); if (!ed) return;
    const i = +ed.dataset.i, b = F2.bridges[i];
    sel = i; restoreSel();
    box.innerHTML = `<div class="row"><span class="chip t">${U(b.a).rom} · ${esc(U(b.a).short)}</span><span class="mute">↔</span><span class="chip t">${U(b.b).rom} · ${esc(U(b.b).short)}</span></div>
      <h3 style="margin:.5em 0 .2em">${esc(b.t)}</h3><ul class="keys">${b.k.map(k => `<li>${k}</li>`).join('')}</ul>
      <div class="row"><a class="btn sm" href="#/bolillero?bridge=${i}">Practicar este puente en voz alta</a></div>`;
    math(box);
  });
  root.addEventListener('keydown', e => { const n = e.target.closest('.node'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); location.hash = '#/unidad/' + n.dataset.u; } });
  const lightUp = n => {
    $$('.node.lit', root).forEach(x => x.classList.remove('lit'));
    if (!n) { if (cons.classList.contains('focus')) { cons.classList.remove('focus'); restoreSel(); } return; }
    clearOn(); cons.classList.add('focus'); n.classList.add('lit');
    $$('.edge:not(.hit)', root).forEach(ed => {
      if (ed.dataset.a == n.dataset.u || ed.dataset.b == n.dataset.u) {
        ed.classList.add('on'); const o = ed.dataset.a == n.dataset.u ? ed.dataset.b : ed.dataset.a; $(`.node[data-u="${o}"]`, root).classList.add('lit');
      }
    });
  };
  if (cons) {
    cons.addEventListener('mouseover', e => lightUp(e.target.closest('.node')));
    cons.addEventListener('mouseleave', () => lightUp(null));
    cons.addEventListener('focusin', e => lightUp(e.target.closest('.node')));
    cons.addEventListener('focusout', () => lightUp(null));
  }
}

/* ---------- inicio ---------- */
route('/', 'home', (p, app) => {
  const S = Store.s, due = Store.dueCards().length;
  const ms = F2.units.map(u => [u, Store.mastery(u.id)]);
  const weakest = ms.slice().sort((a, b) => (a[1] ?? -1) - (b[1] ?? -1))[0];
  const dayIdx = Math.floor(Date.now() / 864e5);
  const allvf = F2.units.flatMap(u => u.vf.map((v, i) => ({ u, v })));
  const trap = allvf[dayIdx % allvf.length];
  let exam = '';
  if (S.exam) { const d = Math.ceil((new Date(S.exam + 'T09:00:00') - Date.now()) / 864e5); if (d >= 0) exam = `<div class="stat"><b>${d}</b><span>días al examen</span></div>`; }
  app.innerHTML = `
  <section class="hero">
    <div class="hero-copy">
      <div class="eyebrow">Física 2 · Electromagnetismo y óptica</div>
      <h1>Defendé la materia <em>hablando</em>, no memorizando.</h1>
      <p class="lead">El examen tiene una parte teórica <strong>oral</strong>. Acá practicás frente a un tribunal simulado: sacás una bolilla, respondés en voz alta y te corregís con los puntos que espera la cátedra. Se aprueba con el 60 %.</p>
      <div class="row"><a class="btn solid" href="#/bolillero">Sacar bolilla <span class="arr" aria-hidden="true">→</span></a><a class="btn" href="#/entrenar/mazo">Repasar tarjetas${due ? ' <span class="mono small mute">' + due + '</span>' : ''}</a><a class="btn ghost" href="#/lab">Laboratorio</a></div>
    </div>
    <figure class="field" id="field" role="img" aria-label="Simulación interactiva de las líneas de campo de un dipolo con cargas +2q y −q">
      <span class="tag">Unidad I · Líneas de campo</span><canvas></canvas>
      <figcaption><span>Arrastrá las cargas. La mitad de las líneas de +2q termina en −q; el resto se va al infinito.</span><span class="eq">Φ = q/ε₀</span></figcaption>
    </figure>
  </section>
  <div class="sectionhead"><h2>Hoy te toca</h2></div>
  <div class="grid g3">
    <div class="card"><div class="eyebrow">Tu punto más flojo</div><h3 style="margin-top:.6em">Unidad ${weakest[0].rom}: ${esc(weakest[0].short)}</h3>
      <p class="mute small">${weakest[1] == null ? 'Todavía sin practicar.' : 'Dominio estimado: ' + pctTxt(weakest[1]) + '.'}</p><a class="btn sm" href="#/bolillero?u=${weakest[0].id}">Sacar esa bolilla</a></div>
    <div class="card"><div class="eyebrow">Repaso espaciado</div><h3 style="margin-top:.6em">${due} tarjeta${due == 1 ? '' : 's'} para hoy</h3>
      <p class="mute small">Las que fallás vuelven antes; las que sabés, cada vez más espaciadas.</p><a class="btn sm" href="#/entrenar/mazo">Empezar repaso</a></div>
    <div class="card"><div class="eyebrow">Trampa del día · U. ${trap.u.rom}</div><p style="margin:.6em 0">${trap.v[0]}</p>
      <details class="verdict"><summary>Ver veredicto</summary><p><strong>${trap.v[1] ? 'Verdadero' : 'Falso'}.</strong> ${trap.v[2]}</p></details></div>
  </div>
  <div class="card statstrip">
    <div class="stat"><b>${Math.round(Store.total() * 100)}<small>%</small></b><span>dominio global</span></div>
    <div class="stat"><b>${Store.streak()}</b><span>días seguidos</span></div>
    <div class="stat"><b>${S.sessions.length}</b><span>defensas simuladas</span></div>
    ${exam || '<div class="stat"><b>—</b><span><a href="#/progreso">Cargá la fecha del examen</a></span></div>'}
  </div>
  <div class="sectionhead"><h2>La constelación de <em>Maxwell</em></h2></div>
  ${constellation()}`;
  bindConstellation(app);
  mountField($('#field', app));
});

/* ---------- unidades ---------- */
route('/unidades', 'unidades', (p, app) => {
  const blocks = [...new Set(F2.units.map(u => u.block))];
  app.innerHTML = `<div class="eyebrow">Programa 10-04067 · 12 unidades</div><h1>Las <em>doce</em> bolillas</h1>
  <p class="mute" style="max-width:62ch">Cada unidad trae resumen, fórmulas, preguntas de tribunal con lo que se espera, deducción y los puentes hacia otras unidades.</p>` +
    blocks.map(b => `<div class="sectionhead"><h2 style="color:${BLOCK[b]}">${b}</h2></div><div class="grid g3">` +
      F2.units.filter(u => u.block === b).map(u => `<a class="card ucard fade" href="#/unidad/${u.id}" style="--c:${unitColor(u)}"><span class="rom">${u.rom}</span><h3>${esc(u.title)}</h3><span class="mute small">${u.book}</span>
      <div><div class="meter"><i style="width:${Math.round((Store.mastery(u.id) || 0) * 100)}%"></i></div></div></a>`).join('') + '</div>').join('');
});

route('/unidad/:id', 'unidades', ({ id }, app) => {
  const u = U(id); if (!u) { location.hash = '#/unidades'; return; }
  const c = unitColor(u), i = F2.units.indexOf(u), prev = F2.units[i - 1], next = F2.units[i + 1];
  const bridges = F2.bridges.map((b, k) => ({ b, k })).filter(x => x.b.a == u.id || x.b.b == u.id);
  const tpls = TPL.filter(t => t.u.includes(u.id));
  const sims = F2.sims.filter(s => s.units.includes(u.id));
  app.innerHTML = `
  <div class="unit-head fade" style="--c:${c}">
    <div class="row"><a class="chip" href="#/unidades">← Unidades</a><span class="chip">${u.block}</span><span class="chip">Sears–Zemansky vol. 2, ${u.book}</span></div>
    <div class="row" style="align-items:flex-end;gap:20px"><div class="rom">${u.rom}</div><h1 style="margin:0">${esc(u.title)}</h1></div>
    <div class="idea">${u.idea}</div>
    <div class="row">${u.temas.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
    <div class="row" style="margin-top:8px"><a class="btn solid" href="#/bolillero?u=${u.id}">Defender esta unidad</a>
      <a class="btn" href="#/entrenar/mazo?u=${u.id}">Tarjetas</a><a class="btn" href="#/entrenar/deduccion?u=${u.id}">Armar deducción</a><a class="btn" href="#/entrenar/vf?u=${u.id}">Verdadero / falso</a>
      ${sims.map(s => `<a class="btn ghost" href="#/lab/${s.id}">Simulador: ${esc(s.title)}</a>`).join('')}</div>
  </div>
  <div class="sectionhead"><h2>El <em>hilo</em></h2></div><div class="card" style="max-width:78ch">${md(u.resumen)}</div>
  <div class="sectionhead"><h2>Fórmulas <em>clave</em></h2></div>
  <div class="grid g3">${u.formulas.map(f => `<div class="card fcard"><div class="nm">${esc(f[0])}</div><div>${f[1]}</div>${f[2] ? `<div class="nt">${f[2]}</div>` : ''}</div>`).join('')}</div>
  <div class="sectionhead"><h2>Preguntas del <em>tribunal</em></h2></div>
  <p class="mute small">Intentá responder en voz alta antes de abrir cada una. Las claves son lo que el tribunal espera escuchar.</p>
  ${u.tribunal.map(q => `<details class="q"><summary>${pillHTML(q.t)}<span>${q.q}</span></summary><div class="body"><div class="eyebrow">Puntos clave</div><ul class="keys">${q.k.map(k => `<li>${k}</li>`).join('')}</ul>${q.err ? `<div class="callout"><b>Error típico</b><br>${q.err}</div>` : ''}</div></details>`).join('')}
  <div class="sectionhead"><h2>Puentes</h2></div>
  <div class="grid g2">${bridges.map(({ b, k }) => { const o = U(b.a == u.id ? b.b : b.a); return `<a class="card ucard" href="#/bolillero?bridge=${k}" style="--c:${unitColor(o)}"><span class="rom">${o.rom}</span><h3>${esc(b.t)}</h3><span class="mute small">con ${esc(o.short)} · practicar en voz alta →</span></a>`; }).join('')}</div>
  ${tpls.length ? `<div class="sectionhead"><h2>Laboratorio (TPL)</h2></div><div class="grid g2">${tpls.map(t => `<div class="card"><div class="eyebrow">TPL ${t.n}</div><h3 style="margin:.3em 0">${t.t}</h3><p class="mute small">Pregunta típica: ${t.q}</p></div>`).join('')}</div>` : ''}
  <div class="callout good" style="margin-top:26px"><b>Consejo de defensa</b><br>${u.consejo}</div>
  <div class="row" style="margin-top:26px">${prev ? `<a class="btn ghost" href="#/unidad/${prev.id}">← ${prev.rom} · ${esc(prev.short)}</a>` : ''}<span class="sp"></span>${next ? `<a class="btn ghost" href="#/unidad/${next.id}">${next.rom} · ${esc(next.short)} →</a>` : ''}</div>`;
});

/* ---------- progreso ---------- */
function radarSVG() {
  const N = F2.units.length, cx = 200, cy = 200, R = 150;
  const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const rings = [.25, .5, .75, 1].map(f => `<polygon points="${F2.units.map((_, i) => pt(i, R * f).join(',')).join(' ')}" fill="none" stroke="var(--line)"/>`).join('');
  const axes = F2.units.map((u, i) => { const [x, y] = pt(i, R), [lx, ly] = pt(i, R + 22); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)"/><text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central" style="fill:${unitColor(u)};font-weight:600">${u.rom}</text>`; }).join('');
  const poly = F2.units.map((u, i) => pt(i, R * Math.max(.02, Store.mastery(u.id) || 0)).join(',')).join(' ');
  return `<svg class="radar" viewBox="0 0 400 400" role="img" aria-label="Radar de dominio por unidad">${rings}${axes}<polygon class="val" points="${poly}" fill="color-mix(in srgb,var(--neg) 16%,transparent)" stroke="var(--neg)" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
}
route('/progreso', 'progreso', (p, app) => {
  const S = Store.s;
  const rank = F2.units.map(u => ({ u, m: Store.mastery(u.id) })).sort((a, b) => (a.m ?? -1) - (b.m ?? -1));
  const days = S.exam ? Math.ceil((new Date(S.exam + 'T09:00:00') - Date.now()) / 864e5) : null;
  let plan = '';
  if (days != null && days >= 0) {
    const n = Math.min(Math.max(days, 1), 10), per = Math.ceil(rank.length / n);
    plan = `<p class="mute small">Faltan <strong>${days}</strong> días. Orden sugerido: empezá por lo más flojo y dejá los últimos días para defensas completas (3 bolillas).</p><table class="t"><tr><th>Día</th><th>Unidades</th><th>Rutina</th></tr>` +
      Array.from({ length: n }, (_, d) => { const us = rank.slice(d * per, (d + 1) * per).map(x => x.u); const last = d >= n - 2 && n > 3;
        return `<tr><td class="mono">D−${days - d}</td><td>${last ? 'Examen completo × 3 bolillas al azar' : us.map(x => x.rom).join(' · ') || 'Repaso libre'}</td><td class="small mute">${last ? 'Cronometrá, hablá en voz alta, repasá tarjetas falladas' : 'Leé el hilo, 1 bolilla en voz alta, 15 tarjetas, 1 deducción'}</td></tr>`; }).join('') + '</table>';
  } else plan = '<p class="mute small">Cargá la fecha de tu examen y armo un plan día por día.</p>';
  app.innerHTML = `<div class="eyebrow">Tu avance</div><h1>Panel de <em>control</em></h1>
  <div class="grid g2"><div class="card"><h3>Dominio por unidad</h3>${radarSVG()}</div>
  <div class="card"><h3>Prioridades</h3>${rank.slice(0, 6).map(x => `<div class="bar"><a href="#/unidad/${x.u.id}" style="color:var(--ink);text-decoration:none">${x.u.rom} · ${esc(x.u.short)}</a><div class="meter"><i style="width:${Math.round((x.m || 0) * 100)}%"></i></div><span class="mono small">${pctTxt(x.m)}</span></div>`).join('')}
  <p class="mute small">El dominio se actualiza con cada defensa, tarjeta, deducción y verdadero/falso (media móvil: lo reciente pesa más).</p></div></div>
  <div class="sectionhead"><h2>Plan de <em>ataque</em></h2></div>
  <div class="card"><div class="row"><label for="exam">Fecha del examen</label><input type="date" id="exam" value="${S.exam || ''}" style="max-width:200px"></div>${plan}</div>
  <div class="sectionhead"><h2>Últimas defensas</h2></div>
  <div class="card">${S.sessions.length ? `<table class="t"><tr><th>Fecha</th><th>Bolillas</th><th>Resultado</th><th>Rúbrica (CG1/CG4/CG9)</th></tr>${S.sessions.slice(-8).reverse().map(s => `<tr><td class="mono small">${new Date(s.t).toLocaleDateString('es-AR')}</td><td>${s.units.map(x => U(x).rom).join(' · ')}</td><td><strong>${Math.round(s.pct * 100)}%</strong> ${s.pct >= .6 ? '<span class="chip t">aprobado</span>' : '<span class="chip">a reforzar</span>'}</td><td class="small mute">${s.rubric ? s.rubric.join(' / ') : '—'}</td></tr>`).join('')}</table>` : '<span class="mute">Todavía no hiciste ninguna defensa simulada.</span>'}</div>
  <div class="sectionhead"><h2>Tus datos</h2></div>
  <div class="card"><p class="mute small">Todo se guarda en este navegador (nada se sube a ningún servidor). Exportá una copia para pasarla a otro dispositivo.</p>
  <div class="row"><button class="btn sm" id="exp">Exportar progreso</button><label class="btn sm ghost" style="cursor:pointer">Importar<input type="file" id="imp" accept="application/json" hidden></label><button class="btn sm bad" id="rst">Borrar todo</button></div></div>`;
  $('#exam', app).addEventListener('change', e => { S.exam = e.target.value || null; Store.save(); Router.render(); });
  $('#exp', app).addEventListener('click', () => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([Store.exportJSON()], { type: 'application/json' }));
    a.download = 'fisica2-progreso-' + Store.dkey() + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('#imp', app).addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return; const r = new FileReader();
    r.onload = () => { try { Store.importJSON(r.result); toast('Progreso importado'); Router.render(); } catch (er) { toast('Archivo inválido'); } }; r.readAsText(f);
  });
  $('#rst', app).addEventListener('click', () => { if (confirm('¿Borrar todo tu progreso en este navegador?')) { Store.reset(); Router.render(); } });
});
