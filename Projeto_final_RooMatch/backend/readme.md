### 4. Setup do Prisma e Histórico de Migrações

Estes passos recriam a estrutura do banco de dados na ordem exata de nosso desenvolvimento:

1.  **Criação Inicial do Schema e Primeira Migração:**

    ```bash
    # (Comando inicial que cria o schema e a primeira migração base)
    npx prisma migrate dev --name init_full_schemas
    ```

2.  **Migração para o Módulo Reset de Senha:**

    ```bash
    # (Adiciona as colunas reset_password_token e reset_password_expires ao modelo User)
    npx prisma migrate dev --name add_password_reset_fields
    ```

3.  **Migração para o Módulo Accounts Não Pagas:**

    ```bash
    # (Torna a coluna paid_by_id da tabela Account opcional (Int?))
    npx prisma migrate dev --name make_account_paid_by_optional
    ```

4.  **População Inicial de Dados (Seed):**
    ```bash
    # Insere Perfis, Usuários Admin/Comum, Casa, Tarefas iniciais e Punições
    npm run prisma:seed
    ```

## ▶️ Executando a Aplicação

O servidor Fastify será iniciado e observará as mudanças de arquivo (`nodemon`):

```bash
npm run dev




💻 Estrutura da API
A API está organizada nos seguintes módulos e endpoints, acessíveis pela URL base http://localhost:3333.

Documentação
URL Base: http://localhost:3333/docs

Ação: Acesso à interface Swagger UI para visualização da documentação completa da API.

Auth (Autenticação)
URL Base: /auth

Ações: POST /auth/login (Login), POST /auth/register (Cadastro), POST /auth/forgot-password (Recuperação de Senha).

Users (Usuários)
URL Base: /users

Ação: PATCH /users/me (Atualiza o perfil do usuário logado).

House (Casa/Comunidade)
URL Base: /house

Ações: GET /house (Busca informações da casa), POST /house/join (Solicita entrada na casa), PATCH /house/members/:userId/status (Atualiza o status de um membro da casa, e.g., aprovação).

Tasks (Tarefas)
URL Base: /tasks

Ações: POST /tasks (Cria nova tarefa), GET /tasks (Lista tarefas), PATCH /tasks/:taskId/status (Atualiza o status de uma tarefa), POST /tasks/:taskId/review (Envia uma revisão/avaliação da tarefa).

Accounts (Contas/Finanças)
URL Base: /accounts

Ações: POST /accounts (Cria nova conta), GET /accounts (Lista contas), PATCH /accounts/:accountId/pay (Registra um pagamento em uma conta).

Punishments (Punições)
URL Base: /punishments

Ações: POST /punishments (Cria nova punição), GET /punishments (Lista punições), POST /punishments/apply (Aplica uma punição a um usuário).

👥 Dados dos Usuários Cadastrados
Abaixo estão os dados dos usuários de exemplo, incluindo credenciais e status na comunidade (House Status):

Werlen

Email: werlen@example.com

Senha: 123

Perfil: ADMIN

House Status: APPROVED

Marcela

Email: marcela@example.com

Senha: 123

Perfil: COMMON

House Status: APPROVED

David

Email: david@example.com

Senha: 123

Perfil: COMMON

House Status: APPROVED
```
