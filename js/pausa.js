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
    <div class="eyebrow">Break</div>
    <h2 id="pausaT">¿Ya? <em>Bueno, dale</em></h2>
    <p class="mute">Elegí cuánto querés cortar. Cuando vuelvas te digo cuánto te queda. Y volvé, gordo vago, que te conozco.</p>
    <fieldset class="dur"><legend>Duración</legend>
      ${[5, 10, 15].map(m => `<label><input type="radio" name="dur" value="${m}" ${m === 5 ? 'checked' : ''}><span>${m} min</span></label>`).join('')}
    </fieldset>
    <div class="apps">${Object.entries(APPS).map(([k, [n]]) => `<button class="btn solid" value="${k}">Abrir ${n} <span class="arr" aria-hidden="true">↗</span></button>`).join('')}</div>
    <div class="row foot"><button class="btn ghost" value="solo">Nada de apps, sólo tirarme un rato</button><span class="sp"></span><button class="btn ghost" value="cancel">Cancelar</button></div>
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
  btn.className = 'topbtn pausebtn'; btn.type = 'button'; btn.title = 'Tomar un break: TikTok o Reels'; btn.setAttribute('aria-label', 'Tomar un break');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg><span>Break</span>';
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
        document.title = `Break · ${mmss(left)} — Física II`;
        if (!document.hidden) showBar(`<span class="dot" aria-hidden="true"></span><span><strong>Estás en break, vaguito.</strong> Te quedan <span class="mono">${mmss(left)}</span>.</span><span class="sp"></span>${APPS[p.app] ? `<button class="btn sm" data-a="app">Volver a ${APPS[p.app][0]}</button>` : ''}<button class="btn sm solid" data-a="end">Ya vuelvo a estudiar</button>`);
      } else {
        document.title = '¡Volvé, vago! Se terminó el break';
        if (!document.hidden) showBar(`<span class="dot done" aria-hidden="true"></span><span><strong>Se terminó el break.</strong> Soltá el celu y volvé con tu unidad más floja.</span><span class="sp"></span><button class="btn sm" data-a="end">Cerrar</button><button class="btn sm solid" data-a="back">Volver a estudiar <span class="arr" aria-hidden="true">→</span></button>`);
      }
      return;
    }
    if (!document.hidden && !dlg.open) studied += dt; // sólo cuenta el tiempo con la pestaña visible
    if (studied >= SUGGEST_AFTER && bar.hidden && !inDefense())
      showBar(`<span class="dot" aria-hidden="true"></span><span>Llevás <strong>${Math.round(studied / 60)} minutos</strong> dándole. ¿Quién te viera? Cortá un toque, que así se te fija mejor.</span><span class="sp"></span><button class="btn sm" data-a="later">Ahora no</button><button class="btn sm solid" data-a="open">Tomarme un break</button>`);
  }
  setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { last = now(); tick(); });
  tick();
})();
