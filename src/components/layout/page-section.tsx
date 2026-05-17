import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PageSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Popover content shown when the info icon is clicked */
  helperContent?: React.ReactNode;
  /** Click handler for the info icon (use instead of helperContent when you want a custom handler, e.g. opening a dialog) */
  onHelperClick?: () => void;
  /** Optional button/element rendered in the top-right corner of the header */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** When true, wraps the section in a white card with rounded corners */
  isCard?: boolean;
}

export function PageSection({
  icon,
  title,
  subtitle,
  helperContent,
  onHelperClick,
  action,
  children,
  className,
  isCard = false,
}: PageSectionProps) {
  const hasHelper = Boolean(helperContent || onHelperClick);

  const infoButton = hasHelper ? (
    <>
      {helperContent ? (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`About ${title}`}
            >
              <Info className="size-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" side="right" align="start">
            {helperContent}
          </PopoverContent>
        </Popover>
      ) : (
        <button
          type="button"
          onClick={onHelperClick}
          className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`About ${title}`}
        >
          <Info className="size-3.5" />
        </button>
      )}
    </>
  ) : null;

  return (
    <div className={`flex flex-col ${isCard ? ' bg-white p-4 rounded-xl' : ''}${className ? ` ${className}` : ''}`}>
      <div className="flex items-center gap-2 mb-4 border-b border-divider pb-4 shrink-0">
        <div className="flex items-center justify-center rounded-lg bg-black/10 p-2 shrink-0">
          {icon}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{title}</span>
            {infoButton}
          </div>
          {subtitle && (
            <span className="text-xs text-muted-foreground -mt-px">{subtitle}</span>
          )}
        </div>

        {action && (
          <div className="ml-auto shrink-0">
            {action}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
