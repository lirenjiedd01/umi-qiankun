// 该文件
import { IConfig } from 'umi-types';

export default {
  // 代理设置
  proxy: {
    '/admin': {
      target: 'https://gateway-test.01member.com', // 测试环境网关地址
      // target: 'https://facade-uat.01member.com', // uat环境网关地址
      // target: '	https://facade.01member.com', // 正式环境网关地址
      changeOrigin: true,
      pathRewrite: { '^/admin/': '/admin/' },
    },
    '/v1': {
      target: 'http://10.11.1.41:8181/', // 龙虎
      // target: 'http://10.11.2.2:8181/', // 卓程
      // target: 'http://10.11.1.172:8181/', // 博文
      changeOrigin: true,
      pathRewrite: { '^/v1': '/v1' },
    },
  },
} as IConfig;
