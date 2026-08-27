/// <reference types="vite/client" />

declare module "virtual:eo2-snapshot-manifest" {
  const manifest: Record<string, { bodyClass: string; file: string; title: string }>;
  export default manifest;
}

interface Window {
  __eo2InitialSnapshot?: {
    file: string;
    promise: Promise<string>;
  };
}
