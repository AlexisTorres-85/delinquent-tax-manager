import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/utils';

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
}: ContentWrapperProps) {
  const hasLeft = left !== undefined;
  const hasRight = right !== undefined;

  const resolvedLeftWidth = leftWidth ?? '33.333333%';
  const resolvedRightWidth = rightWidth ?? '33.333333%';
  const resolvedMainWidth = mainWidth ?? getDefaultMainWidth(hasLeft, hasRight);

  return (
    <div className={cn('flex h-full min-h-0 min-w-0 overflow-hidden bg-white', className)}>
      {hasLeft ? (
        <aside
          className={cn('h-full min-h-0 overflow-x-auto overflow-y-auto border-r bg-white', leftClassName)}
          style={createPanelStyle(resolvedLeftWidth)}
        >
          {left}
        </aside>
      ) : null}

      <main
        className={cn('h-full min-h-0 min-w-0 overflow-x-auto overflow-y-auto bg-white', mainClassName)}
        style={createPanelStyle(resolvedMainWidth)}
      >
        {main}
      </main>

      {hasRight ? (
        <aside
          className={cn('h-full min-h-0 overflow-x-auto overflow-y-auto border-l bg-white', rightClassName)}
          style={createPanelStyle(resolvedRightWidth)}
        >
          {right}
        </aside>
      ) : null}
    </div>
  );
}