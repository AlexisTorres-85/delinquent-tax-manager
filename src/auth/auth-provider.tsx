import { ReactNode } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './msal-instance';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Wrap your entire app with this provider.
 * It initialises the MSAL PublicClientApplication singleton and makes
 * all MSAL hooks available throughout the component tree.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
