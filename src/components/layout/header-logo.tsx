import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { useLayout } from './context';
import { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetBody } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarMenu } from './sidebar-menu';
import { HeaderTitle } from './header-title';
import { HeaderBreadcrumbs } from './header-breadcrumbs';
import { Sidebar } from './sidebar';

export function HeaderLogo() {
  const { isMobile } = useLayout();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex items-center">
      {/* Brand */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center min-w-15">
          <Link to="/" className="">
            <img
              src={toAbsoluteUrl('/images/dtm-logo.svg')}
              className="shrink-0 w-24 ml-4"
              alt="image"
            />
          </Link>
        </div>
      </div>

      {isMobile && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="dim" mode="icon" className="size-6 ml-4">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="p-0 gap-0 w-[250px]"
            side="left"
            close={false}
          >
            <SheetHeader className="p-0 space-y-0" />
            <SheetBody className="flex grow p-0">
              <Sidebar />
              <SidebarMenu />
            </SheetBody>
          </SheetContent>
        </Sheet>
      )}

      <HeaderTitle />
    </div>
  );
}
