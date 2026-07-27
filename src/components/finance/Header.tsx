import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium">Ana Silva</div>
          <div className="text-xs text-muted-foreground">ana@email.com</div>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            AS
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
