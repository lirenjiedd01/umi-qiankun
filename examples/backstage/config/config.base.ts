/**
 * 该文件是项目配置，会被config.local.ts 覆盖同类别配置
 */

import { IConfig } from 'umi-types';

const isDev = process.env.NODE_ENV === 'development';
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
// 会被 config.local.ts 覆盖
const baseConfig: IConfig = {
  history: 'browser',
  base: 'backstage',
  publicPath: '/backstage/',
  outputPath: './dist/backstage',
  mountElementId: 'backstage',
  runtimePublicPath: false,
  // mountElementId: 'root',
  minimizer: 'terserjs',
  // scrm 系统可能需要兼容到 ie9
  targets: {
    ie: 9,
  },
  // manifest: {
  //   basePath: "/"
  // },
  hash: !isDev,
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || "" // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  proxy: {
    "/api/": {
      target: "http://adminv2.happymmall.com",
      changeOrigin: true,
      pathRewrite: { "^/api/": "" }
    }
  }, 
};

export default baseConfig;
