import { useRef, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Table } from '@tanstack/react-table';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Download, Printer, Maximize2, Minimize2, RefreshCw } from 'lucide-react';

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
    /** Height of sticky elements above this component (e.g. tabs bar). */
    stickyTop?: number;
    /** Optional icon rendered to the left of the title/description. */
    icon?: ReactNode;
    /** Catalis header title. */
    title: string;
    /** Parcel number appended to the print/export document title. */
    parcelNumber?: string;
    /** Catalis header description. */
    description: string;
    /** Search input placeholder. */
    searchPlaceholder?: string;
    /** Controlled global filter value. */
    globalFilter: string;
    onGlobalFilterChange: (v: string) => void;
    /** Dynamic filter dropdowns rendered after the search. Each gets flex-1. */
    filters?: FilterConfig[];
    /** Shows a "Clear" button when true. */
    hasActiveFilters?: boolean;
    onClearFilters?: () => void;
    /** Show the Catalis logo / data-sync gif section in the header. */
    isCatalisData?: boolean;
    /** Timestamp of when the data was last fetched from the API. */
    lastUpdated?: Date | null;
    /** react-table instance. */
    table: Table<T>;
    /** Row count to display in pagination (typically filtered row count). */
    recordCount: number;
    isLoading?: boolean;
    paginationSizes?: number[];
    /** Optional banner rendered between the toolbar and the data grid. */
    banner?: ReactNode;
    /** When true, hides the search input. */
    hideSearch?: boolean;
    /** Extra buttons inserted before the divider/Export/Print buttons. */
    extraToolbarButtons?: ReactNode;
    /** Called when the refresh button is clicked. */
    onRefresh?: () => void;
    /** Optional per-row className callback, receives the raw row data. */
    getRowClassName?: (row: T) => string | undefined;
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
        cols.map((col) => {
            const val = row.getValue(col.id);
            const str = val == null ? '' : String(val);
            return /[,"\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
        }).join(',')
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
    const bodyRows = table.getFilteredRowModel().rows
        .map((row) =>
            `<tr>${cols.map((col) => `<td>${row.getValue(col.id) ?? ''}</td>`).join('')}</tr>`
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

// ─── Elapsed time label ───────────────────────────────────────────────────────

function getElapsedLabel(since: Date | null | undefined): string {
    if (!since) return '';
    const mins = Math.floor((Date.now() - since.getTime()) / 60_000);
    if (mins < 1) return 'Just now';
    if (mins === 1) return '1 min ago';
    if (mins < 60) return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    return hrs === 1 ? '1 hr ago' : `${hrs} hrs ago`;
}

function useElapsedLabel(lastUpdated: Date | null | undefined): string {
    const [label, setLabel] = useState(() => getElapsedLabel(lastUpdated));

    useEffect(() => {
        setLabel(getElapsedLabel(lastUpdated));
        const id = setInterval(() => setLabel(getElapsedLabel(lastUpdated)), 30_000);
        return () => clearInterval(id);
    }, [lastUpdated]);

    return label;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Ready-to-use tab layout with a sticky catalis header, toolbar (search, filters,
 * export, print, refresh, maximize), optional banner, data grid with skeleton
 * loading, and a sticky pagination footer.
 *
 * Usage:
 *   <TabLayout title="My Tab" icon={<Icon />} table={table} recordCount={n}
 *     isLoading={isLoading} onRefresh={refetch} globalFilter={...} ... />
 */
export function TabLayout<T extends object>({
    stickyTop = 0,
    title,
    parcelNumber,
    description,
    searchPlaceholder = 'Search...',
    globalFilter,
    onGlobalFilterChange,
    filters = [],
    hasActiveFilters = false,
    onClearFilters,
    isCatalisData = false,
    lastUpdated,
    icon,
    table,
    recordCount,
    isLoading = false,
    paginationSizes = [10, 25, 50, 100],
    banner,
    hideSearch = false,
    extraToolbarButtons,
    onRefresh,
    getRowClassName,
}: TabLayoutProps<T>) {
    const elapsedLabel = useElapsedLabel(lastUpdated);

    const isEmpty = table.getCoreRowModel().rows.length === 0 && !isLoading;

    const [maximized, setMaximized] = useState(false);

    function handleRefresh() {
        if (isLoading) return;
        onRefresh?.();
    }

    // Close maximized view on Escape
    useEffect(() => {
        if (!maximized) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMaximized(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [maximized]);

    const catalisHeaderRef = useRef<HTMLDivElement>(null);
    const [catalisHeaderHeight, setCatalisHeaderHeight] = useState(0);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [toolbarHeight, setToolbarHeight] = useState(0);

    useEffect(() => {
        const el = catalisHeaderRef.current;
        if (!el) return;
        setCatalisHeaderHeight(el.offsetHeight);
        const obs = new ResizeObserver(() => setCatalisHeaderHeight(el.offsetHeight));
        obs.observe(el);
        return () => obs.disconnect();
    }, [maximized]);

    useEffect(() => {
        const el = toolbarRef.current;
        if (!el) return;
        setToolbarHeight(el.offsetHeight);
        const obs = new ResizeObserver(() => setToolbarHeight(el.offsetHeight));
        obs.observe(el);
        return () => obs.disconnect();
    }, [maximized]);

    // Normal-mode thead top (in maximized mode --thead-top is 0 on the scroll wrapper).
    const theadTop = stickyTop + catalisHeaderHeight + toolbarHeight;

    const catalisHeader = (
        <div
            ref={catalisHeaderRef}
            className='bg-app-primary-toolbar-header pl-6 pr-6 pt-4 pb-4 h-20 flex items-center justify-between z-10'
            style={maximized ? undefined : { position: 'sticky', top: stickyTop }}
        >
            <div className='flex items-center gap-2'>
                {icon && (
                    <div className='shrink-0 text-muted-foreground'>
                        {isLoading
                            ? <img src='/images/loading.gif' className='h-8 w-8 object-contain' alt='Loading' />
                            : icon}
                    </div>
                )}
                <div className='flex flex-col'>
                    <h2 className='text-lg font-semibold text-neutral-900'>
                        {isLoading ? `Loading ${title}...` : title}
                    </h2>
                    <p className='text-sm -mt-1 text-muted-foreground max-w-2xl'>{description}</p>
                </div>
            </div>
            {isCatalisData && (
                <div className='flex items-center gap-2 pl-6 ml-6'>
                    <div className='flex flex-col gap-1 items-end'>
                        <img className='w-26' src='/images/catalis-logo.png' />
                        <span className='text-xs -mt-1 text-muted-foreground'>
                            {elapsedLabel ? `Last updated ${elapsedLabel}` : 'Loading...'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );

    const toolbar = (
        <div
            ref={toolbarRef}
            className='flex items-center gap-2 px-6 py-4 h-14 border-b border-t border-divider bg-app-primary-toolbar-fg z-20'
            style={maximized ? undefined : { position: 'sticky', top: stickyTop + catalisHeaderHeight }}
        >
            {!hideSearch && (
                <div className='relative w-1/2 shrink-0'>
                    <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalFilter}
                        onChange={(e) => onGlobalFilterChange(e.target.value)}
                        className='pl-8 h-8 text-sm w-full'
                        disabled={isEmpty || isLoading}
                    />
                    {globalFilter && (
                        <button
                            onClick={() => onGlobalFilterChange('')}
                            disabled={isLoading}
                            className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50'>
                            <X className='h-3.5 w-3.5' />
                        </button>
                    )}
                </div>
            )}

            {/* Dynamic filter dropdowns — each flex-1 */}
            {filters.map((filter, i) => (
                <Select key={i} value={filter.value} onValueChange={filter.onChange} disabled={isEmpty || isLoading}>
                    <SelectTrigger className='h-8 flex-1 text-sm'>
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
                    variant='ghost'
                    size='sm'
                    onClick={onClearFilters}
                    disabled={isLoading}
                    className='h-8 px-2 text-muted-foreground gap-1 shrink-0'
                >
                    <X className='h-3.5 w-3.5' />
                    Clear
                </Button>
            )}

            {extraToolbarButtons}

            <div className='h-5 w-px bg-divider shrink-0 mx-2' />

            <Button variant='outline' size='sm' className='gap-1.5 shrink-0' disabled={isEmpty || isLoading} onClick={() => exportToCsv(table, parcelNumber ? `${title} - ${parcelNumber}` : title)}>
                <Download className='h-3.5 w-3.5' />
                <span className='text-xs'>Export</span>
            </Button>
            <Button variant='outline' size='sm' className='gap-1.5 shrink-0' disabled={isEmpty || isLoading} onClick={() => printTable(table, parcelNumber ? `${title} — ${parcelNumber}` : title)}>
                <Printer className='h-3.5 w-3.5' />
                <span className='text-xs'>Print</span>
            </Button>

            <div className='h-5 w-px bg-divider shrink-0 mx-2' />

            {/* Refresh + Expand button group */}
            <div className='inline-flex items-center border border-input rounded-md overflow-hidden shrink-0'>
                <button
                    className='h-8 w-8 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50'
                    title='Refresh'
                    disabled={isLoading}
                    onClick={handleRefresh}
                >
                    <RefreshCw className={`h-3.5 w-3.5 transition-transform ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <div className='w-px self-stretch bg-input' />
                <button
                    className='h-8 w-8 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50'
                    title={maximized ? 'Minimize' : 'Maximize'}
                    disabled={isLoading}
                    onClick={() => setMaximized((v) => !v)}
                >
                    {maximized ? <Minimize2 className='h-3.5 w-3.5' /> : <Maximize2 className='h-3.5 w-3.5' />}
                </button>
            </div>
        </div>
    );

    const dataGrid = (
        <DataGrid
            table={table}
            recordCount={recordCount}
            isLoading={isLoading}
            loadingMode='skeleton'
            skeletonRowCount={2}
            tableLayout={{ headerSticky: true }}
            tableClassNames={{ headerSticky: 'sticky z-10 [top:var(--thead-top,0px)]' }}
            getRowClassName={getRowClassName as ((row: unknown) => string | undefined) | undefined}
        >
            <DataGridContainer>
                <DataGridTable />
            </DataGridContainer>
            {!isEmpty && recordCount > paginationSizes[0] && (
                <div className='sticky bottom-0 z-10 border-t border-divider bg-table-footer py-2 [box-shadow:0_1px_0_0_var(--background)]'>
                    <DataGridPagination sizes={paginationSizes} showAll />
                </div>
            )}
        </DataGrid>
    );

    if (maximized) {
        // Flex-column layout: header/banner/toolbar are pinned at top (no sticky needed),
        // only the DataGrid area scrolls. thead sticks at top:0 within its own scroll container.
        return createPortal(
            <div className='fixed inset-0 z-50 bg-background flex flex-col'>
                {catalisHeader}
                {banner}
                {toolbar}
                <div className='flex-1 min-h-0 overflow-y-auto' style={{ '--thead-top': '0px' } as CSSProperties}>
                    {dataGrid}
                </div>
            </div>,
            document.body,
        );
    }

    return (
        <div style={{ '--thead-top': `${theadTop}px` } as CSSProperties}>
            {catalisHeader}
            {banner}
            {toolbar}
            {dataGrid}
        </div>
    );
}
