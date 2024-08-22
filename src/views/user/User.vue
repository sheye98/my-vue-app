<template>
  <div class="user-header">
    <el-button type="primary" @click="dialogVisible = true">新增</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input v-model="formInline.keyword" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table :data="list" style="width: 100%; height: 500px">
      <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="(item.width) ? item.width : 125"
      />
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="config.total"
        @current-change="changePage"
        class="pager"
    />
  </div>
  <el-dialog
      v-model="dialogVisible"
      :title="action === 'add' ? '新增用户' : '编辑用户' "
      width="35%"
      :before-close="handleClose"
  >
    <el-form :inline="true" :model="formUser" ref="userForm">
      <el-row>
        <el-col span="12">
          <!--    新增用户的姓名 -->
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>

        <!--    新增用户的年龄 -->
        <!--        不加 prop 无法自动清除 -->
        <el-col span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="formUser.age" placeholder="请输入年龄"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col span="12">
          <!--    新增用户的姓名-->
          <el-form-item label="性别" prop="sex">
            <el-select v-model="formUser.sex" placeholder="请选择" style="width: 100px">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
                v-model="formUser.birth"
                type="date"
                placeholder="请输入出生日期"
                style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="formUser.addr" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-row>

      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>

    </el-form>
  </el-dialog>
</template>

<script>
import {getCurrentInstance, defineComponent, onMounted, ref, reactive} from 'vue'
import {ElMessage, ElMessageBox} from "element-plus";

export default defineComponent({
  setup() {
    const {proxy} = getCurrentInstance()
    const list = ref([])
    const tableLabel = reactive([
      {
        prop: 'name',
        label: '姓名',
      },
      {
        prop: 'age',
        label: '年龄',
      },
      {
        prop: 'sex',
        label: '性别',
      },
      {
        prop: 'birth',
        label: '出生日期',
        width: 200,
      },
      {
        prop: 'addr',
        label: '地址',
        width: 320,
      },
    ])

    const config = reactive({
      total: 0,
      page: 1,
      name: '',
    })

    const getUserData = async (config) => {
      let res = await proxy.$api.getUserData(config)
      config.total = res.count
      list.value = res.list.map((item) => {
        item.sex = item.sex === 0 ? '女' : '男'
        return item
      })
    }

    const changePage = (page) => {
      config.page = page
      getUserData(config)
    }

    onMounted(() => {
      getUserData(config)
    })

    // 双向绑定使用 reactive
    const formInline = reactive({
      keyword: '',
    })

    const handleSearch = () => {
      config.name = formInline.keyword
      getUserData(config)
    }

    // 控制模态框显示阴影
    const dialogVisible = ref(false)
    const handleClose = (done) => {
      ElMessageBox.confirm("确定关闭嘛").then(() => {
        proxy.$refs.userForm.resetFields()
        done()
      }).catch(() => {

      })
    }

    // 添加用户的 form 数据
    const formUser = reactive({
      name: "",
      age: "",
      sex: "",
      addr: "",
      birth: ""
    })

    // 添加用户
    const onSubmit = () => {
      proxy.$refs.userForm.validate(async (valid) => {
        // 校验数据的规则
        if (valid) {
          if (action === 'add') {
            let res = await proxy.$api.addUserData(formUser);
            if (res) {
              // 确认完成之后，输入框的信息全部重置
              proxy.$refs.userForm.resetFields()
              // 输入框消失
              dialogVisible.value = false
              await getUserData(config)
            }
          } else {
            // 编辑的接口
            formUser.sex === "男" ? formUser.sex = 0 : formUser.sex = 1
            let res = await proxy.$api.editUserData(formUser);
            if (res) {
              // 确认完成之后，输入框的信息全部重置
              proxy.$refs.userForm.resetFields()
              // 输入框消失
              dialogVisible.value = false
              await getUserData(config)
            }
          }

        } else {
          ElMessage({
            showClose: true,
            message: '请输出正确的内容',
            type: 'error'
          })
        }
      })

    }

    // 取消
    const handleCancel = () => {
      dialogVisible.value = false
      proxy.$refs.userForm.resetFields()
    }

    // 区分编辑还是新增
    const action = ref('add')
    // 编辑用户
    const handleEdit = (row) => {
      action.value = 'edit'
      dialogVisible.value = true

      row.sex === 0 ? (row.sex = '男') : (row.sex = '女')
      proxy.$nextTick(() => {
        Object.assign(formUser, row)
      })
    }

    const handleAdd = () => {
      action.value = 'add'
      dialogVisible.value = true
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm("确定删除嘛").then(async () => {
        await proxy.$api.deleteUserData({
          id: row.id,
        })
        ElMessage({
          showClose: true,
          message: "删除成功",
          type: "success"
        })
        await getUserData(config)
      }).catch(() => {

      })
    }

    return {
      tableLabel,
      list,
      config,
      changePage,
      formInline,
      handleSearch,
      dialogVisible,
      handleClose,
      action,
      handleCancel,
      formUser,
      onSubmit,
      handleEdit,
      handleAdd,
      handleDelete
    }
  },
})
</script>

<style lang="less" scoped>
.table {
  position: relative;
  height: 520px;

  .pager {
    position: absolute;
    right: 0;
    bottom: -20px;
  }
}

.user-header {
  display: flex;
  justify-content: space-between;
}
</style>
