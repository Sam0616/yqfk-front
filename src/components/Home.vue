<template>
  <div id="app" class="home">
    <div class="header">
      <div class="projectName">疫情防控管理系统</div>
      <div class="company">
        <div>{{companyName}}</div>
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user">
            <i class="el-icon-s-custom iconColor"></i>
            <span>{{userName}}</span>
            <i class="el-icon-arrow-down"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1" icon="el-icon-edit">修改密码</el-dropdown-item>
              <el-dropdown-item command="2" icon="el-icon-user-solid">切换角色</el-dropdown-item>
              <el-dropdown-item command="3" icon="el-icon-switch-button" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </div>
        </el-dropdown>
      </div>
    </div>
    <!-- 修改密码弹出框 -->
    <el-dialog width="40%" title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="新密码" prop="newPassword" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.confirmPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 切换角色弹出框 -->
    <el-dialog width="40%" title="选择角色" :visible.sync="selectRoleVisible">
      <el-form>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select @change="changeRole" v-model="selectRole" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="main">
      <div class="nav">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :default-active="activeIndex"
          router
          :unique-opened='true'
        >
          <NavMenu :navMenus="menuData"></NavMenu>
        </el-menu>
      </div>
      <div class="content">
        <router-view class="view" keep-alive></router-view>
      </div>
    </div>
  </div>
</template>

