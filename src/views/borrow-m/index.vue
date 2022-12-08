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
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :disabled="!checkPermission['super']">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList,  createRecord, updateRecord } from '@/api/borrow-m'
import waves from '@/directive/waves' // waves directive
import permission from "@/directive/permission/index";
import { parseTime } from '@/utils'
import {country} from '@/utils/country'
import Pagination from '@/components/Pagination'
import {category} from "@/utils/category"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";

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
        recordId: undefined,
        user:{
          id: undefined,
          name: undefined,
        },
        resource:{
          resourceId: undefined,
          resourceName: '',
          storageAll: 0,
          storageAvail: 0,
          author: undefined,
          language: undefined,
          country: undefined,
          isbn: undefined,
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
      fetchList(this.listQuery).then(res => {
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
          storageAll: 0,
          storageAvail: 0,
          author: undefined,
          language: undefined,
          country: undefined,
          isbn: undefined,
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
          createRecord(this.temp).then((res) => {
            if(res.data.successed || res.data.record) {
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
          updateRecord(this.temp).then((res) => {
            if(res.data.successed || res.data.record) {
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
    checkPermission
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
