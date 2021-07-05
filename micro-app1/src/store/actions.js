export default {
  SET_KEEP_ALIVE(context, value) {
    context.commit("SET_KEEP_ALIVE", value);
  },
  setNeedReload(context, value) {
    context.commit("setNeedReload", value);
  },
};
