import { Sparkles } from 'lucide-react';


interface ScopeSnapshotProps {
    scopedCount: number;
    delinquentCount: number;
    noPaymentCount: number;
    totalDue: number;
}

export function ScopeSnapshot({ scopedCount, delinquentCount, noPaymentCount, totalDue }: ScopeSnapshotProps) {
    return (
        <div className="flex items-center gap-px bg-neutral-100 border-b border-divider">
            <div className="flex items-center gap-2 px-6 pt-4 pb-4 text-xs text-muted-foreground">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium text-foreground">Live Scope Snapshot</span>
            </div>
            <div className="h-4 w-px bg-neutral-300 mx-1" />
            <Stat label="Matching Parcels" value={scopedCount} />
            <div className="h-4 w-px bg-neutral-300 mx-1" />
            <Stat label="Delinquent in Scope" value={delinquentCount} />
            <div className="h-4 w-px bg-neutral-300 mx-1" />
            <Stat label="No-Payment Records" value={noPaymentCount} />
            <div className="h-4 w-px bg-neutral-300 mx-1" />
            <Stat label="Total Amount Due" value={`$${totalDue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} />
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
