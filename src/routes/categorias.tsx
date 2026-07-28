import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/finance/AppLayout";
import { CategoriaForm } from "@/components/finance/CategoriaForm";
import { useCategorias, useDeleteCategoria } from "@/hooks/use-categorias";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CategoriaAPI } from "@/services/api";
import { useState } from "react";
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

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title: "Categorias — Controle Financeiro" },
      { name: "description", content: "Organize suas receitas e despesas em categorias personalizadas." },
      { property: "og:title", content: "Categorias — Controle Financeiro" },
      { property: "og:description", content: "Organize suas receitas e despesas em categorias personalizadas." },
    ],
  }),
  component: () => (
    <AppLayout title="Categorias">
      <CategoriasContent />
    </AppLayout>
  ),
});

function CategoriasContent() {
  const { data: categorias = [], isLoading } = useCategorias();
  const deleteCategoria = useDeleteCategoria();

  // null = modo criação | CategoriaAPI = modo edição
  const [editing, setEditing] = useState<CategoriaAPI | null>(null);
  // Categoria aguardando confirmação de exclusão
  const [toDelete, setToDelete] = useState<CategoriaAPI | null>(null);

  const receitas = categorias.filter((c) => c.tipo === "receita");
  const despesas = categorias.filter((c) => c.tipo === "despesa");

  const handleDeleteConfirmed = () => {
    if (!toDelete) return;
    deleteCategoria.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success(`Categoria "${toDelete.nome}" removida`);
        if (editing?.id === toDelete.id) setEditing(null);
      },
      onError: (err) => toast.error(err.message),
    });
    setToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground animate-pulse">
        Carregando categorias...
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] max-w-6xl">
      {/* Lista de categorias */}
      <div className="space-y-6">
        <CategoriaGroup
          titulo="Receitas"
          itens={receitas}
          editingId={editing?.id ?? null}
          onEdit={(cat) => setEditing(cat)}
          onCancelEdit={() => setEditing(null)}
          onDelete={(cat) => setToDelete(cat)}
        />
        <CategoriaGroup
          titulo="Despesas"
          itens={despesas}
          editingId={editing?.id ?? null}
          onEdit={(cat) => setEditing(cat)}
          onCancelEdit={() => setEditing(null)}
          onDelete={(cat) => setToDelete(cat)}
        />
      </div>

      {/* Painel lateral: formulário (criação ou edição) */}
      <div className="lg:sticky lg:top-6 h-fit">
        <CategoriaForm
          editing={editing}
          onCancelEdit={() => setEditing(null)}
        />
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria{" "}
              <strong>&quot;{toDelete?.nome}&quot;</strong>?{" "}
              Categorias com transações vinculadas não podem ser excluídas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Sub-componente: grupo de uma lista (Receitas ou Despesas) ──

type GroupProps = {
  titulo: string;
  itens: CategoriaAPI[];
  editingId: string | null;
  onEdit: (cat: CategoriaAPI) => void;
  onCancelEdit: () => void;
  onDelete: (cat: CategoriaAPI) => void;
};

function CategoriaGroup({ titulo, itens, editingId, onEdit, onCancelEdit, onDelete }: GroupProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="font-semibold tracking-tight">{titulo}</div>
        <div className="text-xs text-muted-foreground">
          {itens.length} {itens.length === 1 ? "categoria" : "categorias"}
        </div>
      </div>

      {itens.length === 0 ? (
        <div className="p-8 text-sm text-muted-foreground text-center">
          Nenhuma categoria cadastrada.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {itens.map((c) => {
            const isBeingEdited = c.id === editingId;
            return (
              <li
                key={c.id}
                className={`flex items-center justify-between px-5 py-3 transition-colors ${
                  isBeingEdited
                    ? "bg-primary/5 ring-1 ring-inset ring-primary/20"
                    : "hover:bg-accent/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Ícone colorido */}
                  <span
                    className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${c.cor}20` }}
                  >
                    <span className="h-4 w-4 rounded-full" style={{ background: c.cor }} />
                  </span>
                  <div>
                    <div className="text-sm font-medium">{c.nome}</div>
                    {isBeingEdited && (
                      <div className="text-xs text-primary font-medium">Em edição →</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => isBeingEdited ? onCancelEdit() : onEdit(c)}
                    className={`h-8 w-8 ${
                      isBeingEdited
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label={isBeingEdited ? "Cancelar edição" : `Editar ${c.nome}`}
                    title={isBeingEdited ? "Cancelar edição" : "Editar categoria"}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(c)}
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    aria-label={`Excluir ${c.nome}`}
                    title="Excluir categoria"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
