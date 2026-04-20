import { Configuration, LogLevel, PopupRequest } from '@azure/msal-browser';

// ---------------------------------------------------------------------------
// All values come from environment variables so you only need to change the
// .env.development / .env.production files when switching environments.
// ---------------------------------------------------------------------------

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID as string;
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI as string;

if (!clientId || !tenantId || !redirectUri) {
  throw new Error(
    'Missing Azure Entra configuration. ' +
      'Make sure VITE_AZURE_CLIENT_ID, VITE_AZURE_TENANT_ID, and ' +
      'VITE_AZURE_REDIRECT_URI are set in your .env file.',
  );
}

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage', // sessionStorage is safer; use 'localStorage' to persist across tabs
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (import.meta.env.DEV) {
          switch (level) {
            case LogLevel.Error:   console.error(message); break;
            case LogLevel.Warning: console.warn(message);  break;
            case LogLevel.Info:    console.info(message);  break;
            case LogLevel.Verbose: console.debug(message); break;
          }
        }
      },
    },
  },
};

// Scopes requested on sign-in.
export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

// Scopes used when acquiring a token to call your C# API.
// Must match the scope you exposed in Azure portal → "Expose an API".
const apiClientId = import.meta.env.VITE_AZURE_CLIENT_ID as string;
export const tokenRequest: PopupRequest = {
  scopes: [`api://${apiClientId}/access_as_user`],
};
