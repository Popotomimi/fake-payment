# Guia de gravação — VulnPay

Tudo o que você precisa para rodar, preencher e gravar o vídeo da página fake de checkout.

---

## 1. O comando do campo "Nome completo"

Cole exatamente isto no campo **Nome completo**:

```text
' OR 1=1; --
```

Detalhes importantes:

- Começa com **apóstrofo simples** (`'`), não com acento e não com aspas duplas.
- Depois do apóstrofo vem um **espaço**, a palavra `OR`, outro **espaço**, `1=1`, **ponto e vírgula** (`;`), um **espaço** e **dois hífens** (`--`).
- O campo aceita qualquer texto, mas só dispara a invasão se contiver um dos padrões reconhecidos (veja a seção 9).
- Se o nome **não** tiver o payload, o site mostra apenas o aviso `Pagamento aprovado.` e não avança.

Alternativas aceitas pelo código (não precisa usar, mas funcionam):

```text
' or
or 1=1
union select
$(
;--
; --
```

Recomendado para o vídeo: use o payload completo `' OR 1=1; --`.

---

## 2. Dados para preencher o checkout

Todos os campos são obrigatórios. O navegador bloqueia o envio se algum estiver vazio ou inválido.

| Campo | O que digitar | Observação |
| --- | --- | --- |
| Nome completo | `' OR 1=1; --` | É o gatilho da invasão |
| E-mail | `demo@exemplo.com` | Precisa ter formato de e-mail válido |
| Número do cartão | `4242424242424242` | O campo formata sozinho para `4242 4242 4242 4242` |
| Validade | `1229` | O campo formata sozinho para `12/29` |
| CVV | `123` | Aceita de 3 a 4 dígitos |

Depois clique em **Pagar R$ 249,90**.

> Não use dados reais. O projeto não tem backend e nada é enviado.

---

## 3. Como rodar o projeto

Abra o PowerShell na pasta do projeto:

```powershell
cd C:\Users\Roberto\Desktop\fake-payment
```

### Modo desenvolvimento (mais rápido para testar)

```powershell
npm install
npm run dev
```

Abra no navegador:

```text
http://localhost:5173
```

### Modo produção (recomendado para gravar)

```powershell
npm run build
npm run preview
```

Abra no navegador:

```text
http://localhost:4173
```

O modo produção é o que mais se parece com o site final e evita recarregamentos estranhos durante a gravação.

Para parar o servidor, volte ao terminal e pressione `Ctrl + C`.

---

## 4. Fluxo completo do vídeo

O fluxo é automático depois do checkout:

1. **Checkout** (`#checkout`): preencha os dados e clique em Pagar.
2. **Exploit** (`#exploit`): aparece `ACESSO CONCEDIDO`, o payload e os logs da invasão.
   - Após cerca de 4,6 segundos, avança sozinho para o terminal.
   - Você também pode clicar em **abrir terminal** para ir na hora.
3. **Terminal** (`#terminal`): um Windows PowerShell começa a digitar sozinho:
   - `nmap -sV vulnpay.app`
   - `ssh admin@10.0.0.42`
   - `whoami` (o prompt vira `root@vulnpay:~#`)
   - `ls -la /var/www/vulnpay`
   - `cat /etc/passwd | head -n 3`
   - `curl -O https://vulnpay.app/doom.jsdos`
   - `./doom`
   - A digitação lenta e com pequenos erros corrigidos leva cerca de **25 segundos**.
4. **DOOM** (`#doom`): o jogo carrega sozinho dentro da janela do terminal.
5. **Fechar com o X**: clique no **X** no canto superior direito da janela do terminal.
   - A janela fecha com uma animação.
   - Aparece uma **página 404** por trás (`Página não encontrada`).
   - O mesmo vale para a janela do DOOM: clicar no X também revela a 404.
6. **404**: tem o botão **voltar ao início**, que retorna ao checkout.

> A tela de dicas (`#reveal`) não está mais no fluxo automático, porque os botões "continuar" e "tela cheia" foram removidos. Para abrir a tela de dicas, use `Ctrl + Shift + D` ou acesse a URL com `#reveal` (veja a seção 5).

---

## 5. Atalhos e controles

