import React, { useCallback } from "react";
import { Link, useLocation } from "react-router";
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
} from '@/components/ui/accordion-menu';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLayout } from "./context";

const KNOWN_PARCEL_SUBPATHS = new Set(['catalis-parcel-search', 'recently-viewed', 'audit-logs']);


export function SidebarMenu() {
  const { pathname } = useLocation();
  const { activeMenuItem } = useLayout();

  const matchPath = useCallback(
    (path: string): boolean => path.toLowerCase() === pathname.toLowerCase(),
    [pathname],
  );

  const menuGroups = activeMenuItem?.children ?? [];

  const parcelDetailMatch = pathname.toLowerCase().match(/^\/property-parcels\/([^/]+)$/);
  const parcelNumber = parcelDetailMatch && !KNOWN_PARCEL_SUBPATHS.has(parcelDetailMatch[1])
    ? parcelDetailMatch[1].toUpperCase()
    : null;

  return (
    <div
      className="lg:fixed lg:z-10 lg:top-(--header-height) lg:bottom-0 flex flex-col items-stretch lg:w-(--sidebar-menu-width) overflow-hidden"
      style={{ '--menu-accent': 'var(--color-menu-accent)' } as React.CSSProperties}
    >

      <div className="lg:rounded-tl-2xl px-4 py-1 flex flex-col h-full" style={{ backgroundImage: 'linear-gradient(to bottom, var(--color-sidebar-menu-from), var(--color-sidebar-menu-to))' }}>
      <div className="mb-3 px-1 mt-3 flex-shrink-0">
        <span className="text-sm font-semibold text-black">{activeMenuItem?.title}</span>
      </div>

      <ScrollArea className="flex-1 min-h-0 [&_[data-slot=scroll-area-scrollbar]]:hidden">
        <AccordionMenu
          selectedValue={pathname.toLowerCase()}
          matchPath={matchPath}
          type="multiple"
          className="space-y-5"
          classNames={{
            separator: '-mx-2 mb-2.5',
            label: 'text-xs font-normal text-muted-foreground',
            item: 'h-9 my-0.5 rounded-md px-2.5 text-sm font-normal text-black hover:bg-[var(--menu-accent)]/25 hover:text-primary data-[selected=true]:bg-[var(--menu-accent)]/50 data-[selected=true]:border-r-4 data-[selected=true]:border-r-[var(--menu-accent)] data-[selected=true]:font-medium data-[selected=true]:text-foreground [&[data-selected=true]_svg]:opacity-100',
            group: '',
          }}
        >
          {menuGroups.map((group, index) => (
            <AccordionMenuGroup key={index}>
              {group.children?.map((child, childIndex) => (
                <React.Fragment key={childIndex}>
                  <AccordionMenuItem value={child.path || '#'}>
                    <Link to={child.path || '#'}>
                      {child.icon && <child.icon />}
                      <span>{child.title}</span>
                    </Link>
                  </AccordionMenuItem>
                  {parcelNumber && child.path === '/property-parcels' && (
                    <div className="ml-[16px] pl-4 border-l border-black/30">
                      <Link
                        to={pathname.toLowerCase()}
                        className="relative flex items-center h-9 rounded-md px-2.5 text-sm font-medium bg-[var(--menu-accent)]/50 border-r-4 border-r-[var(--menu-accent)] text-foreground before:absolute before:-left-4 before:top-1/2 before:-translate-y-px before:w-3 before:h-px before:bg-black/30"
                      >
                        <span className="truncate">Parcel: {parcelNumber}</span>
                      </Link>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </AccordionMenuGroup>
          ))}
        </AccordionMenu>
      </ScrollArea>

      <div className="shrink-0 py-3 flex justify-center">
        <img
          src="/images/kenosha-county-logo.png"
          alt="Kenosha County"
          className="h-10 w-auto object-contain"
        />
      </div>
    </div>
    </div>
  );
}
