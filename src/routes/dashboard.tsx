import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/finance/AppLayout";
import { ResumoCard } from "@/components/finance/ResumoCard";
import { GraficoCategorias } from "@/components/finance/GraficoCategorias";
import { GraficoEvolucao } from "@/components/finance/GraficoEvolucao";
import { MesSelector } from "@/components/finance/MesSelector";
import { useResumo, useEvolucao } from "@/hooks/use-resumo";
import { useTransacoes } from "@/hooks/use-transacoes";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Controle Financeiro" },
      { name: "description", content: "Resumo mensal de receitas, despesas e saldo com gráficos." },
      { property: "og:title", content: "Dashboard — Controle Financeiro" },
      { property: "og:description", content: "Resumo mensal de receitas, despesas e saldo com gráficos." },
    ],
  }),
  component: () => (
    <AppLayout title="Dashboard">
      <DashboardContent />
    </AppLayout>
  ),
});

function DashboardContent() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [ano, setAno] = useState(now.getFullYear());

  // Buscar transações sem filtro para gerar a lista de meses disponíveis
  const { data: allTransacoes } = useTransacoes();
  const mesesDisponiveis = useMemo(() => {
    if (!allTransacoes) return [];
    const s = new Set(allTransacoes.map((t) => t.data.slice(0, 7)));
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [allTransacoes]);

  const { data: resumo, isLoading } = useResumo(mes, ano);

  const mesKey = `${ano}-${String(mes).padStart(2, "0")}`;

  const handleMesChange = (v: string) => {
    const [a, m] = v.split("-");
    setAno(Number(a));
    setMes(Number(m));
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Visão geral</div>
          <div className="text-xl font-semibold tracking-tight">Seu mês em números</div>
        </div>
        <MesSelector
          value={mesKey}
          onChange={handleMesChange}
          meses={mesesDisponiveis}
        />
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <ResumoCard label="Receitas do mês" value={resumo?.totalReceitas ?? 0} icon={ArrowUpRight} tone="receita" />
            <ResumoCard label="Despesas do mês" value={resumo?.totalDespesas ?? 0} icon={ArrowDownRight} tone="despesa" />
            <ResumoCard label="Saldo do mês" value={resumo?.saldo ?? 0} icon={Wallet} tone="saldo" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <GraficoCategorias categorias={resumo?.categorias ?? []} />
            <GraficoEvolucao />
          </div>
        </>
      )}
    </div>
  );
}
