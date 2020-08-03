<template>
    <div class="dashboard">
       <loading :active.sync="isLoading"></loading>
        <div class="navbar navbar-expand-lg navbar-dark bg-secondary rounded-lg mb-3">
        <a class="navbar-brand font-weight-bolder shadow px-2" href="#">
            後台
            <sub>管理</sub>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <!-- <li class="nav-item"> -->
                  <!-- <a class="nav-link" href="product.html">產品維護 <span class="sr-only">(current)</span></a> -->
                  <!-- <router-link class="nav-link" to="/admin">首頁</router-link>
              </li> -->
              <li class="nav-item">
                  <router-link class="nav-link" to="/admin/products"
                   active-class="active">
                    產品列表
                  </router-link>
              </li>
              <li class="nav-item">
                  <router-link class="nav-link" :to="{ name: '訂單列表' }"
                   active-class="active">
                    訂單列表
                  </router-link>
              </li>
              <li class="nav-item">
                  <router-link class="nav-link" :to="{ name: '優惠卷列表' }"
                   active-class="active">
                    優惠卷列表
                  </router-link>
              </li>
              <li class="nav-item">
                  <router-link class="nav-link" :to="{ name: '圖庫列表' }"
                   active-class="active">
                    圖庫列表
                  </router-link>
              </li>
               <li class="nav-item">
                <router-link class="nav-link" to="/admin/customerOrders"
                 active-class="active">
                  模擬訂單
                </router-link>
              </li>
            </ul>
        </div>
        <router-link to="/" class="btn btn-outline-success mr-2">回前台</router-link>
        <button @click="logout()" class="btn btn-success my-2 my-sm-0" type="button">登出</button>
        </div>
        <router-view :token="token" v-if="this.checkSucess"></router-view>
    </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      token: '',
      checkSucess: false
    }
  },
  created () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      this.isLoading = true
      // 取得使用者 token
      this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')
      // 紀錄預設共同驗證用 token 權限
      this.axios.defaults.headers.common.Authorization = `Bearer ${this.token}`
      const api = `${process.env.VUE_APP_APIPATH}/auth/check`
      // eslint-disable-next-line
      this.$http.post(api, { 'api_token': this.token }).then((response) => {
        // console.log(response.data.success)
        if (response.data.success) {
          this.checkSucess = true
          this.isLoading = false
        }
      }).catch((err) => {
        console.log(err)
        this.isLoading = false
        this.$router.push('/login')
      })
    },
    // 登出函式
    logout () {
      // 1.document.cookie 本地token及到期日清空
      document.cookie = 'token=;expires=;path=/'
      console.log('已清空token')
      // 2.登出後轉產品列表頁
      this.$router.push('/login')
    }
  }
}
</script>
