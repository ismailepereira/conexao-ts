"""Monta as partes repetidas (cabeçalho, rodapé, diálogo) em todas as páginas.

Cada página marca onde a parte entra:

    <!-- AUTO:cabecalho --> ... <!-- /AUTO:cabecalho -->

O script troca o miolo pelo conteúdo de src/_parciais/<nome>.html, ajustando
os caminhos ({{base}}) para a profundidade da página e marcando o item atual
do menu a partir de <html data-pagina="...">.

Uso:  python tools/montar.py
"""
from __future__ import annotations

import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SRC = RAIZ / "src"
PARCIAIS = SRC / "_parciais"
BLOCO = re.compile(r"(<!-- AUTO:(?P<nome>[a-z-]+) -->)(?P<miolo>.*?)(<!-- /AUTO:(?P=nome) -->)", re.S)


def ler_parcial(nome: str) -> str:
    return (PARCIAIS / f"{nome}.html").read_text(encoding="utf-8").strip()


def preparar(texto: str, base: str, pagina: str) -> str:
    texto = texto.replace("{{marca}}", ler_parcial("marca"))
    texto = texto.replace("{{base}}", base)
    texto = re.sub(
        r"\{\{atual:([a-z-]+)\}\}",
        lambda m: 'aria-current="page"' if m.group(1) == pagina else "",
        texto,
    )
    texto = re.sub(
        r"\{\{atual-drop:([a-z-]+)\}\}",
        lambda m: "data-atual" if pagina.startswith(m.group(1)) else "",
        texto,
    )
    return texto


def montar(arquivo: Path) -> bool:
    html = arquivo.read_text(encoding="utf-8")
    profundidade = len(arquivo.relative_to(SRC).parts) - 1
    base = "../" * profundidade
    m = re.search(r'data-pagina="([a-z-]+)"', html)
    pagina = m.group(1) if m else ""

    def trocar(bloco: re.Match) -> str:
        nome = bloco.group("nome")
        if not (PARCIAIS / f"{nome}.html").exists():
            return bloco.group(0)
        conteudo = preparar(ler_parcial(nome), base, pagina)
        return f"{bloco.group(1)}\n{conteudo}\n{bloco.group(4)}"

    novo = BLOCO.sub(trocar, html)
    if novo != html:
        arquivo.write_text(novo, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    paginas = [p for p in SRC.rglob("*.html") if "_parciais" not in p.parts]
    for p in sorted(paginas):
        mudou = montar(p)
        print(f"{'montada ' if mudou else 'igual   '} {p.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
