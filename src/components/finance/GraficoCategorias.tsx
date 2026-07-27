import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatBRL } from "@/lib/finance-format";
import { useFinance } from "@/store/finance-store";
import { useMemo } from "react";

export function GraficoCategorias({ mes }: { mes: string }) {
  const { categorias, transacoes } = useFinance();

  const data = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transacoes) {
      if (!t.data.startsWith(mes)) continue;
      const cat = categorias.find((c) => c.id === t.categoriaId);
      if (!cat || cat.tipo !== "despesa") continue;
      map.set(cat.id, (map.get(cat.id) ?? 0) + t.valor);
    }
    return Array.from(map.entries()).map(([id, valor]) => {
      const cat = categorias.find((c) => c.id === id)!;
      return { name: cat.nome, value: valor, cor: cat.cor };
    });
  }, [categorias, transacoes, mes]);

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
