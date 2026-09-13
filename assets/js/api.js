/* =============================================================
   api.js — conversa com o api.php do servidor da Conexão
   Mesmas ações do site anterior: salvarContato, salvarDiagnostico,
   registrarEvento, getConteudosDestaque, getConteudoPublico.
   ============================================================= */
(function () {
  'use strict';

  // Páginas em subpasta declaram data-base="../" no <html>
  var base = document.documentElement.getAttribute('data-base') || '';
  var API_URL = base + 'api.php';

  function apiPost(action, data) {
    return fetch(API_URL + '?action=' + encodeURIComponent(action), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {})
    })
      .then(function (r) { return r.ok ? r.json() : { status: 'error' }; })
      .catch(function () { return { status: 'error' }; });
  }

  // Teste local (sem api.php): não registra métrica, evita ruído no console
  // Prévia no GitHub Pages também não tem api.php
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /\.github\.io$/.test(location.hostname) || location.protocol === 'file:';

  function trackEvent(evento, extra) {
    if (local) return Promise.resolve({ status: 'local' });
    return apiPost('registrarEvento', Object.assign({
      evento: evento,
      pagina: location.pathname,
      referrer: document.referrer
    }, extra || {}));
  }

  window.Conexao = window.Conexao || {};
  window.Conexao.base = base;
  window.Conexao.apiPost = apiPost;
  window.Conexao.trackEvent = trackEvent;
  window.Conexao.WA = '5565981172676';
})();
