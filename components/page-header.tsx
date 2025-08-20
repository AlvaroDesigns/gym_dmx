'use client';

import { getPageMetadata } from '@/config/page-metadata';
import { usePathname } from 'next/navigation';

interface PageHeaderProps {
  customTitle?: string;
  customDescription?: string;
  showBreadcrumb?: boolean;
  children?: React.ReactNode;
}

export function PageHeader({
  customTitle,
  customDescription,
  showBreadcrumb = true,
  children,
}: PageHeaderProps) {
  const pathname = usePathname();
  const metadata = getPageMetadata(pathname);

  const title = customTitle || metadata.title;
  const description = customDescription || metadata.description;

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
    </div>
  );
}
