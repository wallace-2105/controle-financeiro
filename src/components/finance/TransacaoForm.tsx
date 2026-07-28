import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useCategorias } from "@/hooks/use-categorias";
import { useCreateTransacao, useUpdateTransacao } from "@/hooks/use-transacoes";
import type { TransacaoAPI } from "@/services/api";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: TransacaoAPI | null;
};

export function TransacaoForm({ open, onOpenChange, editing }: Props) {
  const { data: categorias = [] } = useCategorias();
  const createTransacao = useCreateTransacao();
  const updateTransacao = useUpdateTransacao();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [categoriaId, setCategoriaId] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      if (editing) {
        setDescricao(editing.descricao);
        setValor(String(editing.valor));
        setTipo(editing.tipo);
        setCategoriaId(editing.categoriaId);
        setData(editing.data);
      } else {
        setDescricao("");
        setValor("");
        setTipo("despesa");
        setCategoriaId("");
        setData(new Date().toISOString().slice(0, 10));
      }
      setErrors({});
    }
  }, [open, editing]);

  const catsFiltradas = categorias.filter((c) => c.tipo === tipo);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    if (!descricao.trim()) errs.descricao = true;
    if (!valor || Number(valor) <= 0) errs.valor = true;
    if (!categoriaId) errs.categoriaId = true;
    if (!data) errs.data = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      descricao: descricao.trim(),
      valor: Number(valor),
      categoriaId,
      data,
    };

    if (editing) {
      updateTransacao.mutate(
        { id: editing.id, ...payload },
        {
          onSuccess: () => {
            toast.success("Transação atualizada");
            onOpenChange(false);
          },
          onError: (err) => toast.error(err.message),
        },
      );
    } else {
      createTransacao.mutate(payload, {
        onSuccess: () => {
          toast.success("Transação criada");
          onOpenChange(false);
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const isSubmitting = createTransacao.isPending || updateTransacao.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar transação" : "Nova transação"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <RadioGroup
              value={tipo}
              onValueChange={(v) => {
                setTipo(v as "receita" | "despesa");
                setCategoriaId("");
              }}
              className="grid grid-cols-2 gap-2"
            >
              <label className="flex flex-col gap-0.5 rounded-xl border border-border/60 px-3 py-2.5 cursor-pointer transition-all duration-200 has-[:checked]:border-receita has-[:checked]:bg-receita/5">
                <span className="flex items-center gap-2">
                  <RadioGroupItem value="receita" />
                  <span className="text-sm font-medium">Receita</span>
                </span>
                <span className="text-xs text-muted-foreground pl-6">Salário, freelance, venda...</span>
              </label>
              <label className="flex flex-col gap-0.5 rounded-xl border border-border/60 px-3 py-2.5 cursor-pointer transition-all duration-200 has-[:checked]:border-despesa has-[:checked]:bg-despesa/5">
                <span className="flex items-center gap-2">
                  <RadioGroupItem value="despesa" />
                  <span className="text-sm font-medium">Despesa</span>
                </span>
                <span className="text-xs text-muted-foreground pl-6">Conta, compra, serviço...</span>
              </label>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              💡 O tipo filtra as categorias disponíveis abaixo.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Supermercado"
              className={errors.descricao ? "border-despesa" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className={errors.valor ? "border-despesa" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={errors.data ? "border-despesa" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger className={errors.categoriaId ? "border-despesa" : ""}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {catsFiltradas.length === 0 ? (
                  <div className="py-3 px-2 text-center text-xs text-muted-foreground">
                    Nenhuma categoria de {tipo} cadastrada.
                    <br />Crie uma em &quot;Categorias&quot; primeiro.
                  </div>
                ) : (
                  catsFiltradas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.cor }} />
                        {c.nome}
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.categoriaId && (
              <p className="text-xs text-despesa">Selecione uma categoria.</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
