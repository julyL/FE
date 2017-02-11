import Vue from 'vue';
import App from "../app/page2.vue";
import "../assets/scss/reset.scss";
var app = new Vue({
  el: '#app',
  ...App,
});