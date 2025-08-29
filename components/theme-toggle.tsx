'use client';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? (
        <IconSun className="h-5 text-muted-foreground" />
      ) : (
        <IconMoon className="h-5 text-muted-foreground" />
      )}
    </button>
  );
}
