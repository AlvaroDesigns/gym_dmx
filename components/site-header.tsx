'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { IconLogout } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { DynamicBreadcrumb } from './dynamic-breadcrumb';

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-col">
          <DynamicBreadcrumb />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link
            className="hidden sm:flex items-center gap-2"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              signOut({ callbackUrl: '/' });
            }}
          >
            <>
              <p className="text-sm text-muted-foreground">Cerrar sesión</p>
              <IconLogout className="h-4 text-muted-foreground" />
            </>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
