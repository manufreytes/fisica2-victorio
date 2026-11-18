/* Utilidades de interfaz + router por hash */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const U = id => F2.units.find(u => u.id == id);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/** Markdown mínimo: párrafos, **negrita**. Las fórmulas $..$ las renderiza KaTeX. */
function md(s) {
  return s.trim().split(/\n\s*\n/).map(p => '<p>' + p.trim().replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>').replace(/\n/g, ' ') + '</p>').join('');
}
function math(el) {
  if (!window.renderMathInElement) return;
  try {
    renderMathInElement(el || document.body, {
      delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
      throwOnError: false, ignoredTags: ['script', 'noscript', 'style', 'textarea', 'code']
    });
  } catch (e) { console.warn(e); }
}
function toast(msg, ms = 2200) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}
const BLOCK = { 'Electrostática': 'var(--trace3)', 'Electrodinámica': 'var(--trace2)', 'Magnetismo': 'var(--trace)', 'Ondas y CA': 'var(--trace4)', 'Óptica': 'var(--trace5)' };
const unitColor = u => BLOCK[(typeof u === 'object' ? u : U(u)).block];
const TYPES = { def: 'Definición', ded: 'Deducción', apl: 'Aplicación', cruz: 'Pregunta cruzada', pte: 'Pregunta puente', exp: 'Exposición libre' };
const pillHTML = t => `<span class="pill ${t}">${TYPES[t]}</span>`;
const pctTxt = x => x == null ? '—' : Math.round(x * 100) + '%';

/* ---------- router ---------- */
const Router = (() => {
  const routes = []; let cleanups = []; let lastPath = null; const state = { query: {} };
  function add(pattern, name, fn) {
    const keys = []; const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/?]+)'; }) + '$');
    routes.push({ re, keys, name, fn });
  }
  function onLeave(fn) { cleanups.push(fn); }
  function render() {
    cleanups.splice(0).forEach(f => { try { f(); } catch (e) {} });
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?'); state.query = Object.fromEntries(new URLSearchParams(qs || ''));
    const app = $('#app');
    for (const r of routes) {
      const m = r.re.exec(path); if (!m) continue;
      const params = {}; r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1]));
      $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.r === r.name));
      app.innerHTML = '';
      try { r.fn(params, app); } catch (e) { console.error(e); app.innerHTML = '<div class="card">Ocurrió un error al cargar esta vista. Probá recargar la página.</div>'; }
      math(app);
      if (path !== lastPath) window.scrollTo(0, 0);
      lastPath = path; return;
    }
    location.hash = '#/';
  }
  window.addEventListener('hashchange', render);
  return { add, render, onLeave, state };
})();
const route = Router.add, onLeave = Router.onLeave;

/* ---------- ayudas de formularios ---------- */
function slider(id, label, min, max, step, val, fmt) {
  return `<div class="rd"><label for="${id}">${label}<span class="v" id="${id}v">${fmt ? fmt(val) : val}</span></label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
}
function bindSlider(root, id, fn, fmt) {
  const el = $('#' + id, root), v = $('#' + id + 'v', root);
  const f = () => { const x = parseFloat(el.value); if (v) v.textContent = fmt ? fmt(x) : x; fn(x); };
  el.addEventListener('input', f); return el;
}
function segs(id, opts, cur) {
  return `<div class="segs" id="${id}">${opts.map(([k, l]) => `<button data-k="${k}" class="${k == cur ? 'on' : ''}">${l}</button>`).join('')}</div>`;
}
function bindSegs(root, id, fn) {
  const box = $('#' + id, root);
  box.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', box).forEach(x => x.classList.toggle('on', x === b)); fn(b.dataset.k);
  });
}

/* El "<" dentro de fórmulas ($r<R$) rompería el HTML: se escapa en todo el contenido al cargar. */
(function () {
  const keep = /^<\/?(strong|em|ul|li|ol|br)[\s>\/]/;
  const fix = s => s.replace(/</g, (m, off) => keep.test(s.slice(off, off + 12)) ? m : '&lt;');
  const walk = o => { if (Array.isArray(o)) o.forEach((v, i) => { if (typeof v === 'string') o[i] = fix(v); else walk(v); }); else if (o && typeof o === 'object') for (const k in o) { if (typeof o[k] === 'string') o[k] = fix(o[k]); else walk(o[k]); } };
  walk(F2.units); walk(F2.bridges);
})();
