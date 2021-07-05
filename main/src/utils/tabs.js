import _ from 'lodash'
import store from '@/store'
import router from '@/router'
import { randomString, isIframe } from '@/utils/tools'
import { createMicroApp, findMicroAppByPath } from '@/config/microAppConfig.js'
import actions from '@/shared/qiankun_actions'
class Tabs {
    constructor() {
        !this.getLocalTabs() && this.setLocalTabs([])
        this.initTabs()
    }

    /**
     * 初始化Tabs
     */
    initTabs() {
        this.compareTabs = this.getLocalTabs()
        this.tabs = this.getLocalTabs()
    }
    /**
     * 将最新的Tabs保存到vuex中
     */
    setLocalTabs(tabs = this.tabs) {
        store.dispatch('setTabs', tabs)
        this.initTabs()
    }
    getLocalTabs() {
        return _.cloneDeep(JSON.parse(localStorage.getItem('tabs')))
    }
    /**
     * 需要新开标签页时调用
     * @param  el
     */
    async openTab(el) {
        let realRoute = el
     
        let openedTab = this.tabs.find(item => {
            return item.originRoute.path === el.path
        }) // 查找已打开的当前Tabs
        if (openedTab && openedTab.realRoute) {
            // 如果存在已经打开的tab，取realRoute的path，跳转
            realRoute = openedTab.realRoute
        }
        let isExist = false
        this.tabs.forEach(item => {
            if (item.originRoute.path === el.path) {
                item.active = true
                isExist = true // 已经存在
            } else {
                item.active = false
            }
        })
        let currentId = randomString(8)
        let tab = {
            id: currentId,
            title: el.title,
            originRoute: {
                path: el.path,
                query: el.query || {},
                params: el.params || {}
            },
            active: true,
            closeAble: true,
            history: [],
            cachePaths: [realRoute.path],
            isIframe: isIframe(el.path)
        }
        if (!isExist) {
            this.tabs.push(tab)
        }
        // if (!isIframe(el.path)) {
        router
            .replace({ path: realRoute.path, query: realRoute.query || {}, params: realRoute.params || {} })
            .then(to => {
                // 只有在新增成功之后才会添加标签页
                this.tabs.forEach(item => {
                    if (item.originRoute.path === el.path) {
                        item.realRoute = {
                            path: to.path,
                            title: to.title,
                            query: to.query,
                            params: to.params
                        }
                    }
                })
                this.setLocalTabs(this.tabs)
            })
            .catch(() => {
                this.initTabs()
            })
        // } else {
        //     router.replace({ path: '/iframe', query: { id: currentId } })
        //     this.setLocalTabs(this.tabs)
        // }
    }
    /**
     * 切换页签Tab时调用
     */
    async switchTab(el) {
       
        let { path, query = {}, params = {} } = el.realRoute
        this.tabs.forEach(item => {
            item.active = el.id === item.id
        })
        this.setLocalTabs(this.tabs)
        // if (!isIframe(path)) {
        createMicroApp(path).then(res => {
            router.replace({ path, query, params })
        })
        // } else {
        //     router.replace({ path: '/iframe', query: { id: this.activeTab.id } })
        // }
    }
    /**
     * 关闭页签
     * @description 遍历tabs找到选中的页签，
     * 如果当前页签的active为true，移除的同时，将后一项active设为true;
     * 如果没有后一项则将前一项active设为true;
     * 如果当前页签的active不为true,则直接移除就行
     */
    closeTab(el) {
        /**
         * 这里的逻辑需要改：
         * 当前页签下可能不止打开过一个微应用（e.g:流程中心页签下打开流程设计器），所以需要根据cachePaths去遍历所有微应用，对每个微应用进行相应的unmount或者update处理
         */
        let tabLength = this.tabs.length
        let currentIndex = this.tabs.findIndex(item => {
            return item.id === el.id
        })
        if (el.active) {
            let selectIndex = 0
            if (currentIndex + 1 === tabLength) {
                // 说明是最后一项，移除将前一项active设为true
                this.tabs[currentIndex - 1].active = true
                selectIndex = currentIndex - 1
            } else {
                this.tabs[currentIndex + 1].active = true
                selectIndex = currentIndex + 1
            }
            let realRoute = this.tabs[selectIndex].realRoute
            router.replace({ path: realRoute.path, query: realRoute.query || {}, params: realRoute.params || {} })
        }
        let loadedMicroApps = store.state.loadedMicroApps
        this.tabs.splice(currentIndex, 1)
        let microApp = findMicroAppByPath(el.realRoute.path)
        
        try {
     

            if (microApp) {
                let currentMircoApp = loadedMicroApps[microApp.name]
                let currentMicroAppHasLeftTab = this.tabs.some(item => {
                    // 判断当前微应用是否还存在其他已经打开的页面，如果没有，直接销毁该微应用；如果有，通知微应用清除当前标签页keepAlive缓存
                    return item.realRoute && item.realRoute.path.match(microApp.activeRule.substring(1))
                })
                if (!currentMicroAppHasLeftTab) {
                    // 直接销毁该微应用
                    currentMircoApp.unmount()
                    delete loadedMicroApps[microApp.name]
                    store.dispatch('setLoadedMicroApps', loadedMicroApps)
                } else {
                    let routeNameList = [...new Set([el.realRoute.path, ...el.cachePaths])]
                    routeNameList = routeNameList.map(item => {
                        item = item.split('/')[2]
                        return item
                    })
                    currentMircoApp.update({ props: { type: 'closeTab', tabNameList: routeNameList } }) // 当点击关闭页签时需要通知微应用销毁当前页面keep-alive
                }
            }
            this.setLocalTabs(this.tabs)

            // debugger
        } catch (error) {
            this.setLocalTabs(this.tabs)
        }
    }
     // /**
    //  * 关闭其他页签
    //  */
    // async closeOtherTabs(el) {
    //     if (!el.active) {
    //         if (!isIframe(el.path)) {
    //             let realRoute = el.realRoute
    //             router.replace({ path: realRoute.path, query: realRoute.query || {}, params: realRoute.params || {} })
    //         } else {
    //             router.replace({ path: '/iframe', query: { id: el.id } })
    //         }
    //     }
    //     this.tabs.map(item => {
    //         item.active = item.id === el.id
    //         return item
    //     })
    //     let needCloseTabs = this.tabs.filter(item => {
    //         return item.id !== el.id && item.closeAble
    //     }) // 对这些进行删除处理
    //     for (let i = 0; i < needCloseTabs.length; i++) {
    //         try {
    //             let items = needCloseTabs[i]
    //             let currentIndex = this.tabs.findIndex(citem => {
    //                 return citem.id === items.id
    //             })
    //             this.tabs.splice(currentIndex, 1)
    //             let loadedMicroApps = store.state.loadedMicroApps
    //             let microApp = findMicroAppByPath(items.path)
    //             if (microApp) {
    //                 let currentMircoApp = loadedMicroApps[microApp.name]
    //                 let currentMicroAppHasLeftTab = this.tabs.some(item => {
    //                     return item.realRoute && item.realRoute.path.match(microApp.activeRule.substring(1))
    //                 })
    //                 if (currentMircoApp) {
    //                     if (!currentMicroAppHasLeftTab) {
    //                         // 直接销毁该微应用
    //                         await currentMircoApp.unmount()
    //                         delete loadedMicroApps[microApp.name]
    //                         store.dispatch('setLoadedMicroApps', loadedMicroApps)
    //                     } else {
    //                         let routeNameList = [...new Set([items.path, ...items.cachePaths])]
    //                         routeNameList = routeNameList.map(item => {
    //                             item = item.split('/')[2]
    //                             return item
    //                         })
    //                         await currentMircoApp.update({ props: { type: 'closeTab', tabNameList: routeNameList } }) // 当点击关闭页签时需要通知微应用销毁当前页面keep-alive
    //                     }
    //                 }
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     // debugger

