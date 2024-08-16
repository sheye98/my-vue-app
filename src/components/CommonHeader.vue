<template>
	<el-header>
		<div class="l-content">
			<!-- 图标展示 -->
			<el-button size="small" @click="handleCollapse">
				<el-icon :size="20">
					<Menu />
				</el-icon>
			</el-button>
			<h3>首页</h3>
		</div>

		<div class="r-content">
			<el-dropdown>
				<span class="el-dropdown-link">
					<img class="user" :src="getImgSrc('yin_yang')">

				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item>个人中心</el-dropdown-item>
						<el-dropdown-item>退出</el-dropdown-item>

					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>

	</el-header>
</template>

<script>
	import { defineComponent } from 'vue-demi'
	import { useStore } from 'vuex'

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

			return {
				getImgSrc,
				handleCollapse
			}
		}
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
		background-color: #333
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

</style>