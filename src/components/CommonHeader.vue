<template>
  <el-header>
    <!-- 导航栏左侧 -->
    <div class="l-content">
      <!-- 图标展示 -->
      <el-button size="small" @click="handleCollapse">
        <el-icon :size="20">
          <Menu/>
        </el-icon>
      </el-button>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current"
        >{{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 导航栏右侧 -->
    <div class="r-content">
      <el-dropdown>
                <span class="el-dropdown-link">
                    <img class="user" :src="getImgSrc('yin_yang')"/>
                </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import {computed, defineComponent} from 'vue-demi'
import {useStore} from 'vuex'
import {useRouter} from "vue-router";

export default defineComponent({
  setup() {
    let store = useStore()

    let getImgSrc = (user) => {
      return new URL(`../assets/images/${user}.png`, import.meta.url).href
    }

    // 处理关闭
    let handleCollapse = () => {
      store.commit('updateIsCollapse')
    }

    // 面包屑状态获取,计算获得的变量都要使用计算属性
    const current = computed(() => {
      return store.state.currentMenu
    })

    const router = useRouter()
    const handleLogout = () => {
      store.commit('cleanMenu')
      router.push({name: 'login'})
    }

    return {
      getImgSrc,
      handleCollapse,
      current,
      handleLogout
    }
  },
})
</script>

<style lang="less" scoped>
header {
  // 盒子布局
  display: flex;
  // 左右两边各自到最左最右
  justify-content: space-between;
  // 项目居中
  align-items: center;
  width: 100%;
  background-color: #333;
}

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }

  h3 {
    color: #fff;
  }
}

// .bread /deep/ span {
//     color: #fff;
//     cursor: pointer;
// }

:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}
</style>
