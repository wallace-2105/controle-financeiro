import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMonthLabel } from "@/lib/finance-format";
import { useFinance } from "@/store/finance-store";
import { useMemo } from "react";

export function MesSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { transacoes } = useFinance();
  const meses = useMemo(() => {
    const set = new Set(transacoes.map((t) => t.data.slice(0, 7)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [transacoes]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {meses.map((m) => (
          <SelectItem key={m} value={m}>
            {formatMonthLabel(m)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
