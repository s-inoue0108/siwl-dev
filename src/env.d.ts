/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly APP_NAME: string;
  readonly APP_URL: string;
  readonly APP_ADMIN_MAIL: string;
  readonly PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: string;
  readonly GITHUB_URL: string;
  readonly X_URL: string;
  readonly ZENN_URL: string;
  readonly X_OWNER: string;
  readonly COSMIC_BUCKET_SLUG: string;
  readonly COSMIC_READ_KEY: string;
  readonly COSMIC_WRITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
