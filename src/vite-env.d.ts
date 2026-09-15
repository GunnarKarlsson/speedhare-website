/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin without trailing slash, e.g. https://api.speedhare.io. Empty = same-origin /api (Vite dev proxy). */
  readonly VITE_API_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
