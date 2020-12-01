/**
 * @fileOverview Google Analytics convenience methods
 *
 * @example
 *  <!-- Global site tag (tracker.js) - Google Analytics -->
 *  <script async src="https://www.googletagmanager.com/gtag/js?id=<%= trackingCode %>"></script>
 *  <script>
 *    window.dataLayer = window.dataLayer || [];
 *
 *    function gtag() {
 *      dataLayer.push(arguments);
 *    }
 *
 *    // init ga in mikan/Tracker
 *    window.__TRACKING_CODE__ = '<%= trackingCode %>'
 */

/**
 * init tracker module
 *
 * @param uid
 */
export function init(uid?: string): void {
  // eslint-disable-next-line
  const trackingCode = (<any>window).__TRACKING_CODE__;

  // eslint-disable-next-line
  // @ts-ignore
  gtag("js", new Date());

  if (uid) {
    // eslint-disable-next-line
    // @ts-ignore
    gtag("set", { user_id: uid });
  }

  // eslint-disable-next-line
  // @ts-ignore
  gtag("config", trackingCode, { send_page_view: false });
}

/**
 * page tracking
 *
 * @param pagePath
 * @link https://developers.google.com/analytics/devguides/collection/gtagjs/pages?hl=ja
 */
export function tracePage(pagePath?: string): void {
  // eslint-disable-next-line
  const trackingCode = (<any>window).__TRACKING_CODE__;
  // eslint-disable-next-line
  const page_path = pagePath || location.pathname + location.hash;

  // eslint-disable-next-line
  // @ts-ignore
  gtag("config", trackingCode, {
    page_title: document.title,
    page_path,
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
    value,
  }: { category?: string; label?: string; value?: number }
): void {
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

  // eslint-disable-next-line
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
): void {
  // eslint-disable-next-line
  // @ts-ignore
  gtag("event", "timing_complete", {
    name,
    value,
    event_category: optionalParams.category,
    event_label: optionalParams.label,
  });
}

/**
 * @see https://support.google.com/analytics/answer/1033863?hl=ja
 * @see https://support.google.com/urchin/answer/28307?hl=en
 * @see https://liapoc.com/utm-parameter.html
 */
export interface UrchinTrackingModuleParams {
  // プロパティにトラフィックを誘導した広告主、サイト、出版物、その他を識別します（Google、ニュースレター 4、屋外広告など）
  // 例) summer-mailer: サマーセール用のメール キャンペーン経由のトラフィックを識別
  source: string;
  // 広告メディアやマーケティング メディアを識別します（CPC 広告、バナー、メール ニュースレターなど）。
  // 例) email: メール キャンペーンとアプリ内キャンペーン経由のトラフィックを識別
  medium: string;
  // 商品のキャンペーン名、テーマ、プロモーション コードなどを指定します。
  // 例) summer-sale: キャンペーン全体のトラフィックを識別
  campaign: string;

  // 有料検索向けキーワードを特定します。検索広告キャンペーンにタグを設定する場合は、utm_term を使用してキーワードを指定することができます。
  term?: string;
  // 似通ったコンテンツや同じ広告内のリンクを区別するために使用します。
  // たとえば、メールのメッセージに行動を促すフレーズのリンクが 2 つある場合は、utm_content を使用して別々の値を設定し、どちらが効果的か判断できます。
  content?: string;
}

export function createUrchinTrackingModuleQuery(
  params: UrchinTrackingModuleParams
): string[] {
  const query: string[] = [];

  query.push(`utm_source=${params.source}`);
  query.push(`utm_medium=${params.medium}`);
  query.push(`utm_campaign=${params.campaign}`);

  if (params.term) {
    query.push(`utm_term=${params.term}`);
  }

  if (params.content) {
    query.push(`utm_content=${params.content}`);
  }

  return query;
}
