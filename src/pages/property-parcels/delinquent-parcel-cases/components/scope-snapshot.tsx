import { Sparkles } from 'lucide-react';

interface ScopeSnapshotProps {
    totalCount: number;
    delinquentInScope: number;
    inRemCount: number;
    bankruptcyCount: number;
}

export function ScopeSnapshot({ totalCount, delinquentInScope, inRemCount, bankruptcyCount }: ScopeSnapshotProps) {
    return (
        <div className="flex items-center gap-px bg-muted flex-wrap border-t border-b border-divider">
            <div className="flex items-center gap-2 px-6 py-3 text-xs text-muted-foreground">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium text-foreground">Live Scope Snapshot</span>
            </div>
            <div className="h-4 w-px bg-neutral-300 mx-1" />
            <Stat label="Matching Parcels" value={totalCount} />
            <div className="h-4 w-px bg-neutral-300 mx-1" />
            <Stat label="Delinquent in Scope" value={delinquentInScope} />
            <div className="h-4 w-px bg-neutral-300 mx-1" />
            <Stat label="In Rem" value={inRemCount} />
            <div className="h-4 w-px bg-neutral-300 mx-1" />
            <Stat label="In Bankruptcy" value={bankruptcyCount} />
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2.5 text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-foreground">{value}</span>
        </div>
    );
}
