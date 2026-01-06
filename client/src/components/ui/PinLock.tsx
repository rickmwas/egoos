import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinLockProps {
  onUnlock: () => void;
  correctPin: string;
}

export default function PinLock({ onUnlock, correctPin }: PinLockProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === correctPin) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 500);
      }
    }
  }, [pin, correctPin, onUnlock]);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-8 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-foreground/80" />
          </div>
          <h2 className="text-2xl font-display font-medium text-foreground">EgoOs Locked</h2>
          <p className="text-muted-foreground text-sm">Enter your PIN to access your archive</p>
        </motion.div>

        <div className="flex justify-center gap-4 my-8">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "w-4 h-4 rounded-full border border-primary/20 transition-all duration-300",
                pin.length > i ? "bg-primary border-primary" : "bg-transparent",
                error && "border-red-500 bg-red-500/20"
              )}
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-20 h-20 rounded-full hover:bg-accent/10 active:bg-accent/20 flex items-center justify-center text-2xl font-light transition-colors"
            >
              {num}
            </button>
          ))}
          <div className="w-20 h-20" /> {/* Spacer */}
          <button
            onClick={() => handlePress("0")}
            className="w-20 h-20 rounded-full hover:bg-accent/10 active:bg-accent/20 flex items-center justify-center text-2xl font-light transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-20 h-20 rounded-full hover:bg-red-500/10 active:bg-red-500/20 flex items-center justify-center text-sm font-medium transition-colors text-muted-foreground hover:text-red-400"
          >
            DEL
          </button>
        </div>
      </div>
    </div>
  );
}
