<template>
    <div class="products">
        <div class="text-right mt-3">
            <button @click="openModal('new')" class="btn btn-outline-primary">
            <!-- <i class="material-icons align-middle">add_circle </i> -->
            <font-awesome-icon icon="plus-square"/>
            <span class="align-middle"> 新增產品</span>
            </button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="150">分類</th>
                    <th>產品名稱</th>
                    <th width="120">原價</th>
                    <th width="100">售價</th>
                    <th width="120">是否上架</th>
                    <th width="120">編輯 / 刪除</th>
                </tr>
            </thead>
            <!-- 列出產品 -->
            <tbody>
                <tr v-for="(item) in products" :key="item.id">
                    <td>{{ item.category }}</td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.origin_price | money }}</td>
                    <td>{{ item.price | money }}</td>
                    <td>
                        <span v-if="item.enabled" class="text-success d-flex align-items-center justify-content-center">
                            <a @click="setProductEnabled(item)" class="btn text-success p-0" href="#" role="button" :class="{'disabled':loadingBtn === item.id}">
                                <!-- <i class="material-icons font-size-36">toggle_on </i> -->
                                <font-awesome-icon icon="toggle-off"/>
                                <sup v-if='loadingBtn === item.id' class="spinner-grow spinner-grow-sm text-success" role="status">
                                </sup>
                                <sup v-else > on</sup>
                            </a>
                        </span>
                        <span v-else class="text-danger d-flex align-items-center justify-content-center">
                            <a @click="setProductEnabled(item)" class="btn text-danger p-0" href="#" role="button" :class="{'disabled':loadingBtn === item.id}">
                                <!-- <i class="material-icons font-size-36">toggle_off </i> -->
                                <font-awesome-icon icon="toggle-on"/>
                                <sub v-if='loadingBtn === item.id' class="spinner-grow spinner-grow-sm text-danger" role="status"></sub>
                                <sub v-else > off</sub>
                            </a>
                        </span>
                    </td>
                    <td>
                        <!-- 修改即刪除按鈕，使用v-on:click @click -->
                        <div class="btn-group">
                            <button v-on:click="openModal('edit', item)" class="btn btn-outline-success py-1">
                                <!-- <i class="material-icons align-middle">edit</i> -->
                                <font-awesome-icon icon="edit"/>
                            </button>
                            <button @click="openModal('delete', item)" class="btn btn-outline-danger py-1">
                                <!-- <i class="material-icons align-middle">delete_forever</i> -->
                                <font-awesome-icon icon="trash-alt"/>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 分頁元件 :pages 取得外層 pagination 頁面資訊 ; @emit-pages 刷新頁面-->
        <div class="d-flex justify-content-center">
          <Pagination :pages="pagination" @emit-pages="getProducts"></Pagination>
        </div>
         <!-- Modal -->
        <product-modal ref="productModel" :status="status" :is-new="isNew" @update="getProducts">
        </product-modal>
        <!-- props tempProduct id,title user ; @update 呼叫getProducts-->
        <del-product-modal :temp-product="tempProduct"  @update="getProducts"></del-product-modal>
        <!-- Vue Loading Overlay Component -->
        <loading :active.sync="isLoading"></loading>
    </div>
</template>

<script>
// 載入 Pagination 分頁 components
import Pagination from '@/components/Pagination.vue'
// 載入ProductModal components
import ProductModal from '@/components/ProductModal.vue'
// import $ from 'jquery' // STEP 1：載入 jQuery
// 載入 DelProductModal components
import DelProductModal from '@/components/DelProductModal.vue'
export default {
  name: 'Products',
  components: {
    Pagination,
    ProductModal,
    DelProductModal
  },
  data () {
    return {
      isLoading: false,
      products: [],
      pagination: {},
      tempProduct: {
        imageUrl: [],
        options: {}
      },
      isNew: true,
      status: {
        fileUploading: false
      },
      loadingBtn: ''
    }
  },
  created () {
    this.getProducts()
  },
  methods: {
    getProducts (page = 1, paged = 10) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/products?page=${page}&paged=${paged}`
      // const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products`
      // console.log(api)
      this.axios.get(api).then((response) => {
        this.products = response.data.data
        // 將遠端頁數回應資料存入產品頁數資料並給 pagination 元件做後續處理
        this.pagination = response.data.meta.pagination
        this.isLoading = false
        // console.log(this.products)
      })
    },
    openModal (act, item) {
      switch (act) {
        case 'new':
          // 使用 refs 觸發子元件清空
          this.$refs.productModel.tempProduct = {
            imageUrl: [],
            options: {} // 自行新增相關欄位亦一併清空
          }
          // 202007改成模組內透過 isNew 來判斷 :class ，較為簡潔
          // this.modalClass['bg-primary'] = true;
          // this.modalClass['bg-success'] = false;
          this.isNew = true
          window.$('#productModal').modal('show')
          //   this.$refs['product-Model'].show()
          break
        case 'edit':
          // 202007改成模組內透過 isNew 來判斷 :class ，較為簡潔
          // this.modalClass['bg-primary'] = false;
          // this.modalClass['bg-success'] = true;
          // this.isLoading = true;
          this.loadingBtn = this.tempProduct.id
          this.isNew = false
          this.tempProduct = Object.assign({}, item)
          // this.tempProduct = JSON.parse(JSON.stringify(item));
          // 使用 refs 觸發子元件getProduct方法
          this.$refs.productModel.getProduct(this.tempProduct.id)
          // console.log(this.tempProduct.id)
          window.$('#productModal').modal('show')
          this.loadingBtn = ''
          // this.isLoading = false;
          break
        case 'delete':
          this.tempProduct = JSON.parse(JSON.stringify(item))
          window.$('#delProductModal').modal('show')
          break
        default:
          break
      }
    },
    // 設定產品啟用函式
    setProductEnabled (item) {
      this.loadingBtn = item.id
      // 1.深層複製單筆產品資料至暫存 tempProduct
      this.tempProduct = JSON.parse(JSON.stringify(item))
      // 2.設定API位置
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product/${this.tempProduct.id}`
      // 3.設定是否上架，如果已上架，設定為下架，反之設定為上架
      if (this.tempProduct.enabled) {
        this.tempProduct.enabled = false
      } else {
        this.tempProduct.enabled = true
      }
      // 4.使用 axios.patch API 非同步更新遠端資料
      this.axios.patch(api, this.tempProduct).then(() => {
        this.loadingBtn = ''
        // 5.更新完成後即刷新產品列表
        this.getProducts()
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
