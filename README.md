# Silva & Associados Advogados

Landing page institucional de uma página para um escritório de advocacia fictício. O projeto foi construído apenas com **HTML5, CSS3 e JavaScript vanilla**, sem frameworks, bundlers ou dependências de produção.

O layout é responsivo a partir de **320px**, com foco em clareza, acessibilidade (WCAG AA), SEO técnico e conversão para contato/WhatsApp.

---

## Visão geral

- **Página única** com navegação por âncoras e scrollspy.
- **Mobile-first**, testado em 320, 390, 768, 1024 e 1440px.
- **Acessibilidade**: link de salto, foco visível, menu com ESC e trap de foco, carrossel com teclado/swipe, formulário com erros acessíveis e respeito a `prefers-reduced-motion`.
- **SEO**: title, meta description, canonical, Open Graph, Twitter Card, favicon, manifest e JSON-LD (`Organization`, `LegalService` e `WebSite`).
- **Performance**: CSS crítico inline, SVGs leves, lazy loading nas imagens abaixo da dobra e fontes com `display=swap`.
- **Sem back-end**: o formulário funciona em modo demonstrativo até receber um endpoint.

> **Importante:** nomes, depoimentos, cases, números, OAB, CNPJ, endereço, telefone e redes sociais são **placeholders**. Todo o conteúdo precisa ser revisado e substituído antes da publicação.

---

## Estrutura do projeto

```text
silva-associados/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        ├── apple-touch-icon.png
        ├── blog-empresarial.svg
        ├── blog-familia.svg
        ├── blog-tributario.svg
        ├── equipe-helena.svg
        ├── equipe-marcos.svg
        ├── equipe-rafael.svg
        ├── favicon.svg
        ├── hero-escritorio.svg
        ├── logo.svg
        ├── og-image.png
        ├── site.webmanifest
        └── socio-fundador.svg
```

As seções do `index.html` estão comentadas (`HERO`, `SOBRE`, `ÁREAS`, `DIFERENCIAIS`, `PROCESSO`, `EQUIPE`, `CASES`, `DEPOIMENTOS`, `BLOG`, `CONTATO`, `FOOTER`), o que facilita a localização do conteúdo.

---

## Como visualizar

O site abre diretamente pelo `index.html`, mas um servidor local é recomendado para testar o formulário, o mapa e os caminhos relativos.

```bash
cd silva-associados
python -m http.server 4173
```

Depois acesse `http://localhost:4173/`.

Alternativas:

```bash
npx serve .
# ou
php -S localhost:4173
```

---

## Personalização

### 1. Cores, fontes e identidade visual

Os tokens principais ficam no início de `assets/css/style.css`:

```css
:root {
  --navy-900: #0A1F44;
  --gold: #C5A572;
  --sand: #F5F7FA;
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --header-h: 76px;
}
```

Ao alterar cores ou a altura do header, atualize também o **CSS crítico inline** no `<head>` do `index.html`. Ele é usado antes do carregamento da folha principal e contém uma versão resumida dos mesmos tokens.

As fontes são carregadas pelo Google Fonts no `<head>`. Para trocar a tipografia, atualize:

1. O `<link>` do Google Fonts.
2. As variáveis `--font-serif` e `--font-sans`.
3. O CSS crítico inline que menciona `Playfair Display` e `Inter`.

### 2. Logo, favicon e manifest

- Logo do header/rodapé: SVGs inline no `index.html`.
- Ícone da aba: `assets/images/favicon.svg`.
- Ícone para iOS: `assets/images/apple-touch-icon.png` (180 × 180).
- Manifest: `assets/images/site.webmanifest`.

Se o escritório tiver um logo oficial, substitua os SVGs inline com cuidado para manter `aria-hidden="true"` e `focusable="false"` nos elementos decorativos.

### 3. Conteúdo textual

Substitua, no `index.html`:

- nome do escritório, slogan, textos institucionais e números de experiência;
- áreas de atuação e descrições;
- nomes, cargos, áreas e OAB dos advogados;
- cases, métricas e depoimentos;
- nomes das empresas clientes;
- posts do blog (título, categoria, data, tempo de leitura e resumo);
- endereço, telefone, e-mail e horário;
- OAB/SP e CNPJ no rodapé;
- links das redes sociais;
- aviso legal e nota de privacidade.

Os **cases e depoimentos são ilustrativos**. Use apenas resultados reais, autorizados e documentados. Evite prometer resultados ou usar linguagem sensacionalista.

### 4. Imagens

As imagens atuais são ilustrações SVG criadas para o projeto. Para usar fotos reais:

| Imagem | Arquivo atual | Proporção / tamanho sugerido |
| --- | --- | --- |
| Hero | `hero-escritorio.svg` | 720 × 840 (retrato) |
| Sócio-fundador | `socio-fundador.svg` | 720 × 840 |
| Equipe | `equipe-*.svg` | 560 × 640 |
| Blog | `blog-*.svg` | 1200 × 800 |
| Open Graph | `og-image.png` | 1200 × 630 |
| Apple touch icon | `apple-touch-icon.png` | 180 × 180 |

