<template>
  <div>
    <Header></Header>
    <!-- 书写路由组件出口的地方 -->
    <router-view></router-view>
    <!-- 在Home、Search是显示的，在登录、注册是隐藏的 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header  from "./components/Header";
import Footer  from "./components/Footer";

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  }
};
</script>

<style scoped>

</style>
