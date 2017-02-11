import Vue from 'vue';
import vueRouter from 'vue-router';
import router from './router.js';
import App from './app.vue';
import _ from "lodash";
import "./assets/scss/reset.scss";
import vali from './js/fn/form-validate.js';   //表单验证
import setTitle from './js/fn/setTitle.js';
import store from './js/fn/store.js';
import '../production/js/fn/origin.js';
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '../production/assets/image/error.png',
  attempt: 1
})

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
// Vue.use(MintUI);


window.Vue=Vue;
window.store=store;
window.vali =vali;
window.router=router;
window._=_;
window.setTitle=setTitle;
// import ajax from "axios";
// window.ajax=ajax;
// router.redirect({
//     '/': "/farm-buy" 
// });

router.beforeEach(function(to,from,next) {
      // setTitle(to.meta);
    document.body.scrollTop = 0;
    next();
});
var app = new Vue({
  el: '#app',
  router,
  ...App,
});

