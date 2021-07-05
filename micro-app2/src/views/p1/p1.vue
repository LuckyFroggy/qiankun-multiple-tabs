<template>
  <div class="">
      微应用2-page1
      <input type="text" v-model="form.name" placeholder="测试页签切换或关闭数据是否保持" class="form-input" />
  </div>
</template>

<script>
export default {
    name:'p1',
    data(){
        return {
            form:{
                name:''
            }
        }
    }
}
</script>

<style lang="less" scoped>
.form-input{
    width: 370px;
    height: 32px;
    line-height: 32px;
    border: 1px solid #2979ff;
    padding: 0 6px;
    color: #333;
    border-radius: 2px;
    outline: none
}
</style>