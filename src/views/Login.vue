<template>
  <el-form :model="loginForm" class="login-container">
    <h3>系统登陆</h3>
    <el-form-item>
      <el-input type="text" placeholder="请输入账号" v-model="loginForm.username"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
    </el-form-item>
  </el-form>


</template>
<script>
import {reactive} from "vue";
import {getCurrentInstance} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
  setup() {
    // 双向绑定
    const loginForm = reactive({
      username: "admin",
      password: "admin",
    })

    const {proxy} = getCurrentInstance()
    const store = useStore()
    const router = useRouter()

    const login = async () => {
      const res = await proxy.$api.getMenu(loginForm)
      // 登录时设置 menu 权限
      store.commit('setMenu', res.menu)
      store.commit('addMenu', router)
      store.commit('setToken', res.token)
      // 登录完成设置路由跳转
      await router.push({
        name: 'home',
      })

    }

    return {login, loginForm}
  }
}

</script>

<style scoped lang="less">
.login-container {
  width: 350px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 180px auto;

  h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }

  /deep/ .el-form-item__content {
    justify-content: center;
  }
}
</style>