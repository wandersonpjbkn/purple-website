<template>
  <div class="container-fluid theme--purple fixed-top">
    <the-menu class="container" />
  </div>
</template>

<script>
import TheMenu from '@/components/TheMenu.vue'

export default {
  name: 'TheHeader',
  components: {
    TheMenu
  }
}
</script>
