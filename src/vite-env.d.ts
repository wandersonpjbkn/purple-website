/// <reference types="vite/client" />

// vite-svg-loader: importar SVG como componente Vue (`...svg?component`).
declare module '*.svg?component' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'
  const component: FunctionalComponent<SVGAttributes>
  export default component
}
