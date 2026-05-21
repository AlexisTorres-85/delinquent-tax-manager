import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CatalisResultsTable } from './catalis-results-table';
import { useCatalisSearch } from '@/data/catalis/hooks/use-catalis-search';
import { useMunicipalities } from '@/data/municipalities';
import type { CatalisSearchParams } from '@/data/catalis/types';
type SearchField = CatalisSearchParams['searchField'];

const TAX_YEAR_OPTIONS = ['2026', '2025', '2024', '2023', '2022'];

interface QuickFilters {
  municipality: string;
  taxYear: string[];
  delinquencyStatus: string;
}

function TaxYearMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (year: string) => {
    onChange(value.includes(year) ? value.filter((y) => y !== year) : [...value, year]);
  };

  const label =
    value.length === 0
      ? 'Any Year'
      : value.length === 1
        ? value[0]
        : `${value.length} years selected`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label variant="primary">Tax Year</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between font-normal', value.length === 0 && 'text-muted-foreground')}
          >
            {label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {TAX_YEAR_OPTIONS.map((year) => (
                  <CommandItem key={year} value={year} onSelect={() => toggle(year)}>
                    <Check className={cn('mr-2 h-4 w-4', value.includes(year) ? 'opacity-100' : 'opacity-0')} />
                    {year}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function CatalisSearchForm() {
  const [query, setQuery] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('parcelNumber');

  const searchPlaceholderMap: Record<SearchField, string> = {
    parcelNumber: 'Search by Parcel Number',
    ownerName: 'Search by Owner Name',
    address: 'Search by Address',
    all: 'Search by Parcel Number, Owner Name, or Address',
  };
  const [quickFilters, setQuickFilters] = useState<QuickFilters>({
    municipality: '', taxYear: [], delinquencyStatus: '',
  });

  const municipalities = useMunicipalities();
  const municipalityOptions = [
    { value: 'any', label: 'Any Municipality' },
    ...municipalities.map((m) => ({ value: m.code, label: m.description })),
  ];

  const { results, isLoading, hasSearched, search } = useCatalisSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search({
      query,
      searchField,
      municipality: quickFilters.municipality,
      taxYear: quickFilters.taxYear,
      delinquencyStatus: quickFilters.delinquencyStatus,
    });
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-muted">
        <div className="px-6 pt-4 pb-6 border-b border-divider">
          <div className="flex items-center justify-between mb-3">
            <img
              src="/images/catalis-logo.webp"
              alt="Catalis"
              className="h-10 object-contain"
            />
          </div>
          <div className="border-t border-divider mb-3" />
          <p className="text-sm mb-3">
            Search the Catalis database for parcel records by owner name, parcel number, or address. Use the filters below to narrow results by municipality, tax year, or delinquency status.
          </p>
          <div className="border-t border-divider mb-3" />
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            {/* Row 1: Search Field + Search input */}
            <div className="grid grid-cols-[200px_1fr] gap-3 items-end">
              <SelectField
                label="Search Field"
                labelVariant="primary"
                value={searchField}
                onValueChange={(v) => setSearchField((v || 'parcelNumber') as SearchField)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parcelNumber">Parcel Number</SelectItem>
                  <SelectItem value="ownerName">Owner Name</SelectItem>
                  <SelectItem value="address">Address</SelectItem>
                </SelectContent>
              </SelectField>
              <Input
                label="Search"
                labelVariant="primary"
                placeholder={searchPlaceholderMap[searchField]}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {/* Row 2: Filter dropdowns */}
            <div className="grid grid-cols-3 gap-3 items-end">
              <Combobox
                label="Municipality"
                labelVariant="primary"
                options={municipalityOptions}
                value={quickFilters.municipality || 'any'}
                onValueChange={(v) => setQuickFilters((f) => ({ ...f, municipality: v === 'any' ? '' : v }))}
                placeholder="Any Municipality"
                searchPlaceholder="Search municipality..."
              />
              <TaxYearMultiSelect
                value={quickFilters.taxYear}
                onChange={(v) => setQuickFilters((f) => ({ ...f, taxYear: v }))}
              />
              <SelectField
                label="Delinquency Status"
                labelVariant="primary"
                value={quickFilters.delinquencyStatus}
                onValueChange={(v) => setQuickFilters((f) => ({ ...f, delinquencyStatus: v || '' }))}
              >
                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Delinquent">Delinquent Only</SelectItem>
                  <SelectItem value="Current">Current / No Balance</SelectItem>
                </SelectContent>
              </SelectField>
            </div>
            {/* Row 3: Divider + Search button */}
            <div className="border-t border-divider pt-3 flex justify-start">
              <Button type="submit" variant="primary" className="h-9" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isLoading ? 'Searching...' : 'Search Catalis'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div>
        <CatalisResultsTable results={results} hasSearched={hasSearched} isLoading={isLoading} />
      </div>
    </div>
  );
}
