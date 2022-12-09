<template>
  <div class="dashboard-container">
    <div>
      <el-row class="table-grid-content">
        <el-col :span="18" style="margin-left:50px; margin-right: 3px">
          <el-input v-model="search" placeholder="请输入书名"></el-input>
        </el-col>
        <el-col :span="3" :gutter="1">
          <el-button  icon="el-icon-search" @click="handleQuery">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- :data="tableData.slice((currentPage-1)*pagesize, currentPage*pagesize)"-->
    <el-table

      :data="tableData.slice((currentPage-1)*pagesize, currentPage*pagesize)"
      stripe
      border
      :default-sort = "{prop: 'date', order: 'descending'}"
      style="width: 100%">
  <!--    <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="国家">
              <span>{{ props.row.country }}</span>
            </el-form-item>
            <el-form-item label="语言">
              <span>{{ props.row.language }}</span>
            </el-form-item>
            <el-form-item label="出版年份">
              <span>{{ props.row.publish_date }}</span>
            </el-form-item>
            <el-form-item label="中图分类号">
              <span>{{ props.row.zhongtu }}</span>
            </el-form-item>
            <el-form-item label="ISBN">
              <span>{{ props.row.ISBN }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>-->
      <el-table-column
        prop="resourceName"
        label="书名"
        sortable
        width="290">
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        sortable
        width="250">
      </el-table-column>
      <el-table-column
        prop="publisher"
        label="出版社"
        width="250">
      </el-table-column>
      <el-table-column
        width="100"
        prop="storageAll"
        label="馆藏书目">
      </el-table-column>
      <el-table-column
        width="100"
        prop="storageAvail"
        label="可借数目">
      </el-table-column>
      <!--<el-table-column
        width="100"
        prop="xxx"
        label="借阅">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleBorrow(scope.$index, scope.row)">借书</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <div style="margin-top: 20px; margin-left: 30%">
       <!--<el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="tableData.length"
        layout="total, prev, pager, next, jumper" >
      </el-pagination>-->
       <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="total"
        layout="total, prev, pager, next, jumper" >
      </el-pagination>
<!--
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList" />-->
    </div>
  </div>
</template>


<script>
  import { fetchList} from '@/api/book'
  export default {
    data() {
      return {
        listQuery: {
        /*  page: 1,
          limit: 10,*/
          resourceName: undefined,
          author: undefined,
          publisher: undefined,
          sort: '+resourceId'
        },
        total: '',
        search:'',
        pagesize:10,
        currentPage: 1,
        tableData: null,
        /*        tableData:
                  [
                    {
                  name:'羊羊羊羊羊羊羊羊羊羊羊羊羊小跳',
                  author:'拉巴阿巴阿巴·阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:5,
                  storage_avail:2,
                  ISBN:'2-11-003242-1',
                  country:'厄瓜尔多',
                  language:'中文',
                  publish_date:2008,
                  zhongtu:'I523.84'
                }, {
                  name:'马小跳1',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:5,
                  storage_avail:2,
                  ISBN:'3-11-003242-1',
                  country:'中国',
                  language:'中文',
                  publish_date:2008,
                  zhongtu:'I523.84'
                }, {
                  name:'马大跳2',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:5,
                  storage_avail:3,
                  ISBN:'3-11-003242-2',
                  country:'中国',
                  language:'中文',
                  publish_date:2008,
                  zhongtu:'I523.84'
                }, {
                  name:'马大跳3',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:6,
                  storage_avail:3,
                  ISBN:'3-11-003242-3',
                  country:'中国',
                  language:'中文',
                  publish_date:2008,
                  zhongtu:'I523.84'
                },  {
                  name:'人工智能原理、技术及应用',
                  author:'安俊秀',
                  publisher:'机械工业出版社',
                  storage_all:2,
                  storage_avail:2,
                  ISBN:'978-7-111-70777-6',
                  country:'中国',
                  language:'中文',
                  publish_date:2022,
                  zhongtu:'TP18'
                },  {
                  name:'人工智能导论',
                  author:'金军委',
                  publisher:'北京大学出版社',
                  storage_all:2,
                  storage_avail:2,
                  ISBN:'978-7-301-33118-7',
                  country:'中国',
                  language:'中文',
                  publish_date:2022,
                  zhongtu:'TP18'
                }, {
                  name:'马小跳4',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:5,
                  storage_avail:5,
                  ISBN:'3-11-003242-4',
                  country:'中国',
                  language:'中文',
                  publish_date:2008,
                  zhongtu:'I523.84'
                }, {
                  name:'马小跳5',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:5,
                  storage_avail:3
                },  {
                  name:'马小跳7',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:5,
                  storage_avail:3
                }, {
                  name:'马大跳8',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:5,
                  storage_avail:5
                }, {
                  name:'马大跳9',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:11,
                  storage_avail:10
                }, {
                  name:'马小跳10',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:3,
                  storage_avail:3
                },{
                  name:'马小跳11',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:3,
                  storage_avail:3
                },{
                  name:'马小跳12',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:1,
                  storage_avail:1
                },{
                  name:'马小跳13',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:11,
                  storage_avail:8
                },
                    {
                  name:'马小跳6',
                  author:'阿巴阿巴',
                  publisher:'人民出版社',
                  storage_all:3,
                  storage_avail:3
                }]*/
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleBorrow(index, row) {
        console.log(index, row);
        this.$confirm('确认借阅此本书籍, 是否继续?', '借阅确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '借阅成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleQuery() {
        const tableData = this.tableData
        this.tableData = tableData.filter(
          (data) =>
            !this.search || data.resourceName.toLowerCase().includes(this.search.toLowerCase())
        )
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        console.log(`当前页: ${val}`);
      },
      getList() {
        fetchList(this.listQuery).then(response => {
          console.log(response)
          this.tableData = response.data.list
          this.total = response.data.totalNum
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .table-grid-content {
    border-radius: 4px;
    height: 50 px;
    background: #ebeef5;
    padding: 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>


