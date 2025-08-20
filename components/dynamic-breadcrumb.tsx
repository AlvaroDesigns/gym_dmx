'use client';

import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { capitalCase } from '@/utils/text';

const isIdSegment = (segment: string) => {
  // Puedes mejorar esta lógica si lo necesitas
  return /^[a-zA-Z0-9]{6,}$/.test(segment); // Omite DNIs, IDs, códigos
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname
    .split('/')
    .filter((segment) => segment && !isIdSegment(segment)); // Omitimos los segmentos que parecen IDs

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{capitalCase(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{capitalCase(segment)}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
