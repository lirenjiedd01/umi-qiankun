import { LoginModelType, LoginStateType } from '@/models/login';
import { dispatchWrap } from '@/utils/dispatchUtil';
import { ConnectState } from '@/typings/connect';

export interface LoginPageModelState extends LoginStateType {
  submitting: any;
}

// NOTE: 这里暂时填写 any; 之后会完善这里的类型定义
export function mapStateToProps(state: ConnectState<LoginStateType>): LoginPageModelState {
  return {
    ...state.login,
    submitting: state.loading.effects['login/login'],
  };
}

type KeyMap = keyof LoginModelType['effects'] | keyof LoginModelType['reducers'];

export interface LoginPayload {
  autoLogin: boolean;
  type: string;
  // NOTE: 应该是 枚举
  password?: string;
  account_name?: string;
  mobile_number?: number;
  verification_code?: number;
}

export interface GetCaptchasPayload {
  mobile_number: string;
  usage_type: string;
  country_code: string | number;
}

interface DispatchHandlerPayload {
  login: LoginPayload;
  getCaptchas: GetCaptchasPayload;
}

interface DispatchHandlerResult {}

export type LoginPageDispatchProps = DispatchProps<KeyMap, DispatchHandlerPayload, DispatchHandlerResult>;

export function mapDispatchToProps(dispatch: Function): Partial<LoginPageDispatchProps> {
  return {
    login: args => {
      return dispatchWrap(dispatch, 'login/login', args);
    },
    getCaptchas: args => {
      return dispatchWrap(dispatch, 'login/getCaptchas', args);
    },
    logout: () => {
      return dispatchWrap(dispatch, 'login/logout', {});
    },
  };
}
