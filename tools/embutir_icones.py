"""Desenha os ícones do site localmente, sem depender de API externa.

O HTML continua usando <iconify-icon icon="solar:..." width="16">, mas nenhum
componente externo é carregado: este script lê todos os nomes usados em src/
(HTML e JS), baixa os desenhos uma vez e grava src/assets/js/icones.js. Esse
arquivo coloca o SVG dentro de cada <iconify-icon> (inclusive os criados depois,
como os cartões do blog, e quando o nome do ícone muda, como no menu móvel).

Uso:  python tools/embutir_icones.py
Rode de novo sempre que usar um ícone novo.
"""
from __future__ import annotations

import json
import re
import urllib.request
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SRC = RAIZ / "src"
SAIDA = SRC / "assets" / "js" / "icones.js"
PREFIXOS = ("solar", "ic", "simple-icons")

PADRAO = re.compile(r"""["'](solar|ic|simple-icons):([a-z0-9-]+)["']""")

JS = """/* Gerado por tools/embutir_icones.py — não editar à mão. */
(function () {
  'use strict';
  var ICONES = __DADOS__;

  function svg(nome, largura) {
    var i = ICONES[nome];
    if (!i) return '';
    var w = largura || 16;
    var h = Math.round(w * i[2] / i[1] * 100) / 100;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h +
      '" viewBox="0 0 ' + i[1] + ' ' + i[2] + '" aria-hidden="true" focusable="false">' + i[0] + '</svg>';
  }

  function desenha(el) {
    var nome = el.getAttribute('icon');
    if (!nome || el.getAttribute('data-desenhado') === nome) return;
    el.innerHTML = svg(nome, parseFloat(el.getAttribute('width')) || 16);
    el.setAttribute('data-desenhado', nome);
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-hidden', 'true');
  }

  function varre(raiz) {
    if (raiz.nodeType !== 1) return;
    if (raiz.tagName === 'ICONIFY-ICON') desenha(raiz);
    raiz.querySelectorAll('iconify-icon').forEach(desenha);
  }

  varre(document.documentElement);
  new MutationObserver(function (mudancas) {
    mudancas.forEach(function (m) {
      if (m.type === 'attributes') desenha(m.target);
      else m.addedNodes.forEach(varre);
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['icon'] });

  window.Conexao = window.Conexao || {};
  window.Conexao.icone = svg;
})();
"""


def coletar() -> dict[str, set[str]]:
    usados: dict[str, set[str]] = defaultdict(set)
    for arq in list(SRC.rglob("*.html")) + list((SRC / "assets" / "js").glob("*.js")):
        if arq.name == SAIDA.name:
            continue
        for prefixo, nome in PADRAO.findall(arq.read_text(encoding="utf-8")):
            usados[prefixo].add(nome)
    return usados


def baixar(prefixo: str, nomes: set[str]) -> dict[str, list]:
    url = f"https://api.iconify.design/{prefixo}.json?icons={','.join(sorted(nomes))}"
    req = urllib.request.Request(url, headers={"User-Agent": "conexao-ts/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        dados = json.load(r)
    largura_padrao = dados.get("width", 24)
    altura_padrao = dados.get("height", 24)
    icones = dados.get("icons", {})
    aliases = dados.get("aliases", {})
    saida: dict[str, list] = {}
    for nome in sorted(nomes):
        origem = nome
        if origem not in icones and origem in aliases:
            origem = aliases[origem].get("parent", origem)
        icone = icones.get(origem)
        if not icone:
            print(f"  aviso: {prefixo}:{nome} sem desenho")
            continue
        saida[f"{prefixo}:{nome}"] = [
            icone["body"],
            icone.get("width", largura_padrao),
            icone.get("height", altura_padrao),
        ]
    return saida


def main() -> None:
    usados = coletar()
    todos: dict[str, list] = {}
    for prefixo in PREFIXOS:
        if usados.get(prefixo):
            print(f"{prefixo}: {len(usados[prefixo])} ícones")
            todos.update(baixar(prefixo, usados[prefixo]))
    conteudo = JS.replace("__DADOS__", json.dumps(todos, separators=(",", ":"), ensure_ascii=False))
    SAIDA.write_text(conteudo, encoding="utf-8", newline="\n")
    print(f"gravado {SAIDA.relative_to(RAIZ)} ({SAIDA.stat().st_size // 1024} KB, {len(todos)} ícones)")


if __name__ == "__main__":
    main()
