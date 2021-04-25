import { Route } from '@ant-design/pro-layout/es/typings';

const isDev = process.env.NODE_ENV === 'development';
let noAuth :Route[] = [
  {
    path: '/users',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: '登录',
        path: '/users/login',
        component: './Login',
      },
    ],
  },
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: '注册成功',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: '注册',
        path: '/user/register',
        component: './user/register',
      },
      {
        name: '修改密码成功',
        path: '/user/forget-result',
        component: './user/Forget-result',
      },
      {
        name: '忘记密码',
        path: '/user/forget',
        component: './user/Forget',
      },
      {
        component: './404',
      },
    ],
  },
];

if(isDev){
  noAuth.push({
    path: '/demo',
    routes: [

    ]
  })
}

export default noAuth;
