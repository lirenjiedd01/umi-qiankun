import { IConfig } from 'umi-types';
import baseConfig from './config.base';
import webpackConfig from './config.webpack';
import routes from './routes';
import proSettings from './defaultSettings';

// ref: https://umijs.org/config/

const config: IConfig = {
  ...baseConfig,
  // 比如 ant-design-pro 开启 tree-shaking 之后，gzip 后的尺寸能减少 10K
  treeShaking: true,
  hash: true, // 解决umi框架打包不及时更新问题
  routes,
  theme: proSettings,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    // 这插件可以理解为对webpack的快捷批量配置
    ['../../index.js', {
      keepOriginalRoutes: true
    }],
    [
      'umi-plugin-react',
      {
        title: 'backstage',
        antd: true, // 启用后自动配置 babel-plugin-import 实现 antd, antd-mobile 和 antd-pro 的按需编译，并且内置 antd, antd-mobile 依赖，无需手动在项目中安装。
        dva: {
          immer: true,
          hmr: true,
        },
        dynamicImport: { webpackChunkName: true }, // 路由是否启用按需加载
        // dll: {
        //   exclude: ['af-webpack'],
        // },
        locale: {
          default: process.env.DEFAULT_LANG,
          // default true, when it is true, will use `navigator.language` overwrite default
          antd: true,
          baseNavigator: true,
        },
        routes: {
          exclude: [/models\//, /services\//, /model\.(t|j)sx?$/, /service\.(t|j)sx?$/, /components\//],
        },
      },
    ],
  ],
  ...webpackConfig,
};

export default config;
