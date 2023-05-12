<template>
  <nav class="navbar navbar-expand-lg p-0 align-items-stretch">
    <!-- logo -->
    <logo class="navbar-brand p-0 align-self-center" />

    <!-- toggle -->
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbar-main"
      aria-controls="navbar-main"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <!-- nav -->
    <div id="navbar-main" class="navbar-collapse collapse align-items-stretch">
      <ul class="navbar-nav ms-auto">
        <li v-for="(route, index) in routes" :key="index" class="nav-item">
          <router-link :to="{ name: route.to }" class="nav-link">
            <span>{{ route.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import Logo from '@/components/TheLogo.vue'

export default {
  name: 'TheMenu',
  components: {
    Logo
  },
  data: () => ({
    routes: [
      {
        title: 'Home',
        to: 'home'
      },
      {
        title: 'Serviços',
        to: 'services'
      },
      {
        title: 'Blog',
        to: 'blog'
      },
      {
        title: 'Sobre',
        to: 'about'
      },
      {
        title: 'Contato',
        to: 'contact'
      }
    ]
  })
}
</script>

<style lang="scss" scoped>
.nav {
  &bar {
    height: 75px;
  }

  &-link {
    display: flex;
    height: 100%;

    font: {
      family: $font_main_medium;
    }
    color: $white;

    align-items: center;

    &:hover  {
      background-color: darken($purple, 10);
      color: $white;
    }
  }
}
</style>
