interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-wide">{title}</h1>
        {subtitle && (
          <span className="block text-sm text-white/70">{subtitle}</span>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
