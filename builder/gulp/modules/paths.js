// modules internal
import { route } from '../../config'

const { src, publicSrc, dist } = route

// source paths
const paths = {
  js: {
    watch: `${src}/assets/js/src/*.js`,
    src: `${src}/assets/js/*.js`,
    dist: `${dist}/js`
  },

  css: {
    watch: `${src}/assets/scss/src/*.scss`,
    src: `${src}/assets/scss/*.scss`,
    dist: `${dist}/css`
  },

  fonts: {
    src: [
      `${src}/assets/fonts/**/*.+(ttf|woff|woff2)`
      // `!${src}/assets/fonts/{to-ignore}/**`
    ],
    dist: `${dist}/fonts`
  },

  imgs: {
    src: `${src}/assets/imgs/*.+(png|jpg|gif|svg)`,
    dist: `${dist}/img`
  },

  root: {
    src: [
      // public folder
      `${publicSrc}/*.+(php|txt|css|html|png|ico)`,
      `${publicSrc}/**/*.+(css|js|png|jpg|gif|svg)`,

      // src folder
      `${src}/functions.php`
    ],
    dist: `${dist}/`
  },

  functions: {
    src: `${src}/functions/*.php`,
    dist: `${dist}/functions`
  },

  html: {
    src: [
      `${src}/partials/*.php`,
      `${src}/pages/*.php`
    ],
    dist: `${dist}/`
  },

  partials: {
    src: [
      `${src}/template-parts/*.php`,
      `${src}/template-parts/**/*.php`
    ],
    dist: `${dist}/template-parts`
  }
}

export {
  paths
}
