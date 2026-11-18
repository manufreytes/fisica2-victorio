/* Arranque: tema, router, service worker */
(function () {
  const root = document.documentElement, btn = $('#themeBtn');
  const META = { dark: '#0A1929', light: '#F7F9FC' };
  const apply = t => {
    root.dataset.theme = t; try { localStorage.setItem('f2d.theme', t); } catch (e) {}
    document.querySelector('meta[name=theme-color]').content = META[t];
    Router.render({ instant: true }); // los canvas releen la paleta
  };
  btn.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reducedMotion()) { apply(t); return; }
    // Fundido suave de toda la página
    root.classList.add('theme-vt');
    const vt = document.startViewTransition(() => apply(t));
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

  /* Aviso de visita al dueño del sitio (ntfy.sh): una vez por sesión, sin datos personales.
     Para no notificar tus propias visitas, abrí una vez la web con ?yo (p. ej. .../fisica2-victorio/?yo). */
  try {
    const TOPIC = 'f2d-68757fe9e0d7';
    if (new URLSearchParams(location.search).has('yo')) localStorage.setItem('f2d.owner', '1');
    const skip = localStorage.getItem('f2d.owner') || sessionStorage.getItem('f2d.pinged') || !location.protocol.startsWith('http') || /^(localhost|127\.)/.test(location.hostname);
    if (!skip) {
      sessionStorage.setItem('f2d.pinged', '1');
      const dev = matchMedia('(max-width:860px)').matches ? 'celular' : 'compu';
      fetch(`https://ntfy.sh/${TOPIC}?title=${encodeURIComponent('Visita a Física II')}&tags=books`, { method: 'POST', body: `Alguien entró desde ${dev}.`, keepalive: true }).catch(() => {});
    }
  } catch (e) {}

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
