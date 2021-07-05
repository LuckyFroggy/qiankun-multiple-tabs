import store from '@/store'
function emptyAction() {
    // 提示当前使用的是空 Action
    console.warn('Current execute action is empty!')
}

class Actions {
    // 默认值为空 Action
    actions = {
        onGlobalStateChange: emptyAction,
        setGlobalState: emptyAction
    }

    /**
     * 设置 actions
     */
    setActions(actions) {
        console.log('setActions-actions:', actions)
        this.actions = actions
    }

    /**
     * 映射
     */
    onGlobalStateChange(...args) {
        return this.actions.onGlobalStateChange(...args)
    }

    /**
     * 映射
     */
    setGlobalState(...args) {
        console.log('setGlobalState-args:', args)
        return this.actions.setGlobalState(...args)
    }
}

const actions = new Actions()
export default actions
export let updateMicroAppStrategy = {
    closeTab(props) {
        let keepAlive = store.state.keepAlive
        let tabNameList = props.tabNameList
        tabNameList.forEach(tabName => {
            let index = keepAlive.findIndex(item => {
                return item === tabName
            })
            if (index >= 0) {
                keepAlive.splice(index, 1)
            }
            store.dispatch('SET_KEEP_ALIVE', keepAlive)
        })
    },
    reloadTab(props) {
        let keepAlive = store.state.keepAlive
        let tabNameList = props.tabNameList
        tabNameList.forEach(tabName => {
            let index = keepAlive.findIndex(item => {
                return item === tabName
            })
            store.dispatch('setNeedReload', true)
            setTimeout(() => {
                store.dispatch('setNeedReload', false)
            }, 0)
        })
    }
}
