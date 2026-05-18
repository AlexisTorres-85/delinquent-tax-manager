import { ReactNode } from 'react';
import { useMsalAuthentication } from '@azure/msal-react';
import { InteractionStatus, InteractionType } from '@azure/msal-browser';
import { useAuth } from './use-auth';
import { loginRequest } from './msal-config';
import { DtmAccessProvider } from './dtm-access-context';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Renders children only when authenticated.
 *
 * Flow:
 *  1. Not authenticated + inProgress === None  → useMsalAuthentication fires a redirect to Azure
 *  2. Coming back from Azure (inProgress === HandleRedirect) → shows "Signing in…" while MSAL processes the response
 *  3. Authenticated → renders children
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Must be called unconditionally (not inside AuthenticatedTemplate) so it
  // actually triggers the redirect when the user is unauthenticated.
  useMsalAuthentication(InteractionType.Redirect, loginRequest);

  const { isAuthenticated, inProgress, objectId } = useAuth();

  // MSAL is actively doing something (handling redirect response, acquiring token, etc.)
  if (inProgress !== InteractionStatus.None) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-muted-foreground text-sm">Signing in…</div>
      </div>
    );
  }

  // inProgress is None but not yet authenticated — redirect is about to fire
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-muted-foreground text-sm">Redirecting to login…</div>
      </div>
    );
  }

  return (
    <DtmAccessProvider objectId={objectId}>
      {children}
    </DtmAccessProvider>
  );
}
