export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const monthKey = (iso: string) => iso.slice(0, 7); // "YYYY-MM"

export const formatMonthLabel = (ym: string) => {
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
};

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
