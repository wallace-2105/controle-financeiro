import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/sonner";

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background relative isolate">
      {/* Background Effects (Premium Image + Overlay) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <img 
          src="/premium-bg.png" 
          alt="Premium Dashboard Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-90" 
        />
        {/* Overlay to ensure text readability in light/dark modes */}
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header title={title} />
        <main className="flex-1 p-6 md:p-10 relative z-10">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
