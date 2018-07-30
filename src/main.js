import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App';
import routes from './routes';
import glb from './Global';

import './assets/styles/weui.min.css';
import './assets/styles/app.css';

Vue.prototype.GLOBAL = glb;

Vue.use(VueRouter);

const router = new VueRouter({ routes });

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});