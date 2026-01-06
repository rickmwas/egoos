import { Link } from "wouter";
import { useEntries } from "@/lib/store";
import { SECTIONS } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { entries } = useEntries();

  if (entries.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-medium text-foreground">Welcome to EgoOs</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your private, offline-only sanctuary for reflection. Start by creating your first entry.
          </p>
        </div>
        <Link href="/editor">
          <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-foreground text-background hover:bg-foreground/90">
            <Plus className="w-5 h-5 mr-2" />
            Create Entry
          </Button>
        </Link>
      </div>
    );
  }

  // Group entries by date (simple version)
  const grouped = entries.reduce((acc, entry) => {
    const date = format(new Date(entry.createdAt), "MMMM d, yyyy");
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-1 fade-in">
        <h2 className="text-3xl font-display font-medium tracking-tight">Timeline</h2>
        <p className="text-muted-foreground">Recent reflections and thoughts</p>
      </header>

      <div className="space-y-10 relative">
        <div className="absolute left-0 top-2 bottom-0 w-px bg-border/40 md:left-4" />
        
        {Object.entries(grouped).map(([date, dayEntries], i) => (
          <div key={date} className="relative space-y-6 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-border ring-4 ring-background z-10 md:ml-3.5 ml-[-3px]" />
              <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground/60 font-mono">
                {date}
              </h3>
            </div>

            <div className="space-y-4 pl-4 md:pl-12">
              {dayEntries.map((entry) => {
                const section = SECTIONS.find(s => s.id === entry.section);
                return (
                  <Link key={entry.id} href={`/editor/${entry.id}`}>
                    <div className="group block bg-card/40 hover:bg-card border border-border/40 hover:border-border p-5 rounded-xl transition-all hover:shadow-lg cursor-pointer mb-4 backdrop-blur-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={cn("p-1.5 rounded-md bg-white/5", section?.color)}>
                            {section?.icon && <section.icon className="w-3.5 h-3.5" />}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {section?.label}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground/40 font-mono">
                          {format(new Date(entry.createdAt), "h:mm a")}
                        </span>
                      </div>
                      
                      {entry.title && (
                        <h4 className="text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                          {entry.title}
                        </h4>
                      )}
                      
                      <p className="text-muted-foreground/80 line-clamp-3 leading-relaxed text-sm">
                        {entry.content}
                      </p>

                      {entry.tags.length > 0 && (
                        <div className="flex gap-2 mt-4 flex-wrap">
                          {entry.tags.map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground/70 border border-white/5">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
