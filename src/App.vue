<template>
  <div id="app">
    <the-header />
    <router-view/>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'

export default {
  name: 'App',
  components: {
    TheHeader
  }
}
</script>

<style lang="scss">
@import './assets/scss/main.scss';

#app {
  font-family: $font_main_light;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text;
}
</style>
