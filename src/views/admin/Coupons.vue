<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right my-4">
            <button @click="openCouponModal('new')" class="btn btn-outline-primary">
                <!-- <i class="material-icons align-middle">add_circle </i> -->
                <font-awesome-icon icon="plus-square"/>
                <span class="align-middle"> 新增優惠卷</span>
            </button>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th>折扣百分比</th>
                    <th>到期日</th>
                    <th>是否啟用</th>
                    <th>編輯</th>
                </tr>
            </thead>
            <tbody v-if="coupons.length">
                <tr v-for="(item, index) in coupons" :key="index">
                    <td>{{ item.title }}</td>
                    <td>{{ item.percent }} %</td>
                    <td>{{ item.deadline.datetime }}</td>
                    <td>
                        <span v-if="item.enabled" class="text-success d-flex align-items-center">
                            <a @click="setCouponEnabled(item)" class="btn text-success p-0" href="#" role="button" :class="{'disabled':loadingBtn === item.id}">
                                <!-- <i class="material-icons font-size-36">toggle_on </i> -->
                                <font-awesome-icon icon="toggle-off"/>
                                <sup v-if='loadingBtn === item.id' class="spinner-grow spinner-grow-sm text-success" role="status">
                                </sup>
                                <sup v-else > on</sup>
                            </a>
                        </span>
                        <span v-else class="text-danger d-flex align-items-center">
                            <a @click="setCouponEnabled(item)" class="btn text-danger p-0" href="#" role="button" :class="{'disabled':loadingBtn === item.id}">
                                <!-- <i class="material-icons font-size-36">toggle_off </i> -->
                                <font-awesome-icon icon="toggle-on"/>
                                <sub v-if='loadingBtn === item.id' class="spinner-grow spinner-grow-sm text-danger" role="status"></sub>
                                <sub v-else > off</sub>
                            </a>
                        </span>
                    </td>
                    <td>
                        <div class="btn-group">
                            <button @click="openCouponModal('edit', item)" class="btn btn-outline-success py-1">
                                <!-- <i class="material-icons align-middle">edit</i> -->
                                <font-awesome-icon icon="edit"/>
                            </button>
                            <button @click="openCouponModal('delete', item)" class="btn btn-outline-danger py-1">
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
          <Pagination :pages="pagination" @emit-pages="getCoupons"></Pagination>
        </div>
        <div
        id="couponModal"
        class="modal fade"
        tabindex="-1"
        role="dialog"
        aria-labelledby="couponModalLabel"
        aria-hidden="true"
        >
            <div
                class="modal-dialog"
                role="document"
            >
                <div class="modal-content">
                    <div class="modal-header">
                        <h5
                        id="couponModalLabel"
                        class="modal-title"
                        >
                        {{ isNew ? '新增優惠卷' : '更新優惠券' }}
                        </h5>
                        <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        >
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                        <label for="title">標題</label>
                        <input
                            id="title"
                            v-model="tempCoupon.title"
                            type="text"
                            class="form-control"
                            placeholder="請輸入標題"
                        >
                        </div>
                        <div class="form-group">
                        <label for="coupon_code">優惠碼</label>
                        <input
                            id="coupon_code"
                            v-model="tempCoupon.code"
                            type="text"
                            class="form-control"
                            placeholder="請輸入優惠碼"
                        >
                        </div>
                        <div class="form-group">
                        <label for="due_date">到期日</label>
                        <input
                            id="due_date"
                            v-model="due_date"
                            type="date"
                            class="form-control"
                        >
                        </div>
                        <div class="form-group">
                        <label for="due_time">到期時間</label>
                        <input
                            id="due_time"
                            v-model="due_time"
                            type="time"
                            step="1"
                            class="form-control"
                        >
                        </div>
                        <div class="form-group">
                        <label for="price">折扣百分比</label>
                        <input
                            id="price"
                            v-model="tempCoupon.percent"
                            type="number"
                            class="form-control"
                            placeholder="請輸入折扣數量"
                        >
                        </div>
                        <div class="form-group">
                        <div class="form-check">
                            <input
                            id="enabled"
                            v-model="tempCoupon.enabled"
                            class="form-check-input"
                            type="checkbox"
                            :true-value="true"
                            :false-value="false"
                            >
                            <label
                            class="form-check-label"
                            for="enabled"
                            >是否啟用</label>
                        </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                        type="button"
                        class="btn btn-secondary"
                        data-dismiss="modal"
                        >
                        關閉
                        </button>
                        <button
                        type="button"
                        class="btn btn-primary"
                        @click="updateCoupon"
                        >
                        {{ isNew ? '新增優惠卷' : '更新優惠券' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div
         id="delCouponModal"
         class="modal fade"
         tbindex="-1"
         role="dialog"
         aria-labelledby="delCouponLable"
         aria-hidden="true"
         >
          <div
           class="modal-dialog"
           role="document">
             <div class="modal-content">
                 <div class="modal-header bg-danger text-white board-danger">
                     <h5>
                         <span>刪除優惠卷</span>
                     </h5>
                     <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                     >
                     <span aria-hidden="true">&times;</span>
                     </button>
                 </div>
                 <div class="modal-body">
                      確定要刪除
                    <strong class="text-danger font-weight-bold">
                        {{ tempCoupon.title }}
                    </strong> 嗎?
                    <p class="text-danger text-right mb-0">注意!!刪除後將無法復原</p>
                 </div>
                 <div class="modal-footer">
                       <button type="button" class="btn btn-secondary" data-dismiss="modal">
                           取消
                       </button>
                       <button @click="delCoupon()" type="button" class="btn btn-danger">
                           確認刪除
                       </button>
                 </div>
             </div>
          </div>
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'
export default {
  name: 'Coupons',
  components: {
    Pagination
  },
  data () {
    return {
      coupons: {},
      tempCoupon: {
        title: '',
        code: '',
        percent: 100,
        enabled: false,
        deadline_at: 0
      },
      isLoading: false,
      pagination: {},
      loadingBtn: '',
      isNew: true,
      due_date: '',
      due_time: '',
      status: ''
    }
  },
  created () {
    this.getCoupons()
  },
  methods: {
    getCoupons (page = 1, paged = 10) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/coupons?page=${page}&paged=${paged}`
      this.$http.get(api).then((response) => {
        this.coupons = response.data.data
        this.pagination = response.data.meta.pagination
        this.isLoading = false
        // console.log(this.coupons)
      })
    },
    openCouponModal (act, item) {
    //   this.act = act
      switch (act) {
        case 'new':
          this.isNew = true
          this.tempCoupon = {}
          this.due_date = ''
          this.due_time = ''
          window.$('#couponModal').modal('show')
          break
        // 為了 const 與 let 宣告環境較特別，故需要在 case 外層宣告一個 {} 確保作用域
        case 'edit': {
          this.isNew = false
          this.loadingBtn = item.id
          this.tempCoupon = item
          // 好像不需要強制存入，以下先 mark
          // this.tempCoupon = Object.assign({}, item)
          // 使用 split 切割到期日為日期與時間分開
          const deadline = this.tempCoupon.deadline.datetime.split(' ')
          this.due_date = deadline[0]
          this.due_time = deadline[1]
          window.$('#couponModal').modal('show')
          this.loadingBtn = ''
          break
        }
        case 'delete':
          this.tempCoupon = item
          window.$('#delCouponModal').modal('show')
          break
        default:
          break
      }
    },
    updateCoupon () {
      this.isLoading = true
      let api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/coupon`
      this.status = '已成功新增一筆優惠卷~太棒了喔!'
      // 注意httpMethod要小寫
      let httpMethod = 'post'
      if (!this.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/coupon/${this.tempCoupon.id}`
        httpMethod = 'patch'
        this.status = '太好了~本筆優惠卷已更新成功!'
      }
      // 組合日期時間
      this.tempCoupon.deadline_at = `${this.due_date} ${this.due_time}`
      console.log(this.tempCoupon.deadline_at)
      this.$http[httpMethod](api, this.tempCoupon).then((response) => {
        window.$('#couponModal').modal('hide')
        if (response.status === 200) {
          console.log('新增完成!')
          // 參考範例製作吐司提示訊息
          this.$bus.$emit('message:push',
            this.status,
            'success')
          this.getCoupons()
        } else {
          console.log(response.data.message)
        }
        this.isLoading = false
      }).catch((error) => {
        window.$('#couponModal').modal('hide')
        this.$bus.$emit('message:push',
            `喔歐~出現錯誤惹:
        ${error.response.data.message}(${error.response.status})`,
            'danger')
        this.isLoading = false
      })
    },
    delCoupon () {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/coupon/${this.tempCoupon.id}`
      this.$http.delete(api).then((response) => {
        window.$('#delCouponModal').modal('hide')
        if (response.status === 200) {
          // 參考範例製作吐司提示訊息
          this.$bus.$emit('message:push',
            '本筆資料已刪除成功!',
            'success')
          this.getCoupons()
        } else {
          this.$bus.$emit('message:push',
            `喔歐~出現錯誤惹:
            ${response.data.message}`,
            'danger')
        }
        this.isLoading = false
        // this.getCoupons()
      }).catch((error) => {
        window.$('#delCouponModal').modal('hide')
        this.$bus.$emit('message:push',
            `喔歐~出現錯誤惹:
        ${error.response.data.message}(${error.response.status})`,
            'danger')
        this.isLoading = false
      })
    },
    setCouponEnabled (item) {
      this.loadingBtn = item.id
      // 1.深層複製單筆資料至暫存 tempProduct
      this.tempCoupon = JSON.parse(JSON.stringify(item))
      // 2.設定API位置
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/coupon/${this.tempCoupon.id}`
      // 3.設定是否上架，如果已上架，設定為下架，反之設定為上架
      if (this.tempCoupon.enabled) {
        this.tempCoupon.enabled = false
      } else {
        this.tempCoupon.enabled = true
      }
      // 4.使用 axios.patch API 非同步更新遠端資料
      this.axios.patch(api, this.tempCoupon).then(() => {
        this.loadingBtn = ''
        // 5.更新完成後即刷新產品列表
        this.getCoupons()
      }).catch((error) => {
        this.$bus.$emit('message:push',
            `喔歐~出現錯誤惹:
        ${error.response.data.message}(${error.response.status})`,
            'danger')
        this.loadingBtn = ''
      })
    }
  }
}
</script>
