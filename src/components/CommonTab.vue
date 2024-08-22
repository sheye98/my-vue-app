<template>
    <div class="tags">
        <el-tag
            v-for="(tag, index) in tags"
            :key="tag.name"
            :closable="tag.name !== 'home'"
            :disable-transitions="false"
            :effect="$route.name == tag.name ? 'dark' : 'plain'"
            @click="changeMenu(tag)"
            @close="handleClose(tag, index)"
        >
            {{ tag.label }}
        </el-tag>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
    setup() {
        const store = useStore()
        const tags = store.state.tabsList
        const router = useRouter()
        const route = useRoute()

        const changeMenu = (item) => {
            router.push({ name: item.name })
        }

        const handleClose = (tag, index) => {
            let length = tags.length - 1
            // 处理 vuex 中 tabsList
            store.commit('closeTab', tag)

            // 如果需要删除的 tag 跟当前所在的 tag 不一样则删除
            if (route.name !== tag.name) {
                return
            }

            // 如果删除的是最后一个,则当前 tag 跳转到前一个
            if (index === length) {
                router.push({
                    name: tags[index - 1].name,
                })
            }else{
				// 如果删除不是最后一个,跳到后面的一个
				router.push({
                    name: tags[index].name,
                })
			}
        }

        return {
            tags,
            changeMenu,
            handleClose,
        }
    },
}
</script>

<style lang="less" scoped>
.tags {
    padding: 20px;
    width: 100%;
    .el-tag {
        margin-right: 15px;
        cursor: pointer;
    }
}
</style>
