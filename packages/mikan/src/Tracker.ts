/**
 * @fileOverview Google Analytics convenience methods
 */
import { getCurrentUrl } from "./utils";

/**
 * page tracking
 *
 *
 * @example
 *  <script async src="https://www.googletagmanager.com/gtag/js?id=<%= trackingCode %>"></script>
 *  <script>
 *    window.dataLayer = window.dataLayer || [];
 *    function gtag() {
 *      dataLayer.push(arguments);
 *    }
 *
 *    // important!!
 *    window.__TRACKING_CODE__ = '<%= trackingCode %>'
 *
 *    gtag('js', new Date());
 *    gtag('config', '<%= trackingCode %>', {'send_page_view': false});
 *
 * @param pagePath
 * @link https://developers.google.com/analytics/devguides/collection/gtagjs/pages?hl=ja
 */
export function tracePage(pagePath?: string) {
  const trackingCode = (<any>window)["__TRACKING_CODE__"];
  const page_location = getCurrentUrl();
  const page_path = pagePath || location.pathname + location.hash;

  // @ts-ignore
  gtag("config", trackingCode, {
    page_title: document.title,
    page_location,
    page_path
  });
}

/**
 *
 * @param action
 * @param category
 * @param label
 * @param value
 * @link https://developers.google.com/analytics/devguides/collection/gtagjs/events?hl=ja
 */
export function trackEvent(
  action: string,
  {
    category,
    label,
    value
  }: { category?: string; label?: string; value?: number }
) {
  const params: { [key: string]: string | number } = {};
  if (category) {
    params.event_category = category;
  }
  if (label) {
    params.event_label = label;
  }
  if (value) {
    params.value = value;
  }

  // @ts-ignore
  gtag("event", action, params);
}

/**
 *
 * @param name
 * @param value
 * @param optionalParams
 * @link https://developers.google.com/analytics/devguides/collection/gtagjs/user-timings?hl=ja
 */
export function trackTiming(
  name: string,
  value: number,
  optionalParams: {
    category?: string | "assets";
    label?: string;
  } = {}
) {
  // @ts-ignore
  gtag("event", "timing_complete", {
    name,
    value,
    event_category: optionalParams.category,
    event_label: optionalParams.label
  });
}
