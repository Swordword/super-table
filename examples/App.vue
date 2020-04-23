<template>
  <div id="app">
    <div style="padding:100px">
      <SuperTable :tableData="tableData" :headerList="headerList" :editable="true"></SuperTable>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      headerList: [
        { label: '姓名', prop: 'name' },
        { label: '年龄', prop: 'age' },
        { label: '邮箱', prop: 'email' }
      ],
      tableData: [
        {
          name: '张三',
          age: 16,
          email: '123@xyz.com'
        },
        {
          name: '李四',
          age: 20,
          email: '321@xyz.com'
        },
        {
          name: 'Bob',
          age: 6,
          email: '123@xyz.com'
        }
      ],
      page:{
        pageNumber:1,
        pageSize:10,
        recordCount:3
      }
    }
  },
  mounted() {
    // this.$showToast('标题','显示提示内容')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
