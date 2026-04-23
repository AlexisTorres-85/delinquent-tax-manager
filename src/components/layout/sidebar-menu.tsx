import { useCallback } from "react";
import { Link, useLocation } from "react-router";
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
} from '@/components/ui/accordion-menu';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLayout } from "./context";

export function SidebarMenu() {
  const { pathname } = useLocation();
  const { activeMenuItem } = useLayout();

  const matchPath = useCallback(
    (path: string): boolean => path === pathname,
    [pathname],
  );

  const menuGroups = activeMenuItem?.children ?? [];

  return (
    <div className="lg:fixed lg:z-10 lg:top-(--header-height) lg:bottom-0 flex flex-col bg-[#004B6F] items-stretch lg:w-(--sidebar-menu-width) overflow-hidden">

      <div className="bg-muted border-r lg:rounded-tl-2xl px-4 py-1 shrink-0">
      {/* Area title */}
      <div className="mb-3 px-1 mt-3 flex-shrink-0">
        <span className="text-sm font-semibold text-black">{activeMenuItem?.title}</span>
      </div>

      <ScrollArea className="grow h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)] [&_[data-slot=scroll-area-scrollbar]]:hidden">
        <AccordionMenu
          selectedValue={pathname}
          matchPath={matchPath}
          type="multiple"
          className="space-y-5"
          classNames={{
            separator: '-mx-2 mb-2.5',
            label: 'text-xs font-normal text-muted-foreground',
            item: 'h-8 px-2.5 text-sm font-normal text-black hover:text-primary data-[selected=true]:bg-[#004C70]/15 data-[selected=true]:border-r-4 data-[selected=true]:border-r-[#004C70] data-[selected=true]:font-medium data-[selected=true]:text-foreground [&[data-selected=true]_svg]:opacity-100',
            group: '',
          }}
        >
          {menuGroups.map((group, index) => (
            <AccordionMenuGroup key={index}>
              {group.children?.map((child, childIndex) => (
                <AccordionMenuItem key={childIndex} value={child.path || '#'}>
                  <Link to={child.path || '#'}>
                    {child.icon && <child.icon />}
                    <span>{child.title}</span>
                  </Link>
                </AccordionMenuItem>
              ))}
            </AccordionMenuGroup>
          ))}
        </AccordionMenu>
      </ScrollArea>
    </div>
    </div>
  );
}
