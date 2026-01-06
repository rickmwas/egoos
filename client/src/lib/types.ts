import { type LucideIcon, Sparkles, Heart, Magnet, Star, Brain, Smile, LayoutDashboard, Settings } from "lucide-react";

export type SectionType = 'dreams' | 'crush' | 'attractions' | 'love' | 'thoughts' | 'mood';

export interface SectionConfig {
  id: SectionType;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const SECTIONS: SectionConfig[] = [
  { 
    id: 'dreams', 
    label: 'Dreams & Goals', 
    description: 'Long-term visions and ambitions',
    icon: Sparkles,
    color: 'text-amber-400'
  },
  { 
    id: 'crush', 
    label: 'Crush Log', 
    description: 'Admirations and emotional notes',
    icon: Heart,
    color: 'text-rose-400'
  },
  { 
    id: 'attractions', 
    label: 'Attractions', 
    description: 'Reflections on patterns and preferences',
    icon: Magnet,
    color: 'text-violet-400'
  },
  { 
    id: 'love', 
    label: 'Things I Love', 
    description: 'Aesthetics, music, ideas',
    icon: Star,
    color: 'text-yellow-200'
  },
  { 
    id: 'thoughts', 
    label: 'Free Thoughts', 
    description: 'Unstructured journaling',
    icon: Brain,
    color: 'text-sky-400'
  },
  { 
    id: 'mood', 
    label: 'Mood & Reflection', 
    description: 'Daily emotional check-ins',
    icon: Smile,
    color: 'text-emerald-400'
  },
];

export interface Entry {
  id: string;
  section: SectionType;
  title: string;
  content: string;
  tags: string[];
  mood?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserSettings {
  pin: string | null;
  theme: 'dark' | 'light'; // For now forcing dark but structure is here
  biometricEnabled: boolean;
}
