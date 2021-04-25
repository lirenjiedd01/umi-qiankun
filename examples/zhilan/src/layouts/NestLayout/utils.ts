import { OriginRoute } from '@/models/globalModel';
import { RealAuthoritRoutes } from './interface.d';
import _forEach from 'lodash/forEach';
import { Route } from '@ant-design/pro-layout/es/typings';
import produce from 'immer';
import { getLocale } from 'umi-plugin-react/locale';
import {cloneDeep} from 'lodash';

/**
 * 处理后端返回单路由列表，过滤掉无权限的路由
 * @param routes
 */
export function getDisponseRoutesByApi(routes) {
  // 添加标签特殊处理
  const routeProducer = produce(draft => {
    let listRouter = [];
    if (draft.path === '/members/tag/add') {
      listRouter = draft;
      if (listRouter.routes.find(item => item.path === '/members/tag/add/page')) {
        let uploadRouter = {
          id: '999',
          path: '/members/tag/add/upload',
          name: '添加标签(外部导入)',
          routes: [],
          is_botton: false
        };
        draft.routes.push(uploadRouter);
      }
    }


    if (draft.routes && draft.routes.length) {
      draft.routes = disposeRouteList(draft.routes);
    }
  });

  function disposeRouteList(routeList) {
    if (!routeList.length) return routeList;
    return produce(routeList, draft => {
      return draft.map(route => routeProducer(route));
    });
  }

  return produce(routes, draft => {
    return draft.map(router => {
      return {
        ...router,
        routes: disposeRouteList(router.routes),
      };
    });
  });
}

/**
 * 结合前端静态路由配置 和 后端路由管理配置 获取当前用户真实可用的 路由 和 按钮权限列表
 * @param routes umi 根据 config/routes 前端静态路由配置 通过脚本生成 umi 框架的 router
 * @param authoritRoutes 后端返回当前用户路由可用配置
 * @see routes 生成规则请查阅 src/pages/.umi/router.js
 */
export function getRealAuthoritRoutes(routes: Route[], authoritRoutes: OriginRoute[]): RealAuthoritRoutes {
  let realRoute: Route[] = [];
  let realBtns: any = [];
  // let resRoute: Route[] = [];
  // resRoute = getDisponseRoutesByApi(authoritRoutes) as any;
  let curLang = (getLocale() ==='ja-JP') ?  'ホームページ':"首页";
  // 首页特殊处理
  _forEach(routes, iroute => {
    if (iroute && iroute.path === '/home') {
      let data = cloneDeep(iroute);
      data.name = curLang;
      realRoute.push(data);
    }
  });

  const mapRoutes = (iroute: Route, authoritRoute: OriginRoute) => {
    let validRoute: any = { ...authoritRoute, routes: [] };
    if(iroute.icon){
      validRoute.icon = iroute.icon
    }
    if(iroute.hideChildrenInMenu){
      validRoute.hideChildrenInMenu = true
    }
    if (iroute.routes && iroute.routes.length && authoritRoute.routes && authoritRoute.routes.length) {
      _forEach(iroute.routes, ir => {
        _forEach(authoritRoute.routes, ar => {
          if (ir.path === ar.path) {
            validRoute.routes.push(mapRoutes(ir, ar));
            if (ar.path?.split('/').length === 5 && Array.isArray(ar.routes)) {
              const { path, routes, name } = ar;
              if (ar.routes.length) {
                realBtns.push({ path, btnsList: routes, name });
              } else {
                realBtns.push({ path, btnsList: [], name });
              }
            }
          }
        });
      });
    }

    return validRoute;
  };

  if (routes && routes.length && authoritRoutes && authoritRoutes.length) {
    authoritRoutes.forEach(item => {
      routes.forEach(iroute => {
        // 如果前端定义和api返回定义的路径相同
        if (iroute.path && iroute.path === item.path) {
          let route: Route = mapRoutes(iroute, item);
          realRoute.push(route);
        }
      });
    });
  }

  return {
    routesList: realRoute,
    btnsList: realBtns,
    rawRoutesList: authoritRoutes,
  };
}
