<template>
  <router-link :to="{ name: 'home' }">
    <img :src="img.src" :alt="img.alt" :title="img.alt" />
  </router-link>
</template>

<script>
export default {
  name: 'TheLogo',
  data: () => ({
    img: {
      src: require('@/assets/img/ppl-green-white-lg.png'),
      alt: 'Purple Comunicação'
    }
  })
}
</script>

<style lang="scss" scoped>
img {
  width: 100px;
  height: auto;
}
</style>
