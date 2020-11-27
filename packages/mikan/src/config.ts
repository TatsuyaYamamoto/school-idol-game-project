/**
 * @fileOverview Configuration that the application uses globally.
 */

export interface Config {
  rendererBackgroundColor: number;

  supportedLanguages: string[];
  defaultLanguage: string;

  basicImageWidth: number;
  basicImageHeight: number;
}

const config: Config = {
  /**
   * Background color of the application renderer.
   * It's shown when application draws no sprite.
   */
  rendererBackgroundColor: 0xeeeeee,

  /**
   * Basic width of the application view.
   * This app's assets is draw as premise of this.
   */
  basicImageWidth: 0,

  /**
   * Basic height of the application view.
   * This app's assets is draw as premise of this.
   */
  basicImageHeight: 0,

  /**
   * Languages that this i18n module supports.*
   */
  supportedLanguages: Array.of(),

  /**
   * Default language.
   * This is fallback when user required unsupported language.
   */
  defaultLanguage: "",
};

export default config;
