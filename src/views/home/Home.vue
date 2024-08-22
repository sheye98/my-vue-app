<template>
    <!-- gutter 指定列之间的间距 -->
    <el-row class="home" :gutter="20">
        <!-- 每个布局占多少列 -->
        <el-col :span="8" style="margin-top: 20px">
            <el-card shadow="hover">
                <div class="user">
                    <img src="../../assets/images/yin_yang.png" />
                    <div class="user-info">
                        <p class="name">Admin</p>
                        <p class="role">超级管理员</p>
                    </div>
                </div>

                <div class="login-info">
                    <p>上次登录时间:<span>2022-7-11</span></p>
                    <p>上次登录地点:<span>北京</span></p>
                </div>
            </el-card>

            <el-card shadow="hover" style="margin-top: 20px; height: 450px">
                <el-table :data="tableData">
                    <el-table-column
                        v-for="(val, key) in tableLabel"
                        :key="key"
                        :prop="key"
                        :label="val"
                    >
                    </el-table-column>
                </el-table>
            </el-card>
        </el-col>

        <el-col :span="16" style="margin-top: 20px" class="right-num">
            <div class="num">
                <el-card
                    :body-style="{ display: 'flex', padding: 0 }"
                    v-for="item in countData"
                    :key="item.name"
                >
                    <component
                        class="icons"
                        :is="item.icon"
                        :style="{ background: item.color }"
                    ></component>

                    <div class="detail">
                        <p class="num">￥{{ item.value }}</p>
                        <p class="txt">{{ item.name }}</p>
                    </div>
                </el-card>
            </div>

            <!-- 折线图 -->
            <el-card style="height: 280px">
                <div ref="echart" style="height: 280px"></div>
            </el-card>

            <div class="graph">
                <!-- 柱状图 -->
                <el-card style="height: 260px">
                    <div ref="userchart" style="height: 240px"></div>
                </el-card>
                <el-card style="height: 260px">
                    <div ref="videochart" style="height: 240px"></div>
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { defineComponent, onMounted, ref, getCurrentInstance, reactive } from 'vue'
import * as echart from 'echarts'
import getStatisticalData from '../../api/mockData/static.js'

export default defineComponent({
    setup() {
        const tableLabel = {
            name: '课程',
            todayBuy: '今日购买',
            monthBuy: '本月购买',
            totalBuy: '总购买',
        }

        // 双向绑定到网页上需要使用 ref
        let tableData = ref([])

        const { proxy } = getCurrentInstance()
        const getTableList = async () => {
            // await axios.get('/home/getData').then((res) => {
            //     if (res.data.code == 200) {
            //     tableData.value = res.data.data.tableData
            //     }
            // })
            // 相当于 this 取出全局方法
            let res = await proxy.$api.getTableData()
            tableData.value = res.tableData
        }

        // 获取首页 count 数据
        let countData = ref([])
        const getCountData = async () => {
            let res = await proxy.$api.getCountData()
            countData.value = res.countData
        }

        let xOptions = reactive({
            // 图例文字颜色
            textStyle: {
                color: '#333',
            },
            grid: {
                left: '20%',
            },
            // 提示框
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                type: 'category', // 类目轴
                data: [],
                axisLine: {
                    lineStyle: {
                        color: '#17b3a3',
                    },
                },
                axisLabel: {
                    interval: 0,
                    color: '#333',
                },
            },
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#17b3a3',
                        },
                    },
                },
            ],
            color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
            series: [],
        })
        // 饼状图配置
        let pieOptions = reactive({
            tooltip: {
                trigger: 'item',
            },
            color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],
            series: [],
        })

        let orderData = reactive({
            xData: [],
            series: [],
        })

        let userData = reactive({
            xData: [],
            series: [],
        })

        let videoData = reactive({
            series: [],
        })

        // 获取数据
        const getChartData = async () => {
            let result = await proxy.$api.getChartData()
            // orderData 找不到数据，随机生成
            // let res = result.orderData
            let res = getStatisticalData()

            let userRes = result.userData
            let videoRes = result.videoData
            orderData.xData = res.data
            const keyArray = Object.keys(res[0])
            const series = []
            keyArray.forEach((key) => {
                series.push({
                    name: key,
                    // data: res.data.map((item) => item[key]),
                    data: res.map((item) => item[key]),
                    type: 'line',
                })
            })

            orderData.series = series
            xOptions.xAxis.data = orderData.xData
            xOptions.series = orderData.series
            // orderdata 进行渲染
            let hEcharts = echart.init(proxy.$refs['echart'])
            hEcharts.setOption(xOptions)

            // 柱状图进行渲染
            userData.xData = userRes.map((item) => item.date)
            userData.series = [
                {
                    name: '新增用户',
                    data: userRes.map((item) => item.new),
                    type: 'bar',
                },
                {
                    name: '活跃用户',
                    data: userRes.map((item) => item.active),
                    type: 'bar',
                },
            ]

            xOptions.xAxis.data = userData.xData
            xOptions.series = userData.series
            let uEcharts = echart.init(proxy.$refs['userchart'])
            uEcharts.setOption(xOptions)

            // console.log(videoRes)
            // 饼状图
            videoData.series = [
                {
                    data: videoRes.map((item) => item.value),
                    type: 'pie',
                },
            ]

            pieOptions.series = videoData.series
            let vEcharts = echart.init(proxy.$refs['videochart'])
            vEcharts.setOption(pieOptions)
        }

        onMounted(() => {
            getTableList()
            getCountData()
            getChartData()
        })

        return {
            tableData,
            countData,
            tableLabel,
        }
    },
})
</script>

<style lang="less" scoped>
.home {
    .user {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;

        img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-right: 40px;
        }
    }

    .login-info {
        p {
            line-height: 30px;
            font-size: 14px;
            color: #999;

            span {
                color: #666;
                margin-left: 60px;
            }
        }
    }

    .num {
        display: flex;
        // flex 换行
        flex-wrap: wrap;
        justify-content: space-between;
        .el-card {
            width: 32%;
            margin-bottom: 20px;
        }
        .icons {
            width: 80px;
            height: 80px;
            font-size: 30px;
            text-align: center;
            line-height: 80px;
            color: #fff;
        }
        .detail {
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .num {
                font-size: 30px;
                margin-bottom: 10px;
            }
            .txt {
                font-size: 10px;
                text-align: center;
                color: #999;
            }
        }
    }
    .graph {
        display: flex;
        margin-top: 20px;
        justify-content: space-between;
        .el-card {
            width: 48%;
        }
    }
}
</style>
