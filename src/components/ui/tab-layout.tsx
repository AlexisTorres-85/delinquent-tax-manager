import { useRef, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Table } from '@tanstack/react-table';
import { TAB_TRANSITION_MS } from '@/config/general.config';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Download, Printer, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { DataLoader } from '@/components/ui/data-loader';
import { StatusBadge, StageBadge } from '@/components/ui/parcel-badges';
import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
}

export interface TabLayoutProps<T> {
    stickyTop?: number;
    icon?: ReactNode | string;
    title: string;
    parcelNumber?: string;
    description: string;
    searchPlaceholder?: string;
    globalFilter?: string;
    onGlobalFilterChange?: (v: string) => void;
    filters?: FilterConfig[];
    hasActiveFilters?: boolean;
    onClearFilters?: () => void;
    isCatalisData?: boolean;
    lastUpdated?: Date | null;
    currentStatus?: ParcelStatus;
    currentStage?: ParcelStage;
    table?: Table<T>;
    recordCount?: number;
    isLoading?: boolean;
    isLoadingTable?: boolean;
    paginationSizes?: number[];
    banner?: ReactNode;
    hideSearch?: boolean;
    extraToolbarButtons?: ReactNode;
    onRefresh?: () => void;
    getRowClassName?: (row: T) => string | undefined;
    allowView?: boolean;
    allowEdit?: boolean;
    allowDelete?: boolean;
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    hideHeader?: boolean;
    headerClassName?: string;
    headerActions?: ReactNode;
    children?: ReactNode;
    onHeaderHeightChange?: (height: number) => void;
}

// ─── Export / print utilities ─────────────────────────────────────────────────

function idToLabel(id: string) {
    return id
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
}

function getDataCols<T>(table: Table<T>) {
    return table.getAllColumns().filter((c) => c.id !== 'expand' && c.getIsVisible());
}

function getHeaderLabel<T>(col: ReturnType<Table<T>['getAllColumns']>[number]) {
    const h = col.columnDef.header;
    return typeof h === 'string' ? h : idToLabel(col.id);
}

