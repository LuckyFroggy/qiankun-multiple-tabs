<template>
    <div class="tabBar">
        <div class="tabs">
            <div v-for="item in tabs" :key="item.title" :class="{ tab: true, active: item.active }" @click="tabClick(item)">
                <div class="tab-wrap">
                    <span class="tab-title">{{ item.title }}</span>
                    <i class="el-icon-close" v-if="item.closeAble" @click.stop="$tabs.closeTab(item)" />
                </div>
            </div>
        </div>
        <!-- <TabMenu></TabMenu> -->
    </div>
</template>
<script>
// import TabMenu from '@c/TabMenu'
export default {
    name: 'TabBar',
    components: {
        // TabMenu
    },
    data() {
        return {
            microApp: null,
            tabs: []
        }
    },
    computed: {},
    methods: {
        tabClick(el) {
            // 切换页签
            if (el.id === this.$tabs.activeTab.id) return // 点击的是当前页签
            this.$tabs.switchTab(el)
        },
        closeOtherClickAble(el) {
            let tabs = [...this.tabs]
            return tabs.some(item => {
                return item.path !== el.path && item.closeAble
            })
        },
        closeAllClickAble() {
            let tabs = [...this.tabs]
            return tabs.some(item => {
                return item.closeAble
            })
        },
        rightMenuObj(item) {
            let _this = this
            let menus = [
                {
                    label: '重新加载',
                    handler() {
                        _this.$tabs.reloadTab(item)
                    },
                    clickAble: item.active
                },
                {
                    label: '关闭',
                    handler() {
                        _this.$tabs.closeTab(item)
                        // _this.closeTab(item)
                    },
                    clickAble: item.closeAble
                },
                {
                    label: '关闭其他',
                    handler() {
                        _this.$tabs.closeOtherTabs(item)
                    },
                    clickAble: this.closeOtherClickAble(item)
                },
                {
                    label: '关闭全部',
                    handler() {
                        _this.$tabs.closeAllTabs(item)
                    },
                    clickAble: this.closeAllClickAble()
                }
            ]
            return menus
        }
    },
    mounted() {
        this.tabs = this.$tabs.tabs
    },
    watch: {
        '$store.state.tabs': function() {
            this.tabs = this.$tabs.tabs
        }
    }
}
</script>
<style lang="less" scoped>
.tabBar {
    display: block;
    width: 100%;
    height: 32px;

    position: relative;
    overflow: hidden;
    &::before {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        content: '';
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
    }
    .tabs {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-flow: row nowrap;
        padding: 0 24px;
        .tab {
            position: relative;
            background: #d6dae0;
            border-radius: 4px 4px 0px 0px;
            transition: all 0.2s ease;
            width: 160px;
            min-width: 50px;
            &:before {
                content: '';
                position: absolute;
                width: 10px;
                height: 10px;
                border-bottom: 4px solid transparent;
                border-right: 4px solid transparent;
                border-bottom-right-radius: 100%;
                left: -10px;
                bottom: -4px;
                transition: all 0.2s ease;
            }
            &:after {
                content: '';
                position: absolute;
                width: 10px;
                height: 10px;
                border-bottom: 4px solid transparent;
                border-left: 4px solid transparent;
                border-bottom-left-radius: 100%;
                right: -10px;
                bottom: -4px;
                z-index: 1;
                transition: all 0.2s ease;
            }
            .tab-wrap {
                position: relative;
                display: flex;
                align-items: center;
                user-select: none;
                text-align: center;
                font-size: 14px;
                padding: 6px 4px;
                cursor: pointer;
                overflow: hidden;
                .tab-title {
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1;
                    white-space: nowrap;
                    flex: 1;
                }

                i {
                    margin-left: auto;
                    color: #999999;
                    font-weight: 600;
                }
            }

            &:not(.active):not(:hover) {
                .tab-wrap {
                    &:before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%);
                        width: 0.5px;
                        height: 12px;
                        opacity: 0.5;
                        background: #a2a4a6;
                    }
                    &:after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        right: 0;
                        transform: translateY(-50%);
                        width: 0.5px;
                        height: 12px;
                        opacity: 0.5;
                        background: #a2a4a6;
                    }
                }
            }
            &:first-of-type {
                .tab-wrap {
                    &:before {
                        opacity: 0 !important;
                    }
                }
            }
            &:last-of-type {
                .tab-wrap {
                    &:after {
                        opacity: 0 !important;
                    }
                }
            }
            &.active,
            &:hover {
                overflow: initial;
                background: #f0f0f0;
                color: #2979ff;
                border-radius: 4px 4px 0px 0px;
                transform: scaleX(1.009);
                z-index: 1;
                transition: all 0.2s ease;
            }
            &.active,
            &:hover {
                &:before {
                    border-bottom: 4px solid #f0f0f0;
                    border-right: 4px solid #f0f0f0;
                }
                &:after {
                    border-bottom: 4px solid #f0f0f0;
                    border-left: 4px solid #f0f0f0;
                }
            }
        }
    }
}
</style>
