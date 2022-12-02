<template>
  <div class="dashboard-container">
    <div class="filter-container">
      <el-input v-model="listQuery.book_name" placeholder="书名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.author" placeholder="作者" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="书名" prop="name" min-width="150px" sortable="custom" :class-name="getSortClass('name')">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
<!--          <el-tag>{{ row.type | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="author" sortable="custom" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="馆藏数目" prop="storage_all" sortable="custom" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.storage_all }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可借数目" prop="storage_avail" sortable="custom" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.storage_avail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="语言" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.language }}</span>
        </template>
      </el-table-column>
      <el-table-column label="国家" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ISBN" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ISBN }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button> <!-- TODO confirm框-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="图书全称" prop="name">
              <el-input v-model="temp.name" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="作者名" prop="author">
              <el-input v-model="temp.author" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="作者国籍" prop="country"><!-- TODO 选择国家-->
              <el-input v-model="temp.country" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="图书语言" prop="language"><!-- TODO 选择语言-->
              <el-input v-model="temp.language" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="馆藏数目" prop="storage_all">
              <el-input v-model="temp.storage_all" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="可借数目" prop="storage_avail">
              <el-input v-model="temp.storage_avail" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="ISBN" prop="ISBN">
              <el-input v-model="temp.ISBN" placeholder="Please input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版日期" prop="publish_date">
              <el-date-picker v-model="temp.publish_date" type="datetime" placeholder="Please pick a date" />
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
              <el-input v-model="temp.publisher" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="所属类别" prop="category">
              <el-input v-model="temp.category" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="中图分类号" prop="zhongtu">
              <el-input v-model="temp.zhongtu" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="可图分类号" prop="ketu">
              <el-input v-model="temp.ketu" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="译者" prop="translator">
              <el-input v-model="temp.translator" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="封面" prop="image">
              <el-input v-model="temp.image" placeholder="Please input" /><!--TODO 图片上传-->
            </el-form-item>
            <el-form-item label="权限等级" prop="access">
              <el-input v-model="temp.access" placeholder="Please input" />
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-form-item label="Status">-->
<!--          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
<!--            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="Imp">-->
<!--          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="Remark">-->
<!--          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
<!--        </el-form-item>-->
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
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/book-m'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const fakeData = [
  {
    id: 1,
    name: '《哈利·波特与阿兹卡班的囚徒》',
    storage_all: 10,
    storage_avail: 7,
    author: 'J.K.罗琳',
    language: '中文',
    country: '英',
    ISBN: '7-02-003345-8',
    translator: '郑须弥',
    publisher: '人民文学出版社',
    publish_date: '2000',
    category: '儿童文学-长篇小说-英国-现代',
    zhongtu: 'I561.84',
    ketu: '47.1152',
    image: '',
    access: 'IMPORTANT',
  },
  {
    id: 2,
    name: '《哈利·波特与凤凰社》',
    storage_all: 10,
    storage_avail: 5,
    author: 'J.K.罗琳',
    language: '中文',
    country: '英',
    ISBN: '7-02-003345-9',
    translator: '郑须弥',
    publisher: '人民文学出版社',
    publish_date: '2001',
    category: '儿童文学-长篇小说-英国-现代',
    zhongtu: 'I561.84',
    ketu: '47.1152',
    image: '',
    access: 'IMPORTANT',
  },
]

export default {
  name: 'BookManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        book_name: undefined,
        author: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
      temp: {
        id: undefined,
        name: '',
        storage_all: 0,
        storage_avail: 0,
        author: '',
        language: '',
        country: '',
        ISBN: '',
        translator: '',
        publisher: '',
        publish_date: '',
        category: '',
        zhongtu: '',
        ketu: '',
        image: '',
        access: '' // TODO select,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        author: [{ required: true, message: 'author is required', trigger: 'change' }],
        storage_all: [{ required: true, message: 'title is required', trigger: 'blur' }],
        storage_avail: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
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
        this.listQuery.sort = '+'+field
      } else {
        this.listQuery.sort = '-'+field
      }
      this.getList() // TODO handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
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
      this.temp.timestamp = new Date(this.temp.timestamp)
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
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
      // TODO real delete api
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
