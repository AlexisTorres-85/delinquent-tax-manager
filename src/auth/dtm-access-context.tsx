import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { API_BASE } from '@/lib/api';
import type { DtmAccessData, DtmAccessResponse } from './dtm-access-types';
import { AccessDeniedPage } from '@/pages/auth/access-denied';

// ─── State machine ────────────────────────────────────────────────────────────

type AccessState =
  | { status: 'loading' }
  | { status: 'granted'; data: DtmAccessData }
  | { status: 'denied' }
  | { status: 'error'; message: string };

// ─── Context ──────────────────────────────────────────────────────────────────

interface DtmAccessContextValue {
  userProfile: DtmAccessData['userProfile'] | null;
  accessModules: string[];
  /** Returns true if the given module key is in the user's access list */
  canAccess: (module: string) => boolean;
}

const DtmAccessContext = createContext<DtmAccessContextValue>({
  userProfile: null,
  accessModules: [],
  canAccess: () => false,
});

export function useDtmAccess() {
  return useContext(DtmAccessContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface DtmAccessProviderProps {
  objectId: string;
  children: ReactNode;
}

export function DtmAccessProvider({ objectId, children }: DtmAccessProviderProps) {
  const [state, setState] = useState<AccessState>({ status: 'loading' });

  useEffect(() => {
    if (!objectId) return;

    setState({ status: 'loading' });

    fetch(`${API_BASE}/api/users/check-access/${objectId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json: DtmAccessResponse = await res.json();
        if (json.data?.haveAccessToDTM) {
          setState({ status: 'granted', data: json.data });
        } else {
          setState({ status: 'denied' });
        }
      })
      .catch((err: unknown) => {
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      });
  }, [objectId]);

  if (state.status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Verifying access…</p>
      </div>
    );
  }

  if (state.status === 'denied') {
    return <AccessDeniedPage />;
  }

  if (state.status === 'error') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-destructive font-medium">
          Could not verify your access. Please try again.
        </p>
        <p className="text-xs text-muted-foreground">{state.message}</p>
        <button
          className="text-xs underline text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </div>
    );
  }

  return (
    <DtmAccessContext.Provider
      value={{
        userProfile: state.data.userProfile,
        accessModules: state.data.accessModules,
        canAccess: (mod) => state.data.accessModules.includes(mod),
      }}
    >
      {children}
    </DtmAccessContext.Provider>
  );
}
