import { useState, useEffect } from 'react';

export type Theme = 'sword' | 'classic' | 'bw';

export interface ThemeOption {
  key: Theme;
  label: string;
  icon: string;
  description: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { key: 'sword', label: 'sword', icon: '⚔️', description: 'Ruby & Steel Blue' },
  { key: 'classic', label: 'classic', icon: '📜', description: 'Amber & Parchment' },
  { key: 'bw', label: 'mono', icon: '⬛', description: 'Monochrome High-Contrast' },
];

const THEME_STORAGE_KEY = 'daemon_abyss_active_theme';
const THEME_CHANGE_EVENT = 'daemon_abyss_theme_change';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'sword';
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'classic' || saved === 'sword' || saved === 'bw') {
    return saved;
  }
  return 'sword'; // Default to sword icon palette
}

export function applyTheme(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }));
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    // Ensure the data-theme attribute is set on mount
    const current = getStoredTheme();
    document.documentElement.setAttribute('data-theme', current);
    setThemeState(current);

    const onThemeChange = (e: Event) => {
      const custom = e as CustomEvent<Theme>;
      if (custom.detail) {
        setThemeState(custom.detail);
      }
    };

    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const sequence: Theme[] = ['sword', 'classic', 'bw'];
    const currentIndex = sequence.indexOf(theme);
    const next = sequence[(currentIndex + 1) % sequence.length];
    setTheme(next);
  };

  return { theme, setTheme, toggleTheme, themeOptions: THEME_OPTIONS };
}
