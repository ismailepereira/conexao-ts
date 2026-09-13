# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML + CSS + JavaScript, no build, no framework (same pattern as Ismaile's recent sites). Forms, metrics and the blog keep calling the client's existing `api.php` on conexaots.com (actions `salvarContato`, `salvarDiagnostico`, `registrarEvento`, `getConteudosDestaque`, `getConteudoPublico`). Confirmed by Ismaile on 13/09/2026. Deploy target: the client's own server (PHP host at conexaots.com); locally it runs with sample data because `api.php` is not in this repo.

## Users

Owners and managers of small and mid-sized Brazilian companies (agribusiness, construction, law firms, barbershops and salons, retail, industry, service providers) who feel operational pain (manual processes, scattered data, missed follow-ups) and are evaluating whether technology can fix it. They arrive mostly from Google, WhatsApp, referrals, Instagram and LinkedIn (the options in the site's own "Como nos encontrou?" field). *Inferred from the current site copy; not interviewed.*

## Product Purpose

Institutional site of **Conexão Tecnologia e Serviços**. It explains four services (AI Agents, Micro SaaS, Cloud Computing, Consultoria em TI), three engagement models and a 4-step process, and converts visitors into a free 30-minute technology diagnosis (form or WhatsApp). Success = diagnosis requests and WhatsApp conversations.

## Positioning

"Tecnologia que resolve de verdade — sem promessa, sem enrolação." Direct contact with the person who builds (no intermediaries), diagnosis before any proposal, first working versions in days, metrics defined before starting, 100% remote serving all of Brazil from Rondonópolis-MT.

## Operating Context

The diagnosis is a 30-minute session; contact within 24h via WhatsApp after a request; strategy in 3–5 days; 2-week sprints; support with 4h response SLA. The blog is fed by the client's content panel through `api.php` (around 45 published posts listed in the live sitemap, addressed as `/blog#<slug>`).

## Capabilities and Constraints

- **All copy is preserved verbatim** from the current site (Ismaile's explicit instruction). Originals archived in `docs/original/`.
- Same sections in the same order on the home; each service and the blog get their own page with its own URL.
- Keep `/blog#<slug>` post addressing so the existing sitemap links keep working.
- Keep `privacidade.html` and its text.
- WhatsApp: +55 (65) 98117-2676 · e-mail itamar@conexaots.com · Rondonópolis, MT.
- `imagem_microsaas.png` and `og-image.jpg` return 404 on the live site; `video_microsaas.mp4` is referenced. Do not invent replacements presented as real.

## Brand Commitments

- Name: Conexão Tecnologia e Serviços (wordmark "CONEXÃO / Tecnologia e Serviços").
- Logo: the "M/N" line mark in teal, red-coral and orange (`src/assets/img/logo_transparente.png`). Colors from the logo must stay recognizable.
- Voice: direct, anti-hype, first person plural ("sem enrolação", "sem intermediários").
- Visual direction pinned by Ismaile: the editorial system of his own home (`web/ismailepereira.github.io`) applied with Conexão's colors.
- Footer carries "Desenvolvido por ismailepereira" linking to https://ismailepereira.github.io/.

## Evidence on Hand

Real: service descriptions, sectors served, stack list, engagement models, process steps, three featured articles, contact data, privacy policy. Absent (never fabricate): client logos, testimonials, case numbers, prices, team photos, certifications.

## Product Principles

1. Diagnosis first: every path leads to the free 30-minute diagnosis or WhatsApp.
2. Say it plainly: the copy's directness is the brand; design must not dilute it with decoration.
3. Show the method, not promises: process, models and examples carry the proof.
4. Built for Brazilian PMEs on phones: fast on 4G, WhatsApp-native, LGPD-aware.

## Accessibility & Inclusion

WCAG 2.2 AA contrast and keyboard access; forms usable on mobile keyboards (numeric input for phone), respects reduced motion.
