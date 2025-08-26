'use client';

import * as React from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

export type GenericDrawerProps = React.ComponentProps<typeof Drawer> & {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  withHiddenTitle?: boolean;
  contentClassName?: string;
  contentProps?: Omit<
    React.ComponentProps<typeof DrawerContent>,
    'className' | 'children'
  >;
};

export function GenericDrawer({
  trigger,
  children,
  title,
  withHiddenTitle = true,
  contentClassName,
  contentProps,
  ...props
}: GenericDrawerProps) {
  return (
    <Drawer {...props}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={contentClassName} {...contentProps}>
        {withHiddenTitle && (
          <DrawerTitle className="sr-only">{title ?? 'Drawer'}</DrawerTitle>
        )}
        {children}
      </DrawerContent>
    </Drawer>
  );
}
