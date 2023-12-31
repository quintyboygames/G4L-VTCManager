// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
console.log(process.env.NODE_ENV)
Sentry.init({
  dsn: SENTRY_DSN || 'https://27a4b342f56f4d6290a5303b9276235f@o1249248.ingest.sentry.io/6436432',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  environment: process.env.NODE_ENV,

  enabled: process.env.NODE_ENV !== "development"
});
