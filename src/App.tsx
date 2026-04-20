import { AppRouting } from '@/routing/app-routing';
import { AuthProvider } from '@/auth';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';

const { BASE_URL } = import.meta.env;

export function App() {
  return (
    <AuthProvider>
      <LoadingBarContainer>
        <BrowserRouter basename={BASE_URL}>
          <Toaster />
          <AppRouting />
        </BrowserRouter>
      </LoadingBarContainer>
    </AuthProvider>
  );
}
