# Companion · Sidebar do Playground

Protótipo visual com **4 modelos de design** para o sidebar de ajustes do Playground da docs
(`docs/src/components/Playground.tsx`). Self-contained (HTML/CSS/JS puro), identidade "Manual"
da docs (branco, ink, índigo, Schibsted Grotesk/Inter/IBM Plex Mono).

1. **Acordeão com contadores** — grupos exclusivos, badge "N ativas", busca que expande e destaca.
2. **Inspector denso** — linhas 28px estilo devtools/Figma, headers sticky, tooltip ⓘ no hover.
3. **Cards por grupo com resumo** — ícone + descrição + resumo do estado quando colapsado.
4. **Busca-first com chips** — busca proeminente, chips índigo das configs não-default com ✕.

## Rodar

```bash
./serve.sh          # http://localhost:4324
```

Todos os modelos são funcionais (estado independente por modelo, sem persistência).
Não toca em nada fora desta pasta.
