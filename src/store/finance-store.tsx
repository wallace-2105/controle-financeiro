import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  categoriasMock,
  transacoesMock,
  type Categoria,
  type Transacao,
} from "@/mocks/dados";

type Ctx = {
  categorias: Categoria[];
  transacoes: Transacao[];
  addTransacao: (t: Omit<Transacao, "id">) => void;
  updateTransacao: (t: Transacao) => void;
  removeTransacao: (id: string) => void;
  addCategoria: (c: Omit<Categoria, "id">) => void;
  removeCategoria: (id: string) => void;
};

const FinanceContext = createContext<Ctx | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasMock);
  const [transacoes, setTransacoes] = useState<Transacao[]>(transacoesMock);

  const value = useMemo<Ctx>(
    () => ({
      categorias,
      transacoes,
      addTransacao: (t) =>
        setTransacoes((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]),
      updateTransacao: (t) =>
        setTransacoes((prev) => prev.map((x) => (x.id === t.id ? t : x))),
      removeTransacao: (id) =>
        setTransacoes((prev) => prev.filter((x) => x.id !== id)),
      addCategoria: (c) =>
        setCategorias((prev) => [...prev, { ...c, id: crypto.randomUUID() }]),
      removeCategoria: (id) =>
        setCategorias((prev) => prev.filter((x) => x.id !== id)),
    }),
    [categorias, transacoes],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}
