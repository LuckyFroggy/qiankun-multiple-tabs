<template>
    <div class="layout-header">
        <section class="header-wrap">
            <p class="header-logoText">logo</p>
            <p class="header-logout" @click="logout">退出登录</p>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        logout() {
            // 清除页签本地缓存
            
            this.$tabs.closeAllTabs()
            this.$router.replace({
              path:'/login'
            })
        }
    }
}
</script>

<style lang="less" scoped>
.layout-header {
    position: relative;
    min-width: 1200px;

    .header-wrap {
        background: rgba(250, 250, 250, 0.6);
        border-bottom: 1px solid #dddddd;
        height: 56px;
        line-height: 56px;
        display: flex;
        align-items: center;
        padding: 0 24px;
        .header-logoText {
            font-size: 24px;
        }
        .header-logout {
            margin-left: auto;
            font-size: 18px;
            color: #2979ff;
            cursor: pointer;
        }
    }
}
</style>
