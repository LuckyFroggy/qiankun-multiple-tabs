<template>
    <div class="index">
        <div class="list">
            <section class="list-item" v-for="page in pageList" :key="page.id" @click="openLink(page)">
                {{ page.title }}
            </section>
        </div>
    </div>
</template>
<script>
import pageList from './pageList'
import { createMicroApp } from '@/config/microAppConfig.js'
export default {
    data() {
        return {
            pageList
        }
    },
    methods: {
        openLink(page) {
            let { path, query, title } = page
            createMicroApp(path).then(res => {
                this.$tabs.openTab({
                    title,
                    path,
                    query
                })
            })
        }
    },
    mounted() {}
}
</script>

<style lang="less" scoped>
.index {
    width: 1200px;
    margin: 0 auto;
    .list {
        padding: 12px 0;
        display: flex;
        .list-item {
            cursor: pointer;
            padding: 20px;
            color: #2979ff;
        }
    }
}
</style>
