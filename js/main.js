/* Arranque: tema, router, service worker */
(function () {
  const root = document.documentElement, btn = $('#themeBtn');
  const META = { dark: '#0d1017', light: '#eceef1' };
  const apply = t => {
    root.dataset.theme = t; try { localStorage.setItem('f2d.theme', t); } catch (e) {}
    document.querySelector('meta[name=theme-color]').content = META[t];
    Router.render({ instant: true }); // los canvas releen la paleta
  };
  btn.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reducedMotion()) { apply(t); return; }
    // Revelado circular desde el botón
    const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('theme-vt');
    const vt = document.startViewTransition(() => apply(t));
    vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
    vt.finished.catch(() => {}).then(() => root.classList.remove('theme-vt'));
  });

  // "Saltar al contenido" sin romper el router por hash
  $('.skip').addEventListener('click', e => { e.preventDefault(); $('#app').focus(); });

  // Borde de la barra superior sólo cuando hay scroll
  const bar = $('#topbar'); let ticking = false;
  const onScroll = () => { bar.classList.toggle('scrolled', scrollY > 8); ticking = false; };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  Router.render();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
