'use client';

import {
  IconBarbell,
  IconCamera,
  IconClockHour3,
  IconDashboard,
  IconDeviceImac,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconFriends,
  IconHelp,
  IconInnerShadowTop,
  IconMoneybagEdit,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES_URL } from '@/config/url';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { useSession } from 'next-auth/react';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: ROUTES_URL.DASHBOARD,
      icon: IconDashboard,
    },
    {
      title: 'Personal',
      url: ROUTES_URL.STAFF,
      icon: IconUsers,
      items: [
        {
          title: 'Añadir Personal',
          url: ROUTES_URL.STAFF_CREATE,
        },
      ],
    },
    {
      title: 'Clientes',
      url: ROUTES_URL.CUSTOMERS,
      icon: IconFriends,
      items: [
        {
          title: 'Añadir Clientes',
          url: ROUTES_URL.CUSTOMER_CREATE,
        },
      ],
    },
    {
      title: 'Horarios',
      url: ROUTES_URL.TIMETABLE_SESSIONS,
      icon: IconClockHour3,
    },
    {
      title: 'Zonas',
      url: ROUTES_URL.ZONES,
      icon: IconFolder,
    },
    {
      title: 'Actividades',
      url: ROUTES_URL.ACTIVITIES,
      icon: IconBarbell,
    },
    {
      title: 'Pagos',
      url: ROUTES_URL.PAYMENT,
      icon: IconMoneybagEdit,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Configuración',
      url: ROUTES_URL.SETTINGS,
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
  ],
  documents: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const sessionEmail = session?.user?.email ?? undefined;
  const { data: users } = useGetUsers({ roles: [], email: sessionEmail });
  const userFromApi = users?.[0];
  const displayUser = {
    name: userFromApi?.name ?? data.user.name,
    email: sessionEmail ?? data.user.email,
    avatar: data.user.avatar,
  };

  const roles = (session?.user as { roles?: string[] } | undefined)?.roles ?? [];
  const isAdminOrEmployee = roles.includes('ADMIN') || roles.includes('EMPLOYEE');

  const navItems = React.useMemo(() => {
    const base = [...data.navMain];
    if (isAdminOrEmployee) {
      base.push({
        title: 'Booking',
        url: ROUTES_URL.USER,
        icon: IconDeviceImac,
      });
    }
    return base;
  }, [isAdminOrEmployee]);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