Recomendações:

- Prefira **WebP** ou **AVIF** para fotos, com fallback quando necessário.
- Comprima as imagens antes de subir (por exemplo, Squoosh, ImageOptim ou Sharp).
- Mantenha os atributos `width` e `height` para evitar deslocamento de layout.
- Preserve `loading="lazy"` e `decoding="async"` nas imagens abaixo da dobra.
- Ajuste o `alt` para descrever a imagem; use `alt=""` apenas quando ela for decorativa.
- Se trocar a imagem do hero por WebP/JPG, atualize o `<link rel="preload">` no `<head>` (inclusive o atributo `type`).
- A imagem de Open Graph precisa estar em URL absoluta e acessível publicamente em `1200 × 630`.

### 5. Formulário de contato

O formulário já possui:

- validação de nome, e-mail, telefone, área, mensagem e consentimento LGPD;
- máscara de telefone;
- mensagens de erro inline com `aria-invalid`;
- honeypot anti-spam (campo `website`);
- estado de carregamento e painel de sucesso;
- fallback de erro para falhas de rede.

#### Modo demonstrativo

No `index.html`:

```html
<form class="form" id="contact-form" data-form data-endpoint="" novalidate>
```

Com `data-endpoint=""`, **nada é enviado**. Após 700 ms, o site exibe a mensagem de sucesso apenas para demonstração.

#### Integração real

1. Crie um endpoint que aceite `POST` com `Content-Type: application/json`.
2. Informe a URL em `data-endpoint`, por exemplo:

   ```html
   <form ... data-endpoint="https://api.seuescritorio.com.br/contato">
   ```

3. O corpo enviado tem o formato:

   ```json
   {
     "nome": "João da Silva",
     "email": "joao@empresa.com.br",
     "telefone": "(11) 99999-8888",
     "area": "empresarial",
     "mensagem": "Descrição do caso...",
     "lgpd": "on"
   }
   ```

4. Retorne status **2xx** em caso de sucesso. Qualquer outro status exibe a mensagem de erro no formulário.
5. Valide e sanitize os dados também no servidor. Nunca coloque chaves, tokens ou credenciais no JavaScript do navegador.
6. Configure CORS se o endpoint estiver em outro domínio.
7. Faça testes reais de envio, recebimento, spam e tempo de resposta.

Serviços como Formspree, Basin, Netlify Forms/Functions, Vercel Functions ou um endpoint próprio em PHP/Node podem ser usados. Para maior controle de LGPD, prefira um backend próprio com registro de consentimento, prazo de retenção e política de descarte.

#### LGPD

O checkbox de consentimento é obrigatório. Antes de publicar:

- crie uma **Política de Privacidade** completa (o link atual aponta para `#aviso-legal`);
- informe finalidade, base legal, prazo de retenção, compartilhamento e direitos do titular;
- defina um canal para solicitações (o projeto usa `privacidade@silvaassociados.adv.br` como placeholder);
- evite solicitar dados sensíveis na primeira mensagem — o texto do formulário já orienta o usuário nesse sentido;
- mantenha o honeypot e considere rate limiting/captcha no servidor.

### 6. WhatsApp, telefone e e-mail

O número de WhatsApp placeholder é `5511999999999`. Ele aparece em vários pontos:

- botão do header;
- hero;
- menu mobile;
- bloco de contato;
- rodapé;
- botão flutuante;
- mensagem de sucesso do formulário.

Faça uma busca global por:

```text
5511999999999
(11) 99999-9999
+5511999999999
```

O telefone fixo aparece como `(11) 3456-7890` e `+551134567890`. Atualize também o JSON-LD (`telephone`) e o link `tel:`.

A mensagem pré-preenchida está codificada na URL (`?text=...`). Se alterar o texto, mantenha a codificação URL correta.

### 7. Mapa

O mapa usa um embed do Google Maps:

```html
<iframe src="https://www.google.com/maps?q=Av.%20Paulista%2C%201000...&output=embed">
```

Substitua o endereço na query `q=` e no `title` do iframe. O embed não exige chave de API, mas carrega recursos do Google e pode exigir consentimento de cookies dependendo da sua política de privacidade. Se preferir evitar terceiros, troque por um mapa estático com link para o Google Maps.

### 8. SEO e domínio

Antes de publicar, substitua o domínio placeholder `https://www.silvaassociados.adv.br/` em:

- `<link rel="canonical">`;
- `og:url` e `og:image`;
- `twitter:image`;
- JSON-LD (`@id`, `url`, `logo`, `image`);
- qualquer link absoluto no conteúdo.

Revise também:

- `<title>` e `<meta name="description">`;
- `og:title`, `og:description` e `og:image:alt`;
- dados de endereço, telefone, e-mail, OAB e CNPJ no JSON-LD;
- imagem Open Graph `1200 × 630` publicada no caminho informado.

