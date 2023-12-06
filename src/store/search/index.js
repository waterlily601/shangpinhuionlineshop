import { reqGetSearchInfo } from "@/api";

//state：仓库存储数据的地方
const state = {
    searchList: {}
    
};
//mutations: 修改state的唯一手段
const mutations = {
    GETSEARCHLIST(state,searchList){
        state.searchList = searchList;
    }
};
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
   async getSearchList( {commit}, params = {}){
       let result = await reqGetSearchInfo(params);
       if(result.code == 200){
            commit('GETSEARCHLIST',result.data);
       }

   }
   
};
//getters:可以理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    //品牌的数据
    trademarkList(state) {
        return state.searchList.trademarkList || []
    },
    //商品属性
    attrsList(state) {
         return state.searchList.attrsList || []
    },
    goodsList(state) {
        return state.searchList.goodsList || []
    }
};

//对外暴露Store类的一个实例
export default {
    state,
    mutations,
    actions,
    getters
}