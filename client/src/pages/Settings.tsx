import { useState } from "react";
import { useSettings } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Shield, Smartphone, Trash2, Download } from "lucide-react";

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const [pin, setPin] = useState(settings.pin || "");
  const [confirmPin, setConfirmPin] = useState("");

  const handleSavePin = () => {
    if (pin.length !== 4) {
      toast({ title: "Invalid PIN", description: "PIN must be 4 digits", variant: "destructive" });
      return;
    }
    if (pin !== confirmPin) {
      toast({ title: "Mismatch", description: "PINs do not match", variant: "destructive" });
      return;
    }
    updateSettings({ pin });
    toast({ title: "Security Updated", description: "Your PIN has been set." });
    setConfirmPin("");
  };

  const handleRemovePin = () => {
    updateSettings({ pin: null });
    setPin("");
    setConfirmPin("");
    toast({ title: "Security Updated", description: "PIN removed." });
  };

  const handleExport = () => {
    const data = localStorage.getItem('egoos-entries');
    const blob = new Blob([data || '[]'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `egoos-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Your data has been downloaded." });
  };

  const handleClearData = () => {
    if (confirm("Are you ABSOLUTELY sure? This will delete all your entries permanently. This action cannot be undone.")) {
      localStorage.removeItem('egoos-entries');
      location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <header className="space-y-1">
        <h2 className="text-3xl font-display font-medium tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your privacy and data</p>
      </header>

      <section className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Shield className="w-5 h-5" />
            <h3>Security</h3>
          </div>
          
          <div className="bg-card/40 border border-border/40 p-6 rounded-xl space-y-4">
            <div className="space-y-2">
              <Label>App Lock PIN (4 digits)</Label>
              <div className="flex gap-2">
                <Input 
                  type="password" 
                  maxLength={4} 
                  placeholder="Set PIN" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="bg-background/50 font-mono tracking-widest text-center"
                />
                <Input 
                  type="password" 
                  maxLength={4} 
                  placeholder="Confirm" 
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="bg-background/50 font-mono tracking-widest text-center"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button onClick={handleSavePin} disabled={!pin || pin.length !== 4}>
                {settings.pin ? "Update PIN" : "Set PIN"}
              </Button>
              {settings.pin && (
                <Button variant="outline" onClick={handleRemovePin} className="text-destructive hover:bg-destructive/10 border-destructive/20">
                  Remove PIN
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Download className="w-5 h-5" />
            <h3>Data</h3>
          </div>

          <div className="bg-card/40 border border-border/40 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Export Data</div>
                <div className="text-sm text-muted-foreground">Download a local JSON backup</div>
              </div>
              <Button variant="outline" onClick={handleExport}>
                Export
              </Button>
            </div>
            
            <div className="pt-4 border-t border-border/40 flex items-center justify-between">
              <div>
                <div className="font-medium text-destructive">Danger Zone</div>
                <div className="text-sm text-muted-foreground">Permanently delete all data</div>
              </div>
              <Button variant="ghost" onClick={handleClearData} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
