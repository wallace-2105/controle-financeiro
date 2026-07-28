import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategorias,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria,
  type CategoriaAPI,
} from "@/services/api";

const CATEGORIAS_KEY = ["categorias"] as const;

export function useCategorias() {
  return useQuery({
    queryKey: CATEGORIAS_KEY,
    queryFn: getCategorias,
  });
}

export function useCreateCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cat: Omit<CategoriaAPI, "id">) => criarCategoria(cat),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORIAS_KEY });
    },
  });
}

export function useUpdateCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...cat }: CategoriaAPI) => atualizarCategoria(id, cat),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORIAS_KEY });
    },
  });
}

export function useDeleteCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletarCategoria(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORIAS_KEY });
    },
  });
}
