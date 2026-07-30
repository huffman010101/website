/// <reference types="vite/client" />

// Vite's `?url` suffix imports resolve to an asset URL string at build time.
declare module '*?url' {
  const src: string
  export default src
}
