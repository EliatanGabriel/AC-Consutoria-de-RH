# AC Consultoria de RH

Site institucional da **AC Consultoria de RH** — página inicial, vagas em aberto e cadastro de currículo (Banco de Talentos).

---

## Funcionalidades

- Página inicial institucional
- Apresentação da empresa e dos serviços prestados
- Página de vagas em aberto (conteúdo estático em `assets/js/vagas.js`)
- Formulário de cadastro de currículo (Banco de Talentos) com envio por e-mail via [FormSubmit](https://formsubmit.co)
- Página de contato
- Layout responsivo

---

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)

Projeto 100% estático — **não usa backend, banco de dados nem servidor Node**.

---

## Como executar

Basta abrir o arquivo `index.html` no navegador, ou usar o **Live Server** no Visual Studio Code.

---

## Estrutura

- `index.html` — página inicial
- `pages/vagas.html` — vagas em aberto
- `pages/bancotalentos.html` — cadastro de currículo
- `assets/css/` — folhas de estilo do site
  - `base/` — variáveis, reset e tipografia
  - `layout/` — container, header e footer
  - `components/` — botões, cards, imagens, títulos e tags
  - `sections/` — seções da página inicial (hero, serviços, sobre, contato, feedbacks)
  - `pages/` — estilos específicos das páginas internas (vagas, talentos)
  - `utils/` — media queries responsivas
- `assets/js/vagas.js` — renderização das vagas
- `assets/img/` — imagens do site

---

## Público-alvo

- Candidatos em busca de oportunidades de emprego
- Empresas interessadas nos serviços da AC Consultoria de RH

---

## Licença

Este projeto é de propriedade da **AC Consultoria de RH**.

Todos os direitos reservados.
