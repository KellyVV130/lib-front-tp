<template>
  <div>
    <el-card class="box-card-cal">
    <el-calendar v-model="value" style="width:380px; height: 500px;" >
    </el-calendar>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: large; font-weight: bolder">借阅记录</span>
<!--        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="index"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="书名"
          width="230">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          width="175">
        </el-table-column>
        <el-table-column
          prop="startDate"
          label="借阅日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="还书/应还日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="50">
          <template slot-scope="scope">
            <i v-if="scope.row.status === 1 " class="el-icon-circle-check"></i>
            <i v-if="scope.row.status === 0 " class="el-icon-error"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BookBorrow',
  data() {
    return {
      value: new Date(),
      tableData: [{
        name:'羊羊羊羊羊羊羊羊羊羊羊羊羊小跳',
        author:'拉巴阿巴阿巴·阿巴阿巴',
        startDate: '2022-05-02',
        endDate:'2022-05-22',
        status:1
      },{
        name:'马大跳2',
        author:'阿巴阿巴',
        startDate: '2022-05-02',
        endDate:'2022-06-02',
        status:0
      },{
        name:'人工智能导论',
        author:'金军委',
        startDate: '2022-05-03',
        endDate:'2022-05-11',
        status:1
      },{
        name:'人工智能原理、技术及应用',
        author:'安俊秀',
        startDate: '2022-05-03',
        endDate: '2022-05-11',
        status:1
      },{
        name:'马小跳4',
        author:'阿巴阿巴',
        startDate: '2022-05-05',
        endDate: '2022-06-05',
        status:0
      },{
        name:'马小跳7',
        author:'阿巴阿巴',
        startDate: '2022-05-05',
        endDate: '2022-06-05',
        status:0
      },{
        name:'马大跳8',
        author:'阿巴阿巴',
        startDate: '2022-05-05',
        endDate: '2022-06-05',
        status:0
      }]
    }
  }
}
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 789px;
    margin-top: 30px;
    margin-left: 30px;
    height: 660px;
  }

  .box-card-cal {
    float: right;
    width: 410px;
    margin-right: 10px;
    padding-right: 10px;
    height: 660px;
  }

</style>
