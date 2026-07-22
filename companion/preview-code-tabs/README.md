# Companion · Abas Preview/Código

Protótipo visual com **4 modelos de design** para as abas "Preview | Código" das
seções da documentação do Arcana DataTable (o design atual vive em
`docs/src/components/DocsShell.tsx` + `docs/src/styles.css`).

Todos os modelos pertencem à identidade "Manual" da docs (fundo branco, tinta
`#0f172a`, accent índigo `#4f46e5`, código `#0b1120`, radius máx 6px) — é um
refinamento de componente, não um redesign da página.

## Modelos

1. **Segmented control** — pílula compacta à direita do header do card, com ícones e badge do framework.
2. **Underline deslizante** — abas texto mono uppercase com indicador índigo animado que desliza.
3. **Janela de editor** — barra escura estilo VS Code com abas de arquivo; o corpo alterna claro/escuro sem emenda.
4. **Toggle flutuante** — sem linha de abas; botão flutuante "Ver código / Ver preview" no canto do painel.

## Rodar

```sh
./serve.sh        # http://localhost:4323
```

HTML/CSS/JS puro, self-contained (só Google Fonts externo). As abas de todos os
modelos funcionam de verdade.
