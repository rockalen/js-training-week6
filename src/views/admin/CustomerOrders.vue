<template>
    <div>
    <!-- loading 套件 start -->
        <loading :active.sync="isLoading"></loading>
        <!-- loading 套件 end -->

        <!-- 產品列表 start -->
        <div class="row mt-5">
            <div v-for="(item, index) in products" :key="index" class="col-md-4 mb-4">
                <div class="card">
                    <img :src="item.imageUrl[0]" class="card-img-top cardBg" alt="...">
                    <div class="card-body">
                        <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                        <h5 class="card-title">{{item.title}}</h5>
                        <p class="card-text" v-html="item.content">{{item.content}}</p>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="w-100 text-right" v-if="item.price >= item.origin_price">{{ item.origin_price | money }}元</div>
                            <del v-if="item.price < item.origin_price">原價{{ item.origin_price | money }}元</del>
                            <div v-if="item.price < item.origin_price" class="font-size-20">現在只要{{item.price | money}}元</div>
                        </div>
                    </div>
                    <div class="card-footer d-flex">
                        <button @click="getProduct(item.id)" type="button" class="btn btn-outline-secondary btn-sm" :disabled="status.loadingBtn === item.id">
                            <i v-if="status.loadingBtn === item.id" class="spinner-grow spinner-grow-sm" role="status"></i>
                            查看更多
                        </button >
                        <button @click="addToCart(item)" type="button" class="btn btn-outline-danger btn-sm ml-auto" :disabled="status.loadingBtn === item.id">
                            <i v-if="status.loadingBtn === item.id" class="spinner-grow spinner-grow-sm" role="status"></i>
                            加到購物車
                        </button >
                    </div>
                </div>
            </div>
        </div>
        <!-- 產品列表 end -->

        <!-- 產品內容 Modal start -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="productModalLabel">{{tempProduct.title}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                      <!-- 若使用 airbnb eslint 由於 content 是使用 vue2Editor 生成 HTML 標籤
              所以必須使用 v-html 渲染，因此這邊會出現提示警告是正常的 -->
                    <!-- eslint-disable -->
                    <p
                        class="mb-0"
                        v-html="tempProduct.content"
                    />
                    <!-- eslint-disable -->
                    <p class="font-size-16">{{tempProduct.description}}</p>
                    <!-- {{tempProduct.content}} -->
                    <div class="d-flex justify-content-between align-items-baseline">
                        <div v-if="tempProduct.price >= tempProduct.origin_price">{{ tempProduct.origin_price | money }}元</div>
                        <del v-if="tempProduct.price < tempProduct.origin_price">原價{{ tempProduct.origin_price | money }}元</del>
                        <div v-if="tempProduct.price < tempProduct.origin_price" class="font-size-20">現在只要{{tempProduct.price | money}}元</div>
                    </div>
                    <select @change="changeSelected($event)" name class="form-control mt-3">
                        <option value="0" disabled :selected="tempProduct.selectNum === 0">請選擇數量</option>
                        <option v-for="num in 10" :key="num" :value="num" :selected="tempProduct.selectNum === num">
                            選購 {{num}} {{tempProduct.unit}}
                        </option>
                    </select>
                </div>
                <div class="modal-footer">
                <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> -->
                <div v-if="tempProduct.selectNum" class="text-mute mr-3">
                    小計
                    <strong>{{tempProduct.selectNum*tempProduct.price | money}}</strong>元
                </div>
                <button  @click="addToCart(tempProduct,tempProduct.selectNum)" type="button" class="btn btn-primary" :disabled="!tempProduct.selectNum">
                <i v-if="status.loadingBtn === tempProduct.id" class="spinner-grow spinner-grow-sm" role="status"></i>
                    加到購物車
                </button>
                <!-- <button v-else @click="quantityCalc(tempProduct.id,tempProduct.selectNum)" type="button" class="btn btn-primary" :disabled="status.loadingBtn === item.id">
                    <i v-if="status.loadingBtn === tempProduct.id" class="spinner-grow spinner-grow-sm" role="status"></i>
                    (購物車內已有 {{tempProduct.num}}  {{tempProduct.unit}}) 更新數量
                </button> -->
                </div>
            </div>
            </div>
        </div>
        <!--  產品內容 Modal end -->

        <!-- 購物車頁 Start -->
        <div class="row justify-content-center my-5">
            <div class="col-6">
                <div class="text-right mb-3">
                    <button @click="removeCartAll()" type="button" class="btn btn-outline-danger">
                        <!-- <i class="material-icons align-bottom">delete_forever</i> -->
                        <font-awesome-icon icon="trash-alt"/>
                        刪除所有品項
                    </button>
                </div>
                <table class="table">
                    <thead>
                        <th>刪除</th>
                        <th>品名</th>
                        <th width="140">數量</th>
                        <th >單位</th>
                        <th>單價</th>
                    </thead>
                    <tbody>
                        <tr v-for="item in cart" :key="item.id">
                            <td>
                                <button @click="delFromCart(item.product.id)" type="button" class="btn btn-outline-danger btn-sm">
                                    <!-- <i class="material-icons align-middle">delete_forever</i> -->
                                    <font-awesome-icon icon="trash-alt"/>
                                </button>
                            </td>
                            <td>{{item.product.title}}</td>
                            <td>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <button @click="quantityCalc(item.product.id,item.quantity+1)" class="btn btn-outline-secondary" type="button">
                                            +
                                        </button>
                                    </div>
                                    <!-- 鍵盤Enter後輸入數量 -->
                                    <input @keyup.enter="quantityCalc(item.product.id, $event.target.value)" :value="item.quantity" type="number" min="1" class="form-control text-center px-1" >
                                    <div class="input-group-append">
                                        <button @click="quantityCalc(item.product.id,item.quantity-1)" class="btn btn-outline-secondary" type="button" :disabled="item.quantity === 1">
                                            -
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td>{{item.product.unit}}</td>
                            <td class="text-right">{{item.product.price | money}} 元</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" class="text-right">
                                總計
                            </td>
                            <td class="text-right">
                                {{cartTotal | money}} 元
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <!-- 購物車頁 end -->

        <!-- 訂單表單 start -->
        <div class="row justify-content-center">
            <validation-observer v-slot="{ invalid }" class="col-md-6">
                <form @submit.prevent="successOrder()">
                    <div class="form-group">
                        <validation-provider
                         v-slot="{ errors, classes }"
                         rules="required"
                        >
                            <label for="user-name">收件人姓名</label>
                            <input type="text" id="user-name" class="form-control" placeholder="請輸入姓名" :class="classes" v-model="form.name">
                            <span v-if="errors[0]" class="text-danger">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="form-group">
                        <validation-provider v-slot="{ errors, classes }" rules="email|required">
                            <label for="email">Email</label>
                            <input type="email" id="email" class="form-control" placeholder="請輸入Email" :class="classes" v-model="form.email">
                            <span v-if="errors[0]" class="text-danger">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="form-group">
                        <validation-provider v-slot="{ errors, classes }" rules="required|min:8">
                            <label for="tel">電話</label>
                            <input type="tel" id="tel" class="form-control" placeholder="請輸入電話" :class="classes" v-model="form.tel">
                            <span v-if="errors[0]" class="text-danger">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="form-group">
                        <validation-provider v-slot="{ errors, classes }" rules="required">
                            <label for="address">地址</label>
                            <input type="text" id="address" class="form-control" placeholder="請輸入地址" :class="classes" v-model="form.address">
                            <span v-if="errors[0]" class="text-danger">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="form-group">
                            <label for="payment">付款方式</label>
                            <select name="payment" id="payment" v-model="form.payment" class="form-control">
                                <option value="" disabled>
                                    請選擇付款方式
                                </option>
                                <option value="WebATM">
                                WebATM
                                </option>
                                <option value="ATM">
                                ATM
                                </option>
                                <option value="CVS">
                                CVS
                                </option>
                                <option value="Barcode">
                                Barcode
                                </option>
                                <option value="Credit">
                                Credit
                                </option>
                                <option value="ApplePay">
                                ApplePay
                                </option>
                                <option value="GooglePay">
                                GooglePay
                                </option>
                            </select>
                    </div>
                    <div class="form-group">
                        <!-- <validation-provider v-slot="{ errors, classes }"> -->
                            <label for="message">備註</label>
                           <textarea v-model="form.message" id="message" cols="30" rows="3" class="form-control"></textarea>
                            <!-- <span v-if="errors[0]" class="text-danger">{{ errors[0] }}</span> -->
                        <!-- </validation-provider> -->
                    </div>
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary my-5" :disabled="invalid">
                            確認送出
                        </button>
                    </div>
                </form>
            </validation-observer>
        </div>
        <!-- 訂單表單 end -->
        <!--完成訂單 Modal -->
        <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="successModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="successModalLabel">完成訂單</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    恭喜你已完成訂單。
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                </div>
            </div>
            </div>
        </div>
        <!-- 完成訂單Modal end-->
    </div>
</template>

<script>
export default {
  name: 'CustomerOrder',
  data () {
    return {
      products: [],
      tempProduct: {
      // num: 0,
        selectNum: 0
      },
      form: {
        name: '',
        email: '',
        tel: '',
        address: '',
        payment: '',
        message: ''
      },
      cart: {},
      cartTotal: 0,
      isLoading: false,
      //   user: {
      //       UUID: '1e46f421-bbae-4212-8539-55ea1c5329cf',
      //       API_PATH: 'https://course-ec-api.hexschool.io/api/',
      //   },
      status: {
        loadingBtn: ''
      }
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  },
  methods: {
    // 取得產品列表並渲染畫面
    getProducts (page = 1) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/products?page=${page}`
      // console.log(api);
      this.axios.get(api).then((response) => {
        this.products = response.data.data
        this.isLoading = false
      }).catch((err) => {
        console.log(err)
      })
    },
    // 取得產品詳細資訊並開啟Modal
    getProduct (id) {
      // 設定按鈕disable,spinner效果
      this.status.loadingBtn = id
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/product/${id}`
      // axios非同步遠端取得資料
      this.axios.get(api).then((response) => {
        this.tempProduct = response.data.data
        // 強制雙向綁定訂購數量
        this.$set(this.tempProduct, 'selectNum', 0)

        // 判斷select 數量與該產品在購物車數量一致則selected
        if (this.cart.length) {
          this.cart.forEach(itemCart => {
            if (itemCart.product.id === this.tempProduct.id) {
              this.$set(this.tempProduct, 'selectNum', itemCart.quantity)
            }
          })
        };
        // 開啟產品頁modal
        window.$('#productModal').modal('show')
        // 取回資料後取消按鈕disable,spinner效果
        this.status.loadingBtn = ''
      }).catch((err) => {
        console.log(err)
      })
    },
    // 詳細產品Modal內select改變數量後賦予selectNum
    changeSelected (event) {
      this.$set(this.tempProduct, 'selectNum', event.target.value)
    },
    // 取得購物車內產品列表
    getCart () {
      this.isLoading = true
      // 每次價格要清空，總價才會對
      this.cartTotal = 0
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`
      this.axios.get(api).then((response) => {
        this.cart = response.data.data
        this.cart.forEach((item) => {
        // 每個產品單價*數量的累加等於總價
          this.cartTotal += (item.product.price * item.quantity)
        })
        this.isLoading = false
      })
    },
    // 增加產品到購物車
    addToCart (item, quantity = 1) {
      this.status.loadingBtn = item.id
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`
      const cart = {
        product: item.id,
        quantity
      }
      this.axios.post(api, cart).then((response) => {
        this.getCart()
        this.status.loadingBtn = ''
        window.$('#productModal').modal('hide')
      }).catch((error) => {
        console.log(error.response.data.errors[0])
        alert(error.response.data.errors[0])
        this.status.loadingBtn = ''
        window.$('#productModal').modal('hide')
      })
    },
    // 購物車內產品數量計算
    quantityCalc (id, num) {
    // this.status.loadingBtn = id;
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping`
      const data = {
        product: id,
        quantity: num
      }
      this.axios.patch(api, data).then(() => {
        this.isLoading = false
        this.getCart()
        window.$('#productModal').modal('hide')
        // this.status.loadingBtn = '';
      }).catch((error) => {
        this.isLoading = false
        // this.status.loadingBtn = '';
        window.$('#productModal').modal('hide')
        alert(error.response.data.errors[0])
      })
    },
    // 移除購物車內單項產品
    delFromCart (id) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping/${id}`
      this.axios.delete(api).then(() => {
        this.isLoading = false
        this.getCart()
      })
    },
    // 移除購物車所有內容
    removeCartAll () {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/shopping/all/product`
      this.axios.delete(api).then(() => {
        this.isLoading = false
        this.getCart()
      })
    },
    // 完成訂單
    successOrder () {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/ec/orders`
      this.axios.post(api, this.form).then((response) => {
        if (response.data.data.id) {
          // this.cartTotal = response.data.data.amount;
          // console.log(this.cartTotal);
          window.$('#successModal').modal('show')
          this.isLoading = false
          this.getCart()
        };
      }).catch((error) => {
        this.isLoading = false
        console.log(error.response.data.message)
      })
    }
  }
}
</script>
