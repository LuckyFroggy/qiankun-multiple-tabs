<template>
  <div class="layout-container">
    <Header></Header>
    <tab-bar></tab-bar>
    <div class="layout-main">
      <template v-show="!isMicroApp">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </template>

      <template v-show="isMicroApp">
        <div
          :id="item.id"
          v-for="item in microAppList"
          :key="item.id"
          v-show="isMicroApp"
        ></div>
      </template>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import { microAppList, isMicroApp } from "@/config/microAppConfig.js";
export default {
  name: "Layout",
  components: {
    Header,
    TabBar,
  },
  data() {
    return {
        microAppList
    };
  },
  methods: {
    isMicroApp() {
      return isMicroApp(this.$route.path);
    },
  },
};
</script>

<style lang="less" scoped>
.layout-container{
    .layout-main{
        padding: 12px;
    }
}
</style>
