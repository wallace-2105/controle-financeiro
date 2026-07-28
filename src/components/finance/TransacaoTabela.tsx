import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatBRL, formatDate } from "@/lib/finance-format";
import type { TransacaoAPI, CategoriaAPI } from "@/services/api";
import { cn } from "@/lib/utils";

type Props = {
  transacoes: TransacaoAPI[];
  categorias: CategoriaAPI[];
  onEdit: (t: TransacaoAPI) => void;
  onDelete: (t: TransacaoAPI) => void;
};

export function TransacaoTabela({ transacoes, categorias, onEdit, onDelete }: Props) {
  if (transacoes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada com esses filtros.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 text-xs font-medium text-muted-foreground bg-muted/40 border-b border-border uppercase tracking-wide">
        <div>Descrição</div>
        <div>Categoria</div>
        <div>Data</div>
        <div className="text-right">Valor</div>
        <div className="w-20 text-right">Ações</div>
      </div>
      <ul className="divide-y divide-border">
        {transacoes.map((t) => {
          const isReceita = t.tipo === "receita";
          return (
            <li
              key={t.id}
              className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-5 py-4 items-center hover:bg-accent/40 transition-colors"
            >
              <div className="col-span-2 md:col-span-1">
                <div className="font-medium text-sm">{t.descricao}</div>
                <div className="md:hidden text-xs text-muted-foreground mt-1">
                  {t.categoriaNome} · {formatDate(t.data)}
                </div>
              </div>
              <div className="hidden md:block">
                <Badge
                  variant="outline"
                  className="border-transparent text-xs font-medium"
                  style={{ backgroundColor: `${t.categoriaCor}20`, color: t.categoriaCor }}
                >
                  {t.categoriaNome}
                </Badge>
              </div>
              <div className="hidden md:block text-sm text-muted-foreground">
                {formatDate(t.data)}
              </div>
              <div
                className={cn(
                  "text-right text-sm font-semibold",
                  isReceita ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                )}
              >
                {isReceita ? "+" : "-"} {formatBRL(t.valor)}
              </div>
              <div className="flex justify-end gap-1 md:w-20">
                <Button size="icon" variant="ghost" onClick={() => onEdit(t)} className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(t)} className="h-8 w-8 text-rose-600 hover:text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
