import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Sparkle Cash" },
      { name: "description", content: "Acesse seu painel de controle financeiro premium." },
      { property: "og:title", content: "Entrar — Sparkle Cash" },
      { property: "og:description", content: "Acesse seu painel de controle financeiro premium." },
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
      {/* Painel Esquerdo — Branding Premium */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sidebar-primary/15 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div>
            <div className="font-semibold tracking-tight text-white">Sparkle Cash</div>
            <div className="text-[11px] text-sidebar-foreground/50 font-medium tracking-wide">
              CONTROLE FINANCEIRO
            </div>
          </div>
        </div>
        <div className="space-y-5 max-w-md">
          <h2 className="text-4xl font-display leading-tight text-white">
            Clareza financeira<br/>para a sua vida.
          </h2>
          <p className="text-sidebar-foreground/80 leading-relaxed text-lg">
            Acompanhe receitas, despesas e categorias em uma interface elegante,
            sofisticada e feita para você tomar as melhores decisões.
          </p>
        </div>
        <div className="text-xs text-sidebar-foreground/50">© 2026 Sparkle Cash. Todos os direitos reservados.</div>
      </div>

      {/* Painel Direito — Formulário */}
      <div className="flex items-center justify-center p-6 md:p-12 relative">
        <form onSubmit={submit} className="w-full max-w-[360px] space-y-6 animate-fade-in-up">
          <div className="space-y-2 text-center lg:text-left mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {isRegistro ? "Criar conta" : "Bem-vindo de volta"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isRegistro
                ? "Preencha seus dados para criar sua conta."
                : "Entre com suas credenciais para acessar o painel."}
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
                  className="bg-card"
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
                className="bg-card"
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
                className="bg-card"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full h-11 text-base shadow-sm hover:shadow-md transition-shadow" disabled={loading}>
            {loading
              ? "Aguarde..."
              : isRegistro
                ? "Criar conta"
                : "Entrar"}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground pt-4">
            {isRegistro ? "Já tem uma conta? " : "Ainda não tem conta? "}
            <button
              type="button"
              onClick={() => setIsRegistro(!isRegistro)}
              className="text-primary font-semibold hover:underline"
            >
              {isRegistro ? "Fazer login" : "Criar uma agora"}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
