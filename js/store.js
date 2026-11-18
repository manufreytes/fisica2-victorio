/* Persistencia local (localStorage). Todo queda en el navegador de quien estudia. */
(function () {
  const KEY = 'f2d.v1';
  const def = () => ({ v: 1, m: {}, cards: {}, custom: [], ded: {}, vf: {}, sessions: [], exam: null, active: {}, vfStreak: 0 });
  let S = def();
  try { const r = localStorage.getItem(KEY); if (r) S = Object.assign(def(), JSON.parse(r)); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const dkey = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  window.Store = {
    get s() { return S; },
    save,
    touch() { const k = dkey(); S.active[k] = (S.active[k] || 0) + 1; },
    /** Media móvil exponencial del dominio de una unidad (0..1). */
    bump(u, score, alpha) {
      const m = S.m[u] || { s: null, n: 0 };
      m.s = m.s == null ? score : m.s * (1 - alpha) + score * alpha;
      m.n++; S.m[u] = m; this.touch(); save();
    },
    mastery(u) { const m = S.m[u]; return m && m.s != null ? m.s : null; },
    total() {
      const v = F2.units.map(u => this.mastery(u.id)).map(x => x == null ? 0 : x);
      return v.reduce((a, b) => a + b, 0) / v.length;
    },
    streak() {
      let n = 0; const d = new Date();
      if (!S.active[dkey(d)]) d.setDate(d.getDate() - 1);
      while (S.active[dkey(d)]) { n++; d.setDate(d.getDate() - 1); }
      return n;
    },
    allCards() {
      const out = [];
      F2.units.forEach(u => u.cards.forEach((c, i) => out.push({ id: 'u' + u.id + 'c' + i, unit: u.id, f: c[0], b: c[1] })));
      S.custom.forEach(c => out.push(c));
      return out;
    },
    dueCards(unit) {
      const now = Date.now();
      return this.allCards().filter(c => (!unit || c.unit == unit) && (!S.cards[c.id] || S.cards[c.id].due <= now));
    },
    addCustom(card) { if (!S.custom.some(c => c.id === card.id)) { S.custom.push(card); save(); return true; } return false; },
    exportJSON() { return JSON.stringify(S, null, 1); },
    importJSON(txt) { const o = JSON.parse(txt); if (!o || o.v !== 1) throw new Error('Formato inválido'); S = Object.assign(def(), o); save(); },
    reset() { S = def(); save(); },
    dkey
  };
})();
