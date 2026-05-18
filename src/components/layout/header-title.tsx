import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	User,
	Settings,
	ChevronDown,
	LogOut,
} from 'lucide-react';
import { useLayout } from './context';
import { useAuth } from '@/auth/use-auth';

function getInitials(name: string): string {
	const parts = name.trim().split(' ');
	if (parts.length >= 2) {
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}
	return name.slice(0, 2).toUpperCase();
}

export function HeaderTitle() {
	const { isMobile } = useLayout();
	const { displayName, objectId, logout } = useAuth();
	const initials = getInitials(displayName || 'Guest User');

	return (
		<div className="group flex justify-between items-center gap-2.5 shrink-0">
			<div className="flex items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="none" className="flex items-center justify-between gap-1 px-1.5 -ms-0.5">
							{!isMobile && (
								<span className="text-white text-sm font-medium px-4 py-2 rounded-md bg-white/20 hover:bg-white/40 transition-colors backdrop-blur flex items-center gap-2">
									<span className="flex items-center justify-center size-7 rounded-full bg-[#004C70] text-white text-xs font-semibold">
										{initials}
									</span>
									{displayName || 'Guest User'}
									<ChevronDown className="size-4 text-white" />
								</span>
							)}
						</Button>
					</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 bg-white/95" side="bottom" align="start" sideOffset={10} alignOffset={6}>
							{objectId && (
								<div className="px-2 py-1.5">
									<p className="text-xs font-medium text-foreground">{displayName || 'Guest User'}</p>
									<p className="text-[10px] text-muted-foreground font-mono truncate">{objectId}</p>
								</div>
							)}
							<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<User className="size-4" />
								<span>Profile</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="size-4" />
								<span>Settings</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={logout}>
								<LogOut className="size-4" />
								<span>Logout</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
