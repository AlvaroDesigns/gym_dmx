import { useState } from 'react';

export function useViewToggle<T extends string>(initialValue: T, options: [T, T]) {
  const [currentView, setCurrentView] = useState<T>(initialValue);

  const handleViewChange = (value: string) => {
    if (options.includes(value as T)) {
      setCurrentView(value as T);
    }
  };

  const isFirstView = currentView === options[0];
  const isSecondView = currentView === options[1];

  return {
    currentView,
    setCurrentView,
    handleViewChange,
    isFirstView,
    isSecondView,
    options,
  };
}
