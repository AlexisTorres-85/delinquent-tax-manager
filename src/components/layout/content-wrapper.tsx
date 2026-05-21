import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageToolbar, type BreadcrumbCrumb } from '@/components/ui/page-toolbar';
import { Skeleton } from '@/components/ui/skeleton';
import { TAB_TRANSITION_MS } from '@/config/general.config';
import { DataLoader } from '../ui/data-loader';

function MainPanelSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <DataLoader loading />
    </div>
  );
}

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
  isLoading?: boolean;
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
  isLoading = false,
}: ContentWrapperProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const [renderSkeleton, setRenderSkeleton] = useState(isLoading);
  const [renderContent, setRenderContent] = useState(!isLoading);
  const [contentVisible, setContentVisible] = useState(!isLoading);

  useEffect(() => {
    if (!isLoading) {
      setRenderContent(true);

      const raf = requestAnimationFrame(() => {
        setContentVisible(true);
      });

      const timeout = setTimeout(() => {
        setRenderSkeleton(false);
      }, TAB_TRANSITION_MS);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timeout);
      };
    }

    setRenderSkeleton(true);
    setRenderContent(false);
    setContentVisible(false);
  }, [isLoading]);

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

      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 overflow-hidden bg-white',
          className,
        )}
      >
        {hasLeft ? (
          <aside
            className={cn(
              'flex h-full min-h-0 flex-col border-l-[length:var(--border-divider-dark-width)] border-r border-divider-dark bg-white transition-all duration-200',
              leftCollapsed
                ? 'overflow-hidden'
                : 'overflow-x-auto overflow-y-auto',
              leftClassName,
            )}
            style={
              leftCollapsed
                ? {
                    width: '40px',
                    flexBasis: '40px',
                    flexGrow: 0,
                    flexShrink: 0,
                  }
                : createPanelStyle(resolvedLeftWidth)
            }
          >
            {leftCollapsed && allowCollapseLeft && (
              <div className="flex h-full flex-col items-center gap-3 py-3">
                <button
                  onClick={() => setLeftCollapsed(false)}
                  className="shrink-0 rounded p-1 text-muted-foreground hover:bg-black/5"
                  title="Expand panel"
                  type="button"
                >
                  <PanelLeftOpen className="h-6 w-6" />
                </button>

                {leftHeader && (
                  <div className="flex flex-1 items-center justify-center overflow-hidden">
                    <span
                      className="whitespace-nowrap font-medium text-muted-foreground"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {leftHeader.title}
                    </span>
                  </div>
                )}

                {leftHeader?.icon && (
                  <div className="shrink-0 text-muted-foreground [&_svg]:size-6">
                    {leftHeader.icon}
                  </div>
                )}
              </div>
            )}

            {!leftCollapsed && (
              <>
                {leftHeader && (
                  <div className="flex shrink-0 items-center gap-2 border-b border-divider py-4 pl-6 pr-4" style={{ background: 'var(--color-section-header)' }}>
                    {leftHeader.icon && (
                      <div className="text-muted-foreground [&_svg]:size-8">
                        {leftHeader.icon}
                      </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-base font-semibold text-foreground">
                        {leftHeader.title}
                      </span>

                      {leftHeader.subtitle && (
                        <span className="-mt-0.5 text-xs text-muted-foreground">
                          {leftHeader.subtitle}
                        </span>
                      )}
                    </div>

                    {allowCollapseLeft && (
                      <button
                        onClick={() => setLeftCollapsed(true)}
                        className="shrink-0 rounded p-1 text-muted-foreground hover:bg-black/5"
                        title="Collapse panel"
                        type="button"
                      >
                        <PanelLeftClose className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                )}

                <div className="min-h-0 flex-1 overflow-y-auto">{left}</div>
              </>
            )}
          </aside>
        ) : null}

        <main
          className={cn(
            'relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-white',
            !hasLeft && 'border-l-[length:var(--border-divider-dark-width)] border-divider-dark',
            mainClassName,
          )}
          style={
            leftCollapsed || rightCollapsed
              ? { flex: '1 1 0', minWidth: 0 }
              : createPanelStyle(resolvedMainWidth)
          }
        >
          {renderSkeleton && (
            <div
              className="absolute inset-0 z-10 bg-white"
              style={{
                opacity: isLoading ? 1 : 0,
                transition: `opacity ${TAB_TRANSITION_MS}ms ease`,
                pointerEvents: isLoading ? 'auto' : 'none',
              }}
            >
              <MainPanelSkeleton />
            </div>
          )}

          {renderContent && (
            <div
              className="flex h-full min-h-0 flex-col"
              style={{
                opacity: contentVisible ? 1 : 0,
                transition: `opacity ${TAB_TRANSITION_MS}ms ease`,
              }}
            >
              {mainHeader && (
                <div className="flex shrink-0 z-20 items-center gap-2 border-b border-divider px-6 h-24" style={{ background: 'var(--color-section-header)' }}>
                  {mainHeader.icon && (
                    <div className="text-muted-foreground [&_img]:size-10">
                      {mainHeader.icon}
                    </div>
                  )}

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-base font-semibold text-foreground">
                      {mainHeader.title}
                    </span>

                    {mainHeader.subtitle && (
                      <span className="-mt-0.5 text-xs text-muted-foreground">
                        {mainHeader.subtitle}
                      </span>
                    )}
                  </div>

                  {mainHeader.actions && (
                    <div className="ml-auto flex shrink-0 items-center gap-2">
                      {mainHeader.actions}
                    </div>
                  )}
                </div>
              )}

              <div className="min-h-0 flex-1 overflow-y-auto">
                {main}
              </div>
            </div>
          )}
        </main>

        {hasRight ? (
          <aside
            className={cn(
              'flex h-full min-h-0 flex-col border-l border-divider bg-white transition-all duration-200',
              rightCollapsed
                ? 'overflow-hidden'
                : 'overflow-x-auto overflow-y-auto',
              rightClassName,
            )}
            style={
              rightCollapsed
                ? {
                    width: '40px',
                    flexBasis: '40px',
                    flexGrow: 0,
                    flexShrink: 0,
                  }
                : createPanelStyle(resolvedRightWidth)
            }
          >
            {rightCollapsed && allowCollapseRight && (
              <div className="flex h-full flex-col items-center gap-3 py-3">
                <button
                  onClick={() => setRightCollapsed(false)}
                  className="shrink-0 rounded p-1 text-muted-foreground hover:bg-black/5"
                  title="Expand panel"
                  type="button"
                >
                  <PanelRightOpen className="h-4 w-4" />
                </button>

                {rightHeader && (
                  <div className="flex flex-1 items-center justify-center overflow-hidden">
                    <span
                      className="whitespace-nowrap font-medium text-muted-foreground"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {rightHeader.title}
                    </span>
                  </div>
                )}

                {rightHeader?.icon && (
                  <div className="shrink-0 text-muted-foreground [&_svg]:size-6">
                    {rightHeader.icon}
                  </div>
                )}
              </div>
            )}

            {!rightCollapsed && (
              <>
                {rightHeader && (
                  <div className="flex shrink-0 items-center gap-2 border-b border-divider py-4 pl-4 pr-6" style={{ background: 'var(--color-section-header)' }}>
                    {allowCollapseRight && (
                      <button
                        onClick={() => setRightCollapsed(true)}
                        className="shrink-0 rounded p-1 text-muted-foreground hover:bg-black/5"
                        title="Collapse panel"
                        type="button"
                      >
                        <PanelRightClose className="h-4 w-4" />
                      </button>
                    )}

                    {rightHeader.icon && (
                      <div className="text-muted-foreground [&_svg]:size-8">
                        {rightHeader.icon}
                      </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-base font-semibold text-foreground">
                        {rightHeader.title}
                      </span>

                      {rightHeader.subtitle && (
                        <span className="-mt-0.5 text-xs text-muted-foreground">
                          {rightHeader.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="min-h-0 flex-1 overflow-y-auto">{right}</div>
              </>
            )}
          </aside>
        ) : null}
      </div>
    </div>
  );
}