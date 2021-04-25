import { IConfig, IWebpackChainConfig } from 'umi-types';
import { WatchIgnorePlugin } from 'webpack'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const isProd = process.env.NODE_ENV === 'production';

// https://umijs.org/zh-CN/docs/assets-css
// Umi 会自动识别 CSS Modules 的使用
// // CSS Modules
// import styles from './foo.css';
// // 非 CSS Modules
// import './foo.css';
// Umi 内置支持 less

const cssModuleRegex = /\.module\.css$/;

const lessModuleRegex = /\.module\.less$/;
// NOTE: 这里是针对 webpack 做一些配置上的修改
const webpackConfig: IConfig = {
  urlLoaderExcludes: [lessModuleRegex],
  // 中文文档：https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans
  chainWebpack: (config: IWebpackChainConfig) => {
    // 产生错误是否中断编译
    // eslint-disable-next-line no-param-reassign
    config = config.bail(isProd);
    const lessRule = config.module.rule('less');
    lessRule.exclude.add(lessModuleRegex);

    const cssRule = config.module.rule('css');
    cssRule.exclude.add(cssModuleRegex);

    const baseLoaderName = ['extract-css-loader', 'css-loader', 'postcss-loader', 'less-loader'];
    // 遍历baseLoaderName所有项，逐一添加到less，输出每项的[loaderName, loaderName, options]
    const loaderEntries = baseLoaderName.map(loader => {
      // 为less添加use，并获取options
      let options = lessRule.use(loader).get('options');
      if (loader === 'css-loader') {
        options = {
          ...options,
          camelCase: 'only',
        };
      }
      return [loader, lessRule.use(loader).get('loader'), options];
    });

    loaderEntries.unshift([
      'dts-css-modules-loader',
      'dts-css-modules-loader',
      {
        namedExport: true,
        banner: '// This file is generated automatically by dts-css-modules-loader',
      },
    ]);
    const newCssRule = config.module.rule('module-css').test(cssModuleRegex);
    // .exclude.add(cssRegex).end();

    const newLessRule = config.module.rule('module-less').test(lessModuleRegex);
    // .exclude.add(lessRegex).end();

    // 为新的module-less添加以上所有loader，和lessRule的区别是针对不同的文件名
    loaderEntries.forEach(([loader, loaderAbsolutePath, options]) => {
      newCssRule
        .use(loader)
        .loader(loaderAbsolutePath)
        .options(options);
      newLessRule
        .use(loader)
        .loader(loaderAbsolutePath)
        .options(options);
    });

    config.plugin('watch-ignore').use(WatchIgnorePlugin, [[/less\.d\.ts$/]]);

    // DEBUG:
    // const rule = config.toConfig().plugins;
    // if (rule) {
    //   for (const item of rule) {
    //     console.log(item);
    //   }
    // }

    config.plugin('case-sensitive-paths-webpack-plugin').use(CaseSensitivePathsPlugin)
  },
  define: {
    DEFAULT_PAGE_SIZE: 20,
    NODE_ENV: process.env.NODE_ENV,
    API_ENV: process.env.API_ENV || 'production',
    'process.env.API_ENV': process.env.API_ENV || 'production',
    'process.env.ENV_FLAG': process.env.ENV_FLAG || '',
    DEBUG: JSON.parse(process.env.DEBUG || 'false'),
    DEPLOY_LANG: process.env.DEPLOY_LANG || 'zh_CN',
    LOCAL_MENU: JSON.parse(process.env.LOCAL_MENU || 'false')
  },
};

export default webpackConfig;
