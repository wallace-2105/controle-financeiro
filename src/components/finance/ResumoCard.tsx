import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/finance-format";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "receita" | "despesa" | "saldo";
};

export function ResumoCard({ label, value, icon: Icon, tone = "saldo" }: Props) {
  const positive = value >= 0;
  const color =
    tone === "receita"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "despesa"
        ? "text-rose-600 dark:text-rose-400"
        : positive
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400";

  const bg =
    tone === "receita"
      ? "bg-emerald-500/10"
      : tone === "despesa"
        ? "bg-rose-500/10"
        : positive
          ? "bg-emerald-500/10"
          : "bg-rose-500/10";

  return (
    <Card className="border-border/60">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className={cn("text-2xl font-semibold tracking-tight", color)}>
            {formatBRL(value)}
          </div>
        </div>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", bg)}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
      </CardContent>
    </Card>
  );
}
