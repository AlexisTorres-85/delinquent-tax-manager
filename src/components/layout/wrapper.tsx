import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useLayout } from './context';
import { SidebarMenu } from './sidebar-menu';

export function Wrapper() {
  const { isMobile } = useLayout();

  return (
    <>
      <Header />

      <div className="fixed inset-x-0 bottom-0 top-[var(--header-height)] flex min-h-0 overflow-hidden bg-[#004B6F]">
        {!isMobile && <Sidebar />}

        <div className="flex min-h-0 min-w-0 flex-col grow lg:ps-[var(--sidebar-width)] ">
          <div className="flex min-h-0 flex-grow">
            {!isMobile ? (
              <>
                <div className="hidden shrink-0 lg:block lg:w-(--sidebar-menu-width)" aria-hidden="true" />
                <SidebarMenu />
              </>
            ) : null}

            <main className="min-h-0 min-w-0 grow overflow-hidden" role="content">
              <div className="h-full min-h-0 overflow-hidden bg-white">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
