/* =============================================================
   blog.js — lista de artigos e leitura (/blog#<slug>)
   Lê do api.php (getConteudosDestaque / getConteudoPublico).
   Sem servidor (teste local), usa a cópia em assets/data/blog-exemplo.json.
   ============================================================= */
(function () {
  'use strict';
  var C = window.Conexao;
  var lista = document.getElementById('blog-lista');
  var grade = document.getElementById('blog-grade');
  var contagem = document.getElementById('blog-contagem');
  var leitura = document.getElementById('blog-post');
  var corpo = document.getElementById('post-conteudo');
  if (!grade || !leitura) return;

  var CAT = {
    'AI Agents':         { cor: 'cor-teal',  icone: 'solar:cpu-bolt-linear' },
    'Micro SaaS':        { cor: 'cor-coral', icone: 'solar:widget-5-linear' },
    'Cloud Computing':   { cor: 'cor-amber', icone: 'solar:cloud-storage-linear' },
    'Consultoria em TI': { cor: 'cor-ink',   icone: 'solar:chart-square-linear' },
    'Automação':         { cor: 'cor-teal',  icone: 'solar:settings-minimalistic-linear' }
  };
  function cat(c) { return CAT[c] || { cor: 'cor-teal', icone: 'solar:document-text-linear' }; }

  var meta = {
    titulo: document.title,
    desc: (document.querySelector('meta[name="description"]') || {}).content || ''
  };
  var cache = [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function data(dt, longa) {
    if (!dt) return '';
    var d = new Date(String(dt).replace(' ', 'T'));
    if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-BR', longa ? { day: '2-digit', month: 'long', year: 'numeric' } : { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function iniciais(nome) {
    return String(nome || 'Itamar Pereira').split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase();
  }

  function cartao(p, i) {
    var c = cat(p.categoria);
    // O ícone da categoria fica sempre por baixo: se a imagem demorar ou falhar, o cartão não fica vazio
    var capa = '<span class="post-capa__ic"><iconify-icon icon="' + c.icone + '" width="34"></iconify-icon></span>' +
      (p.imagem_url ? '<img src="' + esc(p.imagem_url) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '');
    return '<a class="cartao post-cartao ' + c.cor + (i === 0 ? ' post-cartao--primeiro' : '') + '" href="#' + esc(p.slug) + '" data-slug="' + esc(p.slug) + '">' +
      '<span class="post-capa">' + capa + '</span>' +
      '<span class="post-cartao__corpo">' +
        '<span class="post-meta">' + (p.categoria ? '<span class="selo">' + esc(p.categoria) + '</span>' : '') + '<time>' + data(p.publicado_em) + '</time></span>' +
        '<span class="post-cartao__titulo">' + esc(p.titulo) + '</span>' +
        '<span class="post-cartao__resumo">' + esc(p.meta_description || '') + '</span>' +
        '<span class="post-cartao__pe"><span class="autor"><span class="autor__av">' + iniciais(p.autor) + '</span>' + esc(p.autor || 'Itamar Pereira') + '</span><span class="link-seta">Ler <iconify-icon icon="solar:arrow-right-linear" width="14"></iconify-icon></span></span>' +
      '</span></a>';
  }

  function aviso(txt) { grade.innerHTML = '<p class="blog-aviso">' + esc(txt) + '</p>'; }

  function carregarLista() {
    aviso('Carregando artigos...');
    return C.apiPost('getConteudosDestaque', {}).then(function (r) {
      if (r && r.status === 'success') return { dados: r.data || [], exemplo: false };
      return fetch(C.base + 'assets/data/blog-exemplo.json')
        .then(function (x) { return x.json(); })
        .then(function (j) { return { dados: j.data || [], exemplo: true }; })
        .catch(function () { return { dados: [], exemplo: false }; });
    }).then(function (res) {
      cache = res.dados;
      if (!cache.length) {
        aviso('Nenhum artigo publicado ainda. Volte em breve!');
        if (contagem) contagem.textContent = '0 artigos publicados';
        return;
      }
      var n = cache.length;
      if (contagem) contagem.textContent = n + ' artigo' + (n !== 1 ? 's' : '') + ' publicado' + (n !== 1 ? 's' : '');
      mostrados = 0;
      grade.innerHTML = '';
      mostrarMais();
      grade.classList.toggle('exemplo', res.exemplo);
    });
  }

  /* Paginação: 12 artigos por vez, o resto sob demanda */
  var POR_PAGINA = 12;
  var mostrados = 0;
  var maisBtn = document.getElementById('blog-mais');
  function mostrarMais() {
    var lote = cache.slice(mostrados, mostrados + POR_PAGINA);
    grade.insertAdjacentHTML('beforeend', lote.map(function (p, i) { return cartao(p, mostrados + i); }).join(''));
    mostrados += lote.length;
    if (maisBtn) maisBtn.hidden = mostrados >= cache.length;
  }
  if (maisBtn) maisBtn.addEventListener('click', mostrarMais);

  function atualizaMeta(p) {
    document.title = p.titulo + ' | Conexão Tecnologia e Serviços';
    var m = document.querySelector('meta[name="description"]');
    if (m && p.meta_description) m.content = p.meta_description;
    var canon = document.querySelector('link[rel="canonical"]');
    if (canon) canon.href = 'https://conexaots.com/blog#' + p.slug;
  }
  function restauraMeta() {
    document.title = meta.titulo;
    var m = document.querySelector('meta[name="description"]');
    if (m) m.content = meta.desc;
    var canon = document.querySelector('link[rel="canonical"]');
    if (canon) canon.href = 'https://conexaots.com/blog';
  }

  function mostraLista() {
    leitura.hidden = true;
    lista.hidden = false;
    restauraMeta();
  }

  function abrirPost(slug) {
    lista.hidden = true;
    leitura.hidden = false;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    corpo.innerHTML = '<p class="blog-aviso">Carregando artigo...</p>';

    C.apiPost('getConteudoPublico', { slug: slug }).then(function (r) {
      var p = r && r.status === 'success' && r.data ? r.data : null;
      var resumo = null;
      if (!p) resumo = cache.filter(function (x) { return x.slug === slug; })[0] || null;
      if (!p && !resumo) {
        corpo.innerHTML = '<p class="blog-aviso">Artigo não encontrado.</p>';
        return;
      }
      p = p || resumo;
      atualizaMeta(p);
      var c = cat(p.categoria);
      var html;
      if (p.content_blog) {
        var md = window.marked ? window.marked.parse(p.content_blog) : '<p>' + esc(p.content_blog).replace(/\n/g, '<br>') + '</p>';
        html = window.DOMPurify ? window.DOMPurify.sanitize(md) : md;
      } else {
        html = '<p>' + esc(p.meta_description || '') + '</p><p class="blog-aviso">O texto completo aparece quando o site está no servidor da Conexão.</p>';
      }
      corpo.innerHTML =
        '<header class="post-cabeca ' + c.cor + '">' +
          (p.categoria ? '<span class="selo">' + esc(p.categoria) + '</span>' : '') +
          '<h1>' + esc(p.titulo) + '</h1>' +
          '<div class="post-meta post-meta--grande"><span class="autor"><span class="autor__av">' + iniciais(p.autor) + '</span>' + esc(p.autor || 'Itamar Pereira') + '</span>' +
          (p.publicado_em ? '<time>' + data(p.publicado_em, true) + '</time>' : '') + '</div>' +
        '</header>' +
        (p.imagem_url ? '<img class="post-imagem" src="' + esc(p.imagem_url) + '" alt="' + esc(p.titulo) + '" onerror="this.remove()">' : '') +
        '<div class="prosa">' + html + '</div>' +
        '<aside class="post-cta bloco-escuro">' +
          '<p>Quer tecnologia que se adapta ao seu negócio? Comece com um diagnóstico gratuito.</p>' +
          '<button class="btn btn-claro" type="button" data-diagnostico="blog-post">Agendar diagnóstico gratuito <iconify-icon icon="solar:arrow-right-linear" width="16"></iconify-icon></button>' +
        '</aside>';
      if (C.trackEvent) C.trackEvent('post_view', { slug: slug });
    });
  }

  function rota() {
    var slug = decodeURIComponent(location.hash.replace('#', ''));
    if (slug && slug !== 'diagnostico') abrirPost(slug); else mostraLista();
  }

  document.addEventListener('click', function (e) {
    var voltar = e.target.closest('[data-voltar-blog]');
    if (voltar) { e.preventDefault(); history.pushState({}, '', location.pathname); mostraLista(); }
  });
  window.addEventListener('hashchange', rota);
  window.addEventListener('popstate', rota);

  carregarLista().then(rota);
})();
