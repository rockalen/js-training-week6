<template>
    <div class="products">
        <loading :active.sync="isLoading"></loading>
        <h2>
        這是產品列表
        </h2>
        <table class="table">
            <tr v-for="item in products" :key="item.id">
                <td>{{item.title}}</td>
                <td>{{item.content}}</td>
                <td>
                    <router-link :to="`/product/${item.id}`" class="btn btn-outline-primary">看產品</router-link>
                    <!-- <a href="#" class="btn btn-outline-primary">
                        看詳細
                    </a> -->
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
  name: 'Products',
  data () {
    return {
      isLoading: false,
      products: []
    }
  },
  created () {
    this.isLoading = true
    const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products`
    // console.log(api)
    this.axios.get(api).then((response) => {
      this.products = response.data.data
      this.isLoading = false
    //   console.log(this.products)
    })
  }

}
</script>
