import { type CSSProperties, type ReactNode, useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageToolbar, type BreadcrumbCrumb } from '@/components/ui/page-toolbar';

export interface SectionHeader {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

interface ContentWrapperProps {
  main: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  mainWidth?: string;
  leftWidth?: string;
  rightWidth?: string;
  className?: string;
  leftClassName?: string;
  mainClassName?: string;
  rightClassName?: string;
  crumbs?: BreadcrumbCrumb[];
  actions?: ReactNode;
  leftHeader?: SectionHeader;
  mainHeader?: SectionHeader;
  rightHeader?: SectionHeader;
  allowCollapseLeft?: boolean;
  allowCollapseRight?: boolean;
}

function createPanelStyle(width: string): CSSProperties {
  return {
    width,
    flexBasis: width,
    flexGrow: 0,
    flexShrink: 0,
  };
}

function getDefaultMainWidth(hasLeft: boolean, hasRight: boolean): string {
  if (hasLeft && hasRight) {
    return '33.333333%';
  }

  if (hasLeft || hasRight) {
    return '66.666667%';
  }

  return '100%';
}

export function ContentWrapper({
  main,
  left,
  right,
  mainWidth,
  leftWidth,
  rightWidth,
  className,
  leftClassName,
  mainClassName,
  rightClassName,
  crumbs,
  actions,
  leftHeader,
  mainHeader,
  rightHeader,
  allowCollapseLeft = false,
  allowCollapseRight = false,
}: ContentWrapperProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const hasLeft = left !== undefined;
  const hasRight = right !== undefined;

  const resolvedLeftWidth = leftWidth ?? '33.333333%';
  const resolvedRightWidth = rightWidth ?? '33.333333%';
  const resolvedMainWidth = mainWidth ?? getDefaultMainWidth(hasLeft, hasRight);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {crumbs && crumbs.length > 0 && (
        <PageToolbar crumbs={crumbs} actions={actions} />
      )}
      <div className={cn('flex min-h-0 flex-1 min-w-0 overflow-hidden bg-white', className)}>
        {hasLeft ? (
          <aside
            className={cn(
              'h-full min-h-0 bg-white flex flex-col transition-all duration-200 border-r border-l-2 border-divider-dark',
              leftCollapsed ? 'overflow-hidden bg-section-header' : 'overflow-x-auto overflow-y-auto',
              leftClassName,
            )}
            style={leftCollapsed
              ? { width: '40px', flexBasis: '40px', flexGrow: 0, flexShrink: 0 }
              : createPanelStyle(resolvedLeftWidth)}
          >
            {/* Collapsed strip */}
            {leftCollapsed && allowCollapseLeft && (
              <div className="flex flex-col items-center gap-3 pt-3 pb-3 h-full">
                <button
                  onClick={() => setLeftCollapsed(false)}
                  className="shrink-0 p-1 rounded hover:bg-black/5 text-muted-foreground"
                  title="Expand panel"
                >
                  <PanelLeftOpen className="h-6 w-6" />
                </button>
                {leftHeader && (
                  <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <span
                      className="font-medium text-muted-foreground whitespace-nowrap"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {leftHeader.title}
                    </span>
                  </div>
                )}
                {leftHeader?.icon && (
                  <div className="shrink-0 text-muted-foreground [&_svg]:size-6">{leftHeader.icon}</div>
                )}
              </div>
            )}

            {/* Expanded content */}
            {!leftCollapsed && (
              <>
                {leftHeader && (
                  <div
                    className="flex items-center gap-2 shrink-0 pl-6 pr-4 pt-4 pb-4 border-b border-divider bg-section-header"
                  >
                    {leftHeader.icon && <div className="text-muted-foreground [&_svg]:size-8">{leftHeader.icon}</div>}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-base font-semibold text-foreground">{leftHeader.title}</span>
                      {leftHeader.subtitle && (
                        <span className="text-xs text-muted-foreground -mt-0.5">{leftHeader.subtitle}</span>
                      )}
                    </div>
                    {allowCollapseLeft && (
                      <button
                        onClick={() => setLeftCollapsed(true)}
                        className="shrink-0 p-1 rounded hover:bg-black/5 text-muted-foreground"
                        title="Collapse panel"
                      >
                        <PanelLeftClose className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                )}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {left}
                </div>
              </>
            )}
          </aside>
        ) : null}

        <main
          className={cn('h-full min-h-0 min-w-0 overflow-x-auto overflow-y-auto bg-white flex flex-col', !hasLeft && 'border-l-2 border-divider-dark', mainClassName)}
          style={(leftCollapsed || rightCollapsed) ? { flex: '1 1 0', minWidth: 0 } : createPanelStyle(resolvedMainWidth)}
        >
          {mainHeader && (
            <div
              className="flex items-center gap-2 shrink-0 pl-6 pr-6 pt-6 pb-6 border-b border-divider bg-section-header"
            >
              {mainHeader.icon && <div className="text-muted-foreground [&_svg]:size-8">{mainHeader.icon}</div>}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-base font-semibold text-foreground">{mainHeader.title}</span>
                {mainHeader.subtitle && (
                  <span className="text-xs text-muted-foreground -mt-0.5">{mainHeader.subtitle}</span>
                )}
              </div>
              {mainHeader.actions && (
                <div className="flex items-center gap-2 ml-auto shrink-0">{mainHeader.actions}</div>
              )}
            </div>
          )}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {main}
          </div>
        </main>

        {hasRight ? (
          <aside
            className={cn(
              'h-full min-h-0 bg-white flex flex-col transition-all duration-200 border-l border-divider',
              rightCollapsed ? 'overflow-hidden' : 'overflow-x-auto overflow-y-auto',
              rightClassName,
            )}
            style={rightCollapsed
              ? { width: '40px', flexBasis: '40px', flexGrow: 0, flexShrink: 0 }
              : createPanelStyle(resolvedRightWidth)}
          >
            {/* Collapsed strip */}
            {rightCollapsed && allowCollapseRight && (
              <div className="flex flex-col items-center gap-3 pt-3 pb-3 h-full">
                <button
                  onClick={() => setRightCollapsed(false)}
                  className="shrink-0 p-1 rounded hover:bg-black/5 text-muted-foreground"
                  title="Expand panel"
                >
                  <PanelRightOpen className="h-4 w-4" />
                </button>
                {rightHeader && (
                  <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <span
                      className="font-medium text-muted-foreground whitespace-nowrap"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {rightHeader.title}
                    </span>
                  </div>
                )}
                {rightHeader?.icon && (
                  <div className="shrink-0 text-muted-foreground [&_svg]:size-6">{rightHeader.icon}</div>
                )}
              </div>
            )}

            {/* Expanded content */}
            {!rightCollapsed && (
              <>
                {rightHeader && (
                  <div
                    className="flex items-center gap-2 shrink-0 pl-4 pr-6 pt-4 pb-4 border-b border-divider bg-section-header"
                  >
                    {allowCollapseRight && (
                      <button
                        onClick={() => setRightCollapsed(true)}
                        className="shrink-0 p-1 rounded hover:bg-black/5 text-muted-foreground"
                        title="Collapse panel"
                      >
                        <PanelRightClose className="h-4 w-4" />
                      </button>
                    )}
                    {rightHeader.icon && <div className="text-muted-foreground [&_svg]:size-8">{rightHeader.icon}</div>}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-base font-semibold text-foreground">{rightHeader.title}</span>
                      {rightHeader.subtitle && (
                        <span className="text-xs text-muted-foreground -mt-0.5">{rightHeader.subtitle}</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {right}
                </div>
              </>
            )}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
