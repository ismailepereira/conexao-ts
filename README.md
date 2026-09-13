# Site — Conexão Tecnologia e Serviços

Redesign do site [conexaots.com](https://conexaots.com) (AI Agents, Micro SaaS, Cloud Computing e Consultoria em TI · Rondonópolis-MT).

- **Texto:** o mesmo do site anterior, sem alteração. Os originais estão em `docs/original/`.
- **Estrutura:** as mesmas seções e na mesma ordem. Cada serviço e o blog ganharam página e endereço próprios.
- **Visual:** o sistema da home do Ismaile (creme, cartões com luz no topo, sombra em camadas, faixas escuras) com as três cores do logo da Conexão.

## Stack
HTML + CSS + JavaScript puro, sem build e sem framework. Fontes do Google Fonts (Plus Jakarta Sans e JetBrains Mono) e ícones do Iconify. O blog usa `marked` e `DOMPurify` via CDN.

Formulários, métricas e blog continuam falando com o **`api.php` que já existe no servidor da Conexão**, com as mesmas ações de antes:

| Ação | Onde |
|---|---|
| `salvarContato` | formulário de `contato.html` |
| `salvarDiagnostico` | janela "Diagnóstico Gratuito — 30 minutos" (todas as páginas) |
| `registrarEvento` | pageview e cliques em CTA |
| `getConteudosDestaque` | lista do blog |
| `getConteudoPublico` | leitura do artigo (`blog.html#<slug>`) |

O `api.php` **não está neste repositório**: ele fica no servidor deles.

## Estrutura
```
conexao-ts/
├── PRODUCT.md                 # verdade do produto (Impeccable)
├── docs/
│   ├── inteligencia.md        # dados do cliente: ler antes de mexer
│   └── original/              # HTML e texto extraído do site anterior
├── tools/
│   └── montar.py              # injeta cabeçalho, rodapé e diálogo nas páginas
└── src/                       # o que vai para o servidor
    ├── index.html             # home (hero, setores, diagnóstico, diferenciais, sobre, modelos, soluções)
    ├── servicos.html          # soluções + como trabalhamos
    ├── servicos/              # ai-agents, micro-saas, cloud-computing, consultoria-ti
    ├── blog.html              # lista e leitura dos artigos (via api.php)
    ├── contato.html
    ├── privacidade.html
    ├── _parciais/             # cabeçalho, rodapé, diálogo e marca (fonte do montar.py)
    └── assets/
        ├── css/               # tokens.css · base.css · components.css · paginas.css
        ├── js/                # api.js · main.js · forms.js · blog.js
        ├── data/blog-exemplo.json   # cópia da lista do blog, só para teste local
        ├── img/               # logo, favicons, pôster do vídeo
        └── video/             # video_microsaas.mp4 (do site anterior)
```

## Rodar localmente
Pelo preview do Claude (`conexao-site` no `.claude/launch.json` do workspace) ou:
```
python -m http.server 5320 --directory src
```
Sem o `api.php`, o blog mostra a cópia de `assets/data/blog-exemplo.json` e os formulários respondem com erro de envio. Isso é esperado.

Adicione `?estatico` ao endereço para desligar as animações de entrada. É o modo usado nas capturas de tela.

## Editar
- **Cabeçalho, rodapé ou janela do diagnóstico:** edite `src/_parciais/*.html` e rode `python tools/montar.py`. Nunca edite o miolo entre `<!-- AUTO:... -->` nas páginas.
- **Cores, fontes e espaçamento:** `src/assets/css/tokens.css`.
- **Cor de cada serviço:** classes `cor-teal` (AI Agents), `cor-coral` (Micro SaaS), `cor-amber` (Cloud) e `cor-ink` (Consultoria).
- **Cache:** CSS e JS entram com `?v=20260913`. Ao mudar CSS ou JS, troque o sufixo em todas as páginas.

## Publicar no servidor da Conexão
1. Suba o **conteúdo de `src/`** para a raiz do site, **sem apagar** `api.php`, `admin*`, `logs/` e o `sitemap.xml` gerado pelo painel.
2. Os endereços antigos `/blog` e `/privacidade` continuam valendo. `/blog#<slug>` continua abrindo o artigo.
3. As páginas novas são `/servicos`, `/servicos/ai-agents`, `/servicos/micro-saas`, `/servicos/cloud-computing`, `/servicos/consultoria-ti` e `/contato`. Incluí-las no sitemap.
4. Conferir se o servidor serve `.html` sem extensão (como já faz com `/blog`). Os links internos usam `.html`, então funcionam dos dois jeitos.

## Pendências (confirmar com o cliente)
- [ ] `og-image.jpg` e `imagem_microsaas.png` davam 404 no site antigo. Hoje o compartilhamento usa `assets/img/logo-512.png`. Ideal: uma imagem 1200×630.
- [ ] Vídeos de demonstração de AI Agents, Cloud e Consultoria ("Demonstração em vídeo em breve").
- [ ] Rodapé diz "© 2025", texto mantido do original. Atualizar o ano?
- [ ] Os três artigos fixos da home antiga (Estratégica, Assertiva e Personalizada) não existem no painel. Os pilares da home apontam para o blog.
- [ ] Aviso "Ao enviar, você concorda com a nossa Política de Privacidade" foi **acrescentado** nos formulários (LGPD).

---
Desenvolvido por [ismailepereira](https://ismailepereira.github.io/)
