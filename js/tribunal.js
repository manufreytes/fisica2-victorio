/* Bolillero + simulador de tribunal */
(function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const FILLERS = /\b(e+h+|m{2,}|o sea|digamos|tipo|como que|viste)\b/gi;
  const RUBRIC = [
    ['CG1', 'Identificar y formular', '¿Describí el contexto físico, reconocí las magnitudes y fijé el sistema de unidades?'],
    ['CG4', 'Técnicas y herramientas', '¿Organicé la respuesta con método, conecté datos con incógnitas y verifiqué la coherencia (unidades, casos límite)?'],
    ['CG9', 'Aprendizaje autónomo', '¿Relacioné con experiencias previas y analogías, reconocí errores y los corregí?']
  ];
  const LEVELS = ['Bajo', 'Medio', 'Alto', 'Muy alto'];

  /* ---------- construcción de una sesión ---------- */
  function buildSteps(uid, bridgeIdx) {
    const u = U(uid), qs = shuffle(u.tribunal);
    const q1 = qs.find(q => q.t === 'def' || q.t === 'ded') || qs[0];
    const q2 = qs.find(q => q !== q1 && (q.t === 'apl' || q.t === 'cruz')) || qs.find(q => q !== q1);
    const brs = F2.bridges.map((b, i) => ({ b, i })).filter(x => x.b.a == uid || x.b.b == uid);
    const br = bridgeIdx != null ? { b: F2.bridges[bridgeIdx], i: bridgeIdx } : pick(brs);
    const other = U(br.b.a == uid ? br.b.b : br.b.a);
    return [
      { u: uid, type: 'exp', q: `Presentá la unidad “${u.title}” como si abrieras la defensa. Elegí un hilo conductor y cubrí lo esencial del programa.`, k: u.temas, hint: 'Cubrí:' },
      { u: uid, type: q1.t, q: q1.q, k: q1.k, err: q1.err },
      { u: uid, type: q2.t, q: q2.q, k: q2.k, err: q2.err },
      { u: uid, type: 'pte', q: `Relacioná la Unidad ${u.rom} (${u.short}) con la Unidad ${other.rom} (${other.short}). ¿Qué las une? Tema: “${br.b.t}”.`, k: br.b.k }
    ];
  }
  const ballColor = u => unitColor(u);

  /* ---------- pantalla de armado ---------- */
  route('/bolillero', 'bolillero', (p, app) => {
    const q = Router.state.query;
    if (q.bridge != null) { start([{ uid: bridgeUnit(+q.bridge), bridge: +q.bridge }], { time: 120, voice: true }); return; }
    if (q.u) { start([{ uid: +q.u }], { time: 120, voice: true }); return; }
    setup(app);
  });
  function bridgeUnit(i) { return F2.bridges[i].a; }

  function setup(app) {
    app.innerHTML = `<header class="pagehead"><div class="eyebrow">Simulador de tribunal</div><h1>El <em>bolillero</em></h1><p>Sacás una bolilla y el tribunal te hace cuatro preguntas: <strong>exposición libre</strong>, una de <strong>definición o deducción</strong>, una de <strong>aplicación o cruzada</strong> y una <strong>pregunta puente</strong> con otra unidad. Respondés en voz alta (o escribís), después ves lo que esperaban y te ponés la nota vos.</p></header><div style="height:36px"></div>
    <div class="grid g2" style="align-items:start">
      <div class="card"><div class="cage" id="cage"></div><div class="drawn" id="drawn"><span class="mute">Girá el bolillero para sacar tu bolilla</span></div>
        <div class="row" style="justify-content:center"><button class="btn solid" id="spin">Girar bolillero</button></div></div>
      <div class="card"><h3>Opciones</h3><div class="grid" style="gap:14px">
        <div><label>Modo</label>${segs('mode', [['1', 'Una bolilla'], ['3', 'Examen completo (3)']], '1')}</div>
        <div><label for="time">Tiempo por pregunta</label><select id="time"><option value="60">1 minuto</option><option value="90">1 min 30 s</option><option value="120" selected>2 minutos</option><option value="180">3 minutos</option><option value="300">5 minutos</option></select></div>
        <div><label>Cómo respondés</label>${segs('voice', [['1', SR ? 'Voz + escrito' : 'Escrito'], ['0', 'Sólo en voz alta']], SR ? '1' : '1')}
          <p class="small mute">${SR ? 'El dictado usa el micrófono y pasa a texto lo que decís. Si no querés usarlo, escribí o hablá sin grabar, también vale.' : 'Tu navegador no tiene dictado, así que escribí tus notas o hablá en voz alta.'}</p></div>
        <div><label for="pickU">…o elegí vos la unidad</label><select id="pickU"><option value="">— al azar —</option>${F2.units.map(u => `<option value="${u.id}">${u.rom} · ${esc(u.short)}</option>`).join('')}</select></div>
      </div></div></div>`;
    cage(app);
  }

  function cage(app) {
    const el = $('#cage', app), balls = [];
    const R = () => el.clientWidth / 2;
    F2.units.forEach(u => {
      const b = document.createElement('div'); b.className = 'ball'; b.textContent = u.rom; b.style.setProperty('--bc', ballColor(u)); el.appendChild(b);
      const ra = Math.random() * 6.28, rr = 40 + Math.random() * 80, va = Math.random() * 6.28; balls.push({ el: b, u, x: rr * Math.cos(ra), y: rr * Math.sin(ra), vx: 2.2 * Math.cos(va), vy: 2.2 * Math.sin(va) });
    });
    let speed = 1, raf, spinning = false, chosen = null;
    const draw = () => {
      const r = R(), br = el.clientWidth * .075;
      balls.forEach(b => {
        if (b === chosen) return;
        b.x += b.vx * speed; b.y += b.vy * speed;
        const d = Math.hypot(b.x, b.y), lim = r - br - 2;
        if (d > lim) { const nx = b.x / d, ny = b.y / d, dot = b.vx * nx + b.vy * ny; b.vx -= 2 * dot * nx; b.vy -= 2 * dot * ny; b.x = nx * lim; b.y = ny * lim; }
        b.el.style.transform = `translate(${r + b.x - br}px,${r + b.y - br}px)`;
      });
      raf = requestAnimationFrame(draw);
    };
    el.style.setProperty('position', 'relative'); balls.forEach(b => { b.el.style.left = '0'; b.el.style.top = '0'; });
    draw(); onLeave(() => cancelAnimationFrame(raf));
    let queue = [], total = 1;
    $('#mode', app).addEventListener('click', () => {});
    bindSegs(app, 'mode', k => total = +k); bindSegs(app, 'voice', () => {});
    $('#spin', app).addEventListener('click', () => {
      if (spinning) return;
      const forced = $('#pickU', app).value;
      const used = queue.map(x => x.uid), pool = F2.units.filter(u => !used.includes(u.id));
      const target = forced ? U(forced) : pick(pool.length ? pool : F2.units);
      if (chosen) { chosen.el.classList.remove('win'); chosen.el.style.zIndex = ''; chosen = null; }
      spinning = true; speed = 5; $('#spin', app).disabled = true; $('#drawn', app).innerHTML = '<span class="mute">Girando…</span>';
      const t0 = performance.now();
      const slow = () => { const t = (performance.now() - t0) / 1800; speed = 5 - 4.4 * Math.min(1, t); if (t < 1) requestAnimationFrame(slow); else land(target); };
      slow();
    });
    function land(u) {
      spinning = false; speed = 0;
      const b = balls.find(x => x.u === u); chosen = b; const r = R(), br = el.clientWidth * .075;
      b.el.classList.add('win'); b.el.style.transform = `translate(${r - br * 1.8}px,${r - br * 1.8}px) scale(3.6)`;
      queue.push({ uid: u.id });
      const done = queue.length >= total;
      $('#drawn', app).innerHTML = `<div class="big">${u.rom}</div><h3 style="margin:0">${esc(u.title)}</h3><span class="mute small">${total > 1 ? `Bolilla ${queue.length} de ${total}` : ''}</span>
        <div class="row" style="justify-content:center;margin-top:10px">${done ? '<button class="btn solid" id="go">Empezar la defensa</button>' : '<button class="btn" id="again">Sacar otra bolilla</button>'}</div>`;
      $('#spin', app).disabled = false;
      const reset = () => { speed = 1; };
      if (done) $('#go', app).addEventListener('click', () => start(queue, { time: +$('#time', app).value, voice: $('#voice .on', app).dataset.k === '1' }));
      else $('#again', app).addEventListener('click', () => { $('#pickU', app).value = ''; setTimeout(() => $('#spin', app).click(), 0); reset(); });
    }
  }

  /* ---------- sesión ---------- */
  function start(list, opt) {
    const app = $('#app');
    const S = { steps: list.flatMap(x => buildSteps(x.uid, x.bridge)), i: 0, res: [], opt, t0: Date.now() };
    step(app, S);
  }

  function step(app, S) {
    if (S.i >= S.steps.length) return summary(app, S);
    const st = S.steps[S.i], u = U(st.u);
    let secs = S.opt.time, over = false, tmr, rec = null, recOn = false;
    const C = 2 * Math.PI * 28;
    app.innerHTML = `
      <div class="row" style="margin-bottom:6px"><span class="chip" style="color:${unitColor(u)}">Unidad ${u.rom} · ${esc(u.short)}</span><span class="sp"></span><a class="btn ghost sm" href="#/bolillero" id="quit">Abandonar</a></div>
      <div class="stepper">${S.steps.map((_, k) => `<i class="${k < S.i ? 'done' : k === S.i ? 'cur' : ''}"></i>`).join('')}</div>
      <div class="card fade">
        <div class="examiner"><div class="avatar" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--trace)" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg></div>
          <div><div class="row">${pillHTML(st.type)}<span class="mute small">Pregunta ${S.i + 1} de ${S.steps.length}</span></div><div class="bubble" style="margin-top:8px">${st.q}</div></div></div>
        <hr>
        <div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div class="timer" id="timer"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="var(--line)" stroke-width="4"/><circle class="fg" id="ring" cx="32" cy="32" r="28" fill="none" stroke="var(--trace)" stroke-width="4" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><b id="tt"></b></div>
          <div class="sp"><textarea id="ans" placeholder="${S.opt.voice ? 'Tu respuesta (podés dictar con el micrófono o escribir notas)…' : 'Notas rápidas (opcional)…'}" aria-label="Tu respuesta"></textarea></div></div>
        <div class="row" style="margin-top:10px">${SR && S.opt.voice ? '<button class="btn sm" id="mic">● Dictar</button>' : ''}<button class="btn sm ghost" id="boardBtn">Pizarra</button><span class="sp"></span><span class="mono small mute" id="metrics"></span></div>
        <div id="boardWrap" hidden style="margin-top:10px"><canvas class="board" id="board"></canvas><div class="row" style="margin-top:6px"><button class="btn sm ghost" id="clr">Borrar pizarra</button><span class="small mute">Dibujá la gaussiana, el diagrama fasorial, la marcha de rayos…</span></div></div>
        <hr><div class="row"><button class="btn solid" id="done">Terminé — ver lo que esperaba el tribunal</button></div>
        <div id="review"></div>
      </div>`;
    const ans = $('#ans', app), tt = $('#tt', app), ring = $('#ring', app), timer = $('#timer', app);
    const fmt = s => Math.floor(s / 60) + ':' + String(Math.abs(s) % 60).padStart(2, '0');
    const tick = () => {
      secs--; if (secs < 0) { over = true; timer.classList.add('over'); }
      tt.textContent = (over ? '+' : '') + fmt(Math.abs(secs < 0 ? -secs : secs));
      ring.style.strokeDashoffset = C * (1 - Math.max(0, secs) / S.opt.time);
    };
    tt.textContent = fmt(secs); tmr = setInterval(tick, 1000); onLeave(() => { clearInterval(tmr); stopRec(); });
    const metrics = () => {
      const t = ans.value.trim(); const w = t ? t.split(/\s+/).length : 0, f = (t.match(FILLERS) || []).length;
      const el = (S.opt.time - Math.max(secs, -999)) || 1, wpm = Math.round(w / (Math.max(1, el) / 60));
      $('#metrics', app).textContent = w ? `${w} palabras · ${f} muletilla${f === 1 ? '' : 's'}${el > 10 ? ' · ' + wpm + ' ppm' : ''}` : '';
    };
    ans.addEventListener('input', metrics);

    /* dictado */
    function stopRec() { if (rec && recOn) { try { rec.stop(); } catch (e) {} } recOn = false; }
    const mic = $('#mic', app);
    if (mic) mic.addEventListener('click', () => {
      if (recOn) { stopRec(); mic.textContent = '● Dictar'; return; }
      rec = new SR(); rec.lang = 'es-AR'; rec.continuous = true; rec.interimResults = false;
      rec.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) ans.value += (ans.value && !/\s$/.test(ans.value) ? ' ' : '') + e.results[i][0].transcript.trim(); metrics(); };
      rec.onend = () => { if (recOn) { try { rec.start(); } catch (e) {} } };
      rec.onerror = ev => { if (ev.error === 'not-allowed') { recOn = false; mic.textContent = '● Dictar'; toast('No me diste permiso para el micrófono'); } };
      try { rec.start(); recOn = true; mic.textContent = '■ Detener dictado'; } catch (e) { toast('No pude arrancar el dictado; probá de nuevo'); }
    });

    /* pizarra */
    const bw = $('#boardWrap', app), bc = $('#board', app); let ctx;
    $('#boardBtn', app).addEventListener('click', () => {
      bw.hidden = !bw.hidden; if (!bw.hidden && !ctx) {
        const dpr = window.devicePixelRatio || 1, r = bc.getBoundingClientRect(); bc.width = r.width * dpr; bc.height = r.height * dpr; ctx = bc.getContext('2d'); ctx.scale(dpr, dpr);
        ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; let d = false;
        const pos = e => { const q = bc.getBoundingClientRect(); return [e.clientX - q.left, e.clientY - q.top]; };
        bc.addEventListener('pointerdown', e => { d = true; ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--trace'); ctx.beginPath(); ctx.moveTo(...pos(e)); bc.setPointerCapture(e.pointerId); });
        bc.addEventListener('pointermove', e => { if (d) { ctx.lineTo(...pos(e)); ctx.stroke(); } });
        bc.addEventListener('pointerup', () => d = false);
      }
    });
    $('#clr', app).addEventListener('click', () => { if (ctx) ctx.clearRect(0, 0, bc.width, bc.height); });

    $('#done', app).addEventListener('click', () => {
      clearInterval(tmr); stopRec(); $('#done', app).disabled = true; metrics();
      const rv = $('#review', app);
      rv.innerHTML = `<div class="sectionhead" style="margin-top:22px"><h3 style="margin:0">Lo que el tribunal esperaba</h3></div>
        <p class="small mute">${st.hint ? 'Tildá los temas que cubriste.' : 'Tildá lo que dijiste con claridad y sin mirar.'} Sé honesto, que el que sale ganando sos vos.</p>
        ${st.k.map((k, i) => `<label class="check" style="text-transform:none;letter-spacing:0;font:inherit;color:inherit"><input type="checkbox" data-i="${i}"><span>${k}</span></label>`).join('')}
        ${st.err ? `<div class="callout"><b>Error típico</b><br>${st.err}</div>` : ''}
        <div class="row" style="margin-top:14px"><span class="mono" id="live">0 / ${st.k.length}</span><span class="sp"></span><button class="btn solid" id="next">${S.i + 1 >= S.steps.length ? 'Ver resultado' : 'Siguiente pregunta →'}</button></div>`;
      math(rv);
      rv.addEventListener('change', e => { const c = e.target.closest('input'); if (c) { c.closest('.check').classList.toggle('on', c.checked); $('#live', rv).textContent = $$('input:checked', rv).length + ' / ' + st.k.length; } });
      $('#next', rv).addEventListener('click', () => {
        const hit = $$('input', rv).map(c => c.checked), pct = hit.filter(Boolean).length / hit.length;
        S.res.push({ u: st.u, type: st.type, pct, miss: st.k.filter((_, i) => !hit[i]), q: st.q, words: ans.value.trim() ? ans.value.trim().split(/\s+/).length : 0, fill: (ans.value.match(FILLERS) || []).length });
        Store.bump(st.u, pct, st.type === 'exp' ? .25 : .4); S.i++; step(app, S);
      });
      rv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#quit', app).addEventListener('click', e => { if (S.res.length && !confirm('¿Dejás la defensa acá? Tranqui, lo que respondiste ya cuenta para tu progreso.')) e.preventDefault(); });
    ans.focus();
  }

  /* ---------- resumen ---------- */
  function summary(app, S) {
    const pct = S.res.reduce((a, r) => a + r.pct, 0) / S.res.length, uids = [...new Set(S.res.map(r => r.u))];
    const verdict = pct >= .8 ? ['Muy sólido', 'Con esto vas tranqui. Igual hacete una defensa completa de 3 bolillas.'] : pct >= .6 ? ['Aprobado (≥ 60 %)', 'Pasás el 60 %, pero repasá lo que te faltó antes de rendir.'] : ['Todavía no alcanza', 'Volvé al “hilo” de la unidad y a las deducciones, y después probá esta bolilla de nuevo.'];
    const words = S.res.reduce((a, r) => a + r.words, 0), fill = S.res.reduce((a, r) => a + r.fill, 0);
    const miss = S.res.filter(r => r.miss.length);
    app.innerHTML = `<div class="eyebrow">Resultado de la defensa</div><div class="row" style="align-items:flex-end"><div class="score" style="color:${pct >= .6 ? 'var(--good)' : 'var(--warn)'}">${Math.round(pct * 100)}%</div><div><h2 style="margin:0">${verdict[0]}</h2><span class="mute">${verdict[1]}</span></div></div>
    <div class="grid g2" style="margin-top:18px;align-items:start">
      <div class="card"><h3>Por pregunta</h3>${S.res.map(r => `<div class="bar"><span>${U(r.u).rom} · ${TYPES[r.type]}</span><div class="meter"><i style="width:${Math.round(r.pct * 100)}%"></i></div><span class="mono small">${Math.round(r.pct * 100)}%</span></div>`).join('')}
        ${words ? `<p class="small mute">Escribiste/dictaste ${words} palabras (${fill} muletillas).</p>` : ''}</div>
      <div class="card"><h3>Autoevaluación con la rúbrica</h3><p class="small mute">La cátedra no mira sólo lo que sabés, también cómo lo explicás. ¿Dónde te ponés?</p>
        ${RUBRIC.map((r, i) => `<div style="margin:10px 0"><label for="rb${i}">${r[0]} · ${r[1]}</label><div class="small mute" style="margin:2px 0 6px">${r[2]}</div><select id="rb${i}">${LEVELS.map((l, j) => `<option ${j === 2 ? 'selected' : ''}>${l}</option>`).join('')}</select></div>`).join('')}</div></div>
    ${miss.length ? `<div class="sectionhead"><h2>Lo que <em>falló</em></h2></div><div class="card"><p class="small mute">Lo que te faltó decir lo podés pasar a tarjetas para repasarlo.</p>${miss.map(r => `<details class="q"><summary>${pillHTML(r.type)}<span>${r.q}</span></summary><div class="body"><ul class="keys">${r.miss.map(k => `<li>${k}</li>`).join('')}</ul></div></details>`).join('')}<div class="row" style="margin-top:12px"><button class="btn" id="mk">Crear tarjetas con mis faltantes</button></div></div>` : '<div class="callout good" style="margin-top:20px"><b>Impecable</b><br>No te salteaste nada. Crack.</div>'}
    <div class="row" style="margin-top:22px"><a class="btn solid" href="#/bolillero">Otra bolilla</a><a class="btn" href="#/progreso">Ver mi progreso</a>${uids.length === 1 ? `<a class="btn ghost" href="#/unidad/${uids[0]}">Repasar la unidad</a>` : ''}</div>`;
    math(app);
    const sess = { t: Date.now(), units: uids, pct, rubric: null }; Store.s.sessions.push(sess); Store.save();
    RUBRIC.forEach((_, i) => $('#rb' + i, app).addEventListener('change', () => { sess.rubric = RUBRIC.map((__, j) => $('#rb' + j, app).value); Store.save(); }));
    sess.rubric = RUBRIC.map((_, j) => $('#rb' + j, app).value); Store.save();
    const mk = $('#mk', app);
    if (mk) mk.addEventListener('click', () => {
      let n = 0;
      miss.forEach(r => { const id = 'x' + r.u + '-' + r.q.slice(0, 24).replace(/\W+/g, '') + '-' + r.miss.length;
        if (Store.addCustom({ id, unit: r.u, f: '<strong>Defensa:</strong> ' + r.q, b: '<ul class="keys">' + r.miss.map(k => '<li>' + k + '</li>').join('') + '</ul>' })) n++; });
      toast(n ? n + ' tarjeta' + (n > 1 ? 's' : '') + ' nueva' + (n > 1 ? 's' : '') + ' en tu mazo' : 'Ya estaban en tu mazo'); mk.disabled = true;
    });
  }
})();
