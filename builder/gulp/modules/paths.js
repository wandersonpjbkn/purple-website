// modules internal
import { route } from '../../config'

// source paths
const paths = {
  js: {
    watch: `${route.src}/assets/js/src/*.js`,
    src: `${route.src}/assets/js/*.js`,
    dist: `${route.dist}/js`
  },

  css: {
    watch: `${route.src}/assets/scss/src/*.scss`,
    src: `${route.src}/assets/scss/*.scss`,
    dist: `${route.dist}/css`
  },

  fonts: {
    src: [
      `${route.src}/assets/fonts/**/*.+(ttf|woff|woff2)`,
      // `!${route.src}/assets/fonts/{to-ignore}/**`
    ],
    dist: `${route.dist}/fonts`
  },

  imgs: {
    src: `${route.src}/assets/imgs/*.+(png|jpg|gif|svg)`,
    dist: `${route.dist}/img`
  },

  root: {
    src: [
      // public folder
      `${route.public}/*.+(php|txt|css|html|png|ico)`,
      `${route.public}/**/*.+(css|js|png|jpg|gif|svg)`,

      // src folder
      `${route.src}/functions.php`
    ],
    dist: `${route.dist}/`
  },

  functions: {
    src: `${route.src}/functions/*.php`,
    dist: `${route.dist}/functions`
  },

  html: {
    src: [
      `${route.src}/templates-parts/*.php`,
      `${route.src}/templates-pages/*.php`
    ],
    dist: `${route.dist}/`
  },
}

export {
  paths
}
