<template>
    <div class="product">
        <loading :active.sync="isLoading"></loading>
        <h2>
        這是單項產品詳細頁
        </h2>
        <hr>
        <h4>
            產品名稱:{{ product.title }}
        </h4>
        <!-- <div class="card">
            <div class="card-body">
                <img :src="product.imageUrl" alt="">
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
  name: 'Product',
  data () {
    return {
      isLoading: false,
      product: {}
    }
  },
  created () {
    this.isLoading = true
    const { id } = this.$route.params
    const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/product/${id}`
    this.$http.get(api).then((response) => {
      this.product = response.data.data
      this.isLoading = false
    //   console.log(this.product)
    })
  }
}
</script>
