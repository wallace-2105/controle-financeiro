import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export function Header({ title }: { title: string }) {
  const { usuario } = useAuth();

  const initials = usuario
    ? usuario.nome
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium">{usuario?.nome ?? "Usuário"}</div>
          <div className="text-xs text-muted-foreground">{usuario?.email ?? ""}</div>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
