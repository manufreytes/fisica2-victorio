/* Pausa de estudio: descanso con tiempo, acceso directo a TikTok / Reels y regreso guiado */
(function () {
  const KEY = 'f2d.pausa', SUGGEST_AFTER = 25 * 60; // segundos de estudio activo antes de sugerir
  const APPS = { tiktok: ['TikTok', 'https://www.tiktok.com/foryou'], reels: ['Reels', 'https://www.instagram.com/reels/'] };
  const now = () => Date.now();
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const set = v => { try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch (e) {} };
  const mmss = s => Math.floor(s / 60) + ':' + String(Math.max(0, s) % 60).padStart(2, '0');
  const inDefense = () => !!$('#ans'); // hay una pregunta del tribunal en curso

  /* ---------- diálogo ---------- */
  const dlg = document.createElement('dialog');
  dlg.className = 'pausa'; dlg.setAttribute('aria-labelledby', 'pausaT');
  dlg.innerHTML = `<form method="dialog">
    <div class="eyebrow">Pausa de estudio</div>
    <h2 id="pausaT">Un descanso <em>corto</em> rinde más</h2>
    <p class="mute">Elegí cuánto dura. Cuando vuelvas a esta pestaña te muestro el tiempo que queda.</p>
    <fieldset class="dur"><legend>Duración</legend>
      ${[5, 10, 15].map(m => `<label><input type="radio" name="dur" value="${m}" ${m === 5 ? 'checked' : ''}><span>${m} min</span></label>`).join('')}
    </fieldset>
    <div class="apps">${Object.entries(APPS).map(([k, [n]]) => `<button class="btn solid" value="${k}">Abrir ${n} <span class="arr" aria-hidden="true">↗</span></button>`).join('')}</div>
    <div class="row foot"><button class="btn ghost" value="solo">Sólo descansar, sin apps</button><span class="sp"></span><button class="btn ghost" value="cancel">Cancelar</button></div>
  </form>`;
  document.body.appendChild(dlg);
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close('cancel'); }); // clic fuera
  $$('button[value]', dlg).forEach(b => b.addEventListener('click', () => {
    const v = b.value; if (v === 'cancel') return;
    const min = +$('input[name=dur]:checked', dlg).value;
    set({ end: now() + min * 60e3, min, app: v });
    hideBar();
    if (APPS[v]) window.open(APPS[v][1], '_blank', 'noopener');
    tick();
  }));
  const open = () => { if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', ''); };

  /* ---------- botón en la barra superior ---------- */
  const btn = document.createElement('button');
  btn.className = 'topbtn pausebtn'; btn.type = 'button'; btn.title = 'Tomar una pausa'; btn.setAttribute('aria-label', 'Tomar una pausa');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3.5c0 1 1 1 1 2s-1 1-1 2M12 3.5c0 1 1 1 1 2s-1 1-1 2"/></svg><span>Pausa</span>';
  $('#themeBtn').before(btn);
  btn.addEventListener('click', open);

  /* ---------- franja inferior ---------- */
  const bar = document.createElement('div');
  bar.className = 'breakbar'; bar.setAttribute('role', 'status'); bar.setAttribute('aria-live', 'polite'); bar.hidden = true;
  document.body.appendChild(bar);
  function hideBar() { bar.hidden = true; bar.classList.remove('in'); }
  function showBar(html) { bar.innerHTML = `<div class="in">${html}</div>`; if (bar.hidden) { bar.hidden = false; requestAnimationFrame(() => bar.classList.add('in')); } }
  bar.addEventListener('click', e => {
    const a = e.target.closest('[data-a]'); if (!a) return;
    const act = a.dataset.a;
    if (act === 'open') open();
    if (act === 'app') { const p = get(); if (p && APPS[p.app]) window.open(APPS[p.app][1], '_blank', 'noopener'); }
    if (act === 'end' || act === 'back' || act === 'later') { set(null); studied = act === 'later' ? SUGGEST_AFTER - 10 * 60 : 0; hideBar(); document.title = baseTitle; }
    if (act === 'back') { const w = F2.units.map(u => [u, Store.mastery(u.id)]).sort((a, b) => (a[1] ?? -1) - (b[1] ?? -1))[0][0]; location.hash = '#/unidad/' + w.id; }
  });

  /* ---------- reloj ---------- */
  const baseTitle = document.title; let studied = 0, last = now();
  function tick() {
    const p = get(), t = now(), dt = Math.min(5, (t - last) / 1000); last = t;
    if (p) {
      const left = Math.round((p.end - t) / 1000);
      if (left > 0) {
        document.title = `Pausa · ${mmss(left)} — Física II`;
        if (!document.hidden) showBar(`<span class="dot" aria-hidden="true"></span><span><strong>En pausa.</strong> Quedan <span class="mono">${mmss(left)}</span>.</span><span class="sp"></span>${APPS[p.app] ? `<button class="btn sm" data-a="app">Volver a ${APPS[p.app][0]}</button>` : ''}<button class="btn sm solid" data-a="end">Terminar la pausa</button>`);
      } else {
        document.title = 'Se terminó la pausa — Física II';
        if (!document.hidden) showBar(`<span class="dot done" aria-hidden="true"></span><span><strong>Se terminó la pausa.</strong> Retomá por tu unidad más floja.</span><span class="sp"></span><button class="btn sm" data-a="end">Cerrar</button><button class="btn sm solid" data-a="back">Retomar <span class="arr" aria-hidden="true">→</span></button>`);
      }
      return;
    }
    if (!document.hidden && !dlg.open) studied += dt; // sólo cuenta el tiempo con la pestaña visible
    if (studied >= SUGGEST_AFTER && bar.hidden && !inDefense())
      showBar(`<span class="dot" aria-hidden="true"></span><span>Llevás <strong>${Math.round(studied / 60)} minutos</strong> de estudio. Un descanso corto ayuda a fijar lo que viste.</span><span class="sp"></span><button class="btn sm" data-a="later">Más tarde</button><button class="btn sm solid" data-a="open">Tomar una pausa</button>`);
  }
  setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { last = now(); tick(); });
  tick();
})();
