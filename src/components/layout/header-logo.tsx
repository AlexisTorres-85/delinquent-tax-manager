import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { useLayout } from './context';
import { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetBody } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import { SidebarMenu } from './sidebar-menu';
import { HeaderTitle } from './header-title';
import { Sidebar } from './sidebar';
import { Input, InputWrapper } from '../ui/input';

export function HeaderLogo() {
  const { isMobile } = useLayout();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex items-center">
      {/* Brand */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center min-w-18">
          <Link to="/" className="">
            <img
              src={toAbsoluteUrl('/images/dtm-logo-light.svg')}
              className="shrink-0 w-30 ml-6"
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
      <div className="h-9 w-px bg-white/20 ml-6 mr-5" />
      <HeaderTitle />
      <InputWrapper className="w-200 hidden lg:inline-flex ml-4 bg-white/20 h-11 border-0 [&_svg]:text-white [&_input]:text-white! [&_input::placeholder]:text-white/80!">
        <Search className="text-white!" />
        <Input type="search" placeholder="Global Search" className="bg-transparent border-0 text-white! placeholder:text-white/80! focus-visible:ring-0 focus-visible:ring-offset-0" />
      </InputWrapper>
    </div>
  );
}
