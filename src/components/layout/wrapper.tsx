import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useLayout } from './context';
import { SidebarMenu } from './sidebar-menu';
import { Footer } from './footer';


export function Wrapper() {
  const { isMobile } = useLayout();
  const { pathname } = useLocation();
  const isDashboard = pathname === '/' || pathname === '/kpis';

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{ background: 'var(--color-app-gradient)' }}
      />
      <Header />

      <div className="fixed inset-x-0 bottom-0 top-[var(--header-height)] flex min-h-0 overflow-hidden">
        {!isMobile && <Sidebar />}

        <div className="flex min-h-0 min-w-0 flex-col grow lg:ps-[var(--sidebar-width)] ">
          <div className="flex min-h-0 flex-grow">
            {!isMobile && !isDashboard ? (
              <>
                <div className="hidden shrink-0 lg:block lg:w-(--sidebar-menu-width)" aria-hidden="true" />
                <SidebarMenu />
              </>
            ) : null}

            <main className="min-h-0 min-w-0 grow overflow-hidden flex flex-col" role="content">
              <div className={`min-h-0 grow overflow-hidden ${isDashboard ? '' : 'bg-white'}`}>
                <Outlet />
              </div>
              {!isDashboard && <Footer />}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
