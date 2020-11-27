import * as log from "loglevel";

log.setLevel(log.levels.DEBUG);

/**
 * Overwrite output message format.
 */
(() => {
  // save original.
  const originalFactory = log.methodFactory;

  // overwrite logging method.
  // eslint-disable-next-line
  // @ts-ignore
  log.methodFactory = (methodName, logLevel, loggerName) => {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    // received params according to `console.log()` style.
    // eslint-disable-next-line
    return (message?: any, ...optionalParams: any[]) => {
      const customMessage = `${methodName.toUpperCase()} [${loggerName}] ${message}`;

      const args = [customMessage];
      if (optionalParams.length !== 0) {
        args.push(...optionalParams);
      }

      rawMethod(...args);
    };
  };
})();

export function getLogger(loggerName: string): log.Logger {
  return log.getLogger(loggerName);
}
