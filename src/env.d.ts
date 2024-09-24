/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly APP_NAME: string;
  readonly APP_ADMIN_MAIL: string;
  readonly PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: string;
  readonly GITHUB_URL: string;
  readonly X_URL: string;
  readonly ZENN_URL: string;
  readonly X_OWNER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
