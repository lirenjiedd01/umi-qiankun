/* eslint-disable import/no-unresolved */
import { Route } from "@ant-design/pro-layout/es/typings";
import noAuth from "./noAuth";
import membersRoute from "./members";
import applicationRoute from "./application";
import basesRoute from "./bases";
import motRoute from "./mot";
import decisionRoute from "./decision";


/**
 * NOTE: umi 的路由基于 react-router 实现，配置和 react-router@4 基本一致
 */


const routes: Route[] = [
  // 无需校验权限页面
  ...noAuth,
  // 权鉴页面
  {
    path: "/",
    component: "../layouts/SecurityLayout",
    routes: [
      {
        path: '/selectSpace',
        component: './LoginSpace',
      },
      {
        path: "/",
        component: "../layouts/NestLayout",
        routes: [
          { path: "/", redirect: "/home" },
          {
            path: "/home",
            component: "./Home"
          },
          membersRoute,
          motRoute,
          applicationRoute,
          decisionRoute,
          basesRoute,
          { component: "./404" }
        ]
      },
      { component: "./404" }
    ]
  },
  { component: "./404" }
];
export default routes;
