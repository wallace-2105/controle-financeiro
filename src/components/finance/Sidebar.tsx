import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, Tags, LogOut, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transacoes", label: "Transações", icon: ListChecks },
  { to: "/categorias", label: "Categorias", icon: Tags },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-border bg-card min-h-screen">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div className="font-semibold tracking-tight">Finanças</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const active = pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
