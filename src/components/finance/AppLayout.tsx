import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { FinanceProvider } from "@/store/finance-store";
import { Toaster } from "@/components/ui/sonner";

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <FinanceProvider>
      <div className="min-h-screen flex bg-muted/30">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title={title} />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
        <Toaster />
      </div>
    </FinanceProvider>
  );
}
