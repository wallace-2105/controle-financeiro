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
      <div className="rounded-xl border border-dashed border-border/60 p-14 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada com esses filtros.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/40 overflow-hidden bg-card shadow-card">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3.5 text-xs font-medium text-muted-foreground bg-muted/30 border-b border-border/40 uppercase tracking-wider">
        <div>Descrição</div>
        <div>Categoria</div>
        <div>Data</div>
        <div className="text-right">Valor</div>
        <div className="w-20 text-right">Ações</div>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-border/40">
        {transacoes.map((t) => {
          const isReceita = t.tipo === "receita";
          return (
            <li
              key={t.id}
              className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-6 py-4 items-center hover:bg-accent/30 transition-colors duration-200"
            >
              {/* Descrição */}
              <div className="col-span-2 md:col-span-1">
                <div className="font-medium text-sm text-foreground">{t.descricao}</div>
                <div className="md:hidden text-xs text-muted-foreground mt-1">
                  {t.categoriaNome} · {formatDate(t.data)}
                </div>
              </div>

              {/* Categoria badge */}
              <div className="hidden md:block">
                <Badge
                  variant="outline"
                  className="border-transparent text-xs font-medium"
                  style={{ backgroundColor: `${t.categoriaCor}15`, color: t.categoriaCor }}
                >
                  {t.categoriaNome}
                </Badge>
              </div>

              {/* Data */}
              <div className="hidden md:block text-sm text-muted-foreground">
                {formatDate(t.data)}
              </div>

              {/* Valor */}
              <div
                className={cn(
                  "text-right text-sm font-display",
                  isReceita ? "text-receita-foreground" : "text-despesa-foreground",
                )}
              >
                {isReceita ? "+" : "−"} {formatBRL(t.valor)}
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-0.5 md:w-20">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(t)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(t)}
                  className="h-8 w-8 text-muted-foreground hover:text-despesa transition-colors duration-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
