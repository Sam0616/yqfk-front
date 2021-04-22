<!--角色管理-->
<template>
  <div class="role">
    <div class="seek" v-show="IsSeek">
      <div class="formContent">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="角色名称">
            <el-input v-model="roleName" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-date-picker label="开始日期" v-model="startTime" type="date" placeholder="选择日期"></el-date-picker>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="roleList">
      <div class="roleTop">
        <div class="addRole">
          <el-button @click="addRole" type="primary" icon="el-icon-circle-plus-outline">添加角色</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style=" width: 96%;margin-left:30px;margin-top:30px;"
        :header-cell-style="{background:'#f5f6fa'}"
      >
        <el-table-column type="index" label="序号" width="60" header-align="center" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180" align="center"></el-table-column>
        <el-table-column prop="createBy" label="创建者" width="180" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="lastUpdateBy" label="更新者" width="180" align="center"></el-table-column>
        <el-table-column prop="lastUpdateTime" label="更新时间" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" width="180" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button title="删除" @click="remove(scope.row)" type="text" size="small">
              <i class="iconSize el-icon-delete-solid"></i>
            </el-button>
            <el-button title="编辑" type="text" size="medium" @click="edit(scope.row)">
              <i class="iconSize el-icon-edit"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationCon">
        <el-pagination
          v-show="Isshow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        ></el-pagination>
      </div>
    </div>
    <!-- 添加角色弹出框 -->
    <el-dialog
      :close-on-click-modal="false"
      width="40%"
      title="添加角色"
      :visible.sync="addRoleVisible"
      :append-to-body="true"
      :show-close="false"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model.trim="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
          <el-input v-model.trim="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="confirm('form')">下一步</el-button>
      </div>
    </el-dialog>
    <!-- 角色权限配置弹出框 -->
    <el-dialog
      width="30%"
      title="权限配置"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="setRoleMenu"
      :show-close="false"
    >
      <el-tree
        :data="data"
        show-checkbox
        node-key="menuId"
        ref="tree"
        highlight-current
        accordion
        :default-expanded-keys="getRoleMenu"
        :default-checked-keys="getRoleMenu"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="getCheckedKeys">完 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {

  data() {
    return {
      defaultProps: {
        children: "childrenList",
        label: "name"
      },
      nodeKey: "deptId",
      defaultCheckedKeys: [],
      optionData: [{ deptId: 0, name: "无相关部门" }],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      depts: 0, // 初始ID（可选）
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      IsSeek: false,
      formLabelWidth: "120px",
      addRoleVisible: false,
      form: {
        roleName: "",
        remark: "",
        deptIdList: ""
      },
      Isshow: false,
      loading: true,
      totals: 0,
      startTime: "",
      roleName: "",
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      setRoleMenu: false,
      data: [],
      defaultProps: {
        children: "childrenList",
        label: "name"
      },
      getRoleMenu: []
    };
  },
  // 过滤
  filters: {},
  // 模块新建时
  created: function() {
    this.getRoleListForm();
    this.getdeptListForm();
  },
  // 计算属性
  mounted() {},
  // 事件处理
  methods: {
    getData(selectedData) {
      this.form.depts = selectedData;
    },
    // 打开权限配置弹出框
    setMenu() {
      let self = this;
      let roleId = sessionStorage.getItem("roleId");
      self.getMenuList().then(data => {
        self.data = data.data;
        if (roleId !== null) {
          self.getRoleMenuabs();
        } else {
          self.getRoleMenu = [];
        }
        self.setRoleMenu = true;
      });
    },
    // 获取角色的菜单配置
    getRoleMenuabs() {
      let self = this;
      let roleId = sessionStorage.getItem("roleId");
      self
        .getRoleMenuList({
          roleId: roleId
        })
        .then(data => {
          self.getRoleMenu = data.data.menuIdList;
        });
    },
    // 获取配置的权限ID,发送数据给后台
    getCheckedKeys() {
      let menuIdArr = this.$refs.tree.getCheckedKeys();
      let parentID = this.$refs.tree.getHalfCheckedKeys();

      let roleId = sessionStorage.getItem("roleId");
      let self = this;
      if (menuIdArr.length == 0) {
        self.$message({
          type: "info",
          message: "请为该角色配置权限。"
        });
        return;
      }
      if (roleId == null) {
        self
          .getAddRole({
            roleName: self.form.roleName,
            remark: self.form.remark,
            // deptIdList: self.form.depts,
            menuIdHalfList:parentID,
            menuIdList: menuIdArr
          })
          .then(data => {
            if (data.code == "0") {
              this.addRoleVisible = false;
              this.form.roleName = "";
              this.form.remark = "";
              this.loading = true;
            } else {
              this.$message({
                type: "info",
                message: data.msg
              });
            }
            this.getRoleListForm();
          });
      } else {
        self
          .getUpdateRole({
            roleId: parseInt(roleId),
            roleName: self.form.roleName,
            remark: self.form.remark,
            // deptIdList: self.form.depts,
             menuIdHalfList:parentID,
            menuIdList: menuIdArr
          })
          .then(data => {
            if (data.code == 0) {
              this.addRoleVisible = false;
              this.form.roleName = "";
              this.form.remark = "";
              this.loading = true;
            } else {
              this.$message({
                type: "info",
                message: data.msg
              });
            }
            this.getRoleListForm();
          });
      }
      self.setRoleMenu = false;
    },
    // 确认删除
    open(row) {
      let self = this;
      this.$confirm("确认要删除此角色吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .getRemoveRole([row.roleId])
            .then(data => {
              if (data.code == "0") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getRoleListForm();
              } else {
                this.$message({
                  type: "info",
                  message: data.msg
                });
              }
            })
            .catch(msg => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 确定添加角色
    confirm(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.addRoleVisible = false;
          self.setMenu();
        } else {
          return false;
        }
      });
    },
    //   新增用户取消
    resetForm(formName) {
      let self = this;
      self.$refs[formName].resetFields();
      self.addRoleVisible = false;
    },
    // 配置权限取消
    cancel() {
      let self = this;
      // self.getRemoveRole({
      //   id:parseInt(sessionStorage.getItem('roleId'))
      // }).then((data)=>{
      self.getRoleMenu = [];
      self.setRoleMenu = false;
      this.getRoleListForm();
      // })
    },
    // 添加角色
    addRole() {
      this.form.roleName = "";
      this.form.remark = "";
      sessionStorage.removeItem("roleId");
      this.addRoleVisible = true;
    },

    //删除单个角色数据
    remove(row) {
      let self = this;
      self.open(row);
    },
    // 编辑单条角色数据
    edit(row) {
      let self = this;
      self
        .getRoleInfoById({
          roleId: row.roleId
        })
        .then(data => {
          self.form.deptIdList = data.data.deptIdList;
          self.defaultCheckedKeys = data.data.deptIdList
        });
      self.form.roleName = row.roleName;
      self.form.remark = row.remark;
      sessionStorage.setItem("roleId", row.roleId);
      self.addRoleVisible = true;
    },
    // 搜索
    onSubmit() {
      console.log(1);
    },
    // 获取角色列表
    getRoleListForm() {
      let self = this;
      self
        .getRoleList({
          page: self.currentPage,
          limit: self.pageSize
        })
        .then(data => {
          self.Isshow = true;
          self.loading = false;
          self.tableData = data.data.list;
          self.totals = data.data.totalCount;
        });
    },
    handleSizeChange(val) {
      let self = this;
      self.pageSize = val;
      self.getRoleListForm();
    },
    handleCurrentChange(val) {
      let self = this;
      self.currentPage = val;
      self.getRoleListForm();
    },
    // 获取部门列表
    getdeptListForm() {
      let self = this;
      self.getDeptList({}).then(data => {
        self.deptOptions = [];
        self.deptOptions =
          data.data == undefined
            ? self.deptOptions
            : self.deptOptions.concat(data.data);
        self.optionData = [{ deptId: 0, name: "无相关部门" }];
        self.optionData = data.data == undefined ? self.optionData : data.data;
      });
    },
  },
  // 监视
  watch: {}
};
</script>
<style scoped>
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
  font-size: 14px;
}
.paginationCon {
  float: right;
  margin-top: 12px;
  margin-right: 30px;
}
</style>
