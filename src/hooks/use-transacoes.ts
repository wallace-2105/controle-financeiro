import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransacoes,
  criarTransacao,
  atualizarTransacao,
  deletarTransacao,
  type TransacaoCreatePayload,
} from "@/services/api";

const TRANSACOES_KEY = ["transacoes"] as const;

type TransacoesFiltros = {
  mes?: number;
  ano?: number;
  categoriaId?: string;
};

export function useTransacoes(filtros?: TransacoesFiltros) {
  return useQuery({
    queryKey: [...TRANSACOES_KEY, filtros],
    queryFn: () => getTransacoes(filtros),
  });
}

export function useCreateTransacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (t: TransacaoCreatePayload) => criarTransacao(t),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRANSACOES_KEY });
      qc.invalidateQueries({ queryKey: ["resumo"] });
    },
  });
}

export function useUpdateTransacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...t }: TransacaoCreatePayload & { id: string }) =>
      atualizarTransacao(id, t),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRANSACOES_KEY });
      qc.invalidateQueries({ queryKey: ["resumo"] });
    },
  });
}

export function useDeleteTransacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletarTransacao(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRANSACOES_KEY });
      qc.invalidateQueries({ queryKey: ["resumo"] });
    },
  });
}
