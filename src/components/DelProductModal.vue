<template>
    <!-- Delete Modal -->
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog" aria-labelledby="delModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header text-white bg-danger border-danger">
                <h5 class="modal-title font-weight-normal" id="delModalLabel">刪除產品</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div  class="modal-body">
                確定要刪除 <strong class="text-danger font-weight-bold"> {{ tempProduct.title }} </strong> 嗎?
                <p class="text-danger text-right mb-0">注意!!刪除後將無法復原</p>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button @click="delProduct()" type="button" class="btn btn-danger">確認刪除</button>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'DelProductModal',
  data () {
    return {
    }
  },
  props: {
    tempProduct: {
      type: Object,
      default () {
        return {
          imageUrl: []
        }
      }
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
    delProduct () {
      // 1.透過外層取得API路徑及產品ID等資訊
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product/${this.tempProduct.id}`
      // 2.透過 axios.delete 非同步刪除資料，刪除成功後執行then
      this.axios.delete(api).then((res) => {
        // 3.關閉刪除視窗
        window.$('#delProductModal').modal('hide')
        // 4.利用$emit呼叫外層更新畫面
        this.$emit('update')
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
