import { useMemo, useState } from 'react';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider, SliderThumb } from '@/components/ui/slider';
import { FolderOpen, SlidersHorizontal, Sparkles } from 'lucide-react';
import { generateDummyParcels, Parcel, ParcelsTable } from './parcels-table';

type StatusFilter = Parcel['status'] | 'all';

export function ParcelsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [minAmountDue, setMinAmountDue] = useState(0);
  const [onlyNoPayment, setOnlyNoPayment] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [denseRows, setDenseRows] = useState(true);

  const parcels = useMemo(() => generateDummyParcels(120), []);
  const activeStatusFilter = statusFilter === 'all' ? undefined : statusFilter;

  const scopedParcels = useMemo(
    () =>
      parcels.filter((parcel) => {
        if (activeStatusFilter && parcel.status !== activeStatusFilter) {
          return false;
        }

        if (parcel.amountDue < minAmountDue) {
          return false;
        }

        if (onlyNoPayment && parcel.lastPaymentDate !== null) {
          return false;
        }

        if (!search.trim()) {
          return true;
        }

        const searchable = `${parcel.parcelNumber} ${parcel.ownerName} ${parcel.propertyAddress}`.toLowerCase();
        return searchable.includes(search.toLowerCase());
      }),
    [activeStatusFilter, minAmountDue, onlyNoPayment, parcels, search],
  );

  const delinquentCount = scopedParcels.filter((parcel) => parcel.status === 'Delinquent').length;
  const noPaymentCount = scopedParcels.filter((parcel) => parcel.lastPaymentDate === null).length;
  const totalDue = scopedParcels.reduce((sum, parcel) => sum + parcel.amountDue, 0);

  const resetControls = () => {
    setSearch('');
    setStatusFilter('all');
    setMinAmountDue(0);
    setOnlyNoPayment(false);
    setPageSize(10);
    setDenseRows(true);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-hidden">
        <ContentWrapper
          leftWidth="28%"
          mainWidth="72%"
          leftClassName="bg-white"
          mainClassName="p-0"
          left={
            <div className="space-y-3 h-full">

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white border-b p-4">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">Grid Controls</span>
              <span className="text-xs text-muted-foreground -mt-1">Browse and manage all parcels</span>
            </div>
          </div>
        </div>
      
      </div>

      <div className='pl-6 pr-6'>
              <div className="space-y-3">
                    <Label variant="primary">Scope Search</Label>
                    <Input variant="sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Owner, address, or parcel #"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label variant="secondary">Status</Label>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="Delinquent">Delinquent</SelectItem>
                        <SelectItem value="In Plan">In Plan</SelectItem>
                        <SelectItem value="Foreclosure">Foreclosure</SelectItem>
                        <SelectItem value="Flagged">Flagged</SelectItem>
                        <SelectItem value="Current">Current</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label variant="secondary">Minimum Amount Due: ${minAmountDue.toLocaleString()}</Label>
                    <Slider
                      value={[minAmountDue]}
                      min={0}
                      max={50000}
                      step={500}
                      onValueChange={(value) => setMinAmountDue(value[0] ?? 0)}
                    >
                      <SliderThumb />
                    </Slider>
                  </div>

                  <div className="space-y-2">
                    <Label variant="secondary">Rows Per Page</Label>
                    <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 rows</SelectItem>
                        <SelectItem value="25">25 rows</SelectItem>
                        <SelectItem value="50">50 rows</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={onlyNoPayment} onCheckedChange={(checked) => setOnlyNoPayment(checked === true)} id="no-payment" />
                      <Label htmlFor="no-payment" variant="secondary">Only records with no payment</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={denseRows} onCheckedChange={(checked) => setDenseRows(checked === true)} id="dense-rows" />
                      <Label htmlFor="dense-rows" variant="secondary">Dense table rows</Label>
                    </div>
                  </div>

                  <Button onClick={resetControls} size="sm" variant="outline" className="w-full">Reset Panel</Button>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Live Scope Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Matching Parcels</span>
                    <span className="font-semibold">{scopedParcels.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delinquent In Scope</span>
                    <span className="font-semibold">{delinquentCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">No-Payment Records</span>
                    <span className="font-semibold">{noPaymentCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Amount Due</span>
                    <span className="font-semibold">${totalDue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          }
          main={
            <div className="h-full">
              <ParcelsTable
                data={parcels}
                filterStatus={activeStatusFilter}
                externalSearch={search}
                minAmountDue={minAmountDue}
                onlyNoPayment={onlyNoPayment}
                pageSize={pageSize}
                dense={denseRows}
              />
            </div>
          }
        />
      </div>
    </div>
  );
}
