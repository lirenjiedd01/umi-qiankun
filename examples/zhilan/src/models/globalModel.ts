import { getAuthorities, getRoleSpaces, spaceSelect} from '../services/global';
import { Subscription, Effect } from 'dva';
import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { message } from 'antd';
import { Route } from '@ant-design/pro-layout/es/typings';
import scrmStore from '@/utils/store';
import Cookies from 'js-cookie';

export interface OriginRoute {
  id: string;
  name: string;
  path?: string; // button 类没有 path
  code?: string; // 路由类 没有 code
  is_botton: boolean;
  nick_name: string;
  parent_id: string;
  routes: OriginRoute[];
}

export interface ISpaceItem {
  id: number;
  name: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  pathname: string;
  query: { [key: string]: any };
  list: OriginRoute[];
  routesList: Route[];
  btnsList: OriginRoute[];
  rawRoutesList: Route[];
  roleSpaces: ISpaceItem[] | null;
  selectedSpace: ISpaceItem;
  rowSpaces: ISpaceItem[] | null;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchAuth: Effect;
    storeAllRoutesAndBtns: Effect;
    clearAuthorities: Effect;
    fetchRoleSpaces: Effect;
    selectSpaceInto: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveRoute: Reducer<GlobalModelState>;
    authList: Reducer<GlobalModelState>;
    clearData: Reducer<GlobalModelState>;
    storeRoutesAndBtns: Reducer<GlobalModelState>;
    saveRoleSpaces: Reducer<GlobalModelState>;
    saveSelectedSpace: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    pathname: '/',
    query: {},
    list: [], // 后端返回路由列表的原始数据
    routesList: [], // 左侧路由菜单
    btnsList: [], // 可用按钮权限列表
    rawRoutesList: [], // 后端返回的路由（过滤了没权限的）
    roleSpaces: null,  // 用于轮播的空间列表
    selectedSpace: scrmStore.get('SPACE') || {id: 0, name: ''}, // 当前选中的空间
    rowSpaces: null   // 原始的空间列表
  },

  effects: {
    // 获取后端返回符合角色的所有路由
    *fetchAuth({ payload, callback }, { call, put }) {
      const response = yield call(getAuthorities, payload);
      // 存储原始数据
      yield put({
        type: 'authList',
        payload: response && response.data && Array.isArray(response.data) ? response.data : [],
      });
      if (callback) callback(response);
      return response;
    },
    // 获取当前用户角色所拥有的空间权限集合
    *fetchRoleSpaces({ payload, callback, isReload}, { call, put, select }) {
        const globalState = yield select(state => state.global);
        const { pathname, search } = window.location;
        const currentPathName = pathname + search;
        // 缓存空间列表，防止重复请求
        if (!globalState.roleSpaces || isReload) {
            const response = yield call(getRoleSpaces, {space_name: payload.space_name});
            const list = response && response.data && Array.isArray(response.data) ? response.data : [];
            const roleSpaces: ISpaceItem[] = [];
            for (let i= 0; i < Math.ceil(list.length / 10 ); i ++ ) {
              roleSpaces.push(list.slice(i * 10, i * 10 + 10 ));
            }
            // 存储空间列表
            yield put({
              type: 'saveRoleSpaces',
              payload: {roleSpaces, rowSpaces: payload.space_name ? globalState.rowSpaces : list},
            });

            // 单空间，默认选中，并判断是否跳转首页
            if (list.length === 1 && !payload.space_name) {
              yield put({
                type: 'selectSpaceInto',
                payload: list[0],
              });
            }

            // 没有空间，不允许进入
            // if (!list.length && !payload.space_name)  {
            //   if (pathname !== '/selectSpace') {
            //     yield put(routerRedux.replace(currentPathName));
            //   } else{
            //     yield put(routerRedux.replace('/'));
            //   }
            // }
            if (callback) callback(response);
            return response;
        }
    },
    // 选择空间进入
    *selectSpaceInto({ payload, callback, isGoHome }, { call, put, select }) {
      const response = yield call(spaceSelect, {space_id: payload.id});
      const { pathname, search } = window.location;
      const currentPathName = pathname + search;
      if(response && response.status && response.status ===1){

        // 存储选中的空间
        scrmStore.set('SPACE', payload);
        yield put({
          type: 'saveSelectedSpace',
          payload,
        });

        // 是否跳转首页
        if (pathname !== '/selectSpace' && !isGoHome) {
          yield put(routerRedux.replace(currentPathName));
        } else{
          yield put(routerRedux.replace('/'));
        }

        if (callback) callback(response);
        return response;
      }else{
        response.error && response.error.message && message.error(response.error.message);
      }
    },
    // 保存当前可显示的左侧菜单和可用按钮权限
    *storeAllRoutesAndBtns({ payload }, { put }) {
      yield put({
        type: 'storeRoutesAndBtns',
        payload,
      });
    },
    *clearAuthorities(_, { put }) {
      let response = [];
      yield put({
        type: 'clearData',
        payload: response,
      });
    },
  },

  reducers: {
    saveRoleSpaces(state, { payload }): GlobalModelState{
      return {
        ...state!,
        roleSpaces: payload.roleSpaces,
        rowSpaces: payload.rowSpaces
      };
    },
    saveSelectedSpace(state, { payload }): GlobalModelState{
      return {
        ...state!,
        selectedSpace: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }): GlobalModelState {
      return {
        ...state!,
        collapsed: payload,
      };
    },
    saveRoute(state, { payload }): GlobalModelState {
      return {
        ...state,
        ...payload,
      };
    },
    authList(state, action): GlobalModelState {
      return { ...(state as GlobalModelState), list: action.payload };
    },
    clearData(state, action) {
      return {
        ...(state as GlobalModelState),
        list: action.payload,
        routesList: [],
        btnsList: [],
      };
    },
    storeRoutesAndBtns(state, action) {
      const { routesList, btnsList, rawRoutesList } = action.payload;
      return {
        ...(state as GlobalModelState),
        routesList,
        btnsList,
        rawRoutesList,
      };
    },
  },

  subscriptions: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setup({ history, dispatch }) {
      return history.listen(({pathname}) => { // 需要判断Cookies是否有值，因为request取的是Cookies里的数据
        const access_token = Cookies.get('currentAuthority') && JSON.parse(Cookies.get('currentAuthority') || '{}').access_token;
        const isPullSpaces = (access_token && pathname !== '/sso') || pathname === '/selectSpace';
        if (isPullSpaces) {
          dispatch({
            type: 'fetchRoleSpaces',
            payload: {space_name: ''},
            isReload: pathname === '/selectSpace'
          });
        }
      });
    },
  },
};

export default GlobalModel;
