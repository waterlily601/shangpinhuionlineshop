import axios from "axios";
//引入进度条
import nprogress from "nprogress";
// 在当前模块引入store
import store from '@/store';
// 引入进度条的样式
import "nprogress/nprogress.css"

//利用axios对象的方法create，去创建一个axios实例
//request就是axios，只不过需要配置一下
const requests = axios.create({
    //配置对象
    //基础路径，发请求时路径中会出现api
    baseURL: "/api",
    timeout: 5000
});

//请求拦截器：在发请求之前，请求拦截器可以检测到
//因此可以在请求发出去之前做一些事情
requests.interceptors.request.use((config)=>{
    // 请求时，如果有用户uuid的话给他带过去
    if(store.state.detail.uuid_token){
        // 给请求头添加一个字段userTempId（这个和后台商量好了）
        config.headers.userTempId = store.state.detail.uuid_token;
    }
    
    // 携带token给服务器
    if(store.state.user.token){
        config.headers.token = store.state.user.token;
    }

    //进度条开始动
    nprogress.start();
    return config;
});

//响应拦截器
requests.interceptors.response.use((res)=>{
    //成功的回调函数：服务器响应数据回来后，响应拦截器可以检测到并做一些事情
    return res.data;
},(error)=>{
    //响应失败的回调函数
    nprogress.done();
    return Promise.reject(new Error('faile'));
});

//对外暴露
export default requests;