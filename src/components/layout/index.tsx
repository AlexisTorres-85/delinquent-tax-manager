import { Wrapper } from './wrapper';
import { LayoutProvider } from './context';
import { layoutDimensions } from '@/config/general.config';
import React from 'react';

export function Layout() {
  return (
    <LayoutProvider
      style={{
        '--header-height': layoutDimensions.headerHeight,
        '--sidebar-width': layoutDimensions.sidebarWidth,
        '--sidebar-menu-width': layoutDimensions.sidebarMenuWidth,
        '--btn-primary': 'var(--color-app-primary)',
        '--btn-primary-fg': 'var(--color-app-primary-fg)',
        '--btn-primary-from': 'var(--color-app-primary-from)',
        '--btn-primary-to': 'var(--color-app-primary-to)',
        '--btn-primary-border': 'var(--color-app-primary-border)',
        '--btn-secondary': 'var(--color-app-secondary)',
        '--btn-secondary-fg': 'var(--color-app-secondary-fg)',
        '--btn-secondary-from': 'var(--color-app-secondary-stop-0)',
        '--btn-secondary-to': 'var(--color-app-secondary-stop-2)',
        '--btn-secondary-border': 'var(--color-app-secondary-border)',
      } as React.CSSProperties}
    >
      <Wrapper />
    </LayoutProvider>
  );
}
