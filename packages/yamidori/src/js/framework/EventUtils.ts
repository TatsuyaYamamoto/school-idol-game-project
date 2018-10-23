/**
 * @fileOverview Define custom event util functions for global {@link EventTarget}.
 */

/**
 * Event target element that util functions use.
 * You can get added event list with Chrome command line, 'getEventListeners(document)';
 * {@see https://developers.google.com/web/tools/chrome-devtools/console/command-line-reference?utm_source=dcc&utm_medium=redirect&utm_campaign=2016q3#geteventlistenersobject}
 *
 * @type {EventTarget}
 */
const eventTarget: EventTarget = document;

/**
 * Cache object that has added events.
 *
 * @type {any}
 */
const cacheEvents = {};

/**
 * Fire an event has provided type.
 *
 * @param type
 */
export function dispatchEvent(type: string): void {
  if (!cacheEvents.hasOwnProperty(type)) {
    console.error("Provided event type is not defined.");
  }

  eventTarget.dispatchEvent(new Event(type));
}

/**
 * Add events.
 *
 * @param events
 */
export function addEvents(events: { [key: string]: (Event) => void }): void {
  Object.keys(events).forEach(key => {
    eventTarget.addEventListener(key, events[key]);
    cacheEvents[key] = events[key];
  });
}

/**
 * Remove events.
 *
 * @param keys
 */
export function removeEvents(keys: string[]): void {
  keys.forEach(key => {
    eventTarget.removeEventListener(key, cacheEvents[key]);
    delete cacheEvents[key];
  });
}
