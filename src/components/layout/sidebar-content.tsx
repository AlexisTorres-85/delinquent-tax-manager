import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MENU_SIDEBAR_MAIN } from '@/config/layout.config';
import { useLayout } from './context';

export function SidebarContent() {
  const { pathname } = useLocation();
  const { activeMenuItem, setActiveMenuItem } = useLayout();

  useEffect(() => {
    const lowerPathname = pathname.toLowerCase();
    // Find the best matching item by rootPath prefix, fall back to exact path
    const match = MENU_SIDEBAR_MAIN.find((item) => {
      if (!item.rootPath || item.rootPath === '/') return false;
      return lowerPathname.startsWith(item.rootPath);
    }) ?? MENU_SIDEBAR_MAIN.find((item) => item.path === '/');

    if (match) setActiveMenuItem(match);
  }, [pathname, setActiveMenuItem]);

  return (
		<ScrollArea className="grow w-full h-[calc(100vh-10rem)] lg:h-[calc(100vh-5.5rem)]">
			<div className="grow gap-2.5 shrink-0 flex items-center flex-col w-full mt-2">
				{MENU_SIDEBAR_MAIN.map((item, index) => (
					<Tooltip key={index}>
						<TooltipTrigger asChild>
						<div className="relative flex w-full items-center justify-center">
								<Button
									asChild
									variant="ghost"
									mode="icon"
									{...(item === activeMenuItem
										? { 'data-state': 'open' }
										: {})}
									className={cn(
										'border border-transparent shrink-0 text-white rounded-md size-9',
									'hover:text-primary data-[state=open]:bg-(--color-sidebar-active-bg)',
									)}
								>
									{item.path ? (
										<Link to={item.path}>
											{item.icon ? (
												<item.icon className="size-5!" />
											) : null}
										</Link>
									) : (
										item.icon ? <item.icon className="size-5!" /> : null
									)}
								</Button>
								{item === activeMenuItem && (
									<div
										className="absolute right-0 h-[33px] -top-[1px] bottom-0 rounded-l-lg"
										style={{ width: 'var(--width-selected-menu-line)', background: 'var(--color-selected-menu-line)' }}
									/>
								)}
							</div>
						</TooltipTrigger>
						<TooltipContent side="right">{item.title}</TooltipContent>
					</Tooltip>
				))}
			</div>
		</ScrollArea>
  );
}
