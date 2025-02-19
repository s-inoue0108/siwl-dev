/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly APP_NAME: string;
  readonly APP_URL: string;
  readonly APP_OWNER: string;
  readonly GOOGLE_APPS_SCRIPT_URL: string;
  readonly PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: string;
  readonly GOOGLE_RECAPTCHA_SECRET_KEY: string;
  readonly GITHUB_URL: string;
  readonly X_URL: string;
  readonly ZENN_URL: string;
  readonly QIITA_URL: string;
  readonly X_OWNER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
