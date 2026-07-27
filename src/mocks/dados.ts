export type Categoria = {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
};

export type Transacao = {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoriaId: string;
};

export const categoriasMock: Categoria[] = [
  { id: "c1", nome: "Salário", tipo: "receita", cor: "#10b981" },
  { id: "c2", nome: "Freelance", tipo: "receita", cor: "#22c55e" },
  { id: "c3", nome: "Investimentos", tipo: "receita", cor: "#14b8a6" },
  { id: "c4", nome: "Alimentação", tipo: "despesa", cor: "#f97316" },
  { id: "c5", nome: "Transporte", tipo: "despesa", cor: "#3b82f6" },
  { id: "c6", nome: "Lazer", tipo: "despesa", cor: "#a855f7" },
  { id: "c7", nome: "Moradia", tipo: "despesa", cor: "#ef4444" },
  { id: "c8", nome: "Saúde", tipo: "despesa", cor: "#ec4899" },
  { id: "c9", nome: "Educação", tipo: "despesa", cor: "#eab308" },
];

export const transacoesMock: Transacao[] = [
  // Mês atual e anteriores — 3 meses
  { id: "t1", descricao: "Salário mensal", valor: 6500, data: "2026-07-05", categoriaId: "c1" },
  { id: "t2", descricao: "Projeto freelance site", valor: 1800, data: "2026-07-12", categoriaId: "c2" },
  { id: "t3", descricao: "Aluguel", valor: 2200, data: "2026-07-08", categoriaId: "c7" },
  { id: "t4", descricao: "Supermercado", valor: 780, data: "2026-07-10", categoriaId: "c4" },
  { id: "t5", descricao: "Uber e transporte", valor: 210, data: "2026-07-15", categoriaId: "c5" },
  { id: "t6", descricao: "Cinema com amigos", valor: 95, data: "2026-07-18", categoriaId: "c6" },
  { id: "t7", descricao: "Consulta médica", valor: 320, data: "2026-07-20", categoriaId: "c8" },

  { id: "t8", descricao: "Salário mensal", valor: 6500, data: "2026-06-05", categoriaId: "c1" },
  { id: "t9", descricao: "Dividendos", valor: 340, data: "2026-06-15", categoriaId: "c3" },
  { id: "t10", descricao: "Aluguel", valor: 2200, data: "2026-06-08", categoriaId: "c7" },
  { id: "t11", descricao: "Restaurantes", valor: 640, data: "2026-06-14", categoriaId: "c4" },
  { id: "t12", descricao: "Combustível", valor: 380, data: "2026-06-11", categoriaId: "c5" },
  { id: "t13", descricao: "Curso online", valor: 450, data: "2026-06-22", categoriaId: "c9" },
  { id: "t14", descricao: "Show", valor: 280, data: "2026-06-25", categoriaId: "c6" },

  { id: "t15", descricao: "Salário mensal", valor: 6200, data: "2026-05-05", categoriaId: "c1" },
  { id: "t16", descricao: "Freelance logo", valor: 900, data: "2026-05-18", categoriaId: "c2" },
  { id: "t17", descricao: "Aluguel", valor: 2200, data: "2026-05-08", categoriaId: "c7" },
  { id: "t18", descricao: "Mercado", valor: 820, data: "2026-05-12", categoriaId: "c4" },
  { id: "t19", descricao: "Farmácia", valor: 180, data: "2026-05-20", categoriaId: "c8" },
  { id: "t20", descricao: "Viagem fim de semana", valor: 720, data: "2026-05-28", categoriaId: "c6" },
];
