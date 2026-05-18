import { AppRouting } from '@/routing/app-routing';
import { AuthProvider } from '@/auth';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QUERY_REFETCH_INTERVAL_MS } from '@/config/general.config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchInterval: QUERY_REFETCH_INTERVAL_MS,
      refetchIntervalInBackground: false, // pause polling when the tab is hidden
    },
  },
});

const { BASE_URL } = import.meta.env;

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingBarContainer>
          <BrowserRouter basename={BASE_URL}>
            <Toaster />
            <AppRouting />
          </BrowserRouter>
        </LoadingBarContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
