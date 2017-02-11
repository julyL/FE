import Vue from 'vue';
import App from "../app/page1.vue";
import "../assets/scss/reset.scss";
var app = new Vue({
  el: '#app',
  ...App,
});