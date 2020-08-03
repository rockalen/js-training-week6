<template>
  <div class="home">
    <!-- <loading :active.sync="isLoading"></loading> -->
    <div class="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <a class="navbar-brand font-weight-bolder shadow-sm px-2" href="#">
                慢慢
                <sub>手做</sub>
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <!-- <a class="nav-link" href="product.html">產品維護 <span class="sr-only">(current)</span></a> -->
            <router-link class="nav-link" to="/">首頁</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">產品列表</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/carts">購物車</router-link>
          </li>
        </ul>
      </div>
       <router-link to="/admin/Products" class="btn btn-outline-secondary">登入管理</router-link>
      <!-- <button @click="logout()" class="btn btn-success my-2 my-sm-0" type="button">登出</button> -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data () {
    return {
      // isLoading: false
    }
  }
}
</script>
