const generalSettings = {
  purchaseLink: '',
  docsLink: '',
  licenseLink: '',
  devsLink: '',
  faqLink: '',
  aboutLink: '',
};

export const layoutDimensions = {
  headerHeight: '90px',
  sidebarWidth: '70px',
  sidebarMenuWidth: '250px',
};

/** Simulated API delay for dummy data services (ms). Set to 0 in production. */
export const FAKE_API_DELAY_MS = 500;

/** Fade-in / fade-out duration for skeleton → content transitions (ms). */
export const TAB_TRANSITION_MS = 100;

/** How often active queries are refetched in the background to stay fresh (ms). */
export const QUERY_REFETCH_INTERVAL_MS = 1000 * 60 * 60 * 3; // 3 hours

export { generalSettings };
