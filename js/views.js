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
const POS = { 1: [95, 175], 2: [235, 80], 3: [235, 265], 4: [385, 175], 5: [385, 360], 6: [545, 95], 7: [545, 255], 8: [545, 420], 9: [705, 340], 10: [705, 480], 11: [800, 175], 12: [925, 310] };
function constellation() {
  const edges = F2.bridges.map((b, i) => {
    const [x1, y1] = POS[b.a], [x2, y2] = POS[b.b];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    let nx = -dy / len, ny = dx / len;
    if (ny > 0 || (Math.abs(ny) < .2 && nx > 0)) { nx = -nx; ny = -ny; }
    const o = len * .22, cx = mx + nx * o, cy = my + ny * o;
    const d = `M${x1} ${y1} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;
    return `<path class="edge" data-i="${i}" data-a="${b.a}" data-b="${b.b}" d="${d}"/><path class="edge hit" data-i="${i}" d="${d}"><title>${esc(U(b.a).short + ' ↔ ' + U(b.b).short + ': ' + b.t)}</title></path>`;
  }).join('');
  const nodes = F2.units.map(u => {
    const [x, y] = POS[u.id], m = Store.mastery(u.id), C = 2 * Math.PI * 35, col = unitColor(u);
    return `<g class="node" data-u="${u.id}" transform="translate(${x} ${y})" tabindex="0" role="link" aria-label="Unidad ${u.rom}: ${esc(u.title)}" style="color:${col}">
      <circle r="35" fill="none" stroke="var(--line)" stroke-width="3"/>
      <circle r="35" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(m || 0) * C} ${C}" transform="rotate(-90)"/>
      <circle class="disc" r="28" stroke="${col}"/><text class="n">${u.rom}</text><text class="l" y="56">${esc(u.short)}</text></g>`;
  }).join('');
  return `<div class="constel"><svg viewBox="0 0 1000 560" role="img" aria-label="Mapa de conexiones entre las doce unidades">${edges}${nodes}</svg>
    <div class="legend">${Object.entries(BLOCK).map(([k, v]) => `<span><i style="background:${v}"></i>${k}</span>`).join('')}<span class="sp"></span><span>El anillo de cada unidad muestra tu dominio · tocá una línea para ver el puente</span></div></div>
    <div class="card bridgebox" id="bridgebox"><span class="mute">Cada línea es una conexión que el tribunal puede pedirte (“relacioná X con Y”). Tocá una.</span></div>`;
}
function bindConstellation(root) {
  const box = $('#bridgebox', root);
  const clearOn = () => $$('.edge.on', root).forEach(e => e.classList.remove('on'));
  root.addEventListener('click', e => {
    const n = e.target.closest('.node'); if (n) { location.hash = '#/unidad/' + n.dataset.u; return; }
    const ed = e.target.closest('.edge'); if (!ed) return;
    const i = +ed.dataset.i, b = F2.bridges[i];
    clearOn(); $(`.edge[data-i="${i}"]:not(.hit)`, root).classList.add('on');
    box.innerHTML = `<div class="row"><span class="chip t">${U(b.a).rom} · ${esc(U(b.a).short)}</span><span class="mute">↔</span><span class="chip t">${U(b.b).rom} · ${esc(U(b.b).short)}</span></div>
      <h3 style="margin:.5em 0 .2em">${esc(b.t)}</h3><ul class="keys">${b.k.map(k => `<li>${k}</li>`).join('')}</ul>
      <div class="row"><a class="btn sm" href="#/bolillero?bridge=${i}">Practicar este puente en voz alta</a></div>`;
    math(box);
  });
  root.addEventListener('keydown', e => { const n = e.target.closest('.node'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); location.hash = '#/unidad/' + n.dataset.u; } });
  root.addEventListener('mouseover', e => {
    const n = e.target.closest('.node'); clearOn(); if (!n) return;
    $$('.edge:not(.hit)', root).forEach(ed => { if (ed.dataset.a == n.dataset.u || ed.dataset.b == n.dataset.u) ed.classList.add('on'); });
  });
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
  <section class="hero fade">
    <div class="eyebrow">Física 2 · Electromagnetismo y Óptica · Sears–Zemansky, vol. 2</div>
    <h1>Defendé la materia <em>hablando</em>, no memorizando.</h1>
    <p class="lead">El examen regular tiene una parte teórica <strong>oral</strong> y el coloquio también. Acá practicás como si estuvieras frente al tribunal: sacás una bolilla, te preguntan, respondés en voz alta y te autoevaluás con los puntos que se esperan y la rúbrica de la cátedra (aprobás con el 60 %).</p>
    <div class="row"><a class="btn solid" href="#/bolillero">Sacar bolilla</a><a class="btn" href="#/entrenar/mazo">Repasar tarjetas${due ? ' (' + due + ')' : ''}</a><a class="btn ghost" href="#/lab">Ir al laboratorio</a></div>
  </section>
  <div class="sectionhead"><h2>La constelación de <em>Maxwell</em></h2></div>
  ${constellation()}
  <div class="sectionhead"><h2>Hoy te toca</h2></div>
  <div class="grid g3">
    <div class="card"><div class="eyebrow">Tu punto más flojo</div><h3 style="margin-top:.5em">Unidad ${weakest[0].rom}: ${esc(weakest[0].short)}</h3>
      <p class="mute small">${weakest[1] == null ? 'Todavía sin practicar.' : 'Dominio estimado ' + pctTxt(weakest[1]) + '.'}</p><a class="btn sm" href="#/bolillero?u=${weakest[0].id}">Sacar esa bolilla</a></div>
    <div class="card"><div class="eyebrow">Repaso espaciado</div><h3 style="margin-top:.5em">${due} tarjeta${due == 1 ? '' : 's'} para hoy</h3>
      <p class="mute small">Las que fallás vuelven antes; las que sabés, cada vez más espaciadas.</p><a class="btn sm" href="#/entrenar/mazo">Empezar</a></div>
    <div class="card"><div class="eyebrow">Trampa del día · U. ${trap.u.rom}</div><p style="margin:.5em 0">${trap.v[0]}</p>
      <details><summary class="small mono" style="cursor:pointer;color:var(--trace)">Ver veredicto</summary><p><strong>${trap.v[1] ? 'Verdadero' : 'Falso'}.</strong> ${trap.v[2]}</p></details></div>
  </div>
  <div class="grid g4" style="margin-top:14px">
    <div class="card stat"><b>${Math.round(Store.total() * 100)}%</b><span>dominio global</span></div>
    <div class="card stat"><b>${Store.streak()}</b><span>días seguidos</span></div>
    <div class="card stat"><b>${S.sessions.length}</b><span>defensas simuladas</span></div>
    <div class="card stat">${exam || '<b>—</b><span>fecha de examen (en Progreso)</span>'}</div>
  </div>`;
  bindConstellation(app);
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
      ${sims.map(s => `<a class="btn ghost" href="#/lab/${s.id}">⚡ ${esc(s.title)}</a>`).join('')}</div>
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
  return `<svg class="radar" viewBox="0 0 400 400" role="img" aria-label="Radar de dominio por unidad">${rings}${axes}<polygon points="${poly}" fill="color-mix(in srgb,var(--trace) 22%,transparent)" stroke="var(--trace)" stroke-width="2"/></svg>`;
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
