import {reqCategoryList,reqGetBannerList,reqFloorList} from '@/api';

//state：仓库存储数据的地方
const state = {
    categoryList:[],
    bannerList:[],
    floorList:[]
};
//mutations: 修改state的唯一手段
const mutations = {
    CATEGORYLIST(state,categoryList){
        state.categoryList = categoryList;
    },
    BANNERLIST(state,bannerList){
        state.bannerList = bannerList;
    },
    FLOORLIST(state,floorList){
        state.floorList = floorList;
    }
};
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
//这里可以书写业务逻辑，但是不能修改state
//在这里提交mutation 让其修改state
const actions = {
    //通过api里面的    
    async categoryList({commit}){
        let result = await reqCategoryList();
        if(result.code == 200){
            commit("CATEGORYLIST",result.data);
        }
    },
    //获取首页轮播图的数据
    async getBannerList({commit}){
        let result = await reqGetBannerList();
        if(result.code == 200){
            commit('BANNERLIST',result.data);
        }
    },
    async getFloorList({commit}){
        let result = await reqFloorList();
        if(result.code == 200){
            commit('FLOORLIST',result.data);
        }
    }
};
//getters:可以理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    
};

//对外暴露Store类的一个实例
export default {
    state,
    mutations,
    actions,
    getters
}