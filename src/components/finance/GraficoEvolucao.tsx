import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatBRL } from "@/lib/finance-format";
import { useEvolucao } from "@/hooks/use-resumo";
import { TrendingUp } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
function PremiumTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card shadow-card-hover rounded-xl px-4 py-3 border border-border/40 min-w-[180px]">
      <div className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: p.fill }}
            />
            <span className="text-sm text-foreground">{p.name}</span>
          </div>
          <span className="text-sm font-display text-foreground">{formatBRL(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function GraficoEvolucao() {
  const { data: evolucao } = useEvolucao(6);

  const chartData = (evolucao?.meses ?? []).map((m) => ({
    mes: m.label,
    receitas: m.receitas,
    despesas: m.despesas,
  }));

  return (
    <Card className="border-border/40 shadow-card animate-fade-in-up animate-delay-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Receitas × Despesas</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                strokeOpacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip content={<PremiumTooltip />} cursor={{ fill: "var(--color-accent)", opacity: 0.3 }} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--color-muted-foreground)" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="receitas"
                name="Receitas"
                fill="var(--color-receita)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="despesas"
                name="Despesas"
                fill="var(--color-despesa)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
