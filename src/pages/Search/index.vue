<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }}<i @click="removeCategoryName">×</i></li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }}<i @click="removeKeyword">×</i></li>
            <!-- 品牌信息的面包屑-->
            <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.split(":")[1] }}<i @click="removeTradeMark">×</i></li>
            <!-- 平台售卖的属性值展示 -->
            <li class="with-x" v-for="(attrValue, index) in searchParams.props" v-show="attrValue" :key="index">{{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i></li>
          </ul>
        </div>

        <!--selector 子给父发数据-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 排序的结构 -->
              <ul class="sui-nav">
                <li :class="{active:isOne}" @click="changeOrder('1')">
                  <a>综合<span v-show="isOne" class="iconfont" :class="{'icon-UP':isAsc,'icon-DOWN':isDesc}"></span></a>
                </li>
                <li :class="{active:isTwo}" @click="changeOrder('2')">
                  <a>价格<span v-show="isTwo" class="iconfont" :class="{'icon-UP':isAsc,'icon-DOWN':isDesc}"></span></a>
                </li>
              </ul>
            </div>
          </div>

          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(good, index) in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 在路由跳转时要记得带上id参数(params)！ -->
                    <router-link :to="`detail/${good.id}`">
                      <img :src="good.defaultImg" />
                    </router-link> 
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">Apple苹果iPhone
                      {{ good.title }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination 
              :pageNo = "searchParams.pageNo" 
              :pageSize="searchParams.pageSize" 
              :total="total" 
              :continues="5" 
              @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchSelector from './SearchSelector/SearchSelector';
  import { mapGetters,mapState } from 'vuex';
  export default {
    name: 'Search',
    components: {
      SearchSelector
    },
    data() {
      return {
        searchParams:{
          category1Id:"",
          category2Id:"",
          category3Id:"",
          categoryName:"",
          keyword:"",
          order:"1:desc",
          pageNo:1,
          pageSize:3,
          props: [""],
          trademark:""
        }
      };
    },
    // 在组件挂载前先执行一次
    beforemounted(){
       // 把参数值赋给 searchParams 
       Object.assign(this.searchParams, this.$route.query, this.$route.params);
    },
    mounted(){
      this.getData();
    },
    computed: {
      ...mapGetters(["goodsList"]),
      isOne(){
        return this.searchParams.order.indexOf('1') != -1;
      },
      isTwo(){
        return this.searchParams.order.indexOf('2') != -1;
      },
      isAsc(){
        return this.searchParams.order.indexOf('asc') != -1;
      },
      isDesc(){
        return this.searchParams.order.indexOf('desc') != -1;
      },
      // 获取search模块展示产品一共多少数据
      ...mapState({
        total:state=>state.search.searchList.total
      })
    },
    methods:{
      // 向服务器发请求获取search模块数据（因为需要根据参数不同来返回不同的数据）
      getData(){
         this.$store.dispatch("getSearchList", this.searchParams);
      },
      removeCategoryName(){
        this.searchParams.categoryName = undefined;
        this.searchParams.category1Id = undefined;
        this.searchParams.category2Id = undefined;
        this.searchParams.category3Id = undefined;
        // 数据置空后还需要像服务器再发一次请求
        this.getData();
        // 地址栏也需要修改：进行路由跳转
        if(this.$route.params){
          // 当路径中出现params的时候，应该带着
           this.$router.push({name:"search", params:this.$route.params});
        }
      },
      removeKeyword(){
        // 给服务器带的参数searchParams的keyword置空
        this.searchParams.keyword = undefined;
        // 再次发送请求
        this.getData();
        // 通知兄弟组件Header删除关键字
        this.$bus.$emit("clear");
        // 进行路由的跳转
        if(this.$route.query){
          this.$router.push({name:"search", query:this.$route.query});
        }
      },
      // 自定义事件的回调
      trademarkInfo(trademark){
          // 整理品牌字段的参数 "ID:品牌名称"
          this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
          // 再发一次请求获取search模块列表数据进行展示
          this.getData();
      },
      // 删除品牌信息
      removeTradeMark(){
        this.searchParams.trademark = undefined;
        this.getData();
      },
      // 收集平台属性的回调
      attrInfo(attr, attrValue){
        let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
        // 需要做一下数组去重：这个元素不在数组中时再添加
        if(this.searchParams.props.indexOf(props) == -1){
           this.searchParams.props.push(props);
        }
        this.getData();
      },
      // 删除售卖属性
      removeAttr(index){
          // 再次整理参数
          this.searchParams.props.splice(index, 1);
          this.getData();
      },
      changeOrder(flag){
        // flag 形参，他是一个标记，代表用户点击的是 综合 还是 价格
        // 首先我得知道他现在是升序还是降序的
        let originSort = this.searchParams.order.split(":")[1];
        // 起始是 1 还是 2（综合还是价格）
        let originFlag = this.searchParams.order.split(":")[0];

        // 准备一个新的order的属性值
        let newOrder = '';
        // 这个能确定点的一定是综合
        if(flag == originFlag){
          newOrder = `${originFlag}:${originSort=="desc"?"asc":"desc"}`;
        }else{
          // 点击的是价格 默认降序
          newOrder =  `${flag}:${'desc'}`;
        }

        // 将新的 order 赋予 searchParams
        this.searchParams.order = newOrder;
        // 再次发请求
        this.getData();
      },
      // 将当前页码数传递给父组件的回调
      getPageNo(PageNo){
        //整理带给服务器的参数
        this.searchParams.pageNo = PageNo;
        this.getData();
      }
    },
    // 数据监听：监听组件实例身上的属性的属性值变化
    watch:{
      // 在这里监听路由的信息，如果发生变化，再次发起请求
      $route(newValue, oldValue){
        // console.log(this.searchParams);
        // 再次发送请求之前需要整理一次给服务器的参数
        Object.assign(this.searchParams,this.$route.query,this.$route.params);
        // 再次发起ajax请求
        this.getData();
        // 每一次请求结束之后，需要清理一下服务器参数，把一二三级分类的id置空
        this.searchParams.category1Id = undefined;
        this.searchParams.category2Id = undefined;
        this.searchParams.category3Id = undefined;
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    margin: 10px 0;

    .py-container {
      width: 1200px;
      margin: 0 auto;

      .bread {
        margin-bottom: 5px;
        overflow: hidden;

        .sui-breadcrumb {
          padding: 3px 15px;
          margin: 0;
          font-weight: 400;
          border-radius: 3px;
          float: left;

          li {
            display: inline-block;
            line-height: 18px;

            a {
              color: #666;
              text-decoration: none;

              &:hover {
                color: #4cb9fc;
              }
            }
          }
        }

        .sui-tag {
          margin-top: -5px;
          list-style: none;
          font-size: 0;
          line-height: 0;
          padding: 5px 0 0;
          margin-bottom: 18px;
          float: left;

          .with-x {
            font-size: 12px;
            margin: 0 5px 5px 0;
            display: inline-block;
            overflow: hidden;
            color: #000;
            background: #f7f7f7;
            padding: 0 7px;
            height: 20px;
            line-height: 20px;
            border: 1px solid #dedede;
            white-space: nowrap;
            transition: color 400ms;
            cursor: pointer;

            i {
              margin-left: 10px;
              cursor: pointer;
              font: 400 14px tahoma;
              display: inline-block;
              height: 100%;
              vertical-align: middle;
            }

            &:hover {
              color: #28a3ef;
            }
          }
        }
      }

      .details {
        margin-bottom: 5px;

        .sui-navbar {
          overflow: visible;
          margin-bottom: 0;

          .filter {
            min-height: 40px;
            padding-right: 20px;
            background: #fbfbfb;
            border: 1px solid #e2e2e2;
            padding-left: 0;
            border-radius: 0;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

            .sui-nav {
              position: relative;
              left: 0;
              display: block;
              float: left;
              margin: 0 10px 0 0;

              li {
                float: left;
                line-height: 18px;

                a {
                  display: block;
                  cursor: pointer;
                  padding: 11px 15px;
                  color: #777;
                  text-decoration: none;
                }

                &.active {
                  a {
                    background: #e1251b;
                    color: #fff;
                  }
                }
              }
            }
          }
        }

        .goods-list {
          margin: 20px 0;

          ul {
            display: flex;
            flex-wrap: wrap;

            li {
              height: 100%;
              width: 20%;
              margin-top: 10px;
              line-height: 28px;

              .list-wrap {
                .p-img {
                  padding-left: 15px;
                  width: 215px;
                  height: 255px;

                  a {
                    color: #666;

                    img {
                      max-width: 100%;
                      height: auto;
                      vertical-align: middle;
                    }
                  }
                }

                .price {
                  padding-left: 15px;
                  font-size: 18px;
                  color: #c81623;

                  strong {
                    font-weight: 700;

                    i {
                      margin-left: -5px;
                    }
                  }
                }

                .attr {
                  padding-left: 15px;
                  width: 85%;
                  overflow: hidden;
                  margin-bottom: 8px;
                  min-height: 38px;
                  cursor: pointer;
                  line-height: 1.8;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;

                  a {
                    color: #333;
                    text-decoration: none;
                  }
                }

                .commit {
                  padding-left: 15px;
                  height: 22px;
                  font-size: 13px;
                  color: #a7a7a7;

                  span {
                    font-weight: 700;
                    color: #646fb0;
                  }
                }

                .operate {
                  padding: 12px 15px;

                  .sui-btn {
                    display: inline-block;
                    padding: 2px 14px;
                    box-sizing: border-box;
                    margin-bottom: 0;
                    font-size: 12px;
                    line-height: 18px;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    border-radius: 0;
                    background-color: transparent;
                    margin-right: 15px;
                  }

                  .btn-bordered {
                    min-width: 85px;
                    background-color: transparent;
                    border: 1px solid #8c8c8c;
                    color: #8c8c8c;

                    &:hover {
                      border: 1px solid #666;
                      color: #fff !important;
                      background-color: #666;
                      text-decoration: none;
                    }
                  }

                  .btn-danger {
                    border: 1px solid #e1251b;
                    color: #e1251b;

                    &:hover {
                      border: 1px solid #e1251b;
                      background-color: #e1251b;
                      color: white !important;
                      text-decoration: none;
                    }
                  }
                }
              }
            }
          }
        }

        .page {
          width: 733px;
          height: 66px;
          overflow: hidden;
          float: right;

          .sui-pagination {
            margin: 18px 0;

            ul {
              margin-left: 0;
              margin-bottom: 0;
              vertical-align: middle;
              width: 490px;
              float: left;

              li {
                line-height: 18px;
                display: inline-block;

                a {
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  border: 1px solid #e0e9ee;
                  margin-left: -1px;
                  font-size: 14px;
                  padding: 9px 18px;
                  color: #333;
                }

                &.active {
                  a {
                    background-color: #fff;
                    color: #e1251b;
                    border-color: #fff;
                    cursor: default;
                  }
                }

                &.prev {
                  a {
                    background-color: #fafafa;
                  }
                }

                &.disabled {
                  a {
                    color: #999;
                    cursor: default;
                  }
                }

                &.dotted {
                  span {
                    margin-left: -1px;
                    position: relative;
                    float: left;
                    line-height: 18px;
                    text-decoration: none;
                    background-color: #fff;
                    font-size: 14px;
                    border: 0;
                    padding: 9px 18px;
                    color: #333;
                  }
                }

                &.next {
                  a {
                    background-color: #fafafa;
                  }
                }
              }
            }

            div {
              color: #333;
              font-size: 14px;
              float: right;
              width: 241px;
            }
          }
        }
      }
    }
  }
</style>