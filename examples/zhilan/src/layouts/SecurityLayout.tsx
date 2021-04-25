import React from 'react';
import { Redirect } from 'umi';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import scrmStore from '@/utils/store';
import iconUrl from '../../public/favicon.png';

const SecurityLayout: React.FC<any> = props => {
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link') as any;
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = iconUrl;
  document.getElementsByTagName('head')[0].appendChild(link);

  const { children, global, location } = props;
  const selectedSpace = scrmStore.get('SPACE');

  /* 因为空间列表里的空间可以绑定和解绑，所以刷新页面会重新请求一次列表，如果将列表存到cookie或者local里，
  因为是异步操作，会导致这里偶尔拿到的列表不是最新的， 因而存到全局的redux里 */

  /* 当前账号是否选择了空间，false则跳转/selectSpace，true则正常显示 */
  let isInSpaces = true;

  // 如果选择了空间，但最新的空间列表里不存在（后台解绑操作），跳转/selectSpace
  if (selectedSpace && global.rowSpaces && global.rowSpaces.length) {
    isInSpaces =  global.rowSpaces.map(item => item.id).includes(selectedSpace.id);
  }
  // 如果没有选择空间，空间列表不为空（后台绑定操作），跳转/selectSpace
  if (!selectedSpace && global.rowSpaces && global.rowSpaces.length) {
    isInSpaces =  false;
  }

  let isLogin = false;
  if (Cookies.get('currentAuthority') && JSON.parse(Cookies.get('currentAuthority') || '{}').access_token) {
    isLogin = true;
  }

  if (!isLogin) {
    return <Redirect to={`/users/login`}></Redirect>;
  }

  // 已登录状态，是否选择了空间
  if (isLogin && !isInSpaces && location.pathname !== '/selectSpace') {
    return <Redirect to={`/selectSpace`}></Redirect>;
  }

  return children;
};
export default connect((state) => {
   return {
     global: state.global
   };
})(SecurityLayout);
