import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/finance/AppLayout";
import { ResumoCard } from "@/components/finance/ResumoCard";
import { GraficoCategorias } from "@/components/finance/GraficoCategorias";
import { GraficoEvolucao } from "@/components/finance/GraficoEvolucao";
import { MesSelector } from "@/components/finance/MesSelector";
import { useFinance } from "@/store/finance-store";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { monthKey } from "@/lib/finance-format";

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
  const { categorias, transacoes } = useFinance();
  const mesesDisponiveis = useMemo(() => {
    const s = new Set(transacoes.map((t) => monthKey(t.data)));
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [transacoes]);
  const [mes, setMes] = useState(mesesDisponiveis[0] ?? new Date().toISOString().slice(0, 7));

  const { receitas, despesas, saldo } = useMemo(() => {
    let r = 0, d = 0;
    for (const t of transacoes) {
      if (!t.data.startsWith(mes)) continue;
      const c = categorias.find((c) => c.id === t.categoriaId);
      if (!c) continue;
      if (c.tipo === "receita") r += t.valor;
      else d += t.valor;
    }
    return { receitas: r, despesas: d, saldo: r - d };
  }, [categorias, transacoes, mes]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Visão geral</div>
          <div className="text-xl font-semibold tracking-tight">Seu mês em números</div>
        </div>
        <MesSelector value={mes} onChange={setMes} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ResumoCard label="Receitas do mês" value={receitas} icon={ArrowUpRight} tone="receita" />
        <ResumoCard label="Despesas do mês" value={despesas} icon={ArrowDownRight} tone="despesa" />
        <ResumoCard label="Saldo do mês" value={saldo} icon={Wallet} tone="saldo" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GraficoCategorias mes={mes} />
        <GraficoEvolucao />
      </div>
    </div>
  );
}
