<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div id="app" class="login" v-loading.body="loading" element-loading-text="登录中....">
    <div class="company">
      <img src="../../static/img/logo.png" alt/>
    </div>
    <div class="face">
      <div class="faceImg">
        <img src="../../static/img/face2.png" alt/>
      </div>
      <div class="loginope">
        <div class="faceSystem">
          <img src="../../static/img/faceSystem.png" alt/>
        </div>
        <p class="loginName">登录</p>
        <p class="register" @click="register">去注册</p>
        <div class="loginIng bot">
          <el-input placeholder="请输入内容" v-model="user.name" autocomplete="off">
            <template slot="prepend">
              <img src="../../static/img/account.png" alt/>
            </template>
          </el-input>
        </div>
        <div class="loginIng bot psd">
          <el-input placeholder="请输入内容" type='password' v-model="user.password" autocomplete="off">
            <template slot="prepend">
              <img src="../../static/img/password.png" alt/>
            </template>
          </el-input>
        </div>
        <div class="loginBut">
          <div>
            <el-checkbox class="memory" v-model="checked">记住密码</el-checkbox>
          </div>
          <div>
            <div class="forgetPassword">忘记密码？</div>
          </div>
        </div>
        <div>
          <div class="but" @click="loginClick">登陆</div>
        </div>
      </div>
    </div>
    <div class="copy">
      Copyright ©2020 中原大数据研究院有限公司 版权所有
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        checked: false,
        user: {
          name: "",
          password: ""
        },
        loading: false
      }
    },
    methods: {
      loginClick() {
        this.$axios.get('api/user/login?username=' + this.user.name + '&password=' + this.user.password).then(res => {
          if (res.data.status==200){
            //将用户放入localStorage
            localStorage.setItem("LOGIN_NAME",res.data.obj.data.username)
            sessionStorage.setItem("ROLE_ID",res.data.obj.data.roleid);
            // 编程式路由,对应还有一个replace，replace不能回退
            this.$router.push({
              path: '/home'
            })
          }else {
            this.$alert("登录失败！请验证账户或密码是否正确！")
          }
        })


      },
      register() {
        this.$router.push({
          path: "/register"
        });
      },
    }
  }
</script>

<style scoped>
  .login {
    height: 100vh;
    background: url("/static/img/loginBac.png") no-repeat;
    background-size: 100vw 100vh;
  }

  .company img {
    width: 244px;
    height: 45px;
    margin-left: 56px;
    margin-top: 39px;
  }

  .face {
    width: 100vw;
    height: calc(100vh - 40px);
    margin-top: 14%;
  }

  .faceImg {
    width: 64%;
    height: 71%;
    min-width: 887px;
    min-height: 545px;
    padding-bottom: 5%;
  }

  .faceImg img {
    width: 100%;
    height: 100%;
  }

  .faceSystem {
    margin-top: -30px !important;
    margin-left: 31px;
  }

  .loginName {
    width: 48px;
    height: 23px;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(5, 255, 255, 1);
    line-height: 24px;
    margin-left: 66px;
    margin-top: 47px;
  }

  .register {
    float: right;
    width: 43px;
    height: 15px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    text-decoration: underline;
    color: rgba(124, 204, 255, 1);
    line-height: 24px;
    margin-right: 58px;
    margin-top: -30px;
    cursor: pointer;
  }

  .loginope {
    position: fixed;
    right: 15%;
    top: 36%;
    z-index: 1;
    width: 351px;
    height: 352px;
    background: url("/static/img/accountBac.png") no-repeat;
  }

  .loginope h3 {
    width: 100%;
    margin: 0;
    padding: 0;
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-size: 26px;
    color: #fff;
    font-family: "microsoft yahei", Helvetica, Tahoma, Arial, "Microsoft jhengHei",
    sans-serif;
  }

  .loginope > div {
    height: 50px;
    /* margin-top: 20px; */
  }

  .loginIng {
    display: flex;
    align-items: center;
    height: 50px;
    justify-content: center;
    width: 228px;
    margin: 0 auto;
  }

  .loginBut {
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 35px;
    line-height: 35px;
  }

  .loginBut > div:nth-child(1) {
    font-size: 14px;
    margin-left: 62px;
    float: left;
    height: 35px;
  }

  .memory {
    color: #fff;
    height: 35px;
    line-height: 35px;
  }

  .but {
    font-size: 16px;
    line-height: 33px;
    border: 0;
    margin-right: 90px;
    text-align: center;
    cursor: pointer;
    width: 228px;
    height: 32px;
    background: rgba(26, 220, 255, 1);
    border-radius: 4px;
    margin-left: 65px;
    margin-top: 30px;
  }

  .forgetPassword {
    float: right;
    margin-right: 36px;
    width: 65px;
    height: 10px;
    font-size: 10px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(26, 209, 255, 1);
    line-height: 10px;
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
