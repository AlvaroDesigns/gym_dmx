'use client';

import { IconAdjustmentsPlus, IconLayoutColumns } from '@tabler/icons-react';
import { useState } from 'react';
import { ViewToggle } from './ui/view-toggle';

export const TestViewToggle = () => {
  const [currentView, setCurrentView] = useState<'default' | 'compiled'>('default');

  console.log('Estado actual del ViewToggle:', currentView);

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Test del ViewToggle</h3>

      <ViewToggle
        size="md"
        variant="outline"
        options={[
          {
            value: 'default',
            icon: <IconLayoutColumns />,
            label: 'Por defecto',
          },
          {
            value: 'compiled',
            icon: <IconAdjustmentsPlus />,
            label: 'Compilado',
          },
        ]}
        value={currentView}
        onValueChange={(value) => {
          console.log('ViewToggle cambió a:', value);
          setCurrentView(value as 'default' | 'compiled');
        }}
      />

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Vista actual:</strong> {currentView}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Haz clic en los botones para cambiar la vista
        </p>
      </div>
    </div>
  );
};
