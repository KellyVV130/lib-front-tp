<template>
  <div>
    <el-card class="box-card">
      <el-descriptions class="margin-top" title="个人信息" :column="3" :size="size" border>
        <template slot="extra">
          <el-button type="primary" @click="dialogFormVisible = true" size="small">编辑</el-button>

          <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名： " prop="name">
                {{ruleForm.name}}
              </el-form-item>
              <el-form-item label="手机号： " prop="phone">
                  <el-input v-model="ruleForm.phone" ></el-input>
              </el-form-item>
              <el-form-item label="居住地址： " prop="home">
                <el-input type="textarea" v-model="ruleForm.home"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </div>
          </el-dialog>

        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ruleForm.name}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          18600000000
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets" ></i>
            正在借阅
          </template>
          <el-tag size="small">4</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            居住地
          </template>
          北京市
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            联系地址
          </template>
          北京市海淀区学院路88号
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="box-card">
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize, currentPage*pagesize)"
      :default-sort = "{prop: 'date', order: 'descending'}"
      style="width: 100%; margin-left: 30px">
      <el-table-column
        type="index"
        label="编号"
        width="60"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="name"
        label="书名"
        width="290">
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="250">
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
        width="100"
        prop="xxx"
        label="延期">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleBorrow(scope.$index, scope.row)">延期</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Postpone',
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleBorrow(index, row) {
      console.log(index, row);
      this.$confirm('确认延长此书借阅期限, 是否继续?', '确认延期', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '延期成功!'
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
          !this.search || data.name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      dialogFormVisible: false,
      ruleForm: {
        name: 'const { name } = await store.dispatch(\'user/getInfo\')',
        phone: '',
        home:'',
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度为 11 个字符', trigger: 'blur' }
        ],
        home: [
          { required: true, message: '请填写联系地址', trigger: 'blur' }
        ]
      },
      search:'',
      pagesize: 10,
      currentPage: 1,
      tableData: [{
        name:'马大跳2',
        author:'阿巴阿巴',
        startDate: '2022-05-02',
        endDate:'2022-06-02',
        status:0
      },{
        name:'马小跳4',
        author:'阿巴阿巴',
        startDate: '2022-05-05',
        endDate: '2022-06-05',
        status:0
      }, {
        name:'马小跳7',
        author:'阿巴阿巴',
        startDate: '2022-05-05',
        endDate: '2022-06-05',
        status:0
      }, {
        name:'马大跳8',
        author:'阿巴阿巴',
        startDate: '2022-05-05',
        endDate: '2022-06-05',
        status:0
      }]
    }
  },
}

</script>

<style lang="scss" scoped>
  .table-grid-content {
    border-radius: 0px;
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

  .box-card {
    width: 1020px;
    margin-top: 30px;
    margin-left: 100px;
  }
</style>
