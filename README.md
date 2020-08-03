---
tags: JavaScript 實戰班
---

# 第六週 Vue Router

- DEMO :[https://rockalen.github.io/js-training-week6/dist/#/](https://rockalen.github.io/js-training-week6/dist/#/)

### Router 運用方法

#### 前台頁面
- 首頁 /
- 關於我們 /about(尚未施作)
- 產品列表 /products
    - 單一產品頁面 /product
- 購物車 /carts
- 購物成功(尚未施作)

#### 後台管理頁面
- 登入頁面 /login
- 產品管理頁面/admin/products
    - 新增、修改商品(component>ProductModal.vue)
    - 刪除商品(component>DelProductModal.vue)
    - 分頁(component>Pagination.vue)
- 優惠券管理頁面/admin/coupons(尚未施作)
- 訂單管理頁面(尚未施作)

#### 專案依賴
1. axios component (import axios from 'axios') - 非同步遠端API存取資料
2. VueAxios component (import VueAxios from 'vue-axios') - 非同步遠端API存取資料
3. vue-loading-overlay component(import Loading from 'vue-loading-overlay') - Loading 頁面視覺效果
4. FontAwesomeIcon component (import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'bootstrap') - FontAwesome Icon
5. bootstrap (@import '~bootstrap/scss/bootstrap')
6. jQuery component (import jQuery from 'jquery')

## 以下為製作筆記

## Router
![](https://i.imgur.com/lF5vJXX.png)
### 網址列上的#/符號
> 如果是SPA架構的話(Single Page Application)
之前是伺服器後端給的路徑，之後是前端模擬的。
讓頁面顯示透過前端路由進行，可以避免後端提供頁面顯示時產生的閃爍，使用者體驗較好。


#### 假設有以上路由要建立，則步驟可為
1. 開.vue檔案 ex: Carts.vue
2. 建立路由 ex: router/index.js
3. 加入路徑 router-link ex: App.vue -> \<router-link>

#### 巢狀路由
![](https://i.imgur.com/QxfFqPZ.png)

```javascript=
const routes = [
  {
    // 單層路由(path開頭需有/符號)
    path: '/admin',
    name: 'Dashboard',
    component: () => import('../views/dashboard/Dashboard.vue'),
    // 巢狀路由(path開頭不需有/符號，將相同結構放在children的array下即可)
    children: [
      {
        path: 'products',
        name: 'admin.products',
        component: () => import('../views/dashboard/Products.vue'),
      },
      {
        path: 'coupons',
        name: 'admin.coupons',
        component: () => import('../views/dashboard/Coupons.vue'),
      },
    ],
  },
]
```

## 登入驗證技巧 (7/24週六直播講)
如果已經登出，不該留在需要登入權限的頁面
![](https://i.imgur.com/ppcwVTB.png)
