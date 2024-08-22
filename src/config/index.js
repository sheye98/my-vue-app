/**
 * 环境配置文件
 */
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
	development: {
		baseApi: '/api',
		mockApi: 'https://apifoxmock.com/m1/5014409-4673956-default/api'
	},
	test: {
		baseApi: '/api',
		mockApi: "https://apifoxmock.com/m1/5014409-4673956-default/api"
	},
	pro: {
		baseApi: "/api",
		mockApi: "https://apifoxmock.com/m1/5014409-4673956-default/api"
	}
}

export default {
	env,
	mock: true,
	...EnvConfig[env]
}