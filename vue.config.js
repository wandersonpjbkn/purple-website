const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
          @import "~@/assets/scss/src/_variables.scss";
        `
      }
    }
  },
  pwa: {
    assetsVersion: '0.0.1',
    name: 'Purple Comunicação',
    themeColor: '#A066CB',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
})
