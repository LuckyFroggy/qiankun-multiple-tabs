export default {
    setTabs(context, value) {
        context.commit('setTabs', value)
    },
    setIframes(context, value) {
        context.commit('setIframes', value)
    },
    setLoadedMicroApps(context, value) {
        context.commit('setLoadedMicroApps', value)
    }
}
