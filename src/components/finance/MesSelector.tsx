import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMonthLabel } from "@/lib/finance-format";

type Props = {
  value: string;
  onChange: (v: string) => void;
  meses: string[];
};

export function MesSelector({ value, onChange, meses }: Props) {
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
