<template>
    <div id="app">
        <template v-if="!!$route.meta.single">
            <router-view />
        </template>
        <template v-else>
            <Layout></Layout>
        </template>
    </div>
</template>
<script>
import Layout from '@/views/layout/layout'
import { createMicroApp } from '@/config/microAppConfig.js'
import actions from '@/shared/qiankun_actions'
export default {
    components: {
        Layout
    },
    data() {
        return {}
    },
    created() {
        // this.refresh()
        createMicroApp(this.$route.path)
        actions.onGlobalStateChange((state, prev) => {
            let { historyAction, loadMicroApp, openTab } = state
            this.$tabs.activeTabHistoryAction[historyAction]()
           
        })
    },
    methods: {
        refresh() {
            // 页面刷新跳转到首页
            this.$router.replace('/')
        }
    }
}
</script>
<style lang="less">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
