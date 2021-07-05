<template>
    <div class="login" @click="handleClickLogin">登录</div>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        handleClickLogin() {
            this.$router.replace('/')
        }
    }
}
</script>

<style lang="less" scoped>
.login {
    padding: 20px;
    font-size: 20px;
    margin: 0 auto;
    text-align: center;
    cursor: pointer;
    color: #2979ff;
}
</style>
