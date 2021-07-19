/**
 * @fileOverview
 * @see https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/lib/gtag.js
 */

export const GA_TRACKING_ID = process.env.APP_TRACKING_CODE;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  (window as any).gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (params: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}) => {
  (window as any).gtag("event", params.action, {
    event_category: params.category,
    event_label: params.label,
    value: params.value,
  });
};
