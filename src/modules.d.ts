declare module '@segment/top-domain' {
  export default function topDomain(url: string): string
}

declare module '@segment/in-eu' {
  export default function inEU(): boolean
}

declare module 'styled-components' {
  export type CSSProp = string | object
}
