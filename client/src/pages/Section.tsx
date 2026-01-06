import { Link, useRoute } from "wouter";
import { useEntries } from "@/lib/store";
import { SECTIONS, SectionType } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Section() {
  const [match, params] = useRoute("/section/:id");
  const { entries } = useEntries();
  
  const sectionId = params?.id as SectionType;
  const sectionConfig = SECTIONS.find(s => s.id === sectionId);
  const sectionEntries = entries.filter(e => e.section === sectionId);

  if (!sectionConfig) return <div>Section not found</div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="space-y-4">
        <Link href="/">
           <Button variant="ghost" className="-ml-4 text-muted-foreground hover:text-foreground mb-4">
             <ArrowLeft className="w-4 h-4 mr-2" />
             Back to Timeline
           </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-white/5", sectionConfig.color)}>
            <sectionConfig.icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-medium tracking-tight">{sectionConfig.label}</h2>
            <p className="text-muted-foreground">{sectionConfig.description}</p>
          </div>
        </div>
      </header>

      {sectionEntries.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/40 rounded-xl bg-white/[0.02]">
          <p className="text-muted-foreground mb-4">No entries in this section yet.</p>
          <Link href="/editor">
            <Button variant="outline">Create Entry</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {sectionEntries.map((entry) => (
             <Link key={entry.id} href={`/editor/${entry.id}`}>
               <div className="group block bg-card/40 hover:bg-card border border-border/40 hover:border-border p-6 rounded-xl transition-all hover:shadow-lg cursor-pointer backdrop-blur-sm">
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-xs text-muted-foreground/40 font-mono uppercase tracking-widest">
                       {format(new Date(entry.createdAt), "MMMM d, yyyy")}
                    </span>
                 </div>
                 
                 {entry.title && (
                   <h4 className="text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                     {entry.title}
                   </h4>
                 )}
                 
                 <p className="text-muted-foreground/80 line-clamp-2 leading-relaxed text-sm">
                   {entry.content}
                 </p>
               </div>
             </Link>
          ))}
        </div>
      )}
    </div>
  );
}