function exportToCsv<T>(table: Table<T>, filename: string) {
    const cols = getDataCols(table);
    const headers = cols.map((c) => getHeaderLabel(c));

    const csvRows = table.getFilteredRowModel().rows.map((row) =>
        cols
            .map((col) => {
                const val = row.getValue(col.id);
                const str = val == null ? '' : String(val);
                return /[,"\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
            })
            .join(','),
    );

    const csv = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

function printTable<T>(table: Table<T>, title: string) {
    const cols = getDataCols(table);
    const headers = cols.map((c) => getHeaderLabel(c));

    const bodyRows = table
        .getFilteredRowModel()
        .rows.map((row) =>
            `<tr>${cols.map((col) => `<td>${row.getValue(col.id) ?? ''}</td>`).join('')}</tr>`,
        )
        .join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body{font-family:sans-serif;font-size:12px;margin:24px}
    h1{font-size:16px;margin-bottom:12px}
    table{border-collapse:collapse;width:100%}
    th{background:#f4f4f4;text-align:left;padding:6px 10px;border:1px solid #ddd;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
    td{padding:6px 10px;border:1px solid #ddd}
    tr:nth-child(even){background:#fafafa}
  </style>
</head>
<body>
  <h1>${title}</h1>
  <table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=900,height=600');
    if (!win) return;

    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
    win.close();
}

// ─── Tab skeleton ─────────────────────────────────────────────────────────────

function TabSkeleton() {
    return <DataLoader />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TabLayout<T extends object>({
    stickyTop = 0,
    title,
    parcelNumber,
    description,
    searchPlaceholder = 'Search...',
    globalFilter = '',
    onGlobalFilterChange,
    filters = [],
    hasActiveFilters = false,
    onClearFilters,
    lastUpdated: _lastUpdated,
    currentStatus,
    currentStage,
    icon,
    table,
    recordCount = 0,
    isLoading = false,
    isLoadingTable = false,
    paginationSizes = [20, 50, 100],
    banner,
    hideSearch = false,
    extraToolbarButtons,
    onRefresh,
    getRowClassName,
    hideHeader = false,
    children,
    onHeaderHeightChange,
    headerClassName,
    headerActions,
    allowView,
    allowEdit,
    allowDelete,
    onView,
    onEdit,
    onDelete,
}: TabLayoutProps<T>) {

    const isEmpty = !table || (table.getCoreRowModel().rows.length === 0 && !isLoading);

    const [maximized, setMaximized] = useState(false);

    function handleRefresh() {
        if (isLoading) return;
        onRefresh?.();
    }

    useEffect(() => {
        if (!maximized) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMaximized(false);
        };

        document.addEventListener('keydown', handler);

        return () => document.removeEventListener('keydown', handler);
    }, [maximized]);

    const [renderSkeleton, setRenderSkeleton] = useState(isLoading);
    const [renderContent, setRenderContent] = useState(!isLoading);
    const [contentVisible, setContentVisible] = useState(!isLoading);

    const catalisHeaderRef = useRef<HTMLDivElement>(null);
    const [catalisHeaderHeight, setCatalisHeaderHeight] = useState(0);

    const bannerRef = useRef<HTMLDivElement>(null);
    const [bannerHeight, setBannerHeight] = useState(0);

    const toolbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = catalisHeaderRef.current;
        if (!el) return;

        const update = () => {
            const h = el.offsetHeight;
            setCatalisHeaderHeight(h);
            onHeaderHeightChange?.(h);
        };

        update();

        const obs = new ResizeObserver(update);
        obs.observe(el);

        return () => obs.disconnect();
    }, [maximized, onHeaderHeightChange, renderContent, table, hideSearch, filters.length]);

    useEffect(() => {
        const el = bannerRef.current;
        if (!el) return;

        const update = () => setBannerHeight(el.offsetHeight);

        update();

        const obs = new ResizeObserver(update);
        obs.observe(el);

        return () => obs.disconnect();
    }, [maximized, banner, renderContent]);

    useEffect(() => {
        if (!isLoading) {
            setRenderContent(true);

            const raf = requestAnimationFrame(() => {
                setContentVisible(true);
            });

            const t = setTimeout(() => {
                setRenderSkeleton(false);
            }, TAB_TRANSITION_MS);

            return () => {
                cancelAnimationFrame(raf);
                clearTimeout(t);
            };
        }

        setRenderSkeleton(true);
        setRenderContent(false);
        setContentVisible(false);
    }, [isLoading]);

    const theadTop = stickyTop + (hideHeader ? 0 : catalisHeaderHeight) + bannerHeight;

    const TabHeader = (
        <div
            ref={catalisHeaderRef}
            className={`relative z-10 flex flex-col overflow-hidden border-t-3 border-t-app-secondary shadow-xl${headerClassName ? ` ${headerClassName}` : ''
                }`}
            style={{
                background: 'var(--parcel-header-background)',
                ...(maximized ? {} : { position: 'sticky' as const, top: stickyTop }),
            }}
        >
            <div
          className="pointer-events-none h-94 absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'var(--parcel-header-texture)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

            {/* Header row */}
            <div className="relative z-10 h-26 flex items-center justify-between gap-6 px-6 py-5">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    {icon && (
                        <div className="shrink-0 [&_img]:size-12 [&_img]:brightness-0 [&_img]:invert [&_svg]:size-9 text-white">
                            {typeof icon === 'string' ? <img src={icon} alt="" /> : icon}
                        </div>
                    )}

                    <div className="flex min-w-0 flex-col gap-1.5 -mt-1">
                        <h2 className="truncate text-2xl font-semibold text-white">
                            {title}
                        </h2>

                        {description && (
                            <p className="-mt-1 max-w-2xl truncate text-xs text-white/80">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="ml-auto flex shrink-0 flex-col items-end justify-center gap-2">
                    {(currentStatus || currentStage) && (
                        <div className="flex items-center gap-2">
                            {currentStatus && <StatusBadge status={currentStatus} />}
                            {currentStage && <StageBadge stage={currentStage} />}
                        </div>
                    )}

                    <div className={`flex items-center justify-end gap-2${headerActions ? '' : ' invisible'}`}>
                        {headerActions ?? <span className="h-8" />}
                    </div>
                </div>
            </div>

            {/* Toolbar row - now part of the polygon header */}
            {table && (
                <div
                    ref={toolbarRef}
                    className="relative z-10 flex h-18 items-center gap-2 px-6 bg-white/20 border-t border-white/30"
                >
                    {!hideSearch && (
                        <div className={`relative shrink-0 ${filters.length > 0 ? 'w-1/2' : 'flex-1'}`}>
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-black" />

                            <Input
                                placeholder={searchPlaceholder}
                                value={globalFilter}
                                onChange={(e) => onGlobalFilterChange?.(e.target.value)}
                                disabled={isEmpty || isLoading}
                                className="h-8 w-full pl-8 pr-8 text-sm text-foreground"
                            />

                            {globalFilter && (
                                <button
                                    onClick={() => onGlobalFilterChange?.('')}
                                    disabled={isLoading}
                                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-50"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    )}

                    {filters.map((filter, i) => (
                        <Select
                            key={i}
                            value={filter.value}
                            onValueChange={filter.onChange}
                            disabled={isEmpty || isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={filter.placeholder ?? 'All'} />
                            </SelectTrigger>

                            <SelectContent>
                                {filter.options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}

                    {hasActiveFilters && onClearFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            disabled={isLoading}
                        >
                            <X className="h-3.5 w-3.5" />
                            Clear
                        </Button>
                    )}

                    {extraToolbarButtons}

                    <div className="mx-2 h-5 w-px shrink-0 bg-white/15" />

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isEmpty || isLoading}
                        onClick={() =>
                            table &&
                            exportToCsv(table, parcelNumber ? `${title} - ${parcelNumber}` : title)
                        }
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span className="text-xs">Export</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isEmpty || isLoading}
                        onClick={() =>
                            table &&
                            printTable(table, parcelNumber ? `${title} — ${parcelNumber}` : title)
                        }
                    >
                        <Printer className="h-3.5 w-3.5" />
                        <span className="text-xs">Print</span>
                    </Button>

                    <div className="mx-2 h-5 w-px shrink-0 bg-white/15" />

                    <Button
                        variant="outline"
                        size="sm"
                        title="Refresh"
                        disabled={isLoading}
                        onClick={handleRefresh}
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 transition-transform ${isLoading ? 'animate-spin' : ''
                                }`}
                        />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        title={maximized ? 'Minimize' : 'Maximize'}
                        disabled={isLoading}
                        onClick={() => setMaximized((v) => !v)}
                    >
                        {maximized ? (
                            <Minimize2 className="h-3.5 w-3.5" />
                        ) : (
                            <Maximize2 className="h-3.5 w-3.5" />
                        )}
                    </Button>
                </div>
            )}
        </div>
    );

    const dataGrid = table ? (
        <DataGrid
            table={table}
            recordCount={recordCount}
            isLoading={isLoadingTable || isLoading}
            loadingMode="skeleton"
            skeletonRowCount={2}
            tableLayout={{ headerSticky: true }}
            tableClassNames={{ headerSticky: 'sticky z-10 [top:var(--thead-top,0px)]' }}
            getRowClassName={getRowClassName as ((row: unknown) => string | undefined) | undefined}
            allowView={allowView}
            allowEdit={allowEdit}
            allowDelete={allowDelete}
            onView={onView as ((row: unknown) => void) | undefined}
            onEdit={onEdit as ((row: unknown) => void) | undefined}
            onDelete={onDelete as ((row: unknown) => void) | undefined}
        >
            <DataGridContainer>
                <DataGridTable />
            </DataGridContainer>

            {!isEmpty && recordCount > paginationSizes[0] && (
                <div className="sticky bottom-0 z-10 border-t border-divider bg-table-footer py-2 [box-shadow:0_1px_0_0_var(--background)]">
                    <DataGridPagination sizes={paginationSizes} showAll />
                </div>
            )}
        </DataGrid>
    ) : null;

    if (maximized) {
        return createPortal(
            <div className="fixed inset-0 z-50 flex flex-col bg-background">
                {renderContent && (
                    <div
                        style={{
                            opacity: contentVisible ? 1 : 0,
                            transition: `opacity ${TAB_TRANSITION_MS}ms ease`,
                        }}
                    >
                        {!hideHeader && TabHeader}
                        {banner}
                    </div>
                )}

                <div
                    className="relative min-h-0 flex-1 overflow-y-auto"
                    style={{ '--thead-top': '0px' } as CSSProperties}
                >
                    {renderSkeleton && (
                        <div
                            style={
                                {
                                    opacity: isLoading ? 1 : 0,
                                    transition: `opacity ${TAB_TRANSITION_MS}ms ease`,
                                    ...(!isLoading
                                        ? {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            pointerEvents: 'none',
                                            zIndex: 1,
                                            overflow: 'hidden',
                                        }
                                        : {}),
                                } as CSSProperties
                            }
                        >
                            <TabSkeleton />
                        </div>
                    )}

                    {renderContent && (
                        <div
                            style={{
                                opacity: contentVisible ? 1 : 0,
                                transition: `opacity ${TAB_TRANSITION_MS}ms ease`,
                            }}
                        >
                            {dataGrid}
                            {!table && children}
                        </div>
                    )}
                </div>
            </div>,
            document.body,
        );
    }

    return (
        <div style={{ position: 'relative', '--thead-top': `${theadTop}px` } as CSSProperties}>
            {renderSkeleton && (
                <div
                    style={
                        {
                            opacity: isLoading ? 1 : 0,
                            transition: `opacity ${TAB_TRANSITION_MS}ms ease`,
                            ...(!isLoading
                                ? {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                    overflow: 'hidden',
                                }
                                : {}),
                        } as CSSProperties
                    }
                >
                    <TabSkeleton />
                </div>
            )}

            {renderContent && (
                <div
                    style={{
                        opacity: contentVisible ? 1 : 0,
                        transition: `opacity ${TAB_TRANSITION_MS}ms ease`,
                    }}
                >
                    {!hideHeader && TabHeader}

                    {banner && (
                        <div
                            ref={bannerRef}
                            className="sticky z-10"
                            style={{
                                top: stickyTop + (hideHeader ? 0 : catalisHeaderHeight),
                            }}
                        >
                            {banner}
                        </div>
                    )}

                    {dataGrid}

                    {!table && children}
                </div>
            )}
        </div>
    );
}