import * as React from 'react';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

interface PageToolbarProps {
  crumbs: BreadcrumbCrumb[];
  actions?: React.ReactNode;
  className?: string;
}

const ARROW_DEPTH = 15;  // px — how deep the chevron point extends
const ARROW_HEIGHT = 45; // px — height of each breadcrumb item

export function PageToolbar({ crumbs, actions, className }: PageToolbarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        className,
      )}
    >
      <nav aria-label="breadcrumb" className="flex items-center flex-shrink-0">
        {crumbs.map((crumb, index) => {
          const isFirst = index === 0;
          const isLast = index === crumbs.length - 1;

          // First item: flat left edge + right arrow
          // All others: left notch (pointing right) + right arrow
          const clipPath = isFirst
            ? `polygon(0 0, calc(100% - ${ARROW_DEPTH}px) 0, 100% 50%, calc(100% - ${ARROW_DEPTH}px) 100%, 0 100%)`
            : `polygon(0 0, calc(100% - ${ARROW_DEPTH}px) 0, 100% 50%, calc(100% - ${ARROW_DEPTH}px) 100%, 0 100%, ${ARROW_DEPTH}px 50%)`;

          return (
            <div
              key={index}
              className={cn(
                'relative flex items-center text-sm font-medium whitespace-nowrap group',
                isFirst ? 'pl-4 pr-6' : '-ml-[10px] pl-10 pr-10',
                isLast ? 'text-white' : 'text-gray-600',
              )}
              style={{
                clipPath,
                zIndex: index + 1,
                height: ARROW_HEIGHT,
                backgroundColor: isLast ? 'var(--color-breadcrumb-active)' : 'var(--color-breadcrumb-inactive)',
                borderBottom: '1px solid var(--color-divider-dark)',
              }}
              onMouseEnter={!isLast ? (e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-breadcrumb-hover)'; } : undefined}
              onMouseLeave={!isLast ? (e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-breadcrumb-inactive)'; } : undefined}
            >
              {crumb.href && !isLast ? (
                <a href={crumb.href}>
                  {isFirst ? <Home className="h-5 w-5" /> : crumb.label}
                </a>
              ) : (
                <span>{isFirst ? <Home className="h-5 w-5" /> : crumb.label}</span>
              )}
            </div>
          );
        })}
      </nav>

      <div
        className="flex flex-1 items-center justify-end gap-2 px-6 self-stretch -ml-[10px]"
        style={{
          background: 'var(--color-breadcrumb-trail)',
          clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${ARROW_DEPTH}px 50%)`,
          paddingLeft: `${ARROW_DEPTH + 16}px`,
        }}
      >
        {actions}
      </div>
    </div>
  );
}
