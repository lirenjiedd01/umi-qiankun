import { MenuTheme } from 'antd/es/menu/MenuContext';

export type ContentWidth = 'Fluid' | 'Fixed';

export type LANG = "zh-CN" | "zh-TW" | "en-US" | "it-IT" | undefined

export interface DefaultSettings {
  /**
   * theme for nav menu
   */
  navTheme: MenuTheme;
  /**
   * primary color of ant design
   */
  primaryColor: string;
  /**
   * nav menu position: `sidemenu` or `topmenu`
   */
  layout: 'sidemenu' | 'topmenu';
  /**
   * layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
   */
  contentWidth: ContentWidth;
  /**
   * sticky header
   */
  fixedHeader: boolean;
  fontFamily: string;
  /**
   * auto hide header
   */
  autoHideHeader: boolean;
  /**
   * sticky siderbar
   */
  fixSiderbar: boolean;
  menu: { locale: boolean };
  title: string;
  pwa: boolean;
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: string;
  colorWeak: boolean;
  lang: LANG
}

const defalutP: DefaultSettings = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#5AA6FF',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fontFamily: '',
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: '后台demo',
  pwa: false,
  iconfontUrl: '',
  lang: (process.env.DEPLOY_LANG as LANG) || 'zh-CN'
};
export default defalutP;
