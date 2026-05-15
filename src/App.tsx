import { AppRouting } from '@/routing/app-routing';
import { AuthProvider } from '@/auth';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
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