    //     this.setLocalTabs(this.tabs)

    // }
    /**
     * 关闭所有非固定页签并销毁微应用或微应用中已缓存的页面
     */
    async closeAllTabs(el) {
        // 关闭所有非固定页签并销毁微应用或微应用中已缓存的页面
        let firstFixedTabIndex = this.tabs.findIndex(item => {
            return !item.closeAble
        }) // 首页
        if (el && el.id !== this.tabs[firstFixedTabIndex].id) {
            let realRoute = this.tabs[firstFixedTabIndex].realRoute
            router.replace({ path: realRoute.path, query: realRoute.query || {}, params: realRoute.params || {} })
        }
        let needCloseTabs = this.tabs.filter(item => {
            return item.closeAble
        })
        for (let i = 0; i < needCloseTabs.length; i++) {
            try {
                let items = needCloseTabs[i]
                let currentIndex = this.tabs.findIndex(citem => {
                    return citem.id === items.id
                })
                this.tabs.splice(currentIndex, 1)
                let loadedMicroApps = store.state.loadedMicroApps
                let microApp = findMicroAppByPath(items.realRoute.path)
                if (microApp) {
                    let currentMircoApp = loadedMicroApps[microApp.name]
                    let currentMicroAppHasLeftTab = this.tabs.some(item => {
                        return item.realRoute && item.realRoute.path.match(microApp.activeRule.substring(1))
                    })
                    if (currentMircoApp) {
                        if (!currentMicroAppHasLeftTab) {
                            // 直接销毁该微应用
                            await currentMircoApp.unmount()
                            delete loadedMicroApps[microApp.name]
                            store.dispatch('setLoadedMicroApps', loadedMicroApps)
                        } else {
                            let routeNameList = [...new Set([items.realRoute.path, ...items.cachePaths])]
                            routeNameList = routeNameList.map(item => {
                                item = item.split('/')[2]
                                return item
                            })
                            await currentMircoApp.update({ props: { type: 'closeTab', tabNameList: routeNameList } }) // 当点击关闭页签时需要通知微应用销毁当前页面keep-alive
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        this.setLocalTabs([])
    }
    /**
     * 登录时调用
     */
    async resetTabs() {
        /*this.$store.state.showApp=false
        this.$nextTick(()=>{
            this.$store.state.showApp=true
        })*/
        let loadedMicroApps = store.state.loadedMicroApps
        console.log('登录时是否有已挂载的微应用=>', loadedMicroApps && Object.values(loadedMicroApps).length)
        if (loadedMicroApps && Object.values(loadedMicroApps).length) {
            // 如果有已挂载的微应用，直接清除掉所有的
            let hasRegisterMicroApps = Object.values(loadedMicroApps)
            for (let item of hasRegisterMicroApps) {
                try {
                    await item.unmount()
                } catch (error) {
                    console.log(error)
                }
            }
        }
        store.dispatch('setLoadedMicroApps', {})
        console.log('登录时已挂载的微应用=>', store.state.loadedMicroApps)
        this.setLocalTabs([])
    }
    /**
     * 跳转到当前页签的首页
     * @param el
     */
    turnToFirstPage(el) {
        this.tabs.forEach(item => {
            if (el.path === item.originRoute.path) {
                item.cachePaths = []
                item.realRoute.name = item.name
                item.realRoute.path = item.path
                item.realRoute.query = item.query
                item.realRoute.params = item.params
            }
        })
        this.setLocalTabs(this.tabs)

        router.replace({ path: el.path, query: el.query || {}, params: el.params || {} })
    }
    /**
     * 页签内切换页面时，更新最新的realRoute
     * @param {*} to
     */
    setRealRoute(to) {
        if (!this.tabs || !this.tabs.length) return
        if (!this.currentTabHasChanged()) {
            // 路由修改，但还是在当前页签内,将新路由赋给active为true的
            this.activeTab.cachePaths = [...new Set([...this.activeTab.cachePaths, to.path])]
            this.activeTab.realRoute = {
                path: to.path,
                title: to.title,
                query: to.query || {},
                params: to.params || {}
            }
        }
        this.setLocalTabs(this.tabs)
    }
    /**
     * 判断页签是否发生了变化（新增页签，删除页签，切换页签等）
     */
    currentTabHasChanged() {
        let r1 = this.tabs.find(item => {
            return item.active
        })
        let r2 = this.compareTabs.find(item => {
            return item.active
        })
        // debugger
        return r1.id !== r2.id
    }
    /**
     * 当前选中的页签项
     */
    get activeTab() {
        return _.find(this.tabs, ['active', true])
    }
    activeTabHistoryPush() {
        actions.setGlobalState({ historyAction: null }) // 再置为null
        this.activeTab.history.push(this.activeTab.realRoute) // push当前选中的页签历史记录栈
    }
    activeTabHistoryPop() {
     
        actions.setGlobalState({ historyAction: null }) // 再置为null
        let lastRoute = this.activeTab.history.pop() // pop当前选中的页签历史记录栈
        if (!lastRoute) return
        router.replace({ path: lastRoute.path, query: lastRoute.query || {}, params: lastRoute.params || {} })
    }
    get activeTabHistoryAction() {
        return {
            null: () => {
                return
            },
            push: this.activeTabHistoryPush.bind(this),
            pop: this.activeTabHistoryPop.bind(this)
        }
    }
}
let tabs = new Tabs()
export default tabs
