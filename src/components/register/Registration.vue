<!--注册-->
<template>
  <div class="register">
    <div class="top">
      <div class="topLeft"></div>
      <span class="welcome">欢迎注册</span>
      <div class="toLogin" @click="tologin()">已有账号？去登录</div>
    </div>
    <div class="bot">
      <div class="step">
        <el-steps :active="active" finish-status="success">
          <el-step title="验证手机号"></el-step>
          <el-step title="完善信息"></el-step>
          <el-step title="注册成功"></el-step>
        </el-steps>
      </div>
      <div class="form">
        <el-form
          v-show="active==0"
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label prop="mobile">
            <el-input placeholder="请输入内容" v-model="ruleForm.mobile" autocomplete="off">
              <template slot="prepend">中国 +86</template>
            </el-input>
          </el-form-item>
          <el-form-item label prop="code">
            <el-input placeholder="请输入内容" v-model="ruleForm.code" autocomplete="off">
              <template slot="prepend">手机验证码</template>
              <el-button slot="append" @click.native="getPhoneCode">{{enterCode}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">下一步</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 用户详细信息 -->
        <el-form v-show="active == 1" :model="form" :rules="rules" ref="form" class="demo-ruleForm">
          <el-form-item label prop="userName" :label-width="formLabelWidth">
            <el-input v-model="form.userName" autocomplete="off">
              <template slot="prepend">用户名称</template>
            </el-input>
          </el-form-item>
          <!--       <el-form-item label prop="account" :label-width="formLabelWidth">
                   <el-input v-model="form.account" autocomplete="off">
                     <template slot="prepend">用户账号</template>
                   </el-input>
                 </el-form-item>-->
          <el-form-item ref="password" label prop="password" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off" type="password">
              <template slot="prepend">设置密码</template>
            </el-input>
          </el-form-item>
          <el-form-item label prop="email" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off">
              <template slot="prepend">用户邮箱</template>
            </el-input>
          </el-form-item>
          <el-form-item style="margin-left:150px;">
            <el-button type="primary" @click="submitForm2('form')">完成</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <div v-show="active == 2" class="step3">
          <div class="contion">恭喜您，注册成功！</div>
          <el-button class="resToLogin" type="primary" @click="tologin()">去登录</el-button>
        </div>
      </div>
    </div>
    <div class="copy">Copyright ©2019 中原大数据研究院有限公司 版权所有</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        active: 0,
        step1: true,
        ruleForm: {
          mobile: "",
          code: "",
          appCode: ""
        },
        enterCode: "获取验证码",
        rules: {
          // app: [{ required: true, message: "请输入APP授权码", trigger: "blur" }],
          userName: [
            {required: true, message: "请输入用户名称", trigger: "blur"},
            {max: 10, message: "用户名称最多为10个字符"}
          ],
          account: [
            {required: true, message: "请输入账号", trigger: "blur"},
            {min: 6, max: 24, message: "账号长度在6-24个字符", trigger: "blur"},
            {
              pattern: /^[a-zA-Z0-9_]{0,}$/,
              message: "不可以输入中文和特殊字符",
              trigger: "blur"
            }
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/,
              message: "至少包含大写字母,小写字母,数字,且不小于6位不大于16位",
              trigger: "blur"
            }
          ],
          telphone: [
            {required: true, message: "请输入手机号", trigger: "blur"},
            {
              pattern: /^1[34578]\d{9}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ],
          email: [
            {required: true, message: "请输入邮箱地址", trigger: "blur"},
            {type: "email", message: "请输入正确的邮箱地址", trigger: "blur"}
          ],
          companyName: [
            {required: true, message: "请输入单位名称", trigger: "blur"},
            {max: 24, message: "单位名称最大长度为24个字符"}
          ],
          companyLicense: [
            {max: 18, message: "统一社会信用代码最大长度为18个字符"}
          ],
          companyAddress: [{max: 50, message: "单位地址最大长度为50个字符"}],
          setRole: [
            {
              required: true,
              message: "请选择角色配置",
              trigger: "change"
            }
          ]
        },
        formLabelWidth: "150px",
        addRoleVisible: false,
        form: {
          userName: "",
          app: "",
          account: "",
          password: "",
          telphone: "",
          email: "",
          companyName: "",
          companyLicense: "",
          companyAddress: "",
          setRole: [],
          remark: "",
          depts: ""
        }
      };
    },
    // 过滤
    filters: {},
    // 模块新建时
    created: function () {
    },
    // 计算属性
    mounted() {
    },
    // 事件处理
    methods: {
      //   获取验证码
      getPhoneCode() {
        let self = this;
        if (self.ruleForm.mobile == "") {
          self.$message({
            type: "info",
            message: "请输入手机号"
          });
          return;
        }

        console.log(self.ruleForm.mobile)
        //ajax
        this.$axios.get("api/user/getCode?phone=" + self.ruleForm.mobile).then(res => {
          console.log(res.data)
        })

      },
      // 下一步，获取APP授权码
      submitForm() {
        console.log(this.ruleForm.code)
        this.$axios.get("api/user/check?code=" + this.ruleForm.code).then(res => {
          console.log(res.data)
          if (res.data.flag) {
            this.active = 1;
          } else {
            this.$message({
              type: "errror",
              message: "验证码不正确"
            })
          }
        })
      },
      // 重置
      resetForm() {
        this.ruleForm = {
          mobile: "",
          code: ""
        };
      },
      submitForm2(formName) {
        this.active = 2;

      },
      tologin() {
        this.$router.push({
          path: "/login"
        });
      },
    },
    // 监视
    watch: {}
  };
</script>
<style scoped>
  .resToLogin {
    width: 336px;
    height: 40px;
    background: rgba(26, 220, 255, 1);
    border-radius: 0px !important;
    color: #0a3d75 !important;
  }

  .step3 {
    width: 100%;
    height: 100%;
    text-align: center;
    margin-left: 50px;
    margin-top: 200px;
  }

  .contion {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(26, 220, 255, 1);
    line-height: 81px;
  }

  .step {
    width: 40%;
    height: auto;
    margin: 0 auto;
  }

  .bot {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 89px;
    left: 0;
    background: url("/static/img/registerBot.png") no-repeat;
    background-size: cover;
    padding-top: 56px;
  }

  .welcome {
    width: 80px;
    height: 20px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(5, 255, 255, 1);
    line-height: 24px;
    margin-left: 24px;
    margin-top: 37px;
  }

  .topLeft {
    width: 244px;
    height: 45px;
    margin-left: 43px;
    background: url("/static/img/logo.png") no-repeat;
    background-size: cover;
    float: left;
    margin-top: 19px;
  }

  .toLogin {
    float: right;
    width: 117px;
    height: 15px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(132, 248, 248, 1);
    line-height: 89px;
    margin-right: 162px;
    cursor: pointer;
  }

  .top {
    width: 100%;
    height: 89px;
    background: url("/static/img/registerTop.png") no-repeat;
    background-size: cover;
    line-height: 89px;
  }

  .register {
    width: 100%;
    height: 100%;
    /* overflow: scroll; */
  }

  .form {
    margin-left: -100px;
    margin-top: 10px;
  }

  .demo-ruleForm {
    width: 40%;
    height: 100%;
    margin: 0 auto;
    padding-top: 30px;
  }

  .copy {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    text-align: center;
    line-height: 70px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(20, 137, 204, 0.99);
    opacity: 0.5;
  }
</style>
