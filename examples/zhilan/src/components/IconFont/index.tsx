import LoadingGif from '@/assets/loading.gif';
import React, { FC } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { formatMessage } from 'umi-plugin-react/locale';

const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/font_1520299_yg5nyjly0d8.js', '//at.alicdn.com/t/font_1963300_tb52r21dlkj.js'],
});

interface IProps {
  imgStyle?: any;
  wrapperStyle?: any;
  textStyle?: any;
}

export const IconLoading: FC<IProps> = ({ imgStyle, wrapperStyle, textStyle }) => (
  <div style={{ width: 160, ...wrapperStyle, margin: '0 auto' }}>
    <img src={LoadingGif} style={{ width: 80, height: 80, ...imgStyle }} alt="" />
    <p style={{ fontSize: 14, marginTop: -20, ...textStyle }}>
      {/* 加载中 */}
      {
        formatMessage({
          id: "iconLoading"
        })
      }
    </p>
  </div>
);

export const IconLoadingComponent = <IconLoading />;

export default IconFont;
