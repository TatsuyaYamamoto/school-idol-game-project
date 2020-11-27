/**
 * @fileOverview i18n, internationalization, module.
 * You should execute {@link initI18n} before using other functions.
 *
 * This detects user language with {@link Detector} in initializing.
 * First access, this detects browser language.
 * From the second time, this check in saved localStorage value.
 *
 * This dependents on {@link config.defaultLanguage} and {@link config.supportedLanguages}.
 * These language configs is supported language string only, for example "en" or "jp".
 * If it's detected with locale string, for example en-US or ja-JP, this module deletes locale section.
 */
import * as i18next from "i18next";
import * as Detector from "i18next-browser-languagedetector";

import config from "./config";

/**
 * Single instance to be set with {@link initI18n}.
 *
 * @type {i18next.i18n}
 * @private
 */
let i18n: i18next.i18n | null = null;

/**
 * Return true if targetLanguage is prop that {@link supportedLanguages} has.
 *
 * @param {string} targetLanguage
 * @returns {boolean}
 * @private
 */
function isDefinedLanguage(targetLanguage: string): boolean {
  return config.supportedLanguages.some((l) => l === targetLanguage);
}

/**
 * Changes the language.
 *
 * @param {string} language
 * @param {i18next.Callback} callback
 * @see i18next#changeLanguage
 */
export function changeLanguage(
  language: string,
  callback?: i18next.Callback
): void {
  if (!i18n) {
    throw new Error("i18n module is not initialized.");
  }

  if (isDefinedLanguage(language)) {
    i18n.changeLanguage(language, callback);
  } else {
    i18n.changeLanguage(config.defaultLanguage, callback);
  }
}

/**
 * Initialize i18next module.
 *
 * @param {i18next.InitOptions} options
 * @param {i18next.Callback} callback
 */
export function initI18n(
  options?: i18next.InitOptions,
  callback?: i18next.Callback
): void {
  const opts = {
    fallbackLng: config.defaultLanguage,
    debug: false,
    ...options,
  };

  i18n = i18next.use(Detector).init(opts, callback);

  const detectedLang = i18n.language.substr(0, 2); // extract language string only.
  changeLanguage(detectedLang);
}

/**
 * Get message resource with provide key.
 *
 * @param key
 * @param options
 * @return {string}
 * @see i18n#t
 */
// tslint:disable-next-line:function-name
export function t(
  key: string | string[],
  // eslint-disable-next-line
  options?: { [key: string]: any }
): string {
  if (!i18n) {
    throw new Error("i18n module is not initialized.");
  }

  return i18n.t(key, options);
}

/**
 * Return the current detected or set language.
 *
 * @see i18n#language
 * @return {string}
 */
export function getCurrentLanguage(): string {
  if (!i18n) {
    throw new Error("i18n module is not initialized.");
  }

  // Step against rewriting directly by user.
  // remove locale if it exists.
  const lang = i18n.language.substr(0, 2);

  return isDefinedLanguage(lang) ? lang : config.defaultLanguage;
}
