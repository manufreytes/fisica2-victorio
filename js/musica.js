/* Música de estudio: reproductor de Spotify integrado, disponible en todas las vistas.
   Vive fuera de #app, así que la música sigue sonando al navegar entre secciones. */
(function () {
  // ↓ Pegá acá el link de la playlist (Spotify → Compartir → Copiar enlace de la playlist)
  const PLAYLIST = 'https://open.spotify.com/playlist/4blc7R6sEmFVyOLFjlE79S';

  const m = /playlist\/([A-Za-z0-9]+)/.exec(PLAYLIST);
  if (!m || m[1] === 'PEGAR_ID_AQUI') { console.info('Música: falta configurar PLAYLIST en js/musica.js'); return; }
  const id = m[1], appUrl = 'https://open.spotify.com/playlist/' + id;
  const embedUrl = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;

  /* botón en la barra superior */
  const btn = document.createElement('button');
  btn.className = 'topbtn musicbtn'; btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'musica');
  btn.title = 'Música de estudio en Spotify';
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg><span>Spotify</span>';
  const anchor = $('.pausebtn') || $('#themeBtn');
  anchor.before(btn);

  /* panel con el reproductor (el iframe se carga recién la primera vez que se abre) */
  const panel = document.createElement('section');
  panel.className = 'musica'; panel.id = 'musica'; panel.setAttribute('aria-label', 'Música de estudio');
  panel.innerHTML = `<header><div><div class="eyebrow">Música de estudio</div><h2>Playlist <em>para concentrarse</em></h2></div>
      <button class="iconbtn" type="button" data-close aria-label="Cerrar el reproductor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
    <div class="player"></div>
    <footer><span class="mute small">Si iniciás sesión en Spotify en este navegador, se escuchan los temas completos.</span><a class="link" href="${appUrl}" target="_blank" rel="noopener">Abrir en la app <span class="arr" aria-hidden="true">↗</span></a></footer>`;
  document.body.appendChild(panel);

  let loaded = false;
  const setOpen = on => {
    if (on && !loaded) {
      loaded = true;
      $('.player', panel).innerHTML = `<iframe title="Playlist de estudio en Spotify" src="${embedUrl}" width="100%" height="352" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }
    panel.classList.toggle('open', on); btn.setAttribute('aria-expanded', String(on)); btn.classList.toggle('on', on);
    if (on) $('[data-close]', panel).focus({ preventScroll: true });
  };
  btn.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  $('[data-close]', panel).addEventListener('click', () => { setOpen(false); btn.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) { setOpen(false); btn.focus(); } });
})();
