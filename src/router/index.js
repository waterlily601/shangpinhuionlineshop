import Vue from 'vue';
import VueRouter from 'vue-router'
import routers from "./routers";
import store from '@/store'
// 重写push和replace
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.push;
VueRouter.prototype.push = function(location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(
            this,
            location,
            () => {},
            () => {}
        );
    }
};
VueRouter.prototype.replace = function(location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject);
    } else {
        originReplace.call(
            this,
            location,
            () => {},
            () => {}
        );
    }
};
//使用插件
Vue.use(VueRouter)
//引入路由组件

// 有个重写push和replace我没写

let router = new VueRouter({
    // 配置路由
    routes:routers,
    scrollBehavior(to, from, savedPosition){
        return {x : 0, y : 0}
    }
});

// 全局守卫：前置守卫（在路由跳转之前进行判断）
router.beforeEach(async (to,from,next)=>{
    // to:可以获取到要跳转的路由信息
    // from：可以获取到从哪个路由而来的信息
    // next:放行函数 next()放行 next(path)放行到指定的路由
    // 用户登录了才会有token，未登录一定不会有token
    let token = store.state.user.token;
    // 用户信息
    //let userInfo = store.state.user.userInfo;
    let name = store.state.user.userInfo.name;
    if(token) {
        // 用户已经登陆了还想去login【不能去，停留在首页】
        if(to.path=='/login' || to.path=='/register'){
            next('/home');
        }else{
            //登录了，但是去的不是login，可以不操作
            if(name){
                next();
            }else{
                // 没有用户信息的话要派发action让仓库存储用户信息再跳转
                try{
                    // 获取用户信息成功
                    await store.dispatch('getUserInfo');
                    next();
                } catch(error) {
                    // token失效了 需要清除token 并退出登录
                    await store.dispatch('userLogout');
                    // 跳转到登录界面
                    next('/login');
                }
            } 
        }
    }else{
        // 未登录 不能去交易相关的、支付相关(pay,paysuccess)、个人中心(center)
        let toPath = to.path;
        if( toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1){
            // 未登录去上面这些路由 ———— 自动跳转到登录页面
            // 把未登录时想去但没有去成的信息，存储于地址栏中【路由】
            next('/login?redirect=' + toPath);
        }else{
             // 未登录去其他路由 ———— 放行
             next();
        }
    }
});
export default router;