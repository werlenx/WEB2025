arkdown# 🏡 RooMatch - API Backend

Este projeto é o backend da aplicação RooMatch, desenvolvida para gerenciar tarefas domésticas, pontuação (gamificação), e finanças (divisão de contas) em casas compartilhadas.

O backend utiliza **Fastify** (Node.js) para rotas rápidas e **Prisma** com **PostgreSQL** para persistência de dados.

## 🚀 Tecnologias Principais

- **Framework:** Fastify
- **Banco de Dados:** PostgreSQL (via Docker)
- **ORM:** Prisma ORM
- **Autenticação:** JWT (JSON Web Tokens)
- **Documentação:** Swagger/OpenAPI

## ⚙️ Instalação e Configuração

### 1. Pré-requisitos

Certifique-se de ter o `Node.js` (v18+) e o `Docker` instalados em sua máquina.

### 2. Configuração Inicial

1.  **Instale as dependências:**

    ```bash
    npm install
    ```

2.  **Crie o arquivo de variáveis de ambiente (`.env`):**

    ```
    # Variável de ambiente crucial para o JWT
    JWT_SECRET="sua_chave_secreta_aqui"

    # Variável de ambiente crucial para o Prisma conectar ao Docker (PostgreSQL)
    DATABASE_URL="postgresql://admin:admin@localhost:5432/roomatch_bd?schema=public"
    ```

### 3. Subindo o Banco de Dados (Docker)

Utilizamos o Docker Compose para rodar o PostgreSQL de forma isolada.

```bash
docker-compose up -d
(O banco de dados estará disponível na porta 5432.)4. Setup do PrismaExecute as migrações e o script de seed para popular o banco com dados de teste (werlen@example.com, marcela@example.com, david@example.com):Bashnpx prisma migrate dev --name init_full_schemas
npm run prisma:seed # (ou npx prisma db seed, dependendo da sua versão)
▶️ Executando a AplicaçãoO servidor Fastify será iniciado e observará as mudanças de arquivo (nodemon).Bashnpm run dev
Endpoints ÚteisRecursoURL BaseDocumentaçãoServidorhttp://localhost:3333Documentaçãohttp://localhost:3333/docsSwagger UILogin/Registro/authCasa/Membros/houseTarefas/tasksContas/accounts🔑 Dados de Teste Padrão (Seed)UsuárioEmailSenhaPerfilHouse StatusWerlenwerlen@example.com123ADMINAPPROVEDMarcelamarcela@example.com123COMMONAPPROVEDDaviddavid@example.com123COMMONAPPROVED
---

**Prioridade:** Aplique a correção no **`user.controller.js`** e tente o Cenário 2 (email duplicado) novamente. Me diga o resultado!
```
