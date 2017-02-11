import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [{
    path: '',
    component: function(resolve) {
        require(['./views/home.vue'], resolve)
    },
}, {
    path: '/home',
    component: function(resolve) {
        require(['./views/home.vue'], resolve)
    }
}, {
    path: '/page1',
    component: function(resolve) {
        require(['./views/page1.vue'], resolve)
    },
    children: [{
        path: '/page1/page1-1',
        component: function(resolve) {
            require(['./views/page1-1.vue'], resolve)
        },
        meta: "page1-1"
    }]
},  {
    path: '/page2',
    component: function(resolve) {
        require(['./views/page2.vue'], resolve)
    }
}];

let router = new VueRouter({
    routes
});
export default router;
