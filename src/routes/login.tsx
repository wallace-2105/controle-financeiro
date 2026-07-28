import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Controle Financeiro" },
      { name: "description", content: "Acesse seu painel de controle financeiro pessoal." },
      { property: "og:title", content: "Entrar — Controle Financeiro" },
      { property: "og:description", content: "Acesse seu painel de controle financeiro pessoal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, registrar } = useAuth();

  const [isRegistro, setIsRegistro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistro) {
        await registrar(nome.trim(), email.trim(), senha);
        toast.success("Conta criada com sucesso!");
      } else {
        await login(email.trim(), senha);
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-500/10 via-background to-blue-500/10">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold">Finanças</span>
        </div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight">
            Controle suas finanças com clareza.
          </h2>
          <p className="text-muted-foreground">
            Acompanhe receitas, despesas e categorias em um só lugar — com gráficos que
            realmente fazem sentido.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">© 2026 Finanças</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isRegistro ? "Criar conta" : "Bem-vindo de volta"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isRegistro
                ? "Preencha seus dados para criar uma conta."
                : "Entre com sua conta para continuar."}
            </p>
          </div>
          <div className="space-y-4">
            {isRegistro && (
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Carregando..."
              : isRegistro
                ? "Criar conta"
                : "Entrar"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {isRegistro ? "Já tem uma conta? " : "Ainda não tem conta? "}
            <button
              type="button"
              onClick={() => setIsRegistro(!isRegistro)}
              className="text-primary font-medium hover:underline"
            >
              {isRegistro ? "Entrar" : "Criar conta"}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
