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
      style="width: 100%; margin-top: 20px;"
    >
      <el-table-column label="用户ID" align="center">
        <template slot-scope="scope">
<!--          {{ scope.$index }}-->
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="借阅卡ID" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cardId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.avatar }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="角色" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role | roleFilter">{{ roles.find(r => r.value === scope.row.role).label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="借阅权限" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.access | accessFilter">{{ scope.row.access }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pageInfo.total>0" :total="pageInfo.total" :page.sync="pageInfo.currentPage" :limit.sync="pageInfo.pageSize" @pagination="changePage"></pagination>
    <el-dialog title="修改" :visible.sync="dialogUpdateVisible" width="64%">
      <el-form ref="dataForm" :model="userInfo" label-position="left" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form-item label="用户ID" prop="userId" >
              <el-input v-model="userInfo.userId" placeholder="Please input" disabled/>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
              <el-input v-model="userInfo.name" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="userInfo.password" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createdTime">
              <el-input v-model="userInfo.createdTime" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="借阅卡ID" prop="cardId">
              <el-input v-model="userInfo.cardId" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <el-input v-model="userInfo.avatar" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-radio v-for="role in roles" :key="role.value" v-model="userInfo.role" :label="role.value">
                {{ role.label }}
              </el-radio>
            </el-form-item>
            <el-form-item label="借阅权限" prop="access">
              <el-radio v-for="access in accesses" :key="access" v-model="userInfo.access" :label="access">
                {{ access }}
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleUpdate">
          提交
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="创建" :visible.sync="dialogCreateVisible" width="64%">
      <el-form ref="dataForm" :model="userInfo" label-position="left" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="userInfo.name" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="userInfo.password" placeholder="Please input" />
            </el-form-item>
<!--            <el-form-item label="借阅卡ID" prop="cardId">-->
<!--              <el-input v-model="userInfo.cardId" placeholder="Please input" />-->
<!--            </el-form-item>-->
            <el-form-item label="头像" prop="avatar">
              <el-input v-model="userInfo.avatar" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-radio v-for="role in roles" :key="role.value" v-model="userInfo.role" :label="role.value">
                {{ role.label }}
              </el-radio>
            </el-form-item>
<!--            <el-form-item label="借阅权限" prop="access">-->
<!--              <el-radio v-for="access in accesses" :key="access" v-model="userInfo.access" :label="access">-->
<!--                {{ access }}-->
<!--              </el-radio>-->
<!--            </el-form-item>-->
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleCreate">
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
    roleFilter(role) {
      const roleMap = {
        super: 'danger',
        admin: 'success',
        user: 'gray'
        // deleted: 'danger'
      }
      return roleMap[role]
    },
    accessFilter(access) {
      const accessMap = {
        1: 'danger',
        2: 'success',
        3: 'gray',
        4: 'info'
      }
      return accessMap[access]
    }
  },
  data() {
    return {
      list: null,
      pageInfo: {
        pageSize: 10,
        currentPage: 1,
        total: 0
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
      accesses: [1, 2, 3, 4],
      textMap: {
        'edit': '编辑',
        'create': '添加'
      },
      dialogUpdateVisible: false,
      dialogCreateVisible: false,
      userInfo: {
        userId: '',
        name: '',
        password: '',
        createTime: '',
        cardId: '',
        access: '',
        avatar: '',
        role: ''
      }
    }
  },
  created() {
    // this.fetchData()
    this.getUserList()
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
        pageNum: this.pageInfo.currentPage,
        sort: 'userId',
        order: 'asc'
      }
      getUsers(params).then(response => {
        this.list = response.data.userList
        this.pageInfo.total = response.data.totalNum
        this.listLoading = false
      })
    },
    openDialog(input) {
      if (input == null) {
        this.dialogCreateVisible = true
        this.userInfo = {
          username: '',
          password: '',
          createTime: '',
          role: ''
        }
      } else {
        this.dialogUpdateVisible = true
        this.userInfo = input
      }
    },
    // submitForm() {
    //   if (this.dialogStatus === 'create') {
    //     this.handleCreate()
    //   } else {
    //     this.handleUpdate()
    //   }
    // },
    // 编辑某个用户信息
    handleUpdate() {
      updateUser(this.userInfo).then(response => {
        this.$message.success('用户信息修改成功！')
        this.dialogUpdateVisible = false
      })
    },
    // 新建用户
    handleCreate() {
      const data = {
        name: this.userInfo.name,
        password: this.userInfo.password,
        avatar: this.userInfo.password,
        role: this.userInfo.role
      }
      createUser(data).then(response => {
        this.$message.success('添加用户成功！')
        this.dialogCreateVisible = false
      })
    },
    // 删除某个用户
    handleDelete(id) {
      console.log(id)
      deleteUser({
        userId: id
      }).then(response => {
        if (response.data.successed === true) {
          this.$message.success('删除用户成功')
          this.getUserList()
        } else {
          this.$message.error(response.data.reason)
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
