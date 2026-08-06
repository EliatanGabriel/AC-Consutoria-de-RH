# AC Consultoria de RH

Site institucional e sistema de recrutamento desenvolvido para a **AC Consultoria de RH**, com o objetivo de apresentar a empresa, seus serviços, divulgar vagas e permitir que candidatos cadastrem seus currículos para futuras oportunidades de emprego.

---

## Objetivo

O projeto tem como finalidade facilitar o contato entre candidatos e a equipe de Recursos Humanos da AC Consultoria de RH.

Os usuários podem conhecer a empresa, visualizar as vagas em aberto e realizar seu cadastro para que seus dados sejam analisados pela equipe de RH e encaminhados para vagas compatíveis com seu perfil.

---

## Funcionalidades

### Públicas
- Página inicial institucional
- Apresentação da empresa
- Informações sobre os serviços prestados
- Página de vagas em aberto (carregadas dinamicamente)
- Formulário de cadastro de candidatos (Banco de Talentos) com envio de currículo
- Envio do cadastro para o sistema e notificação por e-mail
- Contato com a empresa
- Layout responsivo

### Administrativas
- Painel de login de administrador
- CRUD de vagas (criar, editar, excluir, abrir/fechar)
- Listagem dos candidatos cadastrados no Banco de Talentos
- Exclusão de candidaturas

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (front-end)
- Node.js
- Express
- SQLite (banco de dados local)

---

## Como Executar

Requisitos: **Node.js 22 ou superior** (o projeto usa o módulo nativo `node:sqlite`).

1. Clone o repositório.

```bash
git clone https://github.com/EliatanGabriel/ac-consultoria.git
```

2. Instale as dependências.

```bash
npm install
```

3. Inicie o servidor.

```bash
npm start
```

4. Acesse em `http://localhost:3000`.

> Para abrir apenas o site (sem o sistema), execute `index.html` em seu navegador ou use o **Live Server** no Visual Studio Code — mas as páginas de vagas e o painel admin precisam do servidor.

### Acesso ao painel admin

Acesse `http://localhost:3000/pages/admin/login.html`.

Na primeira execução, um administrador padrão é criado automaticamente:

- Usuário: `admin`
- Senha: `admin123`

> **Importante:** em produção, defina as variáveis de ambiente `ADMIN_USER` e `ADMIN_PASSWORD` (ou altere a senha) para não usar as credenciais padrão.

---

## Estrutura

- `index.html` — página inicial
- `pages/vagas.html` — vagas em aberto
- `pages/bancotalentos.html` — formulário de cadastro de candidatos
- `pages/admin/` — painel administrativo (login e dashboard)
- `assets/` — CSS e JavaScript (site e admin)
- `server.js` — servidor Express e API
- `src/db.js` — conexão e criação do banco SQLite
- `src/auth.js` — autenticação e sessões
- `data/` — arquivo do banco local (gerado em tempo de execução)

---

## Público-alvo

- Candidatos em busca de oportunidades de emprego.
- Empresas interessadas nos serviços da AC Consultoria de RH.

---

## Responsividade

O site foi desenvolvido para funcionar em:

- Desktop
- Tablet
- Smartphone

---

## Desenvolvedor

Projeto desenvolvido para a **AC Consultoria de RH**.

---

## Licença

Este projeto é de propriedade da **AC Consultoria de RH**.

Todos os direitos reservados.