'use client';

import {
  IconBarbell,
  IconCamera,
  IconClockHour3,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconFriends,
  IconHelp,
  IconInnerShadowTop,
  IconMoneybagEdit,
  IconSearch,
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
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
