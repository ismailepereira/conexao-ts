/* =============================================================
   main.js — navegação, revelação, marca, WhatsApp e diálogo
   ============================================================= */
(function () {
  'use strict';
  var C = window.Conexao || {};
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabeçalho ---------- */
  var topo = document.querySelector('.topo');
  function aoRolar() {
    if (topo) topo.classList.toggle('rolou', window.scrollY > 12);
    var wa = document.querySelector('.wa-flutua');
    if (wa) wa.classList.toggle('on', window.scrollY > 420);
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  /* Menu Serviços (desktop) */
  var dropBtn = document.querySelector('.menu__drop-btn');
  var drop = document.getElementById('drop-servicos');
  function fechaDrop() {
    if (!dropBtn) return;
    dropBtn.setAttribute('aria-expanded', 'false');
    drop.classList.remove('aberto');
  }
  if (dropBtn && drop) {
    dropBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var abrir = dropBtn.getAttribute('aria-expanded') !== 'true';
      dropBtn.setAttribute('aria-expanded', String(abrir));
      drop.classList.toggle('aberto', abrir);
    });
    document.addEventListener('click', function (e) { if (!drop.contains(e.target)) fechaDrop(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { fechaDrop(); } });
  }

  /* Menu móvel */
  var ham = document.querySelector('.hamburguer');
  var movel = document.getElementById('menu-movel');
  if (ham && movel) {
    ham.addEventListener('click', function () {
      var abrir = movel.hidden;
      movel.hidden = !abrir;
      ham.setAttribute('aria-expanded', String(abrir));
      ham.querySelector('iconify-icon').setAttribute('icon', abrir ? 'solar:close-circle-linear' : 'solar:hamburger-menu-linear');
    });
    movel.addEventListener('click', function (e) {
      if (e.target.closest('a')) { movel.hidden = true; ham.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------- Revelação no scroll ---------- */
  var revelar = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduz) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revelar.forEach(function (el) { io.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Marca: desenho dos três traços e o mapa de conexão ---------- */
  document.querySelectorAll('.desenha').forEach(function (svg) {
    requestAnimationFrame(function () { svg.classList.add('vivo'); });
  });
  var mapa = document.querySelector('.mapa');
  if (mapa) {
    requestAnimationFrame(function () { mapa.classList.add('vivo'); });
    mapa.querySelectorAll('.no').forEach(function (no) {
      var cor = no.getAttribute('data-cor');
      function liga() { mapa.setAttribute('data-ativo', cor); }
      function desliga() { mapa.removeAttribute('data-ativo'); }
      no.addEventListener('mouseenter', liga);
      no.addEventListener('focus', liga);
      no.addEventListener('mouseleave', desliga);
      no.addEventListener('blur', desliga);
    });
  }

  /* ---------- Diálogo do diagnóstico ---------- */
  var dialogo = document.getElementById('dialogo-diagnostico');
  function abreDiagnostico(origem) {
    if (!dialogo) return;
    if (typeof dialogo.showModal === 'function') dialogo.showModal();
    else dialogo.setAttribute('open', '');
    var primeiro = dialogo.querySelector('input:not([type=hidden])');
    if (primeiro) setTimeout(function () { primeiro.focus(); }, 60);
    if (C.trackEvent) C.trackEvent('diagnostico_aberto', { origem: origem || '' });
  }
  function fechaDiagnostico() {
    if (!dialogo) return;
    if (typeof dialogo.close === 'function') dialogo.close(); else dialogo.removeAttribute('open');
  }
  C.abreDiagnostico = abreDiagnostico;
  C.fechaDiagnostico = fechaDiagnostico;

  document.addEventListener('click', function (e) {
    var gatilho = e.target.closest('[data-diagnostico]');
    if (gatilho) { e.preventDefault(); abreDiagnostico(gatilho.getAttribute('data-diagnostico')); }
    if (e.target.closest('[data-fecha-dialogo]')) fechaDiagnostico();
  });
  if (dialogo) {
    dialogo.addEventListener('click', function (e) { if (e.target === dialogo) fechaDiagnostico(); });
  }
  if (location.hash === '#diagnostico') abreDiagnostico('link');

  /* ---------- Máscara de telefone ---------- */
  function mascaraFone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 3) + ' ' + d.slice(3, 7) + '-' + d.slice(7);
  }
  document.querySelectorAll('input[type=tel]').forEach(function (el) {
    el.addEventListener('input', function () { el.value = mascaraFone(el.value); });
  });
  C.mascaraFone = mascaraFone;

  /* ---------- Métricas (mesmo registrarEvento do site anterior) ---------- */
  if (C.trackEvent) {
    C.trackEvent('pageview');
    document.addEventListener('click', function (e) {
      var alvo = e.target.closest('.btn-3d, [data-wa]');
      if (alvo) C.trackEvent('cta_click', { pagina: (alvo.textContent || '').trim().slice(0, 60) });
    });
  }
})();
