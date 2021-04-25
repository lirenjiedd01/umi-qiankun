/**
 * 该文件是项目配置，会被config.local.ts 覆盖同类别配置
 */

import { IConfig } from 'umi-types';

const isDev = process.env.NODE_ENV === 'development';

// 会被 config.local.ts 覆盖
const baseConfig: IConfig = {
  history: 'browser',
  base: 'zhilan',
  publicPath: '/zhilan/',
  outputPath: './dist/zhilan',
  mountElementId: 'zhilan',
  runtimePublicPath: false,
  // mountElementId: 'root',
  minimizer: 'terserjs',
  // scrm 系统可能需要兼容到 ie9
  targets: {
    ie: 9,
  },
  hash: !isDev,
  proxy: {
    '/admin/': {
      target: 'https://gateway-test.01member.com', // 测试环境网关地址
      // target: 'https://facade-uat.01member.com', // uat环境网关地址
      // target: '	https://facade.01member.com', // 正式环境网关地址
      changeOrigin: true,
      pathRewrite: { '^/admin/': '/admin/' },
    }
  }, // 默认 proxy
};

export default baseConfig;
