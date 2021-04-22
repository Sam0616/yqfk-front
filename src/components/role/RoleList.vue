<!--角色管理-->
<template>
    <div class="role">
        <div class="seek">
            <div class="formContent">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item class="label">
                        <el-button type="success" @click="toAddRole()">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="roleList">

            <el-table v-loading="loading" :data="tableData" border row-key="id"
                      style=" width: 96%;margin-left:30px;margin-top:30px;" :header-cell-style="{background:'#f5f6fa'}">
                <el-table-column type="index" label="序号" width="60" header-align="center"
                                 align="center"></el-table-column>
                <el-table-column prop="id" label="角色编号" width="100" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" width="230" align="center"></el-table-column>
                <el-table-column prop="description" label="描述" width="400" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="250">
                    <template slot-scope="roleList">
                        <el-button type="primary" size="max" class="config-btn" style="width:70px;"
                                   @click.native.prevent="toEditRole(roleList.row)">编辑
                        </el-button>
                        <el-button type="danger" class="blue-btn" size="max" style="width:70px"
                                   @click.native.prevent="deleteRole(roleList.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginationCon">
                <el-pagination v-show="isShow" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-sizes="[10, 15, 20, 100]" :page-size='pageSize'
                               layout="total, sizes, prev, pager, next, jumper" :total="totals"></el-pagination>
            </div>
        </div>
        <!-- 添加角色 -->
        <el-dialog
                :close-on-click-modal="false"
                width="35%"
                title="添加角色"
                :visible="addRoleForm"
                :modal-append-to-body='false'
                @close='closeRoleForm'
        >
            <el-form :model="roleForm" ref="roleForm" :rules="rules">
                <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色说明" prop="description" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="roleForm.description"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeRoleForm">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改角色 -->
        <el-dialog
                :close-on-click-modal="false"
                width="35%"
                title="修改角色"
                :visible="editRoleForm"
                :modal-append-to-body='false'
                @close='closeEditRoleForm'
        >
            <el-form :model="roleForm" ref="roleForm" :rules="rules">
                <el-input autocomplete="off" prop="id" v-show="false" v-model="roleForm.id"></el-input>
                <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色说明" prop="description" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="roleForm.description"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEditRoleForm">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

  export default {
    components: {},
    data () {
      return {
        roleForm: {
          id: '',
          roleName: '',
          description: ''
        },
        rules: {
          roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}]
        },
        formLabelWidth: '120px',
        isShow: true,
        loading: false,
        totals: 0,
        roleName: '',
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        addRoleForm: false,
        editRoleForm: false
      }
    },
    // 过滤
    filters: {},
    // 模块新建时
    created: function () {

    },
    // 计算属性
    mounted () {
      this.getRoleListForm()
    },
    // 事件处理
    methods: {

      // 添加页面
      toAddRole () {
        this.addRoleForm = true
      },
      // 关闭添加页面
      closeRoleForm () {
        this.addRoleForm = false
        // 清空表单
        this.$refs['roleForm'].resetFields()
      },

      // 添加角色
      addRole () {
        let self = this
        let {roleName, description} = this.roleForm
        if (!roleName) {
          this.$message.warning('角色名称不能为空!')
          return
        }
        self.getAddRole({roleName, description}).then(res => {
          this.addRoleForm = false
          // 清空表单
          this.$refs['roleForm'].resetFields()
          this.getRoleListForm()
          this.$message.success('添加角色成功!')
        })
      },

      //删除角色
      deleteRole (row) {
        let self = this
        let roleId = row.id
        // 检查角色是否已经使用
        self.getQueryMemberByRoleId({roleId}).then(res => {
          if (res.data.length > 0) {
            this.$message({
              type: 'warning',
              message: '角色已经有用户使用！不能删除！'
            })
          } else {
            this.$confirm('您确定要删除这个角色么, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let id = row.id
              self.getRemoveRole({id}).then(res => {
                this.getRoleListForm()
                this.$message({
                  type: 'success',
                  message: '角色删除成功!'
                })
              })
            })
          }
        })
      },
      // 获取Role列表
      getRoleListForm () {
        let self = this
        self.getRoleList({currentPage: this.currentPage, pageSize: this.pageSize}).then(res => {
          this.tableData = res.data.data
          this.totals = res.data.total
        })
      },
      // 打开修改页面
      toEditRole (row) {
        this.editRoleForm = true
        this.roleForm.id=row.id
        this.roleForm.roleName=row.roleName
        this.roleForm.description=row.description
      },
      //关闭修改页面
      closeEditRoleForm () {
        this.editRoleForm = false
        // 清空表单数据
        this.$refs['roleForm'].resetFields()
      },
      // 修改角色
      editRole () {
        let self = this
        let {id,roleName, description} = this.roleForm
        if(!id){
          this.$message.warning('角色ID不能为空!')
          return
        }
        if(!roleName){
          this.$message.warning('角色名称不能为空!')
          return
        }
        self.getUpdateRole({id,roleName,description}).then(res => {
          this.editRoleForm = false
          // 清空表单
          this.$refs['roleForm'].resetFields()
          this.getRoleListForm()
          this.$message.success('修改角色成功!')
        })
      },

      handleSizeChange (val) {
        let self = this
        self.pageSize = val
        self.getRoleListForm()
      },
      handleCurrentChange (val) {
        let self = this
        self.currentPage = val
        self.getRoleListForm()
      },
    },
    // 监视
    watch: {}
  }
</script>
<style scoped>
    .label {
        padding-left: 20px;
    }

    .role {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .seek {
        width: 98%;
        height: auto;
        margin: 10px auto;
        border: 1px solid #e6e6e6;
        background-color: #fff;
    }

    .roleList {
        width: 98%;
        height: auto;
        border: 1px solid #e6e6e6;
        margin: 10px auto;
        background-color: #fff;
        padding-bottom: 100px;
    }

    .formContent {
        width: 100%;
        height: 100%;
        margin: 30px auto;
    }

    .roleTop {
        width: 100%;
        height: 59px;
        border-bottom: 1px solid #e6e6e6;
    }

    .addRole {
        padding-left: 30px;
        padding-top: 10px;
    }

    .tableForm {
        width: 100%;
        height: 100%;
    }

    .iconSize {
        font-size: 16px;
    }

    .paginationCon {
        float: right;
        margin-top: 12px;
        margin-right: 30px;
    }
</style>
