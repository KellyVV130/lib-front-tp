<template>
  <div class="dashboard-container">
    <div class="filter-container">
          <el-select
            v-model="listQuery.userId"
            placeholder="用户"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter">
            <el-option v-for="item in userList" :key="item.userId" :label="item.name" :value="item.userId" />
          </el-select>
          <el-select
            v-model="listQuery.book_id"
            placeholder="图书id"
            style="width: 200px; margin-left: 20px;"
            class="filter-item"
            @keyup.enter.native="handleFilter">
            <el-option v-for="item in bookList" :key="item.resourceId" :label="item.resourceName" :value="item.resourceId" />
          </el-select>
          <el-input
            v-model="listQuery.book_name"
            placeholder="图书名称"
            style="width: 200px; margin-left: 20px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button v-waves class="filter-item" style=" margin-left: 20px;" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-right: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate" v-permission="['super']">
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
          <span>{{ row.resource.recordId }}</span>
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
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)" v-permission="['super']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="90px">
            <el-form-item label="用户id" prop="user_id">
              <el-select v-model="temp.user_id" class="filter-item">
                <el-option v-for="item in userList" :key="item.userId" :label="item.name" :value="item.userId" />
              </el-select>
            </el-form-item>
            <el-form-item label="图书id" prop="book_id">
              <el-select v-model="temp.book_id" class="filter-item">
                <el-option v-for="item in bookList" :key="item.resourceId" :label="item.resourceName" :value="item.resourceId" />
              </el-select>
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
        <el-form-item>
          <el-button size="mini" type="danger" @click="borrowBook(temp.recordId)" v-permission="['super']">
            模拟刷卡借书
          </el-button>
          <el-button size="mini" type="danger" @click="returnBook(temp.recordId)" v-permission="['super']">
            模拟还书
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" v-permission="['super']">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {createRecord, updateRecord, borrowAPI, returnAPI, fetchRecordList, deleteRecord} from '@/api/borrow-m'
import waves from '@/directive/waves' // waves directive
import permission from "@/directive/permission/index";
import { parseTime } from '@/utils'
import {country} from '@/utils/country'
import Pagination from '@/components/Pagination'
import {category} from "@/utils/category"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
import {getUsers} from "@/api/user-m";
import {fetchList} from "@/api/book-m";

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
        sort: '+recordId'
      },
      temp: {
        user_id: undefined,
        book_id: undefined,
        recordId: undefined,
        user:{
          id: undefined,
          name: undefined,
        },
        resource:{
          resourceId: undefined,
          resourceName: '',
          storageAll: undefined,
          storageAvail: undefined,
          author: undefined,
          language: undefined,
          country: undefined,
          isbn: undefined,
        },
        startDate: parseTime(new Date(), '{y}-{m}-{d}'),
        duringTime: undefined,
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
        user_id: [{ required: true, message: '必填', trigger: 'change' }],
        book_id: [{ required: true, message: '必填', trigger: 'change' }],
        duringTime: [{ required: true, message: '必填', trigger: 'blur' },
          {validator: checkStorage, trigger: 'blur'}],
      },
      downloadLoading: false,
      categoryOptions: category,
      userList: [],
      bookList: []
    }
  },
  created() {
    this.getList()
    getUsers({}).then(res => {
      if(res.status === 200) {
        this.userList = res.data.userList
      }
    })
    fetchList({}).then(res => {
      if(res.status === 200) {
        this.bookList = res.data.list
      }
    })
  },
  methods: {
    checkPermission,
    getList() {
      fetchRecordList(this.listQuery).then(res => {
        console.log(res)
        this.list = res.data.list
        this.total = res.data.totalNum
        this.listQuery.page = res.data.pageNum
        this.listQuery.limit = res.data.pageSize
        this.listLoading = false
      })
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
        recordId: undefined,
        user:{
          id: undefined,
          name: undefined,
        },
        resource:{
          resourceId: undefined,
          resourceName: '',
          storageAll: undefined,
          storageAvail: undefined,
          author: undefined,
          language: undefined,
          country: undefined,
          isbn: undefined,
        },
        startDate: parseTime(new Date(), '{y}-{m}-{d}'),
        duringTime: undefined,
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
          createRecord(this.temp).then((res) => {
            if (res.data.successed || res.data.record) {
              this.$message({
                message: res.data.reason,
                type: 'success'
              })
              this.getList()
              this.dialogFormVisible = false
            } else {
              this.$message({
                message: res.data.reason || res.error,
                type: 'error'
              })
            }
          }).catch(e => {
            this.$message({
              message: e.error,
              type: 'error'
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.user_id = this.temp.userId
      this.temp.book_id = this.temp.resource.resourceId
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateRecord(this.temp).then((res) => {
            if (res.data.successed || res.data.record) {
              this.$message({
                message: res.data.reason,
                type: 'success'
              })
              this.getList()
              this.dialogFormVisible = false
            } else {
              this.$message({
                message: res.data.reason,
                type: 'error'
              })
            }
          }).catch(e => {
            this.$message({
              message: e,
              type: 'error'
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRecord(row.recordId).then(res => {
          if(res.status === 200) {
            this.$message({
              message: res.data.reason,
              type: res.data.successed?'success':'error'
            })
          }
        }).catch(e=>{
          this.$message({
            message: e,
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
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
    },
    borrowBook(id) {
      borrowAPI(id).then(res => {
        if(res.status === 200 && res.data.successed) {
          this.$message({
            message: res.data.reason,
            type: 'success'
          })
              this.getList()
              this.dialogFormVisible = false
        } else {
          this.$message({
            message: res.data.reason,
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
            message: '借书失败',
            type: 'error'
          })
      })
    },
    returnBook(id) {
      returnAPI(id).then(res => {
        if(res.status === 200 && res.data.successed) {
          this.$message({
            message: res.data.reason,
            type: 'success'
          })
              this.getList()
              this.dialogFormVisible = false
        } else {
          this.$message({
            message: res.data.reason,
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
            message: '还书失败',
            type: 'error'
          })
      })
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
