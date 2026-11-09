# VulnPay

Página de checkout fictícia usada em um vídeo educativo sobre segurança. O site simula uma falha de SQL injection, abre um terminal, roda DOOM no navegador e termina em uma página 404.

Não existe backend: nenhum dado é enviado ou armazenado. Use apenas dados fictícios.

## Stack

- Vite 6 + React 18 + TypeScript
- js-dos v8 para rodar o DOOM shareware no navegador

## Como rodar

```powershell
npm install
npm run dev
```

Abra `http://localhost:5173`.

Para gravar o vídeo, prefira o modo produção:

```powershell
npm run build
npm run preview
```

Abra `http://localhost:4173`.

## Payload do campo "Nome completo"

```text
' OR 1=1; --
```

Os demais campos são obrigatórios. Exemplo:

| Campo | Valor |
| --- | --- |
| Nome completo | `' OR 1=1; --` |
| E-mail | `demo@exemplo.com` |
| Número do cartão | `4242424242424242` |
| Validade | `1229` |
| CVV | `123` |

Clique em **Pagar R$ 249,90** para disparar a cena de exploit.

## Fluxo

1. `#checkout` — formulário de pagamento.
2. `#exploit` — tela de acesso concedido com o payload e os logs.
3. `#terminal` — terminal Windows PowerShell digitando sozinho.
4. `#doom` — DOOM carregado via js-dos.
5. Clique no **X** da janela do terminal ou do DOOM para revelar a página **404**.

A tela de dicas fica em `#reveal` e também pode ser aberta pelo painel de cenas.

## Atalhos

| Ação | Atalho |
| --- | --- |
| Acelerar a digitação do terminal | `F2` (alterna) |
| Pular para o DOOM | `Esc` durante o terminal |
| Abrir/fechar o painel de cenas | `Ctrl + Shift + D` |
| Ir direto para uma cena | hash na URL: `#checkout`, `#exploit`, `#terminal`, `#doom`, `#reveal` |
| Fechar terminal/DOOM e ver a 404 | botão **X** da janela |

## Documentação

O passo a passo completo de gravação, checklist e solução de problemas está em [docs/guia-gravacao.md](docs/guia-gravacao.md).

## Estrutura

```text
src/
  components/    telas e componentes (checkout, exploit, terminal, DOOM, 404, reveal)
  data/          roteiro de comandos do terminal
  lib/           payload e navegação por cenas
  index.css      estilos
docs/            guia de gravação
```

## Observações

- O DOOM e a biblioteca js-dos são carregados de CDN; é preciso estar com internet.
- O erro `Failed to execute 'lock' on 'Keyboard'...` no console é interno do js-dos e não afeta o jogo.
- Deploy na Vercel: build `npm run build`, output `dist`.
