import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'

const NETWORK_ERROR = '网络请求异常，请稍后重试...'

const service = axios.create({
	baseURL: config.baseApi
})

// 发送请求之前
service.interceptors.request.use((req) => {
	// 请求之前自定义 header 或者 jwt 等操作
	return req
})

service.interceptors.response.use((res) => {
	const { code, data, msg } = res.data
	if (code === 200) {
		return data
	} else {
		ElMessage.error(msg || NETWORK_ERROR)
		return Promise.reject(NETWORK_ERROR)
	}
})


// 封装核心函数
function request(options) {
	options.method = options.method || 'get'

	if (options.method.toLowerCase() === "get") {
		options.params = options.data
	}

	let isMock = config.mock
	if (typeof options.mock !== 'undefined') {
		isMock = options.mock
	}

	// 对线上环境做处理
	if (config.env === 'prod') {
		// 直接在 service 中全局修改 base url
		service.defaults.baseURL = config.baseApi
	} else {
		service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
	}

	console.log(options, 'options')

	return service(options)
}

export default request