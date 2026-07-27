import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/finance/AppLayout";
import { CategoriaForm } from "@/components/finance/CategoriaForm";
import { useFinance } from "@/store/finance-store";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  const { categorias, removeCategoria } = useFinance();
  const receitas = categorias.filter((c) => c.tipo === "receita");
  const despesas = categorias.filter((c) => c.tipo === "despesa");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] max-w-6xl">
      <div className="space-y-6">
        <Group titulo="Receitas" itens={receitas} onDelete={(id) => {
          removeCategoria(id);
          toast.success("Categoria removida");
        }} />
        <Group titulo="Despesas" itens={despesas} onDelete={(id) => {
          removeCategoria(id);
          toast.success("Categoria removida");
        }} />
      </div>
      <CategoriaForm />
    </div>
  );
}

function Group({
  titulo,
  itens,
  onDelete,
}: {
  titulo: string;
  itens: { id: string; nome: string; cor: string; tipo: string }[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="font-semibold tracking-tight">{titulo}</div>
        <div className="text-xs text-muted-foreground">{itens.length} categorias</div>
      </div>
      {itens.length === 0 ? (
        <div className="p-8 text-sm text-muted-foreground text-center">
          Nenhuma categoria cadastrada.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {itens.map((c) => (
            <li key={c.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg" style={{ background: `${c.cor}25` }}>
                  <span className="block h-full w-full rounded-lg" style={{ background: c.cor, opacity: 0.6 }} />
                </span>
                <div className="text-sm font-medium">{c.nome}</div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(c.id)}
                className="text-rose-600 hover:text-rose-600 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
