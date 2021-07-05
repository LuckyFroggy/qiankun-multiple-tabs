import store from '@/store'
import { loadMicroApp } from 'qiankun'
export const microAppList = [
    {
        id: 'micro1',
        name: 'micro-1',
        entry: 'https://127.0.0.1:5201',
        container: '#micro1',
        activeRule: '#/micro-1'
    },
    {
        id: 'micro2',
        name: 'micro-2',
        entry: 'https://127.0.0.1:5202',
        container: '#micro2',
        activeRule: '#/micro-2'
    }
]
/**
 * @description 查找当前页签是否是微应用下的页面
 */
export function isMicroApp(path) {
    return !!microAppList.some(item => {
        return path.startsWith(item.activeRule.substring(1))
    })
}
/**
 * @description 查找当前页签是否是微应用下的页面，并返回对应微应用配置项
 */
export function findMicroAppByPath(path) {
    return microAppList.find(item => {
        let activeRule = item.activeRule.substring(1)
        return path.startsWith(activeRule)
    })
}
/**
 * @description 创建微应用
 */
export function createMicroApp(path) {
    return new Promise((resolve, reject) => {
        const loadedMicroApps = { ...store.state.loadedMicroApps } // 已手动挂载的微应用对象
        if (!isMicroApp(path)) {
            // 非微应用直接跳转
            resolve()
            return
        }

        // 微应用跳转处理
        /**
         * @description 1.判断是否已手动加载，是则直接跳转，否则先手动挂载，再跳转
         */
        const microAppResult = findMicroAppByPath(path) // 是否是微应用的跳转
        if (Object.prototype.hasOwnProperty.call(loadedMicroApps, microAppResult.name)) {
            resolve()
            return
        }
        try {
            loadedMicroApps[microAppResult.name] = loadMicroApp(microAppResult) // 加载微应用
            store.dispatch('setLoadedMicroApps', loadedMicroApps)
            // console.log('挂载后的已挂载的微应用==>', store.state.loadedMicroApps)
            resolve()
        } catch (err) {
            reject(err)
            console.log(err)
        }
    })
}
