import { ConnectProps } from '@/typings/connect';
import { getTitle } from '@/utils/utils';
import logo from '../assets/logo-no.svg';
import logoJP from '../assets/logo-no-jp.svg';
import styles from './UserLayout.less';
import { getMenuData, MenuDataItem } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React, { useEffect } from 'react';
import { connect } from 'dva';
//import SelectLang from './NestLayout/RightContent/SelectLang';
import cls from 'classnames';
import iconUrl from '../../public/favicon.png';
import { getLocale,setLocale} from 'umi-plugin-react/locale';
import { getLangs } from '@/services/login';
import { message } from 'antd';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}
const UserLayout: React.FC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;

  const languageLabels = {
    'zh-CN': '简体中文',
    'ja-JP':'日本語'
  };

  useEffect(() => {
    getLang();
  }, []);
  const getLang = async () => {
    const res = await getLangs();
    if (res && res.status === 1) {
      // setLocale(res.data);
      setLocale('zh-CN')
    } else {
      res && res.error && res.error.message && message.error(res.error.message);
    }
  }

  const { breadcrumb } = getMenuData(routes);
  const title = getTitle(breadcrumb, location.pathname);

  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = iconUrl;
  document.getElementsByTagName('head')[0].appendChild(link);

  const curLang = () => {
    return getLocale();
  }

  const jpLang = ()=>{
    return getLocale() === "ja-JP";
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className={styles.contains}>
        <div className={cls(styles.content, {[styles.userLoginBox]: location.pathname === '/users/login'})}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={ jpLang() ? logoJP : logo} />
              </Link>
              {/* <SelectLang /> */}
              {languageLabels[curLang()]}
            </div>
          </div>
          <div className={styles.mainCont}>
            <div className={`${styles.tipContainer} ${ jpLang() ? styles.tipContainerBg:""}`}>
            </div>
            <div className={cls(styles.conBox)}>
              <div className={styles.userBox}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect()(UserLayout);
