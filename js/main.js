/* Arranque: tema, router, service worker */
(function () {
  const btn = $('#themeBtn');
  btn.addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t; try { localStorage.setItem('f2d.theme', t); } catch (e) {}
    document.querySelector('meta[name=theme-color]').content = t === 'dark' ? '#080d0b' : '#f3eedf';
    Router.render();
  });
  Router.render();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
