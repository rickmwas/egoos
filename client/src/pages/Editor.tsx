import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useEntries } from "@/lib/store";
import { SECTIONS, SectionType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, Calendar, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Editor() {
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute("/editor/:id");
  const { entries, addEntry, updateEntry, deleteEntry } = useEntries();
  const { toast } = useToast();

  const [section, setSection] = useState<SectionType>("thoughts");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [mood, setMood] = useState("");

  const isEditing = Boolean(match && params?.id);

  useEffect(() => {
    if (isEditing && params?.id) {
      const entry = entries.find(e => e.id === params.id);
      if (entry) {
        setSection(entry.section);
        setTitle(entry.title || "");
        setContent(entry.content);
        setTags(entry.tags.join(", "));
        setMood(entry.mood || "");
      }
    }
  }, [isEditing, params?.id, entries]);

  const handleSave = () => {
    if (!content.trim()) {
      toast({ title: "Content required", description: "Please write something before saving.", variant: "destructive" });
      return;
    }

    const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);

    if (isEditing && params?.id) {
      updateEntry(params.id, {
        section,
        title,
        content,
        tags: tagList,
        mood
      });
      toast({ title: "Saved", description: "Your entry has been updated." });
    } else {
      addEntry({
        section,
        title,
        content,
        tags: tagList,
        mood
      });
      toast({ title: "Created", description: "New entry added to your archive." });
    }
    setLocation("/");
  };

  const handleDelete = () => {
    if (isEditing && params?.id) {
      if (confirm("Are you sure you want to delete this entry?")) {
        deleteEntry(params.id);
        setLocation("/");
      }
    }
  };

  const currentSection = SECTIONS.find(s => s.id === section);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setLocation("/")} className="-ml-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex gap-2">
          {isEditing && (
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={handleSave} className="bg-foreground text-background hover:bg-foreground/90">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4">
          <label className="text-xs uppercase tracking-widest text-muted-foreground/50 font-mono pl-1">Section</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border text-sm transition-all text-left",
                  section === s.id 
                    ? "bg-secondary border-secondary-foreground/10 ring-1 ring-secondary-foreground/20" 
                    : "bg-transparent border-border/40 hover:bg-secondary/30 text-muted-foreground"
                )}
              >
                <s.icon className={cn("w-4 h-4", section === s.id ? s.color : "opacity-50")} />
                <span className={cn(section === s.id ? "text-foreground font-medium" : "")}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground/50 font-mono pl-1">Title (Optional)</label>
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this moment a name..."
            className="bg-transparent border-none text-3xl font-display font-medium px-0 placeholder:text-muted-foreground/20 focus-visible:ring-0 h-auto"
          />
        </div>

        <div className="space-y-2 relative">
          <label className="text-xs uppercase tracking-widest text-muted-foreground/50 font-mono pl-1">Reflection</label>
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="min-h-[300px] resize-none bg-card/20 border-border/40 focus:bg-card/40 focus:border-border transition-all text-lg leading-relaxed p-6 rounded-xl font-sans"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-muted-foreground/50 font-mono pl-1 flex items-center gap-2">
               <Hash className="w-3 h-3" /> Tags
             </label>
             <Input 
               value={tags}
               onChange={(e) => setTags(e.target.value)}
               placeholder="Comma separated tags..."
               className="bg-transparent border-b border-border/40 rounded-none px-0 focus-visible:ring-0 focus:border-foreground transition-colors"
             />
          </div>
          
           {section === 'mood' && (
             <div className="space-y-2">
               <label className="text-xs uppercase tracking-widest text-muted-foreground/50 font-mono pl-1">Mood</label>
               <Select value={mood} onValueChange={setMood}>
                 <SelectTrigger className="bg-transparent border-border/40">
                   <SelectValue placeholder="How do you feel?" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="happy">😊 Happy</SelectItem>
                   <SelectItem value="calm">😌 Calm</SelectItem>
                   <SelectItem value="anxious">😰 Anxious</SelectItem>
                   <SelectItem value="sad">😢 Sad</SelectItem>
                   <SelectItem value="excited">🤩 Excited</SelectItem>
                   <SelectItem value="tired">😴 Tired</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
