<template>
  <div class="dashboard-container">
    <div class="filter-container">
          <el-input
            v-model="listQuery.book_name"
            placeholder="书名"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-input
            v-model="listQuery.user_id"
            placeholder="用户id"
            style="width: 200px; margin-left: 20px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-input
            v-model="listQuery.book_id"
            placeholder="图书id"
            style="width: 200px; margin-left: 20px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button v-waves class="filter-item" style=" margin-left: 20px;" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-right: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            新建
          </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 20px;"
      @sort-change="sortChange"
    >
      <el-table-column label="编号" prop="recordId" sortable="custom" align="center" width="80" :class-name="getSortClass('recordId')">
        <template slot-scope="{row}">
          <span>{{ row.recordId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="书名" prop="book_name" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.resource.resourceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="author" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resource.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="馆藏数目" prop="storage_all" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resource.storageAll }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可借数目" prop="storage_avail" align="center">
        <template slot-scope="{row}">
          <span>{{ row.resource.storageAvail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="借阅时间" width="150px" align="center" sortable="custom" :class-name="getSortClass('startDate')">
        <template slot-scope="{row}">
          <span>{{ row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应还时间" width="150px" align="center" sortable="custom" :class-name="getSortClass('endDate')">
        <template slot-scope="{row}">
          <span>{{ row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="convertStatus(row) | statusFilter">
            {{ convertStatus(row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" v-permission="['admin']">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="90px">
            <el-form-item label="用户id" prop="user_id">
              <el-input v-model="temp.user.id" placeholder="" />
            </el-form-item>
            <el-form-item label="图书id" prop="book_id">
              <el-input v-model="temp.resource.resourceId" placeholder="" />
            </el-form-item>
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="temp.startDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="借书天数" prop="duringTime">
              <el-input v-model="temp.duringTime" type="number" />
            </el-form-item>
            <el-form-item label="还书日期" prop="endDate" v-if="dialogStatus==='update'">
              <el-date-picker
                v-model="temp.endDate"
                type="date"
                disabled
                placeholder="选择日期">
              </el-date-picker>
              <el-tag
                type="danger"
                v-if="convertStatus(temp)==='超期'"
                style="margin-left: 20px;"
              >已超期</el-tag>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/borrow-m'
import waves from '@/directive/waves' // waves directive
import permission from "@/directive/permission/index";
import { parseTime } from '@/utils'
import {country} from '@/utils/country'
import Pagination from '@/components/Pagination'
import {category} from "@/utils/category"; // secondary package based on el-pagination


const fakeData = [
    {
      recordId: 1,
      user:{
        id: 1,
        name: '张三',
      },
      resource:{
        resourceId: 1,
        resourceName: '《哈利·波特与阿兹卡班的囚徒》',
        storageAll: 10,
        storageAvail: 7,
        author: 'J.K.罗琳',
        language: '中文',
        country: '英',
        ISBN: '7-02-003345-8',
      },
      startDate: '2019-02-04',
      duringTime: 14,
      endDate: '2019-02-10',
      borrowed: true,
      postponed: false,
      expired: false,
      postponeDate: undefined,
    },
    {
      recordId: 2,
      user:{
        userId: 2,
        name: '李四',
      },
      resource:{
        resourceId: 1,
        resourceName: '《哈利·波特与火焰杯》',
        storageAll: 10,
        storageAvail: 4,
        author: 'J.K.罗琳',
        language: '中文',
        country: '英',
        ISBN: '7-02-003345-9',
      },
      startDate: '2022-10-04',
      duringTime: 14,
      endDate: '2022-10-18',
      borrowed: true,
      expired: true,
      postponeDate: undefined,
    }
]

export default {
  name: 'BorrowManage',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '已还': 'success',
        '预定': 'info',
        '未还': 'warning',
        '超期': 'danger'
      }
      return statusMap[status]
    },
  },
  data() {
    let checkStorage = (rule, value, callback) => {
      if (value < 0 ) {
        callback(new Error('库存必须大于等于0'));
      } else {
        callback();
      }
    };
    return {
      countryOptions: country,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        book_name: undefined,
        user_id: undefined,
        book_id: undefined,
        sort: '+id'
      },
      temp: {
        recordId: -1,
        user:{
          id: -1,
          name: '',
        },
        resource:{
          resourceId: -1,
          resourceName: '',
          storageAll: 0,
          storageAvail: 0,
          author: '',
          language: '',
          country: '',
          ISBN: '',
        },
        startDate: parseTime(new Date(), '{y}-{m}-{d}'),
        duringTime: 0,
        endDate: undefined,
        borrowed: false,
        postponed: false,
        expired: false,
        postponeDate: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      accessOptions: [{ value: 'ALL', label: '所有人可借' }, { value: 'NONE', label: '不可借'}],
      dialogPvVisible: false,
      pvData: [],
      rules: {
        user_id: [{ required: true, message: 'name is required', trigger: 'change' }],
        book_id: [{ required: true, message: 'author is required', trigger: 'change' }],
        duringTime: [{ required: true, message: 'title is required', trigger: 'blur' },
          {validator: checkStorage, trigger: 'blur'}],
      },
      downloadLoading: false,
      categoryOptions: category
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.list = fakeData
      this.total = fakeData.length
      this.listLoading = false
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
    },
    convertStatus(record){
      if(!record.borrowed) {
        return '预定'
      } else if(record.expired) {
        return '超期'
      } else if(record.endDate<parseTime(new Date(),'{y}-{m}-{d}')) {
        return '已还'
      } else {
        return '未还'
      }
    },
    handleChange(value){
      console.log(value)
      // this.temp.category = []
      // value.forEach(item => {
      //   this.temp.category = this.temp.category + item
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      this.sortNumber(prop, order)
    },
    sortNumber(field, order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+' + field
      } else {
        this.listQuery.sort = '-' + field
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp =  {
        recordId: -1,
        user:{
          id: -1,
          name: '',
        },
        resource:{
          resourceId: -1,
          resourceName: '',
          storageAll: 0,
          storageAvail: 0,
          author: '',
          language: '',
          country: '',
          ISBN: '',
        },
        startDate: parseTime(new Date(), '{y}-{m}-{d}'),
        duringTime: 0,
        endDate: undefined,
        borrowed: false,
        postponed: false,
        expired: false,
        postponeDate: undefined,
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp) // TODO 获取数据而不是临时添加
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      // this.$notify({
      //   title: 'Success',
      //   message: 'Delete Successfully',
      //   type: 'success',
      //   duration: 2000
      // })
      // this.list.splice(index, 1)
      this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO real delete api
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss" scoped>
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
