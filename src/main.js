import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App';
import routes from './routes';
import global_ from './Global';

Vue.prototype.GLOBAL = global_;

import moment from 'moment';
import 'moment/locale/zh-cn';  // without this line it didn't work
import lodash from 'lodash';

moment.locale('zh-cn');
window.moment = moment;
window._ = lodash;

import './assets/js/topics10';
import './assets/js/topics1000';
import './assets/js/common';
import './assets/styles/weui.min.css';
import './assets/styles/app.css';

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});