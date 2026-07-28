import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/finance-format";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "receita" | "despesa" | "saldo";
  delay?: number;
};

export function ResumoCard({ label, value, icon: Icon, tone = "saldo", delay = 0 }: Props) {
  const positive = value >= 0;

  const isSaldo = tone === "saldo";
  const isReceita = tone === "receita" || (isSaldo && positive);
  const isDespesa = tone === "despesa" || (isSaldo && !positive);

  // Color classes using new semantic tokens
  const valueColor = isReceita
    ? "text-receita-foreground"
    : "text-despesa-foreground";

  const iconBg = isReceita
    ? "bg-receita/10"
    : "bg-despesa/10";

  const iconColor = isReceita
    ? "text-receita"
    : "text-despesa";

  // The saldo card gets a subtle gradient background
  const cardBg = isSaldo
    ? positive
      ? "bg-gradient-to-br from-receita/[0.04] via-card to-card"
      : "bg-gradient-to-br from-despesa/[0.04] via-card to-card"
    : "";

  const delayClass =
    delay === 0 ? "animate-delay-1" : delay === 1 ? "animate-delay-2" : "animate-delay-3";

  return (
    <Card
      className={cn(
        "border-border/40 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in-up",
        delayClass,
        cardBg,
      )}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
          <div className={cn("text-[28px] font-display tracking-tight leading-none", valueColor)}>
            {formatBRL(value)}
          </div>
        </div>
        <div
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105",
            iconBg,
          )}
        >
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardContent>
    </Card>
  );
}
