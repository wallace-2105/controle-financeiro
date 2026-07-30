import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, Tags, LogOut, Sparkles } from "lucide-react";
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
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-sidebar bg-gradient-to-b from-transparent to-black/40 min-h-screen relative z-20 border-r border-white/10 dark:border-white/5 shadow-[1px_0_30px_rgba(0,0,0,0.15)]">
      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-6 h-[72px]">
        <div className="h-10 w-10 rounded-xl bg-sidebar-primary/15 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-sidebar-primary" />
        </div>
        <div>
          <div className="font-semibold text-sidebar-foreground tracking-tight">
            Sparkle Cash
          </div>
          <div className="text-[11px] text-sidebar-foreground/50 font-medium tracking-wide">
            CONTROLE FINANCEIRO
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 pt-4 space-y-1">
        {items.map((it) => {
          const active = pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-primary/15 text-sidebar-primary shadow-[inset_0_0_0_1px] shadow-sidebar-primary/20"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className={cn("h-[18px] w-[18px]", active && "text-sidebar-primary")} />
              {it.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground/80 transition-all duration-200"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sair
        </button>
      </div>
    </aside>
  );
}
