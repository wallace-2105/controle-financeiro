import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  apiLogin,
  apiRegistrar,
  clearToken,
  isAuthenticated as checkAuth,
  type AuthResponse,
} from "@/services/api";

type AuthUser = {
  nome: string;
  email: string;
};

type AuthContextType = {
  usuario: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sessão do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored && checkAuth()) {
      try {
        setUsuario(JSON.parse(stored));
      } catch {
        clearToken();
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const saveUser = useCallback((data: AuthResponse) => {
    const user: AuthUser = { nome: data.nome, email: data.email };
    setUsuario(user);
    localStorage.setItem("auth_user", JSON.stringify(user));
  }, []);

  const login = useCallback(
    async (email: string, senha: string) => {
      const data = await apiLogin(email, senha);
      saveUser(data);
    },
    [saveUser],
  );

  const registrar = useCallback(
    async (nome: string, email: string, senha: string) => {
      const data = await apiRegistrar(nome, email, senha);
      saveUser(data);
    },
    [saveUser],
  );

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem("auth_user");
    setUsuario(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      usuario,
      isAuthenticated: !!usuario && checkAuth(),
      isLoading,
      login,
      registrar,
      logout,
    }),
    [usuario, isLoading, login, registrar, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
