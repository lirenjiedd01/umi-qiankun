import 'reflect-metadata';
import { IconLoadingComponent } from '@/components/IconFont';
import { Spin } from 'antd';
import excharts from "echarts";
import echartTheme from "./utils/echartTheme.json";

/**
 * echart图表默认主题样式,
 * @param 1:  自定义的主题名称，
 * @param 2:  主题配置的json文件， =======>  可找ui提供
 */
excharts.registerTheme("echartTheme",echartTheme);

Spin.setDefaultIndicator(IconLoadingComponent);

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
