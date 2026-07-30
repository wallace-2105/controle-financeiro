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
    <header className="sticky top-0 z-50 h-[72px] border-b border-border/40 bg-background/60 backdrop-blur-xl px-6 md:px-10 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-foreground">{usuario?.nome ?? "Usuário"}</div>
          <div className="text-xs text-muted-foreground">{usuario?.email ?? ""}</div>
        </div>
        <Avatar className="h-10 w-10 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
