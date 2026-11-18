/* Entrenamiento: mazo (repaso espaciado), armá la deducción, verdadero/falso con trampa */
(function () {
  const MODES = [['mazo', 'Mazo de repaso'], ['deduccion', 'Armá la deducción'], ['vf', 'Verdadero / falso']];

  function header(mode, u) {
    return `<header class="pagehead"><div class="eyebrow">Entrenamiento</div><h1>${mode === 'mazo' ? 'Repaso <em>espaciado</em>' : mode === 'deduccion' ? 'Armá la <em>deducción</em>' : 'Verdadero o falso: <em>las trampas</em>'}</h1></header><div style="height:28px"></div>
    <div class="row" style="margin-bottom:16px"><div class="tabs" style="margin:0">${MODES.map(m => `<a class="tab ${m[0] === mode ? 'on' : ''}" href="#/entrenar/${m[0]}${u ? '?u=' + u : ''}" style="text-decoration:none">${m[1]}</a>`).join('')}</div><span class="sp"></span>
      <select id="uf" style="max-width:260px" aria-label="Filtrar por unidad"><option value="">Todas las unidades</option>${F2.units.map(x => `<option value="${x.id}" ${x.id == u ? 'selected' : ''}>${x.rom} · ${esc(x.short)}</option>`).join('')}</select></div>`;
  }
  function bindFilter(app, mode) { $('#uf', app).addEventListener('change', e => { location.hash = '#/entrenar/' + mode + (e.target.value ? '?u=' + e.target.value : ''); }); }

  route('/entrenar', 'entrenar', (p, app) => {
    app.innerHTML = `<header class="pagehead"><div class="eyebrow">Entrenamiento</div><h1>Tres formas de <em>fijar</em> lo que sabés</h1><p>Repaso espaciado para retener, deducciones para el pizarrón y afirmaciones engañosas para no caer en las trampas del tribunal.</p></header><div class="grid g3" style="margin-top:40px">
      <a class="card ucard" href="#/entrenar/mazo" ><span class="rom">↻</span><h3>Mazo de repaso</h3><span class="mute small">Tarjetas con repaso espaciado: ${Store.dueCards().length} para hoy.</span></a>
      <a class="card ucard" href="#/entrenar/deduccion" ><span class="rom">∑</span><h3>Armá la deducción</h3><span class="mute small">Ordená los pasos de las demostraciones que te piden en el pizarrón.</span></a>
      <a class="card ucard" href="#/entrenar/vf" ><span class="rom" style="font-size:1.5rem">V/F</span><h3>Verdadero / falso</h3><span class="mute small">Las afirmaciones “casi correctas” que usa el tribunal para pisar.</span></a></div>`;
  });

  /* ---------- mazo ---------- */
  route('/entrenar/mazo', 'entrenar', (p, app) => {
    const u = Router.state.query.u || '';
    let extra = false, queue, idx, shown, stats;
    const build = (practice) => {
      const all = Store.allCards().filter(c => !u || c.unit == u);
      queue = practice ? shuffle(all).slice(0, 12) : shuffle(Store.dueCards(u)).slice(0, 25);
      idx = 0; shown = false; stats = [0, 0, 0, 0];
    };
    build(false);
    const draw = () => {
      let body;
      if (idx >= queue.length) {
        const n = stats.reduce((a, b) => a + b, 0), nextDue = Object.values(Store.s.cards).map(c => c.due).filter(d => d > Date.now()).sort()[0];
        body = n ? `<div class="card" style="text-align:center"><div class="score">${n}</div><p>tarjetas repasadas · ${stats[2] + stats[3]} bien · ${stats[0] + stats[1]} para reforzar</p><div class="row" style="justify-content:center"><a class="btn solid" href="#/bolillero">Pasar a una defensa</a><button class="btn" id="more">Repasar 12 más al azar</button></div></div>`
          : `<div class="card" style="text-align:center"><h3>No hay tarjetas pendientes</h3><p class="mute">${nextDue ? 'La próxima vence ' + new Date(nextDue).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' }) + '.' : ''}</p><button class="btn" id="more">Repasar 12 al azar igual</button></div>`;
      } else {
        const c = queue[idx];
        body = `<div class="row small mono mute" style="margin-bottom:8px"><span>${idx + 1} / ${queue.length}</span><span class="chip" style="color:${unitColor(c.unit)}">U. ${U(c.unit).rom} · ${esc(U(c.unit).short)}</span></div>
        <div class="card flip fade" id="flip"><div>${shown ? `<div class="eyebrow" style="margin-bottom:12px">Respuesta</div><div style="font-size:1.05rem;font-family:var(--sans);text-align:left">${c.b}</div>` : c.f}</div></div>
        ${shown ? `<div class="rate" style="margin-top:12px">${[['Otra vez', '<10 min'], ['Difícil', ''], ['Bien', ''], ['Fácil', '']].map((r, i) => `<button class="btn ${i == 0 ? 'bad' : i == 3 ? 'solid' : ''}" data-r="${i}">${r[0]}<small>[${i + 1}]</small></button>`).join('')}</div>`
          : `<div class="row" style="margin-top:12px;justify-content:center"><button class="btn solid" id="show">Mostrar respuesta <span class="kbd">espacio</span></button></div><p class="small mute" style="text-align:center">Primero decila en voz alta, después mirá.</p>`}`;
      }
      app.innerHTML = header('mazo', u) + body; bindFilter(app, 'mazo'); math(app);
      const more = $('#more', app); if (more) more.onclick = () => { build(true); draw(); };
      const show = $('#show', app); if (show) show.onclick = () => { shown = true; draw(); };
      $$('[data-r]', app).forEach(b => b.onclick = () => rate(+b.dataset.r));
    };
    const rate = r => {
      const c = queue[idx], now = Date.now(); const s = Store.s.cards[c.id] || { ease: 2.5, int: 0, reps: 0, due: 0 };
      if (r === 0) { s.reps = 0; s.int = 0; s.ease = Math.max(1.3, s.ease - .2); s.due = now + 10 * 60 * 1000; queue.push(c); }
      else {
        if (r === 1) { s.int = Math.max(1, Math.round((s.int || 1) * 1.2)); s.ease = Math.max(1.3, s.ease - .15); }
        else if (r === 2) { s.int = s.reps === 0 ? 1 : s.reps === 1 ? 3 : Math.round(s.int * s.ease); }
        else { s.int = s.reps === 0 ? 3 : s.reps === 1 ? 6 : Math.round(s.int * s.ease * 1.3); s.ease += .1; }
        s.reps++; s.due = now + s.int * 864e5;
      }
      Store.s.cards[c.id] = s; Store.bump(c.unit, [0, .4, .8, 1][r], .08); stats[r]++; idx++; shown = false; draw();
    };
    const key = e => {
      if (!$('#flip')) return; if (e.target.matches('textarea,input,select')) return;
      if (!shown && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); shown = true; draw(); }
      else if (shown && /^[1-4]$/.test(e.key)) rate(+e.key - 1);
    };
    document.addEventListener('keydown', key); onLeave(() => document.removeEventListener('keydown', key));
    draw();
  });

  /* ---------- armá la deducción ---------- */
  route('/entrenar/deduccion', 'entrenar', (p, app) => {
    const uq = Router.state.query.u || '';
    let uid, order, mine, verified;
    const choose = () => {
      const pool = F2.units.filter(x => !uq || x.id == uq);
      uid = pool.length === 1 ? pool[0].id : pick(pool.filter(x => x.id !== uid)).id;
      const n = U(uid).deduccion.pasos.length; order = shuffle([...Array(n).keys()]); if (n > 1 && order.every((v, i) => v === i)) order.reverse(); mine = []; verified = false;
    };
    choose();
    const draw = () => {
      const u = U(uid), d = u.deduccion, rest = order.filter(i => !mine.includes(i));
      const correct = mine.map((s, i) => s === i);
      app.innerHTML = header('deduccion', uq) + `<div class="card"><div class="row"><span class="chip" style="color:${unitColor(u)}">Unidad ${u.rom} · ${esc(u.short)}</span><span class="sp"></span><button class="btn sm ghost" id="other">Otra deducción</button></div>
      <h2 style="margin-top:12px">${d.titulo}</h2><p class="mute small">${d.intro} Tocá un paso para sumarlo a tu orden; tocá uno de tu orden para devolverlo.</p>
      <div class="grid g2" style="align-items:start"><div><div class="eyebrow" style="margin-bottom:8px">Tu orden</div>${mine.length ? mine.map((s, i) => `<div class="slotrow ${verified ? (correct[i] ? 'ok' : 'no2') : ''}" data-m="${i}"><span class="no">${i + 1}</span><span>${d.pasos[s]}</span></div>`).join('') : '<div class="mute small">Todavía no elegiste ningún paso.</div>'}</div>
      <div><div class="eyebrow" style="margin-bottom:8px">Pasos desordenados (${rest.length})</div>${rest.map(s => `<div class="slotrow" data-p="${s}"><span class="no">·</span><span>${d.pasos[s]}</span></div>`).join('') || '<div class="mute small">No quedan pasos.</div>'}</div></div>
      <div class="row" style="margin-top:14px"><button class="btn solid" id="check" ${mine.length === d.pasos.length && !verified ? '' : 'disabled'}>Verificar</button><button class="btn ghost" id="sol">Ver solución</button><button class="btn ghost" id="retry">Reordenar</button></div>
      <div id="msg"></div></div>`;
      bindFilter(app, 'deduccion'); math(app);
      $$('[data-p]', app).forEach(el => el.onclick = () => { if (verified) return; mine.push(+el.dataset.p); draw(); });
      $$('[data-m]', app).forEach(el => el.onclick = () => { if (verified) return; mine.splice(+el.dataset.m, 1); draw(); });
      $('#other', app).onclick = () => { choose(); draw(); };
      $('#retry', app).onclick = () => { mine = []; verified = false; order = shuffle(order); draw(); };
      $('#sol', app).onclick = () => { $('#msg', app).innerHTML = `<div class="callout good" style="margin-top:14px"><b>Solución</b><ol style="margin:.4em 0 0;padding-left:1.3em">${d.pasos.map(s => `<li>${s}</li>`).join('')}</ol></div>`; math($('#msg', app)); };
      $('#check', app).onclick = () => {
        verified = true; const n = correct.filter(Boolean).length, tot = d.pasos.length, ok = n === tot;
        Store.bump(uid, ok ? 1 : (n / tot) * .6, .25); if (ok) Store.s.ded[uid] = (Store.s.ded[uid] || 0) + 1; Store.save();
        draw(); const first = correct.indexOf(false);
        $('#msg', app).innerHTML = ok ? `<div class="callout good" style="margin-top:14px"><b>¡Perfecto!</b><br>Ahora el desafío de verdad: reconstruila en voz alta sin mirar, justificando cada paso (¿por qué simetría?, ¿por qué esta superficie?).</div>`
          : `<div class="callout" style="margin-top:14px"><b>${n} de ${tot} en su lugar</b><br>El primer error está en tu paso ${first + 1}. Pensá qué tiene que haber ocurrido antes de ese paso.</div>`;
      };
    };
    draw();
  });

  /* ---------- verdadero / falso ---------- */
  route('/entrenar/vf', 'entrenar', (p, app) => {
    const uq = Router.state.query.u || '';
    let cur = null, answered = false;
    const pool = () => F2.units.filter(u => !uq || u.id == uq).flatMap(u => u.vf.map((v, i) => ({ u, v, key: u.id + ':' + i })));
    const next = () => {
      const P = pool(), prefer = P.filter(x => Store.s.vf[x.key] !== true), src = prefer.length ? prefer : P;
      const pickItem = () => pick(src); cur = pickItem(); if (cur && src.length > 1) { let t = 0; while (Store.s.lastVf === cur.key && t++ < 5) cur = pickItem(); } answered = false; Store.s.lastVf = cur.key;
    };
    next();
    const draw = () => {
      const { u, v } = cur;
      app.innerHTML = header('vf', uq) + `<div class="card vf fade"><div class="row small mono mute"><span class="chip" style="color:${unitColor(u)}">U. ${u.rom} · ${esc(u.short)}</span><span class="sp"></span><span>racha ${Store.s.vfStreak}</span></div>
      <p class="stmt">${v[0]}</p>
      ${answered ? `<div class="callout ${answered === 'ok' ? 'good' : ''}"><b>${answered === 'ok' ? 'Bien' : 'Trampa'} · es ${v[1] ? 'VERDADERO' : 'FALSO'}</b><br>${v[2]}</div><p class="small mute">Ahora decí en voz alta cómo lo justificarías ante el tribunal.</p><div class="row"><button class="btn solid" id="nx">Otra afirmación</button></div>`
        : `<div class="opts"><button class="btn" data-a="1">Verdadero</button><button class="btn bad" data-a="0">Falso</button></div>`}</div>`;
      bindFilter(app, 'vf'); math(app);
      $$('[data-a]', app).forEach(b => b.onclick = () => {
        const ok = (b.dataset.a === '1') === v[1]; answered = ok ? 'ok' : 'bad'; Store.s.vf[cur.key] = ok; Store.s.vfStreak = ok ? Store.s.vfStreak + 1 : 0;
        Store.bump(u.id, ok ? 1 : 0, .1); draw();
      });
      const nx = $('#nx', app); if (nx) nx.onclick = () => { next(); draw(); };
    };
    draw();
  });
})();
