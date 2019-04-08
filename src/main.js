import 'babel-polyfill'
import Vue from 'vue'
import NMS from './nms'
import router from './router'
import axios from 'axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView)
Vue.config.productionTip = false

//  request拦截器  -->  全局request添加请求头
axios.interceptors.request.use(config => {
	//  to do 
	return config
}, err => {
  	return Promise.reject(err)
})

//  response拦截器  -->  全局错误处理
axios.interceptors.response.use(response=>{
        return response;
    },
    err=>{
        err.response ? console.log(`${err.response.status} ${err.response.statusText}`) : console.log('Unknow error');
        return Promise.reject(err);
    }
);

Vue.prototype.$http = axios

new Vue({
    el: '#app',
    router,
    components: { NMS },
    template: '<NMS/>'
})
