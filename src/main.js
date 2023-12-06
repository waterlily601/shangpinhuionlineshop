import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
//引入三级联动的组件
import TypeNav from '@/components/TypeNav'
import router from './router'
//将其注册为全局组件 第一个参数 全局组件的名字 第二个参数 哪一个组件
//引入路由
// import router from '@/router'
import store from '@/store'
//引入mock数据
import '@/mock/mockServe' 
//引入swiper样式
import "swiper/css/swiper.css"
// 统一接口api文件夹里面全部请求函数
import * as API from '@/api';

import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import { Button,MessageBox } from 'element-ui';
import myPlugins from '@/plugins/myPlugins';
// 引入插件
// 图片懒加载
import img from '@/components/images/wx_cz.jpg'
import VueLazyload  from 'vue-lazyload';
import validate from "@/plugins/validate";

// 注册插件
Vue.use(VueLazyload,{
    preLoad: 1.3,
    error: 'dist/error.png',
    loading: img,
    attempt: 1
});

// 使用路由插件
Vue.use(VueRouter);
Vue.component(TypeNav.name,TypeNav);
Vue.component(Carousel.name, Carousel);
Vue.component(Pagination.name, Pagination);
Vue.component(Button.name,Button);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  // 全局事件总线 $bus 的配置
  beforeCreate(){
      Vue.prototype.$bus = this;
      Vue.prototype.$API = API;
  },
  //注册路由
  router,
  //注册vuex仓库：此时组件实例的身上会多一个$store属性
  store
}).$mount('#app')
