# Companion · Layouts da Documentação

Protótipo visual **isolado** (sem backend, sem build, fora do `docs/` real) com **4
propostas de layout/UX** para substituir ou complementar a documentação atual do
`@arcanalabs/datatable`, que hoje é uma landing single-page de scroll único.

## Rodar

```bash
./serve.sh            # http://localhost:4322
# ou
python3 -m http.server 4322
```

Abra `http://localhost:4322`. Sem dependências — HTML/CSS/JS puro. Cada proposta é um
arquivo auto-contido; a barra fixa no canto inferior direito troca entre elas.

## As 4 propostas

1. **Manual** (`proposal-1-manual.html`) — referência três painéis estilo Stripe: nav
   lateral com scroll-spy, prosa no centro, código sticky à direita sincronizado com a
   seção lida. Toggle global React/Vue. *Melhor para consulta diária de API.*

2. **Bancada** (`proposal-2-bancada.html`) — playground-first estilo Storybook: knobs
   de props que alteram o preview da tabela E o código gerado em tempo real. "A config
   é a doc." *Melhor para descobrir recursos experimentando.*

3. **Trilha** (`proposal-3-trilha.html`) — guia linear em 8 capítulos com rail de
   progresso que preenche no scroll; cada capítulo declara objetivo e resultado.
   *Melhor para onboarding de quem nunca usou a lib.*

4. **Cookbook** (`proposal-4-cookbook.html`) — busca orientada a tarefa ("quero fazer
   X") com cards-receita em vernáculo de planilha (coordenadas de célula, seleção
   estilo Excel) e drawer de detalhe com preview + código. *Melhor para quem já usa e
   quer a receita pronta.*

As propostas não são mutuamente excludentes — dá para combinar (ex.: Trilha como
"Começando" + Manual como referência + Cookbook como catálogo de exemplos).

Todo o conteúdo (props, métodos, tipos de busca, snippets) vem da API real documentada
em `docs/src/App.tsx` e `ExampleCatalog.tsx`; as tabelas nas demos são HTML estático
imitando o componente.
