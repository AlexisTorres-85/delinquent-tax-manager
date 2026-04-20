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
    // Find the best matching item by rootPath prefix, fall back to exact path
    const match = MENU_SIDEBAR_MAIN.find((item) => {
      if (!item.rootPath || item.rootPath === '/') return false;
      return pathname.startsWith(item.rootPath);
    }) ?? MENU_SIDEBAR_MAIN.find((item) => item.path === '/');

    if (match) setActiveMenuItem(match);
  }, [pathname, setActiveMenuItem]);

  return (
		<ScrollArea className="grow w-full h-[calc(100vh-10rem)] lg:h-[calc(100vh-5.5rem)]">
			<div className="grow gap-2.5 shrink-0 flex items-center flex-col mt-4">
				{MENU_SIDEBAR_MAIN.map((item, index) => (
					<Tooltip key={index}>
						<TooltipTrigger asChild>
							<Button
								asChild
								variant="ghost"
								mode="icon"
								{...(item === activeMenuItem
									? { 'data-state': 'open' }
									: {})}
								className={cn(
									'border border-transparent data-[state=open]:border-input shrink-0 text-white rounded-md size-9',
									'hover:text-primary data-[state=open]:border-input',
								)}
							>
								{item.path ? (
									<Link to={item.path}>
										{item.icon ? (
											<item.icon className="size-4.5!" />
										) : null}
									</Link>
								) : (
									item.icon ? <item.icon className="size-4.5!" /> : null
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right">{item.title}</TooltipContent>
					</Tooltip>
				))}
			</div>
		</ScrollArea>
  );
}
