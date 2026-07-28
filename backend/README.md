# Backend — Controle Financeiro API

API ASP.NET Core (.NET 8) para o sistema de controle financeiro pessoal.

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Ferramenta `dotnet-ef` (Entity Framework CLI)

## Instalação 

### 1. Instalar o .NET 8 SDK

Baixe e instale a partir de: https://dotnet.microsoft.com/download/dotnet/8.0

Confirme a instalação:
```bash
dotnet --version
```

### 2. Instalar a ferramenta EF Core

```bash
dotnet tool install --global dotnet-ef
```

### 3. Restaurar pacotes

```bash
cd backend/Backend.API
dotnet restore
```

### 4. Criar o banco de dados (SQLite)

O banco de dados é criado automaticamente ao rodar a aplicação (auto-migrate no `Program.cs`).

Mas se preferir criar manualmente:

```bash
dotnet ef database update
```

O arquivo `financeiro.db` será criado na pasta `Backend.API/`.

### 5. Rodar a aplicação

```bash
dotnet run
```

A API estará disponível em: **http://localhost:5079**

Swagger UI: **http://localhost:5079/swagger**

## Criando Migrations

Se alterar os Models, gere uma nova migration:

```bash
dotnet ef migrations add NomeDaMigration
```

## Endpoints

### Autenticação (público)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/registrar` | Criar conta (retorna JWT) |
| POST | `/api/auth/login` | Login (retorna JWT) |

### Categorias (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/categorias` | Listar categorias |
| POST | `/api/categorias` | Criar categoria |
| PUT | `/api/categorias/{id}` | Atualizar categoria |
| DELETE | `/api/categorias/{id}` | Deletar categoria |

### Transações (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/transacoes?mes=&ano=&categoriaId=` | Listar com filtros |
| POST | `/api/transacoes` | Criar transação |
| PUT | `/api/transacoes/{id}` | Atualizar transação |
| DELETE | `/api/transacoes/{id}` | Deletar transação |

### Dashboard/Resumo (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/resumo?mes=&ano=` | Resumo do mês |
| GET | `/api/resumo/evolucao?meses=6` | Evolução últimos N meses |

## Autenticação

Use o token JWT retornado no login/registro no header:
```
Authorization: Bearer <token>
```

No Swagger, clique no botão 🔒 **Authorize** e cole o token.

## Configuração

As configurações estão em `appsettings.json`:

- **ConnectionStrings:DefaultConnection** — caminho do banco SQLite
- **Jwt:Key** — chave secreta para assinar tokens JWT
- **Jwt:ExpiresInHours** — duração do token (padrão: 24h)

## Notas

- Ao registrar um novo usuário, **9 categorias padrão** são criadas automaticamente (Salário, Freelance, Alimentação, etc.)
- Transações **não possuem campo Tipo** — o tipo (receita/despesa) é sempre inferido pela Categoria vinculada
- Cada usuário só acessa seus próprios dados (isolamento por UsuarioId)
