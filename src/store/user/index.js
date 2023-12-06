import {reqGetCode, reqUserRegister,reqUserLogin,reqUserInfo,reqLogout} from '@/api';
import {setToken, getToken,removeToken} from '@/utils/token';

const state = {
    code:"",
    token:getToken(),
    userInfo:{}
};

const mutations = {
    GETCODE(state, code){
        state.code = code;
    },
    USERLOGIN(state, token){
        state.token = token;
    },
    USERINFO(state,userInfo){
        state.userInfo = userInfo;
    },
    CLEAR(state){
        // 把仓库中无关用户信息清空
        state.token = '';
        state.user={};
        // 本地存储数据清空
        removeToken();
    }
};

const actions = {
    async getCode({commit}, phone){
        let result = await reqGetCode(phone);
        if(result.code == 200){
            commit('GETCODE',result.data);
            return 'ok';
        }else{
            return Promise.reject(new Error('faile'));
        }
    },
    // 用户注册
    async userRegister({commit}, user){
        let result = await reqUserRegister(user);
        if(result.code == 200){
            return 'ok';
        }else{
            return Promise.reject(new Error('faile'));
        }
    },
    // 用户登录
    async userLogin({commit},user){
        let result = await reqUserLogin(user);
        if(result.code == 200){
            commit('USERLOGIN',result.data.token);
            // 持久化存储token
            // localStorage.setItem("TOKEN", result.data.token);
            setToken(result.data.token);
            return 'ok';
        }else{
            return Promise.reject(new Error('faile'));
        }
    },
    // 获取用户信息
    async getUserInfo({commit}){
        let result = await reqUserInfo();
        if(result.code == 200){
            commit('USERINFO',result.data);
            return 'ok';
        }else{
            return Promise.reject(new Error('faile'));
        }
    },
    // 退出登录
    async userLogout({commit}){
        // 只是向服务器发起一次请求，通知服务器清除token
        let result = await reqLogout();
        // 记住：action里面不能操作state，需要提交到mutations来修改state
        if(result.code == 200){
            commit("CLEAR");
            return 'ok';
        }else{
            return Promise.reject(new Error('faile'));
        }
    }
};

const getters = {

};

export default{
    state,
    mutations,
    actions,
    getters
}