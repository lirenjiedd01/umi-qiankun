import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { AnyAction } from 'redux';
import { GlobalModelState } from '@/models/globalModel';
import { LoginStateType } from '@/models/login';
import { ApplicationsModelState } from '@/models/applications';
import { HomeStateType } from '@/pages/Home/model';
import { EffectsCommandMap } from 'dva';
import { UserModelState } from '@/models/user';

type Effect<T> = (action: AnyAction, effects: EffectsCommandMap) => Promise<T>;

interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    login?: boolean;
  };
}

interface Route extends MenuDataItem {
  routes?: Route[];
}

// NOTE: 迁移到 global.d.ts 中;
// 因为改文件定义中存在模块的 import 导致该文件中的定义需要 import 之后才能使用;
// 使其全局的定义失效

interface ConnectState<T> extends DefaultRootState {
  user: UserModelState;
  home: HomeStateType;
  [key: string]: T;
}

// 初始化 model 生成的全局 store
interface DefaultRootState {
  global: GlobalModelState;
  applications: ApplicationsModelState;
  login: LoginStateType;
  user: UserModelState;
  loading: Loading; // dva-loading
}

interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}

interface IConnectProps<P = {}> extends Partial<RouterTypes<Route, P>> {
  dispatch: Dispatch;
}

interface ComponentCommonProps<Q extends { [key: string]: string } = {}> {
  location: {
    hash: string;
    pathname: string;
    query: Q;
    search: string;
  };
  history: History;
  route: Route;
}

interface IConnectState<P = {}> extends ConnectProps<P>, DefaultRootState {}

interface IRoutePageProps<P = {}> extends ConnectProps<P>, DefaultRootState, ComponentCommonProps{
  contentHeight: number;
  tableY: number
}
