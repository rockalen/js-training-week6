<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <table class="table">
            <thead>
                <tr>
                    <th>下單時間</th>
                    <th>購買款項</th>
                    <th>付款方式</th>
                    <th>應付金額</th>
                    <th>是否付款</th>
                </tr>
            </thead>
            <tbody v-if = "orders.length">
                <tr v-for="(item, index) in orders"
                    :key="index"
                    :class="{'text-danger': !item.paid}"
                    >
                    <td>{{ item.created.datetime }}</td>
                    <td>
                        <ul class="list-unstyled">
                            <li v-for="(product, index) in item.products"
                            :key="index"
                            >
                                {{ product.product.title}} 數量 : {{ product.quantity }} {{ product.product.unit }}
                            </li>
                        </ul>
                    </td>
                    <td>{{ item.payment }}</td>
                    <td>{{ item.amount | money }}</td>
                    <td>
                        <div class="custom-control custom-switch">
                            <input
                                :id="item.id"
                                v-model="item.paid"
                                type="checkbox"
                                class="custom-control-input"
                                @change="setOrderPaid(item)"
                            >
                            <label
                                class="custom-control-label"
                                :for="item.id"
                            >
                                <strong
                                v-if="item.paid"
                                class="text-success"
                                >已付款</strong>
                                <span
                                v-else
                                class="text-muted"
                                >尚未付款</span>
                            </label>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
         <!-- 分頁元件 :pages 取得外層 pagination 頁面資訊 ; @emit-pages 刷新頁面-->
        <div class="d-flex justify-content-center">
          <Pagination :pages="pagination" @emit-pages="getOrders"></Pagination>
        </div>
    </div>
</template>

<script>
// 載入 Pagination 分頁 components
import Pagination from '@/components/Pagination.vue'
export default {
  name: 'Orders',
  components: {
    Pagination
  },
  data () {
    return {
      orders: {},
      pagination: {},
      isLoading: false
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    getOrders (page = 1, paged = 8) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/orders?page=${page}&paged=${paged}`
      //   const params = {
      //     'page': '1',
      //     'paged': '25',
      //     'orderBy': 'created_at, updated_at',
      //     'sort': 'desc, asc'
      //   }
      //   Object.keys(params)
      //     .forEach(key => api.searchParams.append(key, params[key]))
      this.$http.get(api).then((response) => {
        this.orders = response.data.data
        this.pagination = response.data.meta.pagination
        // console.log(this.orders)
        this.isLoading = false
      })
    },
    setOrderPaid (item) {
      let api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/orders/${item.id}/paid`
      if (!item.paid) {
        api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/orders/${item.id}/unpaid`
      }
      this.$http.patch(api, item.id).then((response) => {
        console.log('已付款')
        this.getOrders()
      })
    }
  }
}
</script>
