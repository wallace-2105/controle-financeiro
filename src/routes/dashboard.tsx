import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/finance/AppLayout";
import { ResumoCard } from "@/components/finance/ResumoCard";
import { GraficoCategorias } from "@/components/finance/GraficoCategorias";
import { GraficoEvolucao } from "@/components/finance/GraficoEvolucao";
import { MesSelector } from "@/components/finance/MesSelector";
import { useResumo } from "@/hooks/use-resumo";
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

  // Busca todas as transações para montar a lista de meses disponíveis no seletor
  const { data: allTransacoes } = useTransacoes();

  // Gera a lista de meses que têm transações + garante que o mês atual SEMPRE aparece
  const mesesDisponiveis = useMemo(() => {
    const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const set = new Set<string>([mesAtual]); // mês atual sempre está disponível
    if (allTransacoes) {
      for (const t of allTransacoes) {
        set.add(t.data.slice(0, 7));
      }
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [allTransacoes]);

  const { data: resumo, isLoading } = useResumo(mes, ano);

  // "2026-07" format para o MesSelector
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
        <div className="text-sm text-muted-foreground animate-pulse">Carregando dados do mês...</div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            <ResumoCard
              label="Receitas do mês"
              value={resumo?.totalReceitas ?? 0}
              icon={ArrowUpRight}
              tone="receita"
              delay={0}
            />
            <ResumoCard
              label="Despesas do mês"
              value={resumo?.totalDespesas ?? 0}
              icon={ArrowDownRight}
              tone="despesa"
              delay={1}
            />
            <ResumoCard
              label="Saldo do mês"
              value={resumo?.saldo ?? 0}
              icon={Wallet}
              tone="saldo"
              delay={2}
            />
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
