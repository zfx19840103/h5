import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'login',
            meta: { title: '2020中秋商城' },
            component: () => import(/* webpackChunkName: "login" */ '../components/login.vue'),
        },
        {
            path: '/login',
            name: 'login',
            meta: { title: '2020中秋商城' },
            component: () => import(/* webpackChunkName: "login" */ '../components/login.vue'),
        },
        {
            path: '/product',
            name: 'product',
            meta: { title: '2020中秋商城' },
            component: () => import(/* webpackChunkName: "product" */ '../components/product.vue'),
        },
        {
            path: '/addaddress',
            name: 'addaddress',
            component: () => import(/* webpackChunkName: "addaddress" */ '../components/addaddress.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/ordercheck',
            name: 'ordercheck',
            component: () => import(/* webpackChunkName: "ordercheck" */ '../components/ordercheck.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/ordercheck_zt',
            name: 'ordercheck_zt',
            component: () => import(/* webpackChunkName: "ordercheck_zt" */ '../components/ordercheck_zt.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/ordertrack',
            name: 'ordertrack',
            component: () => import(/* webpackChunkName: "ordertrack" */ '../components/ordertrack.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/myorder',
            name: 'myorder',
            component: () => import(/* webpackChunkName: "myorder" */ '../components/myorder.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/addrise',
            name: 'addrise',
            component: () => import(/* webpackChunkName: "addrise" */ '../components/addrise.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/orderdetail',
            name: 'orderdetail',
            component: () => import(/* webpackChunkName: "orderdetail" */ '../components/orderdetail.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/orderdetail_zt',
            name: 'orderdetail_zt',
            component: () => import(/* webpackChunkName: "orderdetail_zt" */ '../components/orderdetail_zt.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/invoicenews',
            name: 'invoicenews',
            component: () => import(/* webpackChunkName: "invoicenews" */ '../components/invoicenews.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/addinvoice',
            name: 'addinvoice',
            component: () => import(/* webpackChunkName: "addinvoice" */ '../components/addinvoice.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/invoicetime',
            name: 'invoicetime',
            component: () => import(/* webpackChunkName: "invoicetime" */ '../components/invoicetime.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/invoiceopen',
            name: 'invoiceopen',
            component: () => import(/* webpackChunkName: "invoiceopen" */ '../components/invoiceopen.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/invoiceshow',
            name: 'invoiceshow',
            component: () => import(/* webpackChunkName: "invoiceshow" */ '../components/invoiceshow.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/invoiceaddress',
            name: 'invoiceaddress',
            component: () => import(/* webpackChunkName: "invoiceaddress" */ '../components/invoiceaddress.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/workarea',
            name: 'workarea',
            component: () => import(/* webpackChunkName: "workarea" */ '../components/workarea.vue'),
            meta: { title: '2020中秋商城' }
        }
    ]
})

const originalPush = Router.prototype.push
   Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
