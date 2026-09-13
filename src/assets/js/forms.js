/* =============================================================
   forms.js — contato (salvarContato) e diagnóstico (salvarDiagnostico)
   Mesmos campos e mensagens do site anterior.
   ============================================================= */
(function () {
  'use strict';
  var C = window.Conexao || {};
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function valorDe(form, nome) {
    var el = form.elements[nome];
    return el ? String(el.value || '').trim() : '';
  }
  function status(form, tipo, texto) {
    var box = form.querySelector('.form-status');
    if (!box) return;
    box.hidden = !texto;
    box.className = 'form-status' + (tipo ? ' ' + tipo : '');
    box.textContent = texto || '';
  }
  function marcaErro(el, msg) {
    var campo = el.closest('.campo');
    if (!campo) return;
    var aviso = campo.querySelector('.campo__erro');
    if (msg) {
      campo.classList.add('erro');
      el.setAttribute('aria-invalid', 'true');
      if (!aviso) { aviso = document.createElement('span'); aviso.className = 'campo__erro'; campo.appendChild(aviso); }
      aviso.textContent = msg;
    } else {
      campo.classList.remove('erro');
      el.removeAttribute('aria-invalid');
      if (aviso) aviso.remove();
    }
  }
  function foneValido(v) { var d = v.replace(/\D/g, ''); return d.length >= 10 && d.length <= 11; }

  /* Validação ao sair do campo, com as mensagens do site anterior */
  function validarAoSair(el, teste, msg) {
    if (!el) return;
    el.addEventListener('blur', function () {
      var v = el.value.trim();
      if (!v && !el.required) { marcaErro(el, ''); return; }
      marcaErro(el, teste(v) ? '' : msg);
    });
    el.addEventListener('input', function () { if (el.closest('.campo.erro') && teste(el.value.trim())) marcaErro(el, ''); });
  }
  document.querySelectorAll('input[name=nome]').forEach(function (el) { validarAoSair(el, function (v) { return v.length >= 2; }, 'Campo obrigatório'); });
  document.querySelectorAll('input[type=email]').forEach(function (el) { validarAoSair(el, function (v) { return EMAIL.test(v); }, 'E-mail inválido'); });
  document.querySelectorAll('input[type=tel]').forEach(function (el) { validarAoSair(el, foneValido, 'Informe um número válido com DDD'); });

  function botaoEnviando(form, ligado, textoOriginal) {
    var btn = form.querySelector('button[type=submit]');
    if (!btn) return;
    if (ligado) {
      btn.dataset.html = btn.innerHTML;
      btn.textContent = 'Enviando...';
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.html || textoOriginal || btn.innerHTML;
      btn.disabled = false;
    }
  }

  /* ---------- Contato ---------- */
  var contato = document.getElementById('form-contato');
  if (contato) {
    contato.addEventListener('submit', function (e) {
      e.preventDefault();
      if (valorDe(contato, 'site')) return; // isca para robôs
      var dados = {
        nome: valorDe(contato, 'nome'),
        empresa: valorDe(contato, 'empresa'),
        email: valorDe(contato, 'email'),
        telefone: valorDe(contato, 'telefone'),
        servico: valorDe(contato, 'servico'),
        mensagem: valorDe(contato, 'mensagem')
      };
      if (!dados.nome || !dados.email || !dados.mensagem) {
        status(contato, 'err', '⚠️ Preencha: Nome, E-mail e Mensagem.');
        return;
      }
      if (!EMAIL.test(dados.email)) {
        status(contato, 'err', '⚠️ E-mail inválido.');
        marcaErro(contato.elements.email, 'E-mail inválido');
        return;
      }
      status(contato, '', '');
      botaoEnviando(contato, true);
      C.apiPost('salvarContato', dados).then(function (r) {
        botaoEnviando(contato, false);
        if (r && r.status === 'success') {
          status(contato, 'ok', '✅ Mensagem enviada! Retornaremos em breve.');
          contato.reset();
          if (C.trackEvent) C.trackEvent('contato_enviado', { servico: dados.servico });
        } else {
          status(contato, 'err', '⚠️ ' + ((r && r.message) || 'Não foi possível enviar agora. Chame no WhatsApp: +55 (65) 98117-2676.'));
        }
      });
    });
  }

  /* ---------- Diagnóstico ---------- */
  var diag = document.getElementById('form-diagnostico');
  var sucesso = document.getElementById('diagnostico-sucesso');
  if (diag) {
    diag.addEventListener('submit', function (e) {
      e.preventDefault();
      if (valorDe(diag, 'site')) return;
      var dados = {
        nome: valorDe(diag, 'nome'),
        empresa: valorDe(diag, 'empresa'),
        email: valorDe(diag, 'email'),
        telefone: valorDe(diag, 'telefone'),
        segmento: valorDe(diag, 'segmento'),
        desafio: valorDe(diag, 'desafio'),
        origem: valorDe(diag, 'origem')
      };
      if (!dados.nome || !dados.email || !dados.telefone) {
        status(diag, 'err', '⚠️ Preencha: Nome, E-mail e WhatsApp.');
        return;
      }
      if (!EMAIL.test(dados.email)) {
        status(diag, 'err', '⚠️ E-mail inválido.');
        marcaErro(diag.elements.email, 'E-mail inválido');
        return;
      }
      status(diag, '', '');
      botaoEnviando(diag, true);
      C.apiPost('salvarDiagnostico', dados).then(function (r) {
        botaoEnviando(diag, false);
        if (r && r.status === 'success') {
          diag.hidden = true;
          if (sucesso) { sucesso.hidden = false; sucesso.querySelector('h3').setAttribute('tabindex', '-1'); sucesso.querySelector('h3').focus(); }
          if (C.trackEvent) C.trackEvent('diagnostico_enviado', { segmento: dados.segmento });
        } else {
          status(diag, 'err', '⚠️ ' + ((r && r.message) || 'Não foi possível enviar agora. Chame no WhatsApp: +55 (65) 98117-2676.'));
        }
      });
    });

    /* Ao fechar depois do sucesso, o formulário volta limpo */
    var dialogo = document.getElementById('dialogo-diagnostico');
    if (dialogo) {
      dialogo.addEventListener('close', function () {
        if (sucesso && !sucesso.hidden) {
          sucesso.hidden = true;
          diag.hidden = false;
          diag.reset();
          status(diag, '', '');
        }
      });
    }
  }
})();
