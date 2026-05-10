import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import { CatalisResultsTable } from './catalis-results-table';
import { useCatalisSearch } from '@/data/catalis/hooks/use-catalis-search';
import type { CatalisSearchParams } from '@/data/catalis/types';
type SearchField = CatalisSearchParams['searchField'];

interface QuickFilters {
  county: string;
  status: string;
  propertyType: string;
  taxYear: string;
}

interface AdvancedFilters {
  parcelNumber: string;
  ownerFirstName: string;
  ownerLastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zip: string;
  minTaxAmount: string;
  maxTaxAmount: string;
  delinquencyStatus: string;
}

export function CatalisSearchForm() {
  const [query, setQuery] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('all');
  const [quickFilters, setQuickFilters] = useState<QuickFilters>({
    county: '', status: '', propertyType: '', taxYear: '',
  });
  const [advanced, setAdvanced] = useState<AdvancedFilters>({
    parcelNumber: '', ownerFirstName: '', ownerLastName: '',
    addressLine1: '', addressLine2: '', city: '', zip: '',
    minTaxAmount: '', maxTaxAmount: '', delinquencyStatus: '',
  });
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const { results, isLoading, hasSearched, search } = useCatalisSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search({
      query,
      searchField,
      county: quickFilters.county,
      status: quickFilters.status,
      propertyType: quickFilters.propertyType,
      taxYear: quickFilters.taxYear,
      parcelNumber: advanced.parcelNumber,
      ownerFirstName: advanced.ownerFirstName,
      ownerLastName: advanced.ownerLastName,
      addressLine1: advanced.addressLine1,
      city: advanced.city,
      zip: advanced.zip,
      minTaxAmount: advanced.minTaxAmount,
      maxTaxAmount: advanced.maxTaxAmount,
      delinquencyStatus: advanced.delinquencyStatus,
    });
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background">
      <div className="px-6 pt-4 pb-6 border-b border-divider">
        <div className="flex items-center justify-between mb-3">
          <img
            src="/images/catalis-logo.png"
            alt="Catalis"
            className="h-6 object-contain"
          />
        </div>
        <form onSubmit={handleSearch} className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Search"
              labelVariant="primary"
              placeholder="Search by Parcel Number, Owner Name, or Address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="w-48">
            <SelectField
              label="Search Field"
              labelVariant="primary"
              value={searchField}
              onValueChange={(v) => setSearchField((v || 'all') as SearchField)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="parcelNumber">Parcel Number</SelectItem>
                <SelectItem value="ownerName">Owner Name</SelectItem>
                <SelectItem value="address">Address</SelectItem>
              </SelectContent>
            </SelectField>
          </div>
          <Button type="submit" variant="primary" className="h-9 shrink-0" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
        <div className="flex flex-wrap gap-3 items-end mt-3">
          <div className="w-44">
            <SelectField
              label="County"
              labelVariant="primary"
              value={quickFilters.county}
              onValueChange={(v) => setQuickFilters((f) => ({ ...f, county: v || '' }))}
            >
              <SelectTrigger><SelectValue placeholder="All Counties" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                <SelectItem value="Kenosha">Kenosha</SelectItem>
                <SelectItem value="Racine">Racine</SelectItem>
              </SelectContent>
            </SelectField>
          </div>
          <div className="w-44">
            <SelectField
              label="Status in Catalis"
              labelVariant="primary"
              value={quickFilters.status}
              onValueChange={(v) => setQuickFilters((f) => ({ ...f, status: v || '' }))}
            >
              <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Delinquent">Delinquent</SelectItem>
                <SelectItem value="Foreclosure">Foreclosure</SelectItem>
                <SelectItem value="Exempt">Exempt</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </SelectField>
          </div>
          <div className="w-44">
            <SelectField
              label="Property Type"
              labelVariant="primary"
              value={quickFilters.propertyType}
              onValueChange={(v) => setQuickFilters((f) => ({ ...f, propertyType: v || '' }))}
            >
              <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Agricultural">Agricultural</SelectItem>
                <SelectItem value="Vacant">Vacant Land</SelectItem>
              </SelectContent>
            </SelectField>
          </div>
          <div className="w-36">
            <SelectField
              label="Tax Year"
              labelVariant="primary"
              value={quickFilters.taxYear}
              onValueChange={(v) => setQuickFilters((f) => ({ ...f, taxYear: v || '' }))}
            >
              <SelectTrigger><SelectValue placeholder="Any Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Year</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </SelectField>
          </div>
        </div>
      </div>

      {/* Advanced filters */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full px-6 py-2.5 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-neutral-100 hover:bg-muted/20 transition-colors text-left border-b border-divider"
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`} />
            Advanced Search
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 py-6 bg-white border-b border-divider">
            <div className="grid grid-cols-4 gap-x-4 gap-y-3">
              <Input
                label="Parcel Number (exact match)"
                labelVariant="primary"
                value={advanced.parcelNumber}
                onChange={(e) => setAdvanced((a) => ({ ...a, parcelNumber: e.target.value }))}
                placeholder="e.g. CTL-001-0001"
              />
              <Input
                label="Owner First Name"
                labelVariant="primary"
                value={advanced.ownerFirstName}
                onChange={(e) => setAdvanced((a) => ({ ...a, ownerFirstName: e.target.value }))}
              />
              <Input
                label="Owner Last Name"
                labelVariant="primary"
                value={advanced.ownerLastName}
                onChange={(e) => setAdvanced((a) => ({ ...a, ownerLastName: e.target.value }))}
              />
              <SelectField
                label="Delinquency Status"
                labelVariant="primary"
                value={advanced.delinquencyStatus}
                onValueChange={(v) => setAdvanced((a) => ({ ...a, delinquencyStatus: v || '' }))}
              >
                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Delinquent">Delinquent</SelectItem>
                </SelectContent>
              </SelectField>
              <Input
                label="Address Line 1"
                labelVariant="primary"
                value={advanced.addressLine1}
                onChange={(e) => setAdvanced((a) => ({ ...a, addressLine1: e.target.value }))}
              />
              <Input
                label="Address Line 2"
                labelVariant="primary"
                value={advanced.addressLine2}
                onChange={(e) => setAdvanced((a) => ({ ...a, addressLine2: e.target.value }))}
              />
              <Input
                label="City"
                labelVariant="primary"
                value={advanced.city}
                onChange={(e) => setAdvanced((a) => ({ ...a, city: e.target.value }))}
              />
              <Input
                label="ZIP Code"
                labelVariant="primary"
                value={advanced.zip}
                onChange={(e) => setAdvanced((a) => ({ ...a, zip: e.target.value }))}
              />
              <Input
                label="Min Tax Amount ($)"
                labelVariant="primary"
                value={advanced.minTaxAmount}
                onChange={(e) => setAdvanced((a) => ({ ...a, minTaxAmount: e.target.value }))}
                placeholder="0.00"
              />
              <Input
                label="Max Tax Amount ($)"
                labelVariant="primary"
                value={advanced.maxTaxAmount}
                onChange={(e) => setAdvanced((a) => ({ ...a, maxTaxAmount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      </div>

      {/* Results */}
      <div>
        <CatalisResultsTable results={results} hasSearched={hasSearched} isLoading={isLoading} />
      </div>
    </div>
  );
}
