<template>
  <div class="app-container">
    <el-button type="primary" size="mini" @click="openDialog(null)">添加</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="用户ID" width="142" align="center">
        <template slot-scope="scope">
<!--          {{ scope.$index }}-->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="角色" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role | statusFilter">{{ scope.row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pageInfo.total>0" :total="pageInfo.total" :page.sync="pageInfo.currentPage" :limit.sync="pageInfo.pageSize" @pagination="changePage"></pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" width="60%">
      <el-form ref="dataForm" :model="userInfo" label-position="left" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form-item label="用户ID" prop="id">
              <el-input v-model="userInfo.id" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userInfo.username" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="userInfo.password" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
              <el-input v-model="userInfo.createTime" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-radio v-for="role in roles" :key="role.value" v-model="userInfo.role" :label="role.value">
                {{ role.label }}
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?handleCreate:handleUpdate">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import { deleteUser, getUsers, createUser, updateUser } from '@/api/user-m'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(role) {
      const statusMap = {
        staff: 'danger',
        user: 'gray'
        // deleted: 'danger'
      }
      return statusMap[role]
    }
  },
  data() {
    return {
      list: null,
      pageInfo: {
        pageSize: 10,
        currentPage: 1,
        total: 100
      },
      listLoading: true,
      checkedRole: [],
      roles: [
        {
          value: 'user',
          label: '普通用户'
        },
        {
          value: 'admin',
          label: '工作人员'
        },
        {
          value: 'super',
          label: '超级管理员'
        }
      ],
      textMap: {
        'edit': '编辑',
        'create': '添加'
      },
      dialogVisible: false,
      dialogStatus: 'create',
      userInfo: {
        id: '',
        username: '',
        password: '',
        createTime: '',
        role: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    // 加载某页用户列表
    getUserList() {
      this.listLoading = true
      const params = {
        pageSize: this.pageInfo.pageSize,
        currentPage: this.pageInfo.currentPage
      }
      getUsers(params).then(response => {
        this.list = response.data.userList
        this.pageInfo.total = response.data.totalNum
        this.listLoading = false
      })
    },
    openDialog(input) {
      if (input === null) {
        this.dialogVisible = true
        this.dialogStatus = 'create'
        this.userInfo = {
          id: '',
          username: '',
          password: '',
          createTime: '',
          role: ''
        }
      } else {
        this.dialogVisible = true
        this.dialogStatus = 'edit'
        this.userInfo = input
      }
    },
    // 编辑某个用户信息
    handleUpdate() {
      updateUser(this.userInfo).then(response => {
        if (response.data.code === '200') {
          this.$message.success('用户信息修改成功！')
        } else {
          this.$message.error('用户信息修改失败。')
        }
      })
    },
    // 新建用户
    handleCreate() {
      createUser(this.userInfo).then(response => {
        if (response.data.code === '200') {
          this.$message.success('添加用户成功！')
        } else {
          this.$message.error(response.data.code + ': ' + response.data.message)
        }
      })
    },
    // 删除某个用户
    handleDelete(id) {
      console.log(id)
      deleteUser({
        id: id
      }).then(response => {
        if (response.data.code === '200') {
          this.$message.success('删除用户成功')
        } else {
          this.$message.error(response.data.code + ': ' + response.data.message)
        }
      })
    },
    // 修改页大小/页码
    changePage(currentPage, pageSize) {
      this.pageInfo.currentPage = currentPage
      this.pageInfo.pageSize = pageSize
      this.getUserList()
    }
  }
}
</script>
