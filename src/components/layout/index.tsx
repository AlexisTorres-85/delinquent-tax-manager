import { Wrapper } from './wrapper';
import { LayoutProvider } from './context';

export function Layout() {
  return (
    <LayoutProvider
      style={{
        '--header-height': '60px',
        '--sidebar-width': '60px',
        '--sidebar-menu-width': '300px',
      } as React.CSSProperties}
    >
      <Wrapper />
    </LayoutProvider>
  );
}
