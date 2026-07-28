import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useCreateCategoria } from "@/hooks/use-categorias";
import { toast } from "sonner";

const CORES = [
  "#10b981", "#22c55e", "#14b8a6", "#3b82f6", "#6366f1",
  "#a855f7", "#ec4899", "#ef4444", "#f97316", "#eab308",
];

export function CategoriaForm() {
  const createCategoria = useCreateCategoria();
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [cor, setCor] = useState(CORES[0]);
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return setErr(true);

    createCategoria.mutate(
      { nome: nome.trim(), tipo, cor },
      {
        onSuccess: () => {
          setNome("");
          setErr(false);
          toast.success("Categoria criada");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="font-semibold tracking-tight">Nova categoria</div>
      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Assinaturas"
          className={err ? "border-rose-500" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label>Tipo</Label>
        <RadioGroup
          value={tipo}
          onValueChange={(v) => setTipo(v as "receita" | "despesa")}
          className="grid grid-cols-2 gap-2"
        >
          <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/5">
            <RadioGroupItem value="receita" />
            <span className="text-sm font-medium">Receita</span>
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 cursor-pointer has-[:checked]:border-rose-500 has-[:checked]:bg-rose-500/5">
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
                transform: cor === c ? "scale(1.1)" : "scale(1)",
              }}
              aria-label={`cor ${c}`}
            />
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={createCategoria.isPending}>
        {createCategoria.isPending ? "Criando..." : "Criar categoria"}
      </Button>
    </form>
  );
}
