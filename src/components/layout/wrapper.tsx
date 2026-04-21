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

      <div className="flex grow pt-[var(--header-height)] bg-[#004B6F]">
        {!isMobile && <Sidebar />}

        <div className="flex flex-col grow lg:ps-[var(--sidebar-width)] ">
          <div className="flex flex-grow">
            {!isMobile && <SidebarMenu />}

            <main className="grow lg:ps-[calc(var(--sidebar-menu-width)+0px)]" role="content">
              <div className="bg-white h-full">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
