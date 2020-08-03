<template>
  <div class="imgCloud">
    <!-- <div class="text-right my-4">
      <button @click="openStorageModal('new')" class="btn btn-outline-primary">
        <i class="material-icons align-middle">add_circle </i>
        <font-awesome-icon icon="plus-square"/>
        <span class="align-middle"> 新增圖片</span>
      </button>
    </div> -->
    <table class="table">
        <thead>
            <tr>
                <th>圖片縮圖</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody v-if="storages.length">
          <tr v-for="(item, index) in storages" :key="index">
            <td><img :src="item.path" width="100px" class="img-fluid"></td>
            <td>
                <button @click="openDeleteModal(item)" class="btn btn-outline-danger py-1">
                    <!-- <i class="material-icons align-middle">delete_forever</i> -->
                    <font-awesome-icon icon="trash-alt"/>
                </button>
            </td>
          </tr>
        </tbody>
    </table>
    <!-- 分頁元件 :pages 取得外層 pagination 頁面資訊 ; @emit-pages 刷新頁面-->
    <div class="d-flex justify-content-center">
      <Pagination :pages="pagination" @emit-pages="getStorages"></Pagination>
    </div>
    <div
         id="openDeleteModal"
         class="modal fade"
         tbindex="-1"
         role="dialog"
         aria-labelledby="openDeleteLable"
         aria-hidden="true"
         >
          <div
           class="modal-dialog"
           role="document">
             <div class="modal-content">
                 <div class="modal-header bg-danger text-white board-danger">
                     <h5 class="modal-title font-weight-normal" id="openDeleteLable">
                         <span>刪除圖片</span>
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
                    <img :src="tempData.path" width="100px" class="img-fluid">
                      確定要刪除此圖片嗎?
                    <!-- <strong class="text-danger font-weight-bold">
                        {{ tempData.path }}
                    </strong> -->
                    <p class="text-danger text-right mb-0">注意!!刪除後將無法復原</p>
                 </div>
                 <div class="modal-footer">
                       <button type="button" class="btn btn-secondary" data-dismiss="modal">
                           取消
                       </button>
                       <button @click="delStorage()" type="button" class="btn btn-danger">
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
  name: 'imgCloud',
  components: {
    Pagination
  },
  data () {
    return {
      storages: {},
      tempData: {},
      pagination: {},
      isLoading: false
    }
  },
  created () {
    this.getStorages()
  },
  methods: {
    getStorages (page = 1, paged = 10) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/storage?page=${page}&paged=${paged}`
      this.$http.get(api).then((response) => {
        this.storages = response.data.data
        this.pagination = response.data.meta.pagination
        this.isLoading = false
        console.log(this.storages)
      })
    },
    openDeleteModal (item) {
      this.tempData = item
      window.$('#openDeleteModal').modal('show')
    },
    delStorage () {
      this.isLoading = true
      const api = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/storage/${this.tempData.id}`
      this.$http.delete(api).then((response) => {
        window.$('#openDeleteModal').modal('hide')
        this.isLoading = false
        this.getStorages()
      })
    }
  }
}
</script>
