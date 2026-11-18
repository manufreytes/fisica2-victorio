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
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg><span>Spotify</span>';
  const anchor = $('.pausebtn') || $('#themeBtn');
  anchor.before(btn);

  /* panel con el reproductor (el iframe se carga recién la primera vez que se abre) */
  const panel = document.createElement('section');
  panel.className = 'musica'; panel.id = 'musica'; panel.setAttribute('aria-label', 'Música de estudio');
  panel.innerHTML = `<header><div><div class="eyebrow">Música de estudio</div><h2>Música para <em>meterle</em></h2></div>
      <button class="iconbtn" type="button" data-close aria-label="Cerrar el reproductor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
    <div class="player"></div>
    <footer><span class="mute small">Si entrás con tu cuenta de Spotify en este navegador, te pasa los temas enteros.</span><a class="link" href="${appUrl}" target="_blank" rel="noopener">Abrir en la app <span class="arr" aria-hidden="true">↗</span></a></footer>`;
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
