<template>
    <div class="common-layout">
        <!-- class="lay-container" -->
        <el-container class="lay-container">

            <common-aside></common-aside>

            <!-- class="r-container" -->
            <el-container class="r-container">
                <common-header />
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';
    import CommonHeader from '../components/CommonHeader.vue';
    import CommonAside from '../components/CommonAside.vue';

    export default defineComponent({
        components: {
            CommonHeader,
            CommonAside,
        }
    })


</script>

<style lang="less" scoped>

    .el-container {
        // 注意
        flex-wrap: wrap;
        align-items: flex-start;
    }

    .common-layout {
        height: 100%;

        .el-container.lay-container {
            height: 100%;
            flex-wrap: wrap;
            align-items: flex-start;

            .el-aside {
                height: 100%;
                background-color: #545c64;
            }
        }
    }


</style>