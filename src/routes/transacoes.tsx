import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/finance/AppLayout";
import { TransacaoTabela } from "@/components/finance/TransacaoTabela";
import { TransacaoForm } from "@/components/finance/TransacaoForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTransacoes, useDeleteTransacao } from "@/hooks/use-transacoes";
import { useCategorias } from "@/hooks/use-categorias";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { TransacaoAPI } from "@/services/api";
import { toast } from "sonner";

export const Route = createFileRoute("/transacoes")({
  head: () => ({
    meta: [
      { title: "Transações — Controle Financeiro" },
      { name: "description", content: "Gerencie suas receitas e despesas com filtros por categoria e período." },
      { property: "og:title", content: "Transações — Controle Financeiro" },
      { property: "og:description", content: "Gerencie suas receitas e despesas com filtros por categoria e período." },
    ],
  }),
  component: () => (
    <AppLayout title="Transações">
      <TransacoesContent />
    </AppLayout>
  ),
});

function TransacoesContent() {
  const { data: categorias = [] } = useCategorias();
  const { data: allTransacoes = [], isLoading } = useTransacoes();
  const deleteTransacao = useDeleteTransacao();

  const [catFiltro, setCatFiltro] = useState<string>("todas");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TransacaoAPI | null>(null);
  const [toDelete, setToDelete] = useState<TransacaoAPI | null>(null);

  const filtered = useMemo(() => {
    return allTransacoes
      .filter((t) => (catFiltro === "todas" ? true : t.categoriaId === catFiltro))
      .filter((t) => (de ? t.data >= de : true))
      .filter((t) => (ate ? t.data <= ate : true))
      .sort((a, b) => b.data.localeCompare(a.data));
  }, [allTransacoes, catFiltro, de, ate]);

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Todas as suas movimentações</div>
          <div className="text-xl font-semibold tracking-tight">
            {isLoading ? "Carregando..." : `${filtered.length} transaç${filtered.length === 1 ? "ão" : "ões"}`}
          </div>
        </div>
        <Button
          className="shadow-sm hover:shadow-md transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1.5" /> Nova transação
        </Button>
      </div>

      <div className="rounded-xl border border-border/40 bg-card p-5 grid gap-4 md:grid-cols-[1fr_1fr_1fr] items-end shadow-card">
        <div className="space-y-1.5">
          <Label className="text-xs">Categoria</Label>
          <Select value={catFiltro} onValueChange={setCatFiltro}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.cor }} />
                    {c.nome}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">De</Label>
          <Input type="date" value={de} onChange={(e) => setDe(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Até</Label>
          <Input type="date" value={ate} onChange={(e) => setAte(e.target.value)} />
        </div>
      </div>

      <TransacaoTabela
        transacoes={filtered}
        categorias={categorias}
        onEdit={(t) => {
          setEditing(t);
          setOpen(true);
        }}
        onDelete={(t) => setToDelete(t)}
      />

      <TransacaoForm open={open} onOpenChange={setOpen} editing={editing} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação &quot;{toDelete?.descricao}&quot; será
              removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) {
                  deleteTransacao.mutate(toDelete.id, {
                    onSuccess: () => toast.success("Transação excluída"),
                    onError: (err) => toast.error(err.message),
                  });
                }
                setToDelete(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
