import {
  useIsAuthenticated,
  useMsal,
} from '@azure/msal-react';
import {
  AccountInfo,
  InteractionRequiredAuthError,
  SilentRequest,
} from '@azure/msal-browser';
import { useCallback } from 'react';
import { loginRequest, tokenRequest } from './msal-config';

// ---------------------------------------------------------------------------
// useAuth – primary hook for login / logout / user info
// ---------------------------------------------------------------------------
export function useAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const account: AccountInfo | null = accounts[0] ?? null;

  const login = useCallback(() => {
    instance.loginPopup(loginRequest).catch(console.error);
  }, [instance]);

  const logout = useCallback(() => {
    instance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
    }).catch(console.error);
  }, [instance]);

  return {
    isAuthenticated,
    inProgress,
    account,
    login,
    logout,
    /** Display name from the ID token, falls back to username */
    displayName: account?.name ?? account?.username ?? '',
    /** Primary email / UPN */
    email: account?.username ?? '',
  };
}

// ---------------------------------------------------------------------------
// useAccessToken – silently acquire a token; triggers popup if needed
// ---------------------------------------------------------------------------
export function useAccessToken() {
  const { instance, accounts } = useMsal();

  const getToken = useCallback(async (): Promise<string | null> => {
    const account = accounts[0];
    if (!account) return null;

    const request: SilentRequest = { ...tokenRequest, account };

    try {
      const result = await instance.acquireTokenSilent(request);
      return result.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const result = await instance.acquireTokenPopup(request);
        return result.accessToken;
      }
      console.error('Failed to acquire token', error);
      return null;
    }
  }, [instance, accounts]);

  return { getToken };
}
