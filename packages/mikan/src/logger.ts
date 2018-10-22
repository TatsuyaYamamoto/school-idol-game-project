import * as log from "loglevel";

log.setLevel(log.levels.DEBUG);

/**
 * Overwrite output message format.
 */
(function() {
  // save original.
  const originalFactory = log.methodFactory;

  // overwrite logging method.
  // @ts-ignore
  log.methodFactory = function(methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    // received params according to `console.log()` style.
    return function(message?: any, ...optionalParams: any[]) {
      const customMessage = `${methodName.toUpperCase()} [${loggerName}] ${message}`;

      const args = [customMessage];
      if (optionalParams.length !== 0) {
        args.push(...optionalParams);
      }

      rawMethod(...args);
    };
  };
})();

export function getLogger(loggerName: string) {
  return log.getLogger(loggerName);
}
