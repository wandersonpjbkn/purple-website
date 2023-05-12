<template>
  <section class="hero" :style="`background-image:url(${src})`">
    <slot />
  </section>
</template>

<script>
export default {
  name: 'TheHero',
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.hero {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: {
    position: center center;
    repeat: none;
    size: cover;
  }

  align-items: center;
  justify-content: center;
  flex-direction: column;

  &:before {
    content: '';

    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;

    display: block;
    width: 75vw;
    height: 60px;
    background: {
      color: $purple;
    }
  }
}
</style>
