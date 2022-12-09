<template>
  <div>
    <el-card class="box-card-cal">
    <el-calendar v-model="value" style="width:520px; height: 500px;" >
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
          prop="resourceName"
          label="书名"
          width="230">
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="author"-->
<!--          label="作者"-->
<!--          width="175">-->
<!--        </el-table-column>-->
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
          prop="xx"
          label="状态"
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" v-if="!scope.row.borrowed" type="success" plain>已还</el-button>
            <el-button size="mini" v-if="!scope.row.borrowed" type="info" plain>预约</el-button>
            <el-button size="mini" v-if="scope.row.borrowed" type="danger" plain>未还</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { getBorrowList, postpone } from '@/api/borrow'
export default {
  name: 'BookBorrow',
  data() {
    return {
      value: new Date(),
      pagesize: 10,
      tableData: [{
        resourceName:'羊羊羊羊羊羊羊羊羊羊羊羊羊小跳',
        author:'拉巴阿巴阿巴·阿巴阿巴',
        startDate: '2022-05-02',
        endDate:'2022-05-22',
        status:1
      },{
        resourceName:'马大跳2',
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
        status:2
      },{
        name:'马大跳8',
        author:'阿巴阿巴',
        startDate: '2022-05-05',
        endDate: '2022-06-05',
        status:2
      }]
    }
  },
  mounted() {
    this.getBorrowList()
  },
  methods: {
    getBorrowList() {
      const data = {
        userId: parseInt(localStorage.getItem('id')),
        pageSize: this.pagesize,
        pageNum: this.currentPage
      }
      getBorrowList(data).then(response => {
        this.tableData = response.data.list
        // this.total = response.data.totalNum
      })
    },
  },
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
    width: 660px;
    margin-top: 30px;
    margin-left: 20px;
    height: 660px;
  }
  .box-card-cal {
    float: right;
    width: 540px;
    margin-right: 20px;
    padding-right: 10px;
    height: 660px;
  }
</style>
