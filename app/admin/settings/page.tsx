'use client';

import { ProductLayout } from '@/components/layout/product';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Page() {
  return (
    <ProductLayout>
      <div>
        <h3>Maximo de dias para el calendario</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un valor" />
          </SelectTrigger>
        </Select>
      </div>
    </ProductLayout>
  );
}
