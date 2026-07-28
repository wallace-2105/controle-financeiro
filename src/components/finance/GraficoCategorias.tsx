import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatBRL } from "@/lib/finance-format";
import type { CategoriaTotalItem } from "@/services/api";
import { PieChartIcon } from "lucide-react";

type Props = {
  categorias: CategoriaTotalItem[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function PremiumTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-card shadow-card-hover rounded-xl px-4 py-3 border border-border/40">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: item.payload.cor }}
        />
        <span className="text-sm font-medium text-foreground">{item.name}</span>
      </div>
      <div className="text-lg font-display text-foreground">{formatBRL(item.value)}</div>
    </div>
  );
}

export function GraficoCategorias({ categorias }: Props) {
  const data = categorias
    .filter((c) => c.tipo === "despesa")
    .map((c) => ({ name: c.nome, value: c.total, cor: c.cor }));

  return (
    <Card className="border-border/40 shadow-card animate-fade-in-up animate-delay-1">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Despesas por categoria</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            Sem despesas neste período
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.cor} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<PremiumTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: "var(--color-muted-foreground)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
