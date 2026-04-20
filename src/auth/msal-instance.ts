import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msal-config';

// Singleton – shared across the whole app.
export const msalInstance = new PublicClientApplication(msalConfig);
