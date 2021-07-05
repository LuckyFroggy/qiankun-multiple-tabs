<template>
    <div class="">
        微应用2-page3
        <div class="goback" @click="goBack">返回</div>
    </div>
</template>

<script>
export default {
    name: 'p3',
    methods: {
        goBack() {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="less" scoped>
.goback {
    padding: 0 14px;
    color: #2979ff;
    font-size: 16px;
    text-decoration: underline;
    cursor: pointer;
}
</style>
