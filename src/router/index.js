import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        name: '首頁',
        component: () => import('../views/Index.vue')
      },
      {
        path: '/products',
        name: '產品列表',
        component: () => import('../views/Products.vue')
      },
      {
        // 記得動態ID
        path: '/product/:id',
        name: '產品詳細頁',
        component: () => import('../views/Product.vue')
      },
      {
        path: '/carts',
        name: '購物車',
        component: () => import('../views/Carts.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/admin/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/Dashboard.vue'),
    children: [
      {
        path: 'products',
        name: '產品列表',
        component: () => import('../views/admin/Products.vue')
      },
      {
        path: 'orders',
        name: '訂單列表',
        component: () => import('../views/admin/Orders.vue')
      },
      {
        path: 'coupons',
        name: '優惠卷列表',
        component: () => import('../views/admin/Coupons.vue')
      },
      {
        path: 'imgCloud',
        name: '圖庫列表',
        component: () => import('../views/admin/imgCloud.vue')
      },
      {
        path: 'customerOrders',
        name: '模擬訂單',
        component: () => import('../views/admin/CustomerOrders.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
