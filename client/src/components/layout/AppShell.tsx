import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { SECTIONS } from "@/lib/types";
import { LayoutDashboard, Lock, LogOut, Plus, Search, Menu, X, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import PinLock from "@/components/ui/PinLock";
import { useSettings } from "@/lib/store";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const [isLocked, setIsLocked] = useState(false); 

  // Check PIN on mount
  useEffect(() => {
    if (settings.pin) {
      setIsLocked(true);
    }
  }, [settings.pin]);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  if (isLocked) {
    return <PinLock onUnlock={handleUnlock} correctPin={settings.pin!} />;
  }

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-xl border-r border-border/40">
      <div className="p-6">
        <h1 className="text-2xl font-display font-semibold tracking-tighter text-foreground/90 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-foreground/80" />
          EgoOs
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-widest opacity-60">Personal Archive</p>
      </div>

      <div className="px-4 mb-4">
        <Link href="/editor">
          <Button className="w-full justify-start gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl shadow-foreground/5">
            <Plus className="w-4 h-4" />
            New Entry
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <Link href="/">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/5",
              location === "/" && "bg-white/5 text-foreground font-medium"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Timeline
          </Button>
        </Link>
        
        <div className="pt-4 pb-2 px-2 text-xs font-mono uppercase tracking-widest text-muted-foreground/40">
          Sections
        </div>
        
        {SECTIONS.map((section) => (
          <Link key={section.id} href={`/section/${section.id}`}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group",
                location.startsWith(`/section/${section.id}`) && "bg-white/5 text-foreground font-medium"
              )}
            >
              <section.icon className={cn("w-4 h-4 transition-colors", location.startsWith(`/section/${section.id}`) ? section.color : "group-hover:text-foreground/80")} />
              {section.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border/40 space-y-1">
        <Link href="/settings">
          <Button variant="ghost" className={cn("w-full justify-start gap-3 text-muted-foreground hover:text-foreground", location === "/settings" && "bg-white/5 text-foreground")}>
            <SettingsIcon className="w-4 h-4" />
            Settings
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-red-400 hover:bg-red-400/10" onClick={() => setIsLocked(true)}>
          <Lock className="w-4 h-4" />
          Lock App
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 z-20">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-border/40 flex items-center justify-between px-4 z-40">
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-foreground/80" />
           <h1 className="text-xl font-display font-semibold tracking-tighter">EgoOs</h1>
         </div>
         <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
         </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 bg-background z-30 md:hidden p-4"
          >
            <div className="h-full" onClick={() => setMobileMenuOpen(false)}>
              <Sidebar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative h-screen pt-16 md:pt-0">
        <div className="max-w-3xl mx-auto p-4 md:p-8 lg:p-12 min-h-full">
           {children}
        </div>
      </main>
    </div>
  );
}
