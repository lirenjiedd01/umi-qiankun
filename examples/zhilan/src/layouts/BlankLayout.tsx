import React from 'react';
import { getAuthorityFromRouter } from '@/utils/utils';
import { useLocation, useSelector } from 'dva';
import { DefaultRootState } from '@/typings/connect';
import { GlobalModelState } from '@/models/globalModel';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Exception/NoMatch';
import NotFound from '@/components/Exception/NotFound';

const Layout: React.FC<any> = props => {
  const { route, children, neesAuth = false } = props;
  const { routes } = route;
  const location = useLocation();

  const global = useSelector<DefaultRootState, GlobalModelState>(state => state.global);
  const authoritys = getAuthorityFromRouter(global.rawRoutesList, routes, location.pathname);

  if (neesAuth) {
    return (
      <Authorized authority={authoritys} noMatch={<NoMatch />} notFound={<NotFound />}>
        {children}
      </Authorized>
    );
  } else {
    return <div>{children}</div>;
  }
};

export default Layout;
