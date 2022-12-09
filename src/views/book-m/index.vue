<template>
  <div class="dashboard-container">
    <div class="filter-container">
          <el-input
            v-model="listQuery.resourceName"
            placeholder="书名"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-input
            v-model="listQuery.author"
            placeholder="作者"
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
      <el-table-column label="编号" prop="resourceId" sortable="custom" align="center" width="80" :class-name="getSortClass('resourceId')">
        <template slot-scope="{row}">
          <span>{{ row.resourceId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="书名" prop="resourceName" min-width="150px" sortable="custom" :class-name="getSortClass('resourceName')">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.resourceName }}</span>
<!--          <el-tag>{{ row.type | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="author" sortable="custom" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="馆藏数目" prop="storageAll" sortable="custom" align="center" :class-name="getSortClass('storageAll')">
        <template slot-scope="{row}">
          <span>{{ row.storageAll }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可借数目" prop="storageAvail" sortable="custom" align="center" :class-name="getSortClass('storageAvail')">
        <template slot-scope="{row}">
          <span>{{ row.storageAvail }}</span>
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
          <span>{{ row.isbn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="图书全称" prop="resourceName">
              <el-input v-model="temp.resourceName" placeholder="例：《三国演义》" />
            </el-form-item>
            <el-form-item label="作者名" prop="author">
              <el-input v-model="temp.author" placeholder="请输入全名" />
            </el-form-item>
            <el-form-item label="作者国籍" prop="country">
              <el-select v-model="temp.country" filterable class="filter-item" placeholder="请选择">
                <el-option-group v-for="group in countryOptions":key="group.label" :label="group.label">
                   <el-option v-for="item in group.options" :key="item.label" :label="item.label" :value="item.label">
                     <span style="float: left">{{ item.label }}</span>
<!--                     <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
                   </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="图书语言" prop="language">
              <el-select v-model="temp.language" placeholder="请选择" class="filter-item">
                <el-option label="中文" value="中文" />
                <el-option label="外语" value="外语" />
              </el-select>
            </el-form-item>
            <el-form-item label="馆藏数目" prop="storageAll">
              <el-input v-model="temp.storageAll" type="number" placeholder="请输入数字" />
            </el-form-item>
            <el-form-item label="可借数目" prop="storageAvail">
              <el-input v-model="temp.storageAvail" type="number" placeholder="请输入数字" />
            </el-form-item>
            <el-form-item label="ISBN" prop="isbn">
              <el-input v-model="temp.isbn" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版年份" prop="publishDate">
              <el-date-picker
                v-model="temp.publishDate"
                type="year"
                placeholder="选择年">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
              <el-input v-model="temp.publisher" placeholder="请输入全称" />
            </el-form-item>
            <el-form-item label="所属类别" prop="category">
               <el-cascader
                 clearable
                  v-model="temp.category"
                  :options="categoryOptions"
                  @change="handleChange">
               </el-cascader>
            </el-form-item>
            <el-form-item label="中图分类号" prop="zhongtu">
              <el-input v-model="temp.zhongtu" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="可图分类号" prop="ketu">
              <el-input v-model="temp.ketu" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="译者" prop="translator" v-if="temp.language==='中文' && temp.country!=='中国'">
              <el-input v-model="temp.translator" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="权限等级" prop="access">
              <el-select v-model="temp.access" class="filter-item" placeholder="请选择权限等级">
                <el-option v-for="item in accessOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
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
<!--          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />-->
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
import { fetchList, createArticle, updateArticle, deleteArticle } from '@/api/book-m'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import {country} from '@/utils/country'
import Pagination from '@/components/Pagination'
import {category} from "@/utils/category"; // secondary package based on el-pagination

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

export default {
  name: 'BookManage',
  components: { Pagination },
  directives: { waves },
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
      tableKey: undefined,
      list: null,
      total: undefined,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        resourceName: undefined,
        author: undefined,
        sort: '+resourceId'
      },
      calendarTypeOptions,
      temp: {
        resourceId: undefined,
        resourceName: '',
        storageAll: undefined,
        storageAvail: undefined,
        author: '',
        language: '',
        country: '',
        isbn: '',
        translator: undefined,
        publisher: undefined,
        publishDate: undefined,
        category: undefined,
        zhongtu: undefined,
        ketu: undefined,
        image: undefined,
        access: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      accessOptions: [{ value: 1, label: '1(最严格)' }, { value: 2, label: '2'}, { value: 3, label: '3'}, { value: 4, label: '4'}],
      dialogPvVisible: false,
      pvData: [],
      rules: {
        resourceName: [{ required: true, message: '图书名称必填', trigger: 'change' }],
        author: [{ required: true, message: '作者必填', trigger: 'change' }],
        storageAll: [{ required: true, message: '馆藏书目必填', trigger: 'blur' },
          {validator: checkStorage, trigger: 'blur'}],
        storageAvail: [{ required: true, message: '可借数目必填', trigger: 'blur' },
          {validator: checkStorage, trigger: 'blur'}],
        publishDate: [{required: true, message: '出版日期必填', trigger: 'blur'}]
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
      fetchList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.list
        this.total = response.data.totalNum
        this.listQuery.page = response.data.pageNum
        this.listQuery.limit = response.data.pageSize

        // Just to simulate the time of the request
        this.listLoading = false
      })
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
      this.temp = {
        resourceId: undefined,
        resourceName: '',
        storageAll: undefined,
        storageAvail: undefined,
        author: '',
        language: '',
        country: '',
        isbn: '',
        translator: undefined,
        publisher: undefined,
        publishDate: undefined,
        category: undefined,
        zhongtu: undefined,
        ketu: undefined,
        image: undefined,
        access: undefined
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
          createArticle(this.temp).then((res) => {
            if(res.status === 200) {
              this.dialogFormVisible = false
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: '失败',
                type: 'error'
              })
            }
          }).catch(e => {
            console.log(e)
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
          updateArticle(this.temp).then((res) => {
            if(res.data.successed || res.data.resource!==null) {
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.getList()
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
        deleteArticle(row.resourceId).then(res => {
          if(res.data.successed) {
             this.$message({
                type: 'success',
                message: '删除成功!'
              });
             this.getList()
          } else {
            this.$message({
              type: 'error',
              message: res.data.reason
            })
          }
        }).catch(e => {
          this.$message({
            type: 'error',
            message: e
          })
        })

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
