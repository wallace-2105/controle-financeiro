# Sparkle Cash Craft 💰

Sistema de controle financeiro pessoal — cadastre suas receitas e despesas, acompanhe categorias e visualize sua saúde financeira mês a mês em um dashboard com gráficos.

## Visão geral

<img width="953" height="538" alt="image" src="https://github.com/user-attachments/assets/49c7ec41-4ce1-4b1d-84f3-fe2b40932f60" />

<img width="959" height="539" alt="Captura de tela 2026-07-28 135521" src="https://github.com/user-attachments/assets/0a39c62d-d96d-462e-89ef-ea62ccf86294" />



Este projeto nasceu de uma necessidade real: ter um controle financeiro simples, visual e sob meu próprio domínio (sem depender de planilhas soltas ou apps de terceiros). O sistema permite:

- Registrar transações (receitas e despesas) com descrição, valor, data e categoria
- Organizar transações por categorias personalizáveis (ex: Salário, Alimentação, Moradia, Lazer)
- Visualizar um dashboard mensal com totais de receita, despesa e saldo
- Acompanhar a evolução financeira ao longo dos meses através de gráficos
- Filtrar transações por mês, ano e categoria

## Stack utilizada

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite + TanStack Router + TanStack Query |
| UI | Tailwind CSS v4 + shadcn/ui (Radix) |
| Gráficos | Recharts |
| Backend | ASP.NET Core Web API (.NET 8) |
| Banco de dados | SQLite + Entity Framework Core |
| Autenticação | JWT |

## Estrutura do repositório

```
sparkle-cash-craft/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/
│   │   └── finance/        # Componentes de negócio (Dashboard, Transações, Categorias)
│   ├── mocks/               # Dados fake usados no desenvolvimento inicial
│   └── routes/              # Páginas (file-based routing via TanStack Router)
├── backend/
│   └── Backend.API/         # API ASP.NET Core
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       └── appsettings.json
└── README.md                 # Este arquivo
```

## Como rodar o projeto localmente

O sistema tem duas partes que rodam **simultaneamente**, em terminais separados: o backend (API) e o frontend (interface).

### 1. Backend (API .NET)

Pré-requisitos: [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

```bash
cd backend/Backend.API
dotnet restore
dotnet run
```

A API sobe em `http://localhost:5079` (Swagger em `/swagger`).

> Instruções completas de configuração, endpoints e autenticação estão no [README do backend](backend/Backend.API/README.md).

### 2. Frontend (React)

Pré-requisitos: [Node.js](https://nodejs.org/) 18+

```bash
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173` (porta padrão do Vite).

## Funcionalidades

- [x] Cadastro de transações (receita/despesa)
- [x] Categorias personalizáveis, com cor e tipo
- [x] Dashboard com resumo financeiro mensal (receitas, despesas, saldo)
- [x] Gráfico de gastos por categoria
- [x] Gráfico de evolução mensal
- [x] Filtro por mês, ano e categoria
- [x] Autenticação via JWT
- [ ] Transações recorrentes (ex: salário fixo mensal automático)
- [ ] Metas financeiras
- [ ] Exportação de relatórios (PDF/Excel)

## Modelagem de dados

```
Usuario
├── Id, Nome, Email, SenhaHash, CriadoEm

Categoria
├── Id, Nome, Tipo (Receita/Despesa), Cor, UsuarioId

Transacao
├── Id, Descricao, Valor, Data, CategoriaId, UsuarioId
```

> Observação: a `Transacao` não possui campo `Tipo` próprio — ele é sempre inferido a partir da `Categoria` vinculada.

## Autor

Desenvolvido por Wallace como projeto pessoal de estudo e uso real no controle financeiro do dia a dia.