Recomenda-se criar, no deploy:

- `robots.txt`;
- `sitemap.xml` com a URL canônica;
- redirecionamento de `http` para `https` e de `www` para o domínio escolhido (ou o contrário, mas apenas um canônico);
- página 404 personalizada.

### 9. Publicação

O site é totalmente estático: basta enviar `index.html`, `README.md` e a pasta `assets/` para o servidor.

Sugestões:

- **Netlify / Vercel / Cloudflare Pages**: deploy da pasta, HTTPS automático.
- **GitHub Pages**: publique a branch com o `index.html` na raiz.
- **Hospedagem tradicional**: envie via FTP/SFTP para a raiz do domínio.

Cuidados:

- sirva sempre em HTTPS;
- configure cache para CSS, JS e imagens; se atualizar com frequência, use versionamento (`style.css?v=2`) ou cache curto para o HTML;
- mantenha o `index.html` como documento inicial;
- após o deploy, teste o formulário, o WhatsApp, o mapa e as imagens sociais.

---

## Acessibilidade

O projeto foi construído com foco em WCAG AA:

- estrutura semântica com `header`, `nav`, `main`, `section`, `footer`;
- link “Pular para o conteúdo”;
- navegação por teclado com foco visível;
- menu mobile fecha com `ESC` e devolve o foco ao botão;
- carrossel com botões acessíveis, dots, setas do teclado, swipe e status `aria-live`;
- formulário com labels, `aria-required`, `aria-invalid`, erros inline e foco no primeiro campo inválido;
- `prefers-reduced-motion` desativa animações;
- contraste de cores ajustado;
- imagens decorativas com `alt=""` e ícones com `aria-hidden="true"`.

A auditoria Lighthouse do projeto (desktop, via ferramenta de QA) resultou em:

- **Acessibilidade: 100**
- **Boas práticas: 100**
- **SEO: 100**

Os resultados podem variar conforme ambiente, extensões, fontes e conteúdo. Reexecute a auditoria após qualquer alteração de cores, textos ou estrutura.

---

## Performance

- CSS crítico inline para o primeiro paint.
- CSS completo carregado em seguida.
- SVGs leves no lugar de fotos pesadas.
- `preload` da imagem principal.
- `loading="lazy"` e `decoding="async"` nas imagens secundárias.
- `preconnect` para o Google Fonts.
- JavaScript com `defer`, sem bibliotecas.
- Animações com `IntersectionObserver`.

Ao substituir por fotos reais, compressão e dimensionamento correto são essenciais para não perder esses ganhos.

---

## Checklist antes de publicar

- [ ] Substituir nome, textos, áreas, equipe, cases, depoimentos e clientes.
- [ ] Revisar OAB, CNPJ, endereço, telefone, e-mail e redes sociais.
- [ ] Configurar `data-endpoint` e testar o envio real do formulário.
- [ ] Criar a Política de Privacidade e revisar os textos de LGPD.
- [ ] Substituir as ilustrações por fotos reais, se desejado, e atualizar os `alt`.
- [ ] Atualizar todas as ocorrências do domínio e da imagem Open Graph.
- [ ] Criar `robots.txt` e `sitemap.xml`.
- [ ] Testar WhatsApp, telefone, e-mail e mapa.
- [ ] Testar em 320, 390, 768, 1024 e 1440px.
- [ ] Testar teclado, leitor de tela e `prefers-reduced-motion`.
- [ ] Rodar Lighthouse e corrigir regressões.
- [ ] Revisar a publicidade conforme o Código de Ética e Disciplina da OAB e o Provimento CFOAB nº 205/2021.

---

## Conformidade com a publicidade advocatícia

Este projeto é um modelo. Antes de usar em produção, o conteúdo deve ser validado por um advogado responsável, considerando o **Código de Ética e Disciplina da OAB** e o **Provimento CFOAB nº 205/2021**, que regulamenta publicidade, informação e captação de clientes.

Atenção especial a:

- promessas ou garantias de resultado;
- expressões como “consulta gratuita”, “melhor escritório” ou “especialista” sem comprovação;
- divulgação de cases e valores sem autorização e sem contexto;
- depoimentos que possam sugerir vantagem indevida;
- sensacionalismo, mercantilização ou linguagem de venda agressiva;
- uso de dados de clientes sem consentimento.

O aviso legal do rodapé é um ponto de partida, não substitui a revisão jurídica e a política de privacidade.

---

## Limitações conhecidas

- O formulário está em modo demonstrativo até a configuração do endpoint.
- Os links do blog apontam para `#blog`; não há páginas de artigo.
- Cases, depoimentos, números, nomes, OAB, CNPJ e endereço são fictícios.
- O mapa e as fontes dependem de serviços externos.
- Não há área administrativa, CMS ou banco de dados.

---

© 2026 Silva & Associados Advogados — conteúdo de demonstração.
