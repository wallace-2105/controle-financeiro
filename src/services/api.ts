const API_BASE = "http://localhost:5079/api";

// ── Token management ──

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("auth_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ── Fetch wrapper ──

class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
  ) {
    super(typeof data === "object" && data !== null && "mensagem" in data
      ? (data as { mensagem: string }).mensagem
      : `Erro ${status}`);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = { mensagem: response.statusText };
    }
    throw new ApiError(response.status, data);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ── Auth ──

export type AuthResponse = {
  token: string;
  nome: string;
  email: string;
};

export async function apiLogin(email: string, senha: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
  setToken(data.token);
  return data;
}

export async function apiRegistrar(nome: string, email: string, senha: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/registrar", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha }),
  });
  setToken(data.token);
  return data;
}

// ── Categorias ──

// Resposta da API com id string (guid)
export type CategoriaAPI = {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
};

export async function getCategorias(): Promise<CategoriaAPI[]> {
  return request<CategoriaAPI[]>("/categorias");
}

export async function criarCategoria(cat: Omit<CategoriaAPI, "id">): Promise<CategoriaAPI> {
  return request<CategoriaAPI>("/categorias", {
    method: "POST",
    body: JSON.stringify(cat),
  });
}

export async function atualizarCategoria(id: string, cat: Omit<CategoriaAPI, "id">): Promise<CategoriaAPI> {
  return request<CategoriaAPI>(`/categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify(cat),
  });
}

export async function deletarCategoria(id: string): Promise<void> {
  return request<void>(`/categorias/${id}`, { method: "DELETE" });
}

// ── Transações ──

export type TransacaoAPI = {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoriaId: string;
  categoriaNome: string;
  categoriaCor: string;
  tipo: "receita" | "despesa";
};

type TransacaoFiltros = {
  mes?: number;
  ano?: number;
  categoriaId?: string;
};

export async function getTransacoes(filtros?: TransacaoFiltros): Promise<TransacaoAPI[]> {
  const params = new URLSearchParams();
  if (filtros?.mes) params.set("mes", String(filtros.mes));
  if (filtros?.ano) params.set("ano", String(filtros.ano));
  if (filtros?.categoriaId) params.set("categoriaId", filtros.categoriaId);

  const qs = params.toString();
  return request<TransacaoAPI[]>(`/transacoes${qs ? `?${qs}` : ""}`);
}

export type TransacaoCreatePayload = {
  descricao: string;
  valor: number;
  data: string;
  categoriaId: string;
};

export async function criarTransacao(t: TransacaoCreatePayload): Promise<TransacaoAPI> {
  return request<TransacaoAPI>("/transacoes", {
    method: "POST",
    body: JSON.stringify(t),
  });
}

export async function atualizarTransacao(id: string, t: TransacaoCreatePayload): Promise<TransacaoAPI> {
  return request<TransacaoAPI>(`/transacoes/${id}`, {
    method: "PUT",
    body: JSON.stringify(t),
  });
}

export async function deletarTransacao(id: string): Promise<void> {
  return request<void>(`/transacoes/${id}`, { method: "DELETE" });
}

// ── Resumo ──

export type CategoriaTotalItem = {
  categoriaId: string;
  nome: string;
  cor: string;
  tipo: "receita" | "despesa";
  total: number;
};

export type ResumoAPI = {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  categorias: CategoriaTotalItem[];
};

export async function getResumo(mes: number, ano: number): Promise<ResumoAPI> {
  return request<ResumoAPI>(`/resumo?mes=${mes}&ano=${ano}`);
}

export type EvolucaoMesItem = {
  mes: number;
  ano: number;
  label: string;
  receitas: number;
  despesas: number;
};

export type EvolucaoAPI = {
  meses: EvolucaoMesItem[];
};

export async function getEvolucao(meses: number = 6): Promise<EvolucaoAPI> {
  return request<EvolucaoAPI>(`/resumo/evolucao?meses=${meses}`);
}
