<template>
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
              <div class="modal-content">
                <div :class="{'bg-primary': isNew , 'bg-success': !isNew}" class="modal-header text-white">
                  <h5 v-if="isNew" class="modal-title" id="productModalLabel">新增資料</h5>
                  <h5 v-else class="modal-title" id="productModalLabel">編輯資料</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" class="text-white">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row">
                            <div class="col-4">
                                <!-- <div class="form-group">
                                    <label for="imageUrl" class="col-form-label">輸入圖片網址:</label>
                                    <input v-model="tempProduct.imageUrl" type="text" class="form-control" id="imageUrl" placeholder="請輸入圖片連結位址">
                                </div> -->
                                <div v-for="i in 5" :key="i + 'img'" class="form-group">
                                    <label :for="'img' + i">輸入圖片網址</label>
                                    <input :id="'img' + i" v-model="tempProduct.imageUrl[i - 1]" type="text" class="form-control"
                                      placeholder="請輸入圖片連結">
                                </div>
                                <div class="form-group">
                                    <label for="customFile">
                                      或 上傳圖片
                                      <i v-if="status.fileUploading" class="fas fa-spinner fa-spin"></i>
                                    </label>
                                    <input id="customFile" ref="file" type="file" class="form-control" @change="uploadFile">
                                </div>
                                <!-- <img :src="tempProduct.imageUrl" alt="" class="image-fluid"> -->
                                <!-- <div v-if="isNew" class="d-none"></div> -->
                                <div class="card">
                                    <img class="card-img-top" :src="tempProduct.imageUrl[0]" alt>
                                    <div class="card-body">
                                      <p v-if="isNew" class="card-text">輸入圖片網址後立即預覽圖片</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="imgStyle" class="col-form-label">Image Style:</label>
                                    <input v-model="tempProduct.options.imgStyle" type="text" class="form-control" id="imgStyle" placeholder="請輸入圖片樣式(css)">
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="form-group">
                                    <label for="title" class="col-form-label">標題</label>
                                    <input v-model="tempProduct.title" type="text" class="form-control" id="title" placeholder="請輸入產品標題">
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="category" class="col-form-label">類別</label>
                                        <input v-model="tempProduct.category" type="text" class="form-control" id="category" placeholder="請輸入類別">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="unit" class="col-form-label">單位</label>
                                        <input v-model="tempProduct.unit" type="text" class="form-control" id="unit" placeholder="請輸入單位">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="origin_price" class="col-form-label">原價</label>
                                        <input v-model="tempProduct.origin_price" type="number" class="form-control" id="origin_price" placeholder="請輸入原價">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="price" class="col-form-label">售價</label>
                                        <input v-model="tempProduct.price" type="number" class="form-control" id="price" placeholder="請輸入售價">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="description" class="col-form-label">產品描述</label>
                                    <textarea v-model="tempProduct.description" class="form-control" id="description" placeholder="請輸入產品描述"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="content" class="col-form-label">產品內容介紹</label>
                                    <textarea v-model="tempProduct.content" class="form-control" id="content" placeholder="請輸入產品內容介紹"></textarea>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <div class="form-check">
                                            <input id="onSale" v-model="tempProduct.options.onSale" class="form-check-input" type="checkbox"
                                              :true-value="true" :false-value="false">
                                            <label class="form-check-label" for="onSale">是否特價</label>
                                        </div>
                                    </div>
                                    <div class="form-group col-md-5">
                                        <div class="form-check">
                                            <input id="is_enabled" v-model="tempProduct.enabled" class="form-check-input" type="checkbox"
                                              :true-value="true" :false-value="false">
                                            <label class="form-check-label" for="is_enabled">是否上架(顯示於前台)</label>
                                        </div>
                                    </div>
                                    <div class="form-group col-md-3">
                                      <label for="order" class="col-form-label">顯示序號</label>
                                      <input v-model="tempProduct.options.order" class="form-control" type="number" name="order" id="order" placeholder="請輸入顯示序號" >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                  <button @click="updateProduct()" type="button" :class="{'btn-primary':isNew,'btn-success':!isNew}" class="btn">確認送出</button>
                </div>
              </div>
            </div>
             <!-- Vue Loading Overlay Component -->
        <loading :active.sync="isLoading"></loading>
    </div>
</template>

<script>
export default {
  name: 'ProductModal',
  data () {
    return {
      tempProduct: {
        imageUrl: [],
        options: {}
      },
      isLoading: false,
      statusMsg: ''
    }
  },
  props: {
    productid: {
      type: String,
      default: ''
    },
    status: {
      type: Object,
      default () {
        return {
        }
      }
    },
    isNew: {
      type: Boolean,
      default: true
    },
    user: {
      type: Object,
      default () {
        return {
        }
      }
    }
  },
  methods: {
    // 抓取個別產品資料函數
    getProduct (id) {
      // 遠端存取Loading畫面打開
      this.isLoading = true
      // 設定 API 遠端連線字串
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product/${id}`
      this.axios.get(api).then((res) => {
        // window.$('#productModal').modal('show')
        // 透過 axios API 取回遠端產品資料
        this.tempProduct = res.data.data
        // 遠端存取Loading畫面關閉
        this.isLoading = false
      }).catch((error) => {
        console.log(error)
      })
    },
    // 新增、更新個別產品函數
    updateProduct () {
      // 定義要更新的API，如果新增，則httpMethod操作為post，編輯為patch
      const apiUrl = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}`
      let api = `${apiUrl}/admin/ec/product`
      this.statusMsg = '本筆資料已成功新增!'
      // 注意httpMethod要小寫
      let httpMethod = 'post'
      // 設定更新產品api路徑
      if (!this.isNew) {
        api = `${apiUrl}/admin/ec/product/${this.tempProduct.id}`
        httpMethod = 'patch'
        this.statusMsg = '本筆資料已完成更新!'
      }
      // token已定義在created時期
      // axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      // axios.defaults.headers.common['Authorization'] = `Bearer ${this.user.token}`;
      // 透過 axios[httpMethod] 執行post 或 patch 操作
      this.axios[httpMethod](api, this.tempProduct).then((response) => {
        window.$('#productModal').modal('hide')
        if (response.status === 200) {
          // 參考範例製作吐司提示訊息
          this.$bus.$emit('message:push',
            this.statusMsg,
            'success')
          // 呼叫外層更新畫面
          this.$emit('update')
        } else {
          this.$bus.$emit('message:push',
            `喔歐~上傳圖片不可超過 2 MB
        ${response.data.message}(${response.status})`,
            'danger')
        }
      }).catch((error) => {
        this.$bus.$emit('message:push',
            `喔歐~發生錯誤惹:
        ${error.response.data.message}(${error.response.status})`,
            'danger')
        window.$('#productModal').modal('hide')
      })
    },
    // 參考範例加入上傳檔案
    uploadFile () {
      const uploadedFile = this.$refs.file.files[0]
      const formData = new FormData()
      formData.append('file', uploadedFile)
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/storage`
      this.status.fileUploading = true
      this.axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.status.fileUploading = false
        if (response.status === 200) {
          this.tempProduct.imageUrl.push(response.data.data.path)
          // 參考範例製作吐司提示訊息
          this.$bus.$emit('message:push',
            '圖片已上傳成功!',
            'success')
        }
      }).catch((error) => {
        this.$bus.$emit('message:push',
            `喔歐~上傳圖片不可超過 2 MB
        ${error.response.data.message}(${error.response.status})`,
            'danger')
        // console.log('上傳不可超過 2 MB')
        this.status.fileUploading = false
      })
    }
  }
}
</script>
