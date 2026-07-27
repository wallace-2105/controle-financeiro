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
import { formatBRL, formatMonthLabel, monthKey } from "@/lib/finance-format";
import { useFinance } from "@/store/finance-store";
import { useMemo } from "react";

export function GraficoEvolucao() {
  const { categorias, transacoes } = useFinance();

  const data = useMemo(() => {
    const map = new Map<string, { receitas: number; despesas: number }>();
    for (const t of transacoes) {
      const k = monthKey(t.data);
      const cat = categorias.find((c) => c.id === t.categoriaId);
      if (!cat) continue;
      const row = map.get(k) ?? { receitas: 0, despesas: 0 };
      if (cat.tipo === "receita") row.receitas += t.valor;
      else row.despesas += t.valor;
      map.set(k, row);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => ({ mes: formatMonthLabel(k), ...v }));
  }, [categorias, transacoes]);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Receitas x Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="var(--color-muted-foreground)"
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip
                formatter={(v: number) => formatBRL(v)}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
