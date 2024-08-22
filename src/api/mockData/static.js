/**
 * 此代码为折线图中找不到数据自己随机生成的，并不是项目原本代码
 */

import Mock from 'mockjs'

function getStatisticalData() {
	let List = []
	//Mock.Random.float 产生随机数100到8000之间 保留小数 最小0位 最大0位
	for (let i = 0; i < 7; i++) {
		List.push(
			Mock.mock({
				苹果: Mock.Random.float(100, 8000, 0, 0),
				vivo: Mock.Random.float(100, 8000, 0, 0),
				oppo: Mock.Random.float(100, 8000, 0, 0),
				魅族: Mock.Random.float(100, 8000, 0, 0),
				三星: Mock.Random.float(100, 8000, 0, 0),
				小米: Mock.Random.float(100, 8000, 0, 0)
			})
		)
	}

	return List
}

export default getStatisticalData
