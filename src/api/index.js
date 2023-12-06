//这个模块进行API的统一管理
import requests from './ajax';
import mockRequests from './mockAjax';
//三级联动接口
//请求地址：/api/product/getBaseCategoryList   get请求   无参数

export const reqCategoryList = () => requests.get('/product/getBaseCategoryList');

//获取banner（Home首页轮播图接口）
export const reqGetBannerList = () => mockRequests.get('/banner');

//获取floor
export const reqFloorList = () => mockRequests.get('/floor');

//获取search
export const reqGetSearchInfo = (params) => requests({url:"/list", method:"post", data:params});

export const reqGoodsInfo = (skuId) => requests({url:`/item/${skuId}`, method:"get"});// 这里不要params不然会报错

// 将产品添加到购物车中（获取更新某一个产品的个数）
export const reqAddOrUpdateShopCart = (skuId,skuNum) => requests({url:`/cart/addToCart/${skuId}/${skuNum}`, method:"post"});

// 获取购物车数据的接口
export const reqCartList = () => requests({url:"/cart/cartList",method:"get"});

// 删除购物产品的接口
export const reqDeleteCartById = (skuId) => requests({url:`/cart/deleteCart/${skuId}`,method:"delete"});

// 修改商品的选中状态
export const reqUpdateCheckedByid = (skuId,isChecked) => requests({url:`/cart/checkCart/${skuId}/${isChecked}`,method:"get"});

// 获取验证码接口
export const reqGetCode = (phone) => requests({url:`/user/passport/sendCode/${phone}`, method:"get"});

// 注册接口
export const reqUserRegister = (data) => requests({url:"/user/passport/register", data, method:"post"});

// 登录接口
export const reqUserLogin = (data) => requests({url:"/user/passport/login", data, method:"post"});

// 获取用户信息（需要带着用户token向服务器要用户信息）
export const reqUserInfo = () => requests({url:'/user/passport/auth/getUserInfo', method:'get'});

// 退出登录
export const reqLogout = () => requests({url:'/user/passport/logout',method:'get'});

// 结算 ———— 获取用户地址信息
export const reqAddressInfo = ()=>requests({url:'/user/userAddress/auth/findUserAddressList/',method:'get'});

// 获取商品清单
export const reqOrderInfo = ()=>requests({url:'/order/auth/trade',method:'get'});

// 提交订单请求
export const reqSubmitOrder = (tradeNo,data)=>requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'});

// 获取支付信息 需要拿着订单号向服务器发请求获得此次订单的信息
export const reqPayInfo = (orderId)=>requests({url:`/payment/weixin/createNative/${orderId}`,method:'get'});

// 查询支付状态
export const reqPayStatus = (orderId)=>requests({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'});

// 获取订单列表
export const reqMyOrderList = (page,limit)=>requests({url:`/order/auth/${page}/${limit}`,method:'get'});