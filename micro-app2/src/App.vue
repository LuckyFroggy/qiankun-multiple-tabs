<template>
  <div id="micro2">
    <keep-alive :include="keepAlive" v-if="isRouterAlive">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
import actions from "@/shared/qiankun_actions";
export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
      keepAlive: [],
    };
  },
  created() {
    this.keepAlive = this.$store.state.keepAlive;
    // console.log('this.keepAlive=====>',this.keepAlive);
    
    this.initToken();
  },

  methods: {
    initToken() {
      actions.onGlobalStateChange((state, prevState) => {}, true);
    },
    reload(name = this.$route.name) {
      const index = this.keepAlive.findIndex((item) => item == name);
      this.keepAlive.splice(index, 1);
      this.$nextTick(function () {
        this.keepAlive.push(name);
      });
    },
  },
  watch: {
    "$store.state.keepAlive": function () {
      this.keepAlive = this.$store.state.keepAlive;
      // console.log('this.keepAlivesswww=====>',this.keepAlive);
    },
    "$store.state.needReload": function () {
      if (this.$store.state.needReload) {
        this.reload();
      }
    },
  },
};
</script>
<style lang="less">
#micro1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
