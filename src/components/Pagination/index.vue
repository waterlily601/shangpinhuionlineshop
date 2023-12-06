<template>
  <div class="pagination">
    <!-- <h1>{{ startNumAndEndNum }}----当前的页码{{ pageNo }}</h1> -->
    <button :disabled="pageNo==1" @click="$emit('getPageNo', pageNo-1)">上一页</button>
    <!-- 在大于1的时候才显示这个 -->
    <button v-show="startNumAndEndNum.start > 1" @click="$emit('getPageNo', 1)" :class="{active:pageNo == 1}">1</button>
    <button v-show="startNumAndEndNum.start > 2">···</button>

    <!-- 中间部分 v-if 大于start的页码才显示 -->
    <button v-for="(page,index) in startNumAndEndNum.end" :key="index" 
    v-show="page >= startNumAndEndNum.start"
    @click="$emit('getPageNo', page)"
    :class="{active:pageNo == page}">{{ page }}</button>
    
    <button v-show="startNumAndEndNum.end < totalPage - 1" >···</button>
    <button v-show="startNumAndEndNum.end < totalPage" @click="$emit('getPageNo', totalPage)" :class="{active:pageNo == totalPage}">{{ totalPage }}</button>
    <button :disabled="pageNo==totalPage" @click="$emit('getPageNo', pageNo+1)">下一页</button>
    
    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
    props:['pageNo','pageSize','total','continues'],
    computed:{
      // 总共多少页
      totalPage(){
        // 向上取证
        return Math.ceil(this.total / this.pageSize);
      },
      // 计算连续的页码的起始数字与结束数字
      startNumAndEndNum(){
        let {continues, pageNo, totalPage} = this; 
        let start = 0, end = 0;
        
        // 如果不够5页
        if(continues > totalPage){
            start = 1;
            end = this.totalPage;
        }else{
            start = pageNo - parseInt(continues/2);
            end = pageNo + parseInt(continues/2);

            if(start <= 0)
            {
              start = 1;
              end = continues;
            }

            if(end > totalPage)
            {
              start = totalPage - continues + 1;
              end = totalPage;
            }
        }

        return {start, end};
      }
    }
  };
</script>

<style lang="less" scoped>
  .pagination {
    text-align: center;
    button {
      margin: 0 5px;
      background-color: #f4f4f5;
      color: #606266;
      outline: none;
      border-radius: 2px;
      padding: 0 4px;
      vertical-align: top;
      display: inline-block;
      font-size: 13px;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border: 0;

      &[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.active {
        cursor: not-allowed;
        background-color: #409eff;
        color: #fff;
      }
    }
  }

  .active{
    background-color: skyblue;
  }
</style>
