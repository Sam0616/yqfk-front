<template>
  <div class="role">
    <div class="seek">
      <div class="formContent">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="手机号" class="label">
            <el-input v-model="searchPhone" placeholder="请输入内容" value=''></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="findUsers">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="toAddUser">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!--用户列表-->
    <div class="userList">
      <el-table v-loading="loading" :data="userList" border row-key="id" lazy
                style=" width: 96%;margin-left:30px;margin-top:30px;" :header-cell-style="{background:'#f5f6fa'}">
        <el-table-column type="index" label="序号" width="50" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="id" label="用户编号" header-align="center"
                         align="center"></el-table-column>
        <el-table-column prop="username" label="用户名称" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="180" align="center"></el-table-column>

        <el-table-column label="姓别" align="center">
          <template slot-scope="userList">
            <p>{{userList.row.sexid | filterSex}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" width="180" align="center"></el-table-column>
        <!--        <el-table-column label="部门" align="center">-->
        <!--          <template slot-scope="userList">-->
        <!--            <p>{{userList.row.deptid | filterDept(that)}}</p>-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column prop="roleid" label="用户角色" align="center">
          <template slot-scope="userList">
            <p>{{userList.row.roleid | filterRole(that)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="userList">
            <!--            <el-button type="warning" size="max" class="config-btn" style="width:100px;"-->
            <!--                       @click.native.prevent="">修改密码-->
            <!--            </el-button>-->
            <el-button type="primary" size="max" class="config-btn" style="width:70px;"
                       @click.native.prevent="toEdituser(userList.row)">编辑
            </el-button>
            <el-button type="danger" class="blue-btn" size="max" style="width:70px"
                       @click.native.prevent="delUser(userList.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--      分页-->
      <div class="paginationCon">
        <el-pagination v-show="isShow" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage" :page-sizes="[5,10, 15, 20, 100]" :page-size='pageSize'
                       layout="total, sizes, prev, pager, next, jumper" :total="totals"></el-pagination>
      </div>


      <!-- 添加用户 -->
      <el-dialog
        :close-on-click-modal="false"
        width="35%"
        title="添加用户"
        :visible="addUserForm"
        :modal-append-to-body='false'
        @close='closeUserForm'
      >

        <el-form :model="userForm" ref="roleForm" :rules="rules">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username">
            <el-input autocomplete="off" v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
            <el-input autocomplete="off" v-model="userForm.password"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" :label-width="formLabelWidth" prop="rePassword">
            <el-input autocomplete="off" v-model="userForm.rePassword"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="userForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio v-model="userForm.sex" :label="0">男</el-radio>
            `
            <el-radio v-model="userForm.sex" :label="1">女</el-radio>
            `
          </el-form-item>

          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select class="filter-item" placeholder="请选择" v-model="userForm.roleid">
              <el-option v-for="role in roleList" :value="role.id" :key="role.id">{{role.role}}</el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="userForm.age"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="userForm.email"></el-input>
          </el-form-item>
          <!--   <el-form-item label="部门" :label-width="formLabelWidth">
               <el-select class="filter-item" placeholder="请选择" v-model="userForm.deptid">
                 <el-option v-for="dept in deptList" :value="dept.id" :key="dept.id">{{dept.name}}</el-option>
               </el-select>
             </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeUserForm">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>

      <!--    修改用户-->
      <el-dialog
        :close-on-click-modal="false"
        width="35%"
        title="修改用户"
        :visible="editUserForm"
        :modal-append-to-body='false'
        @close='closeEditUserForm'
      >
        <el-form :model="userForm" ref="roleForm" :rules="rules">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username">
            <el-input autocomplete="off" v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
            <el-input autocomplete="off" v-model="userForm.password"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" :label-width="formLabelWidth" prop="rePassword">
            <el-input autocomplete="off" v-model="userForm.rePassword"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="userForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio v-model="userForm.sexid" :label="0">男</el-radio>
            <el-radio v-model="userForm.sexid" :label="1">女</el-radio>
          </el-form-item>

          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select class="filter-item" placeholder="请选择" v-model="userForm.roleid">
              <el-option v-for="role in roleList" :value="role.id" :label="role.role" :key="role.id">{{role.role}}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="userForm.age"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="userForm.email"></el-input>
          </el-form-item>
          <!--       <el-form-item label="部门" :label-width="formLabelWidth">
                   <el-select class="filter-item" placeholder="请选择" v-model="userForm.deptid">
                     <el-option  v-for="dept in deptList" :value="dept.id" :label="dept.name" :key="dept.id">{{dept.name}}</el-option>
                   </el-select>
                 </el-form-item>-->

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEditUserForm">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </div>
      </el-dialog>

    </div>

    </div>
</template>


<script>
  import axios from 'axios'

  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        that: this,
        formLabelWidth: '120px',
        addUserForm: false,
        editUserForm: false,
        searchPhone: '',
        loading: true,
        isShow: true,
        currentPage: 1,
        pageSize: 10,
        totals: 18,
        rules: [],
        userForm: {
          username: "",
          password: "",
          rePassword: "",
          phone: "",
          sexid: 0,
          roleid: "",
          age: 0,
          email: "",
          // deptid: ""
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ],
          rePassword: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },
        userList: [],
        roleList: [],
        // deptList: []
      }
    },
    mounted() {
      // ajax 获取用户列表
      this.initListMy();

      // ajax 获取角色列表
      axios.get("api/role/getAllRoles").then(res => {
        // console.log(res)
        this.roleList = res.data.obj.data;
      })
      /*      // ajax 获取部门列表
            axios.get("api/dept/list").then(res => {
              console.log(res.data.data)
              this.deptList = res.data.data;
            })*/
    },
    methods: {
      closeUserForm: function () {
        this.addUserForm = false;
      },
      closeEditUserForm: function () {
        this.editUserForm = false;
      },


      addUser: function () {
        this.$refs.roleForm.validate((valid) => {
          if (valid) {
            console.log(this.userForm)
            // 添加用户
            axios.post("api/user/register", this.userForm).then(res => {
              console.log(res.data.status)
              if (res.data.status == 200) {
                alert("用户添加成功")
                // 列表数据的重新加载
                this.initListMy();
              } else {
                alert("用户添加失败")
              }
              // 关闭弹窗
              this.addUserForm = false;
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },


      toAddUser: function () {
        this.addUserForm = true;
      },


      //显示列表
      initListMy: function (pageNo = 1, pageSize = 5) {
        axios.get("api/user/getAllUsers?pageNo=" + pageNo + "&pageSize=" + pageSize).then(res => {
          console.log(res.data.obj)
          this.userList = res.data.obj.data
          this.currentPage = res.data.obj.pageNo;
          this.pageSize = res.data.obj.pageSize;
          this.totals = res.data.obj.count;

          this.loading = false
        })
      },




      delUser: function (id) {

        this.$confirm("您确认要删除这条记录吗？").then(res => {
          axios.get("api/user/delUser?userId=" + id).then(res => {
            this.$alert("用户删除成功")
            // 列表数据的重新加载
            this.initListMy();
          })
        })
      },


      toEdituser(user) {
        this.userForm = user;
        this.editUserForm = true;
      },

      editUser: function () {
        console.log(this.userForm)
        //Ajax修改
        axios.post('api/user/updUser', this.userForm).then(res => {
          console.log(res.data.status)
          if (res.data.status = 200) {
            this.$alert("用户修改成功")
            // 列表数据的重新加载
            this.initListMy();
          } else {
            this.$alert("用户修改失败")
          }
          // 关闭弹窗
          this.editUserForm = false;
        })
      },

      //分页
      handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      // 取出当前页的数据
      this.initListMy(this.currentPage,val)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      // 取出当前页的数据
      this.initListMy(val,this.pageSize)
    },



      findUsers: function () {
        axios.get("api/user/getAllUsers?content=" + this.searchPhone).then(res => {
          //console.log(res.data.obj.data)
          this.userList = res.data.obj.data
        })
      }
    },
    filters: {
      filterSex: function (v) {
        return v == 0 ? '男' : '女'
      },

      filterDept: function (id, that) {
        let name = "ok";
        for (let i = 0; i < that.deptList.length; i++) {
          if (that.deptList[i].id === id) {
            name = that.deptList[i].name;
          }
        }
        return name;
      },

      filterRole: function (id, that) {
        let name = "ok";
        for (let i = 0; i < that.roleList.length; i++) {
          if (that.roleList[i].id === id) {
            name = that.roleList[i].role;
          }
        }
        return name;
      },
    }

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

  .userList {
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
