import { useQuery } from "@tanstack/react-query";
import { getResumo, getEvolucao } from "@/services/api";

export function useResumo(mes: number, ano: number) {
  return useQuery({
    queryKey: ["resumo", mes, ano],
    queryFn: () => getResumo(mes, ano),
    enabled: mes >= 1 && mes <= 12 && ano >= 2000,
  });
}

export function useEvolucao(meses: number = 6) {
  return useQuery({
    queryKey: ["resumo", "evolucao", meses],
    queryFn: () => getEvolucao(meses),
  });
}
