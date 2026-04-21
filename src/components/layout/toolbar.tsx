import { ReactNode } from 'react';

function Toolbar({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between p-4 bg-muted border-b">
      {children}
    </div>
  );
}

function ToolbarActions({ children }: { children?: ReactNode }) {
  return <div className="flex items-center gap-2.5">{children}</div>;
}

function ToolbarHeading ({ children }: { children: ReactNode }) {
  return <div className="flex flex-col justify-center gap-2">{children}</div>;
}

function ToolbarPageTitle ({ children }: { children?: string }) {
  return (
    <h1 className="text-base font-medium leading-none text-foreground">
      {children}
    </h1>
  );
};

function ToolbarDescription ({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center text-xs -mt-1 font-normal text-muted-foreground">
      {children}
    </p>
  );
};

export {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarPageTitle,
  ToolbarDescription,
};
