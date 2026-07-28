import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useCreateCategoria, useUpdateCategoria } from "@/hooks/use-categorias";
import { toast } from "sonner";
import type { CategoriaAPI } from "@/services/api";
import { Pencil, Plus, X } from "lucide-react";

const CORES = [
  "#10b981", "#22c55e", "#14b8a6", "#3b82f6", "#6366f1",
  "#a855f7", "#ec4899", "#ef4444", "#f97316", "#eab308",
];

type Props = {
  /** Se informado, o formulário entra em modo de edição */
  editing?: CategoriaAPI | null;
  /** Chamado quando o usuário cancela a edição */
  onCancelEdit?: () => void;
};

export function CategoriaForm({ editing = null, onCancelEdit }: Props) {
  const createCategoria = useCreateCategoria();
  const updateCategoria = useUpdateCategoria();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [cor, setCor] = useState(CORES[0]);
  const [err, setErr] = useState(false);

  // Quando a prop `editing` mudar, carregamos os dados no form
  useEffect(() => {
    if (editing) {
      setNome(editing.nome);
      setTipo(editing.tipo);
      setCor(editing.cor);
      setErr(false);
    } else {
      // Modo criação: reset apenas quando saímos do modo edição
      setNome("");
      setTipo("despesa");
      setCor(CORES[0]);
      setErr(false);
    }
  }, [editing]);

  const isEditing = !!editing;
  const isPending = createCategoria.isPending || updateCategoria.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return setErr(true);

    const payload = { nome: nome.trim(), tipo, cor };

    if (isEditing && editing) {
      updateCategoria.mutate(
        { id: editing.id, ...payload },
        {
          onSuccess: () => {
            toast.success("Categoria atualizada");
            onCancelEdit?.();
          },
          onError: (error) => toast.error(error.message),
        },
      );
    } else {
      createCategoria.mutate(payload, {
        onSuccess: () => {
          setNome("");
          setCor(CORES[0]);
          setErr(false);
          toast.success("Categoria criada");
        },
        onError: (error) => toast.error(error.message),
      });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-5">
      {/* Cabeçalho do formulário — muda conforme o modo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          {isEditing ? (
            <>
              <Pencil className="h-4 w-4 text-primary" />
              Editar categoria
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 text-primary" />
              Nova categoria
            </>
          )}
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cancelar edição"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Preview da cor selecionada ao lado do nome */}
      <div className="space-y-2">
        <Label htmlFor="cat-nome">Nome</Label>
        <div className="flex items-center gap-2">
          <span
            className="h-5 w-5 rounded-full shrink-0 border border-border/60"
            style={{ background: cor }}
          />
          <Input
            id="cat-nome"
            value={nome}
            onChange={(e) => { setNome(e.target.value); setErr(false); }}
            placeholder="Ex: Assinaturas"
            className={err ? "border-rose-500 focus-visible:ring-rose-500" : ""}
          />
        </div>
        {err && (
          <p className="text-xs text-rose-500">O nome é obrigatório.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Tipo</Label>
        <RadioGroup
          value={tipo}
          onValueChange={(v) => setTipo(v as "receita" | "despesa")}
          className="grid grid-cols-2 gap-2"
        >
          <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/5 transition-colors">
            <RadioGroupItem value="receita" />
            <span className="text-sm font-medium">Receita</span>
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 cursor-pointer has-[:checked]:border-rose-500 has-[:checked]:bg-rose-500/5 transition-colors">
            <RadioGroupItem value="despesa" />
            <span className="text-sm font-medium">Despesa</span>
          </label>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex flex-wrap gap-2">
          {CORES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCor(c)}
              className="h-8 w-8 rounded-full border-2 transition-all"
              style={{
                background: c,
                borderColor: cor === c ? "var(--color-foreground)" : "transparent",
                transform: cor === c ? "scale(1.15)" : "scale(1)",
                outline: cor === c ? `2px solid ${c}40` : "none",
                outlineOffset: "2px",
              }}
              aria-label={`cor ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancelEdit}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending
            ? isEditing ? "Salvando..." : "Criando..."
            : isEditing ? "Salvar alterações" : "Criar categoria"}
        </Button>
      </div>
    </form>
  );
}
