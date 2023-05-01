import path from 'path'

const local = '/'

const theme = 'purple-wp'

const route = {
  // sources
  public: path.resolve(__dirname, './../', './theme/public'),
  src: path.resolve(__dirname, './../', './theme/src'),

  // destiny
  dist: path.resolve(__dirname, './../', `./www/wp-content/themes/${theme}`)
}

export {
  theme,
  route,
  local
}
