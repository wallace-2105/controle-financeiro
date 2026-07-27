import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatBRL, formatDate } from "@/lib/finance-format";
import { useFinance } from "@/store/finance-store";
import type { Transacao } from "@/mocks/dados";
import { cn } from "@/lib/utils";

type Props = {
  transacoes: Transacao[];
  onEdit: (t: Transacao) => void;
  onDelete: (t: Transacao) => void;
};

export function TransacaoTabela({ transacoes, onEdit, onDelete }: Props) {
  const { categorias } = useFinance();

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
          const cat = categorias.find((c) => c.id === t.categoriaId);
          const isReceita = cat?.tipo === "receita";
          return (
            <li
              key={t.id}
              className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-5 py-4 items-center hover:bg-accent/40 transition-colors"
            >
              <div className="col-span-2 md:col-span-1">
                <div className="font-medium text-sm">{t.descricao}</div>
                <div className="md:hidden text-xs text-muted-foreground mt-1">
                  {cat?.nome} · {formatDate(t.data)}
                </div>
              </div>
              <div className="hidden md:block">
                {cat && (
                  <Badge
                    variant="outline"
                    className="border-transparent text-xs font-medium"
                    style={{ backgroundColor: `${cat.cor}20`, color: cat.cor }}
                  >
                    {cat.nome}
                  </Badge>
                )}
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
