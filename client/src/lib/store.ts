import { useState, useEffect } from 'react';
import { Entry, UserSettings } from './types';
import { nanoid } from 'nanoid'; // Actually, I don't have nanoid installed. I'll use a simple random string.

const generateId = () => Math.random().toString(36).substring(2, 9);

// Simple event bus for cross-component updates
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    try {
      const stored = localStorage.getItem('egoos-entries');
      if (stored) {
        setEntries(JSON.parse(stored).sort((a: Entry, b: Entry) => b.createdAt - a.createdAt));
      }
    } catch (e) {
      console.error('Failed to load entries', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    listeners.add(refresh);
    return () => {
      listeners.delete(refresh);
    };
  }, []);

  const addEntry = (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: Entry = {
      ...entry,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updated = [newEntry, ...entries];
    localStorage.setItem('egoos-entries', JSON.stringify(updated));
    notify();
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<Entry>) => {
    const updated = entries.map(e => e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e);
    localStorage.setItem('egoos-entries', JSON.stringify(updated));
    notify();
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    localStorage.setItem('egoos-entries', JSON.stringify(updated));
    notify();
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry };
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    pin: null,
    theme: 'dark',
    biometricEnabled: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('egoos-settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const updateSettings = (updates: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('egoos-settings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
}
