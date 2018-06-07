// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
import axios from 'axios';
import { Radio,RadioButton,Button, Select,Upload } from 'element-ui';
import VueI18n from 'vue-i18n';
import zhLocale from "../node_modules/element-ui/lib/locale/lang/zh-CN";
import enLocale from "../node_modules/element-ui/lib/locale/lang/en";
import esLocale from "../node_modules/element-ui/lib/locale/lang/es";
import zhTWLocale from "../node_modules/element-ui/lib/locale/lang/zh-TW";


Vue.use(VueI18n);
Vue.use(VueResource);
Vue.use(Button);
Vue.use(Select);
Vue.use(Radio);
Vue.use(RadioButton);
Vue.use(Upload);

const i18n=new VueI18n({
  //部署拿取语言版本
  //
  //此处缺少繁体字版本
  locale:window.sessionStorage.locale?window.sessionStorage.locale:'zh_CN',
  //合并i18n和element编译文件
  messages:{
    //中文
    'zh_CN':Object.assign(require('./common/lang/zh'),zhLocale),
    //英语
    'en_US':Object.assign(require('./common/lang/en'),enLocale),
    //西语
    'es_SP':Object.assign(require('./common/lang/es'),esLocale),
    //繁体中文
    'zh_TW':Object.assign(require('./common/lang/zh-taiwan'),zhTWLocale)
  }
});

//配置i18n和element结合
Vue.use(ElementUI,{
  i18n: (key, value) => i18n.t(key, value)
});
var locale=window.sessionStorage.locale;
document.title=locale=="zh_CN"?"顾客管理":
               locale=="en_US"?"Customer management":
               locale=="es_SP"?"La gestión de clientes":
               locale=="zh_TW"?"顧客管理":"顾客管理";

Vue.prototype.dev={
  getTree:"/customer/core/organization/getCustomerTreeJSON",
  getTypes:"/customer/core/tag/getInstanceTypes",
  getTags:"/customer/core/tag/getAllTagsJSON",
  treeByOrg:"/customer/core/instance/treeByOrganizationJSON",
  screenInstance:"/customer/core/tag/screenInstanceJSON"
};


//部署配置端口//切换接口//拿account id//拿customer id
// Vue.prototype.getPort=window.sessionStorage.ctx;
// Vue.prototype.getAccountId=window.sessionStorage.accountId;
// Vue.prototype.getCustomerId=window.sessionStorage.customerId;
// Vue.prototype.getAccountDemo=window.sessionStorage.accountDemo=="false"?false:true;
// axios.defaults.withCredentials=true;


//开发调试用配置
// Vue.prototype.getAccountId="3dda2fa884ec4e319e2149cf1088be54";
// Vue.prototype.getCustomerId="08dcccb989134de4a58d4f077cd0cb07";
Vue.prototype.getPort="http://localhost:8090/mrj-web-core";
// Vue.prototype.getPort="http://192.168.0.114:8080/mrj-web-core";
// Vue.prototype.getPort="http://192.168.0.152:8080/mrj-web-core";
Vue.prototype.getAccountId="3dda2fa884ec4e319e2149cf1088be54";
Vue.prototype.getCustomerId="08dcccb989134de4a58d4f077cd0cb07";
Vue.prototype.getAccountDemo=false;



Vue.config.productionTip = false;
axios.defaults.responseType='json'
Vue.prototype.$ajax = axios;

//日期格式化
Vue.prototype.formatDate=function(date){
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h=h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var second=date.getSeconds();
  second=second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};

import './assets/js/jquery-2.1.4';
import './assets/css/bootstrap.min.css';
import './assets/css/bootstrap.css';
import './assets/css/common.css';
import './assets/css/face.css';
import 'sweetalert';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts';
import './assets/css/tree.css';

Vue.prototype.$echarts = echarts;



/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  template: '<App/>',
  components: { App }
});
