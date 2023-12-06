// 路由配置信息
// import Home from "@/pagaes/Home/Home.vue";
// import Login from '@/pages/Login'
// import Search from '@/pages/Search'
// import Register from '@/pages/Register'
// import Detail from '@/pages/Detail'
// import AddCartSuccess from '@/pages/AddCartSuccess'
// import Shopcart from '@/pages/ShopCart'
// import Trade from '@/pages/Trade'
// import Pay from '@/pages/Pay'
// import PaySuccess from '@/pages/PaySuccess'
// import Center from '@/pages/Center'
// 引入二级路由组件
// import MyOrder from '@/pages/Center/myOrder'
// import GroupOrder from '@/pages/Center/groupOrder'

export default [ 
    {
        path:"/home",
        component: () => import("@/pages/Home"),
        meta:{show:true}
    },
    {
        path:"/center",
        component:() => import("@/pages/Center"),
        meta:{show:true},
        // 二级路由组件
        children:[
            {
                path:'myorder',
                component: () => import("@/pages/Center/myOrder")
            },
            {
                path:'grouporder',
                component: () => import("@/pages/Center/groupOrder")
            },
            // 为了不让右侧出现白页 重定向一下
            {
                path:'/center',
                redirect:'/center/myorder'
            }
        ]
    },
    {
        path:"/paysuccess",
        component:() => import("@/pages/PaySuccess"),
        meta:{show:true},
        // beforeEnter: (to,from,next) => {
        //     if(from('/pay')){
        //         next();
        //     }else{
        //         next(false);
        //     }
        // }
    },
    {
        path:"/login",
        component:() => import("@/pages/Login"),
        meta:{show:true}
    },
    {
        path:"/search/:keyword?",
        component:() => import("@/pages/Search"),
        meta:{show:true},
        name:"search",
        props: ($route) => ({
            keyword: $route.params.keyword,
            k: $route.query.k,
        }), 
    },
    {
        path:"/register",
        component:() => import("@/pages/Register"),
        meta:{show:true}
    },
    {
        path:"/detail/:skuId",
        component:() => import("@/pages/Detail"),
        meta:{show:true}
    },
    {
        name:"addcartsuccess",
        path:"/addcartsuccess",
        component:() => import("@/pages/AddCartSuccess"),
        meta:{show:true}
    },
    {
        path:"/shopcart",
        name: "ShopCart",
        component:() => import("@/pages/ShopCart"),
        meta:{show:true}
    },
    {
        path:"/trade",
        component:() => import("@/pages/Trade"),
        meta:{show:true},
        // 路由独享守卫 能不能进来要判断
        beforeEnter:(to,from,next) => {
            // 去交易页面，必须是从购物车而来
            if(from.path=="/shopcart"){
                next();
            }else{
                // 其他的路由组件不能直接跳转到这个，停留在当前
                next(false);
            }
        }
    },
    {
        path:"/pay",
        component:() => import("@/pages/Pay"),
        meta:{show:true},
        beforeEnter:(to,from,next) => {
            if(from.path == '/trade'){
                next();
            }else{
                next(false);
            }
        }
    },
    //重定向，在项目运行的时候访问/，立马让他定向到首页
    {
        path:'*',
        redirect:"/home"
    }
];