<script>
    import NavMenu from "./cModule/sideNav";
    export default {
        components: { NavMenu },
        name: "Home",
        data(){
            return {
                rules: {
                    newPassword: [
                        { required: true, message: "请输入密码", trigger: "blur" },
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/,
                            message: "至少包含大写字母,小写字母,数字,且不小于6位不大于16位",
                            trigger: "blur"
                        }
                    ],
                    confirmPassword: [
                        { required: true, message: "请输入密码", trigger: "blur" },
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/,
                            message: "至少包含大写字母,小写字母,数字,且不小于6位不大于16位",
                            trigger: "blur"
                        }
                    ]
                },
                selectRole: "",
                companyName: sessionStorage.getItem("companyName"),
                activeIndex: "aa",
                menuData: [
                    {
                        id:1,
                        name:'个人&群体查询服务',
                        path:'/home/personal',
                        icon:'el-icon-s-custom',
                        children:[
                            {
                                id:1-1,
                                name:'个人来源地查询',
                                path:'/home/source',
                                icon:'el-icon-user-solid',
                            },
                            {
                                id:1-2,
                                name:'个人历史轨迹查询',
                                path:'/home/history',
                                icon:'el-icon-info',
                            },
                            {
                                id:1-3,
                                name:'危险伴行行为查询',
                                path:'/home/dangerous',
                                icon:'el-icon-warning',
                            },
                            {
                                id:1-4,
                                name:'个人综合感染风险',
                                path:'/home/risk',
                                icon:'el-icon-message-solid',
                            }
                        ]
                    },
                    {
                        id:2,
                        name:'区域疫情防控',
                        path:'/home/epidemic',
                        icon:'el-icon-place',
                        children:[
                            {
                                id:2-1,
                                name:'区域疑似&感染案例查询',
                                path:'/home/case',
                                icon:'el-icon-phone-outline',
                            },
                            {
                                id:2-2,
                                name:'区域来源地人流统计分布',
                                path:'/home/statistics',
                                icon:'el-icon-s-data',
                            },
                            {
                                id:2-3,
                                name:'区域风险指标',
                                path:'/home/target',
                                icon:'el-icon-s-flag',
                            }
                        ]
                    },
                    {
                        id:3,
                        name:'疫情仿真模拟',
                        path:'/home/simulate',
                        icon:'el-icon-s-marketing',
                        children:[
                            {
                                id:3-1,
                                name:'危险伴行人员',
                                path:'/home/riskPersonal',
                                icon:'el-icon-user-solid',
                            },
                            {
                                id:3-2,
                                name:'疫情原因追溯',
                                path:'/home/trace',
                                icon:'el-icon-thumb',
                            },
                            {
                                id:3-3,
                                name:'疫情扩散仿真',
                                path:'/home/scale',
                                icon:'el-icon-price-tag',
                            }
                        ]
                    },
                    {
                        id:4,
                        name:'人员管理',
                        path:'/home/people',
                        icon:'el-icon-user',
                        children:[
                            {
                                id:4-1,
                                name:'用户管理',
                                path:'/home/user',
                                icon:'el-icon-user',
                            },
                            {
                                id:4-2,
                                name:'角色管理',
                                path:'/home/role',
                                icon:'el-icon-s-custom',
                            },
                            {
                                id:4-3,
                                name:'菜单管理',
                                path:'/home/menu',
                                icon:'el-icon-notebook-2',
                            },
                            {
                                id:4-4,
                                name:'权限管理',
                                path:'/home/auth',
                                icon:'el-icon-setting',
                            },
                            {
                              id:4-5,
                              name:'部门管理',
                              path:'/home/dept',
                              icon:'el-icon-setting',
                            },
                        ]
                    }
                ],
                dialogFormVisible: false,
                form: {
                    newPassword: "",
                    confirmPassword: ""
                },
                formLabelWidth: "120px",
                userName: localStorage.getItem("LOGIN_NAME"),
                loading: true,
                isCollapse: false,
                options: [],
                selectRoleVisible: false
            };
        },
        mounted() {
            let start = window.location.href.lastIndexOf("/");
            let path = window.location.href.slice(start + 1);
            this.activeIndex = path;

        },
        methods: {
            // 切换角色
            changeRole() {
                let self = this;
                sessionStorage.setItem("loginRoleId", this.selectRole);
                sessionStorage.setItem("changeRole", "1");
                this.getUserMenuList();
                self.selectRoleVisible = false;

            },
            // 确定修改密码
            confirm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let self = this;
                        if (self.form.newPassword !== self.form.confirmPassword) {
                            self.$message({
                                type: "info",
                                message: "两次密码输入不一致，请重新输入。"
                            });
                            return;
                        }
                        self
                            .getUpdatePassword({
                                password: self.form.newPassword
                            })
                            .then(data => {
                                if (data.code == "0") {
                                    self.$message({
                                        type: "info",
                                        message: "密码修改成功，请重新登录。"
                                    });
                                    self.$router.push({
                                        path: "/login"
                                    });
                                } else {
                                    self.$message({
                                        type: "info",
                                        message: data.msg
                                    });
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            //  获取用户菜单列表
            getUserMenuList() {
                let self = this;
                let role_id_list = [parseInt(sessionStorage.getItem("loginRoleId"))];
                self
                    .getMenuList({
                        role_id_list: role_id_list,
                        filter_flag: 1
                    })
                    .then(data => {
                        self.menuData = data.result.menu_tree;
                        let changeRole = sessionStorage.getItem("changeRole");
                        if (changeRole == "1") {
                            self.$router.push({
                                path: self.menuData[0].children[0].url
                            });
                            self.activeIndex = self.menuData[0].children[0].perms
                        }
                    });
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            // 点击右上角个人信息菜单项触发相关事件
            handleCommand(command) {
                if (command == "1") {
                    this.form = {};
                    this.dialogFormVisible = true;
                } else if (command == "2") {
                    this.selectRole = JSON.parse(sessionStorage.getItem("loginRoleId"));
                    this.options = JSON.parse(sessionStorage.getItem("roleList"));
                    this.selectRoleVisible = true;
                } else if (command == "3") {

                  this.$confirm("您确认退出登录吗？").then(res=>{
                    sessionStorage.clear()
                    this.$router.push({
                      path: "/login"
                    });
                  })


                }
            },
            // 侧导航跳转
            menuSelected(route) {
                // this.$router.push({
                //     path:route
                // })
            },

        }
    }
</script>

<style scoped>
  .home {
    width: 100%;
    height: 100%;
    min-width: 1800px;
    overflow-x:scroll;
  }
  .main {
    width: 100%;
    height: calc(100% - 51px);
  }
  .header {
    width: 100%;
    height: 50px;
    min-height: 50px;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    border-bottom: 1px solid #ccc;
  }
  .nav {
    width: 240px;
    background-color: #ffffff;
    height: 100%;
    max-width: 240px;
    position: fixed;
    top: 50px;
    left: 0;
    z-index: 9999;
  }
  .content {
    width: calc(100% - 240px);
    height: 100%;
    position: fixed;
    left: 240px;
    top: 50px;
    background-color: #f0f2f5;
  }
  .navMenu,
  .el-menu,
  .el-submenu__title {
    height: 100%;
  }
  .projectName {
    float: left;
    width: 239px;
    max-width: 239px;
    height: 50px;
    background-color: #009fe9;
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 50px;
  }
  .company {
    float: right;
    height: 50px;
  }
  .company div:nth-child(1) {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    color: #606266;
    font-size: 14px;
    border-right: 1px solid #ccc;
    padding-right: 16px;
  }
  .company div:nth-child(2) {
    height: 50px;
    float: right;
    line-height: 50px;
    padding-right: 20px;
    cursor: pointer;
  }
  .iconColor {
    padding-left: 16px;
    color: #009fe9;
    font-size: 16px;
  }
  .user span {
    padding-left: 2px;
    padding-right: 2px;
    font-size: 14px;
    color: #606266;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
