/// <reference types="vite/client" />

// vite-svg-loader: import SVG as a Vue component (`...svg?component`).
declare module '*.svg?component' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'
  const component: FunctionalComponent<SVGAttributes>
  export default component
}
