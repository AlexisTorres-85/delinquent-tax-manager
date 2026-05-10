import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Search } from 'lucide-react';
import { CatalisSearchForm } from './components/catalis-search-form';

export function CatalisParcelSearchPage() {
  return (
    <ContentWrapper
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Property Parcels', href: '/property-parcels' },
        { label: 'Catalis Parcel Search' },
      ]}
      mainHeader={{
        icon: <Search className="h-6 w-6" />,
        title: 'Catalis Parcel Search',
        subtitle: 'Search for parcels using the Catalis integration',
      }}
      mainClassName="p-0"
      main={<CatalisSearchForm />}
    />
  );
}
