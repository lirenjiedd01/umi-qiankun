import LayoutWrapper from './PageHeaderWrapper';
import styles from './index.module.less';
import React from 'react';
import { RouteContext } from '@ant-design/pro-layout';
import { PageHeaderWrapperProps } from '@ant-design/pro-layout/es/PageHeaderWrapper';
import { BreadcrumbProps, Route } from 'antd/es/breadcrumb/Breadcrumb';
import cls from 'classnames';
import Link from 'umi/link';
import { formatMessage } from 'umi-plugin-react/locale';

export interface IPageHeaderWrapperProps extends PageHeaderWrapperProps {
  headerTransparent?: boolean;
  padding?: number;
  bg?: string;
  style?: object;
  isMargin?:boolean;
}

function itemRender(route: Route, params: any, routes: Route[]) {
  let disableTwo = false;
  if (routes.length === 3 && routes[1].breadcrumbName === routes[2].breadcrumbName) {
    disableTwo = true;
  }
  const first = routes.indexOf(route) === 0;
  const last = routes.indexOf(route) === routes.length - 1;

  if (first) {
    return (
      <>
        <span>{formatMessage({ id: 'navbar.currentLocation' })}</span>
        <Link to={route.path} className={styles.breadColor}>{route.breadcrumbName}</Link>
      </>
    );
  }

  return last ? (
    <span className={styles.lastText}>{route.breadcrumbName}</span>
  ) : disableTwo ? null : (
    <Link to={route.path} className={styles.breadColor}>{route.breadcrumbName}</Link>
  );
}

const PageHeaderWrapper: React.FC<IPageHeaderWrapperProps> = props => {
  const { padding = 24, bg = 'white', isMargin=true, headerTransparent = false, className, style, ...rest } = props;
  let stylesCont = {} as any;
  
  if(padding>0){
    stylesCont={
      padding, 
      background: bg,
      boxShadow:'0 2px 8px 0 rgba(133,164,209,.17)'
    } 
  }else{
    stylesCont={
      padding, 
      background: bg
    }
  }
  if(isMargin){
    stylesCont.margin = '0 24px 24px'
  }
  return (
    <RouteContext.Consumer>
      {value => {
        const { routes } = value.breadcrumb as Pick<BreadcrumbProps, 'routes'>;
        return (
          <LayoutWrapper
            title={false}
            breadcrumb={{ routes, itemRender, separator: '/' }}
            className={cls(styles.wrap, className, { [styles.headerTransparent]: headerTransparent })}
            {...rest}
          >
            <div style={{ ...stylesCont, ...style }} className={styles.minHeight}>
              {props.children}
            </div>
          </LayoutWrapper>
        );
      }}
    </RouteContext.Consumer>
  );
};

export default PageHeaderWrapper;
