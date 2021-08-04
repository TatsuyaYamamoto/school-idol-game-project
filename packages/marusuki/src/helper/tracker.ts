/**
 * @link https://developers.google.com/analytics/devguides/collection/gtagjs/events?hl=ja
 */
export const sendEvent = (
  action: "gameover",
  {
    category,
    label,
    value,
  }: { category?: string; label?: string; value?: number }
): void => {
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
};
