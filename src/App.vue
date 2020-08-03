<template>
  <div class="container" id="app">
    <!-- <loading :active.sync="isLoading"></loading> -->
    <Toast />
    <router-view/>
  </div>
</template>

<script>
import Toast from '@/components/Toasts.vue'
export default {
  name: 'App',
  components: {
    Toast
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/all.scss';

#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft JhengHei", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
