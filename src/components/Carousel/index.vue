<template>
   <div class="swiper-container" ref="cur">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(carousal,index) in list" :key="carousal.id">
                <img :src="carousal.imgUrl">
            </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination">
        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        </div>
    </div>
</template>

<script>
import Swiper from "swiper";
export default {
    name: 'Carousel',
    props:['list'],
    watch:{
        list:{
            // 不管你数据有没有变化，我上来立即监听一次
            immediate:true,
            handler(){
                //只能监听到数据已经有了，但是v-for动态渲染结构还是没办法确定
                this.$nextTick(() => {
                     //当执行此回调时，可以保证服务器的数据回来了。v-for执行完毕了（即轮播图的结构一定有了）
                     var mySwiper = new Swiper (
                        this.$refs.cur, 
                        {
                            loop: true, // 循环模式选项

                            // 如果需要分页器
                            pagination: {
                              el: '.swiper-pagination',
                              clickable: true
                            },
                        
                            // 如果需要前进后退按钮
                            navigation: {
                              nextEl: '.swiper-button-next',
                              prevEl: '.swiper-button-prev',
                            },
                    });     
                });
            }
        }
    }
}
</script>

<style scoped>

</style>