| Ação | Como fazer |
| --- | --- |
| Acelerar a digitação do terminal | Pressione `F2` (alterna modo rápido; é invisível na tela) |
| Pular direto para o DOOM | Pressione `Esc` durante o terminal |
| Abrir/fechar o painel de cenas | `Ctrl + Shift + D` |
| Ir direto para uma cena | Use a URL com hash: `#checkout`, `#exploit`, `#terminal`, `#doom`, `#reveal` |
| Fechar o terminal ou o DOOM e ver a 404 | Clique no **X** da janela |
| Voltar ao checkout a partir da 404 | Clique em **voltar ao início** |
| Jogar o DOOM | Clique dentro da janela do jogo e use as setas, `Enter`, `Ctrl` e `Espaço` |

Observações:

- O `F2` é um interruptor: aperte uma vez para acelerar e outra para voltar ao ritmo normal.
- O `Esc` no terminal pula para o DOOM. Dentro do DOOM, o `Esc` é o menu do próprio jogo.
- O overlay "Click to capture mouse / Use `Esc` to unlock" foi removido. O mouse não é capturado.
- O painel de cenas fica escondido por padrão. Não aperte `Ctrl + Shift + D` durante a gravação se não quiser que ele apareça.

---

## 6. Roteiro sugerido para gravar

1. Abra o navegador em `http://localhost:4173` e deixe em tela cheia (`F11`).
2. Confirme que está no checkout e que o painel de cenas está fechado.
3. Comece a gravar a tela.
4. Preencha os campos na ordem (nome com o payload primeiro).
5. Clique em **Pagar R$ 249,90** e deixe a cena de exploit rodar.
6. No terminal, se quiser encurtar, aperte `F2` (a digitação acelera sem aparecer nada na tela).
7. Quando o DOOM carregar, jogue alguns segundos.
8. Clique no **X** da janela para fechar e revelar a **404**.
9. Encerre a gravação e faça a narração por cima, explicando que era uma simulação e mostrando as brechas de segurança.

Dica: se quiser gravar a tela de dicas, abra `http://localhost:4173/#reveal` em uma nova aba ou use `Ctrl + Shift + D` e clique em `reveal`.

---

## 7. Checklist antes de gravar

- [ ] Está com internet (o DOOM e a biblioteca js-dos vêm de CDN).
- [ ] Rodou `npm run build` e `npm run preview`.
- [ ] Abriu `http://localhost:4173` (não o `file://`).
- [ ] Zoom do navegador em 100%.
- [ ] Barra de favoritos e abas extras escondidas.
- [ ] Painel de cenas fechado.
- [ ] Testou o fluxo uma vez antes de gravar.
- [ ] Esperou o DOOM carregar completamente antes de jogar.

---

## 8. Problemas comuns

**O nome não dispara a invasão**
- Confira se o payload está exatamente `' OR 1=1; --`.
- Confira se todos os outros campos estão preenchidos e válidos.
- Se aparecer `Pagamento aprovado.`, o payload não foi reconhecido.

**O DOOM não carrega**
- Verifique a internet e recarregue a página.
- A mensagem `Carregando DOOM...` pode ficar alguns segundos.
- Se aparecer erro, recarregue a página e tente de novo.

**Aparece um erro de teclado no console**
- `Failed to execute 'lock' on 'Keyboard'...` é interno do js-dos e não afeta o jogo. Pode ignorar.

**A digitação do terminal está lenta demais**
- Aperte `F2` para acelerar ou `Esc` para pular direto ao DOOM.

**A tela de dicas não aparece no fluxo**
- É esperado. Use `#reveal` na URL ou o painel `Ctrl + Shift + D`.

**Cliquei no X sem querer**
- A página 404 tem o botão **voltar ao início**. Também dá para recarregar a página.

---

## 9. Onde personalizar

| O que mudar | Arquivo |
| --- | --- |
| Payload e padrões aceitos no nome | `src/lib/payload.ts` |
| Comandos e respostas do terminal | `src/data/script.ts` |
| Tempo e estilo da digitação | `src/components/FakeTerminal.tsx` |
| DOOM, CDN e comportamento do mouse | `src/components/DoomScreen.tsx` |
| Página 404 | `src/components/NotFound.tsx` |
| Dicas da tela final | `src/components/RevealScreen.tsx` |
| Estilos e cores | `src/index.css` |
| Cenas e navegação por hash | `src/lib/scenes.ts` |

Para trocar o payload principal, edite a constante `EXAMPLE_PAYLOAD` em `src/lib/payload.ts` e os padrões da função `isPayload`.

---

## 10. Deploy na Vercel (opcional)

- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite

Depois do deploy, acesse a URL gerada e use os mesmos hashes (`#checkout`, `#terminal`, etc.).
