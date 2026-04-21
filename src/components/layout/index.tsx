import { Wrapper } from './wrapper';
import { LayoutProvider } from './context';

export function Layout() {
  return (
    <LayoutProvider
      style={{
        '--header-height': '90px',
        '--sidebar-width': '70px',
        '--sidebar-menu-width': '300px',
      } as React.CSSProperties}
    >
      <Wrapper />
    </LayoutProvider>
  );
}
