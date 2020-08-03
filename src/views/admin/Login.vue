<template>
    <div class="login">
         <div class="row h-100 justify-content-center align-items-center">
            <div class="col-3">
                <form class="form-signin" @submit.prevent="login">
                    <h1 class="mb-3">
                        請先登入
                    </h1>
                    <div class="form-group">
                    <label for="inputEmail" class="sr-only">Email address</label>
                    <input type="email" v-model="user.email" id="inputEmail" class="form-control" placeholder="請輸入E-mail address" required autofocus>
                    </div>
                    <div class="form-group">
                    <label for="inputPassword" class="sr-only">Password</label>
                    <input type="password" class="form-control" v-model="user.password" id="inputPassword" placeholder="請輸入密碼" required>
                    </div>
                    <button class="btn btn-primary btn-lg" type="submit">
                        登入
                    </button>
                    <p class="mt-3 mb-3 text-muted">
                        &copy; 2020 - 慢慢手做 <sub>∞</sub>
                    </p>

                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      token: ''
    }
  },
  methods: {
    login () {
      const api = `${process.env.VUE_APP_APIPATH}/auth/login`
      this.$http.post(api, this.user).then((res) => {
        // 注意!以下宣告方式即可不需要寫res.data.token
        const { token } = res.data
        const { expired } = res.data
        // 參考第4周作業寫入本地cookie，包括設置有效時間expires
        document.cookie = `token=${token};expires=${new Date(expired * 1000)};path=/`
        console.log(document.cookie)
        this.$router.push('/admin/products')
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss">
    // body {
    //     height: 100vh;
    // }
    .login{
        height: 100vh;
    }
</style>
