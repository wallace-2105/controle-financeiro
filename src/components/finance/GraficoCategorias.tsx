import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatBRL } from "@/lib/finance-format";
import type { CategoriaTotalItem } from "@/services/api";

type Props = {
  categorias: CategoriaTotalItem[];
};

export function GraficoCategorias({ categorias }: Props) {
  const data = categorias
    .filter((c) => c.tipo === "despesa")
    .map((c) => ({ name: c.nome, value: c.total, cor: c.cor }));

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Despesas por categoria</CardTitle>
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
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.cor} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => formatBRL(v)}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
