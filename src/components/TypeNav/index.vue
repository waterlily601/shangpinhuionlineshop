<template>
    <!-- 商品分类导航 -->
    <div class="type-nav">
            <div class="container">
                <div @mouseleave="leaveShow" @mouseenter="enterShow">
                <h2 class="all">全部商品分类</h2>
                <!-- 过渡动画 -->
                <transition name="sort">
                <div class="sort" v-show="show">
                   <div class="all-sort-list2" @click="goSearch">
                        <div class="item" v-for="(c1,index) in categoryList" :key="c1.categoryId" :class="{cur:currentIndex == index}">
                            <h3 @mouseenter="changeIndex(index)">
                                <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{ c1.categoryName }}</a>
                            </h3>
                            <div class="item-list clearfix" :style="{display:currentIndex==index?'block':'none'}">
                                <div class="subitem" v-for="(c2,index) in c1.categoryChild" :key="c2.categoryId">
                                    <dl class="fore">
                                        <dt>
                                            <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{ c2.categoryName }}</a>
                                             </dt>
                                        <dd>
                                            <em v-for="(c3,index) in c2.categoryChild" :key="c3.categoryId">
                                                <a :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId">{{ c3.categoryName }}</a>
                                            </em>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div> 
                   </div>
                </transition>
                </div>
                <nav class="nav">
                    <a href="###">服装城</a>
                    <a href="###">美妆馆</a>
                    <a href="###">尚品汇超市</a>
                    <a href="###">全球购</a>
                    <a href="###">闪购</a>
                    <a href="###">团购</a>
                    <a href="###">有趣</a>
                    <a href="###">秒杀</a>
                </nav>
            </div>
    </div>
</template>

<script>
//declare module 'lodash/cloneDeep'
import {mapState} from 'vuex';
import throttle from 'lodash/throttle';

export default {
    name:"TypeNav",
    data(){
        return {
            //用于存储用户鼠标移上了哪一个一级分类
            currentIndex:-1,
            show:true
        }
    },
    //当组件挂载完毕，可以向服务器发请求
    mounted(){
        //当组件挂载完毕时，让show属性变为false
        // 通知Vuex发请求获取数据存储在仓库中
        this.$store.dispatch("categoryList");
        //如果不是home路由组件，将typeNav进行隐藏
        if(this.$route.path != '/home'){
            this.show = false;
        }
    },
    computed:{
        ...mapState({
            categoryList:(state) => {
                return state.home.categoryList;
            }
        })
    },
    methods:{
        //鼠标进入 修改响应式数据currentIndex的值
         changeIndex:throttle(function(index){
             this.currentIndex = index;
         },50),

        //一级移除鼠标分类的事件回调
        goSearch(event){
            // 最好的解决方案： 编程式导航 + 事件委派
            // 第一个问题 如何确定点击的是a标签
            // 解决方案：把a标签加上自定义属性 这个自定义属性其他的子节点没有
            let element = event.target;
            let {categoryname,category1id,category2id,category3id} = element.dataset;
            //如果标签身上有categoryname就一定是a标签
            if(categoryname){
                // 整理路由跳转的参数
                let location = { name: "search"};
                let query = {categoryName: categoryname};
                //一级分类、二级分类、三级分类的a标签
                if(category1id){
                    query.category1Id = category1id;
                }else if(category2id){
                    query.category2Id = category2id;
                }else if(category3id){
                    query.category3Id = category3id;
                } 

                //判断：如果路由器跳转时，带有params参数，也需要带着传递过去
                if(this.$route.params){
                    location.params = this.$route.params;
                    //参数整理完成后
                    location.query = query;
                    //进行路由跳转
                    this.$router.push(location);
                }  
            }
        },
        //当鼠标进入时，让商品分类列表进行展示
        enterShow(){
            this.show = true;
        },

        //当鼠标离开的时候，让商品分类列表进行隐藏
        leaveShow(){
            // 判断如果是Search路由组件的时候才会执行
            if(this.$route.path != "/home"){
                this.currentIndex = -1;
                this.show = false;
            }
           
        }
    }
};
</script>

<style scoped lang="less">
    .type-nav {
        border-bottom: 2px solid #e1251b;

        .container {
            width: 1200px;
            margin: 0 auto;
            display: flex;
            position: relative;

            .all {
                width: 210px;
                height: 45px;
                background-color: #e1251b;
                line-height: 45px;
                text-align: center;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
            }

            .nav {
                a {
                    height: 45px;
                    margin: 0 22px;
                    line-height: 45px;
                    font-size: 16px;
                    color: #333;
                }
            }

            .sort {
                position: absolute;
                left: 0;
                top: 45px;
                width: 210px;
                height: 461px;
                position: absolute;
                background: #fafafa;
                z-index: 999;

                .all-sort-list2 {
                    .item {
                        h3 {
                            line-height: 30px;
                            font-size: 14px;
                            font-weight: 400;
                            overflow: hidden;
                            padding: 0 20px;
                            margin: 0;

                            a {
                                color: #333;
                            }
                        }

                        .item-list {
                            display: none;
                            position: absolute;
                            width: 734px;
                            min-height: 460px;
                            background: #f7f7f7;
                            left: 210px;
                            border: 1px solid #ddd;
                            top: 0;
                            z-index: 9999 !important;

                            .subitem {
                                float: left;
                                width: 650px;
                                padding: 0 4px 0 8px;

                                dl {
                                    border-top: 1px solid #eee;
                                    padding: 6px 0;
                                    overflow: hidden;
                                    zoom: 1;

                                    &.fore {
                                        border-top: 0;
                                    }

                                    dt {
                                        float: left;
                                        width: 54px;
                                        line-height: 22px;
                                        text-align: right;
                                        padding: 3px 6px 0 0;
                                        font-weight: 700;
                                    }

                                    dd {
                                        float: left;
                                        width: 415px;
                                        padding: 3px 0 0;
                                        overflow: hidden;

                                        em {
                                            float: left;
                                            height: 14px;
                                            line-height: 14px;
                                            padding: 0 8px;
                                            margin-top: 5px;
                                            border-left: 1px solid #ccc;
                                        }
                                    }
                                }
                            }
                        }

                        &:hover {
                            .item-list {
                                display: block;
                            }
                        }
                    }
                    .cur  {
                        background-color: skyblue;
                    }
                }
            }

            // 过渡动画的样式
            // 过渡动画开始状态(进入)
            .sort-enter{
                height: 0px;
            }

            // 过渡动画结束状态(进入)
            .sort-enter-to{
                height: 461px;
            }

            // 定义动画时间、速率
            .sort-enter-active{
                transition: all .5s linear;
            }
        }
    }
</style>