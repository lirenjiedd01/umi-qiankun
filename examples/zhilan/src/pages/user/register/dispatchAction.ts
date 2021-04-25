import { dispatchWrap } from '@/utils/dispatchUtil';
import { ConnectState } from '@/typings/connect';
import { RegisterStateType, RegisterModelType } from './model';

export interface RegisterPageModelState extends RegisterStateType {
  submitting: any;
}

// NOTE: 这里暂时填写 any; 之后会完善这里的类型定义
export function mapStateToProps(state: ConnectState<RegisterStateType>): RegisterPageModelState {
  return {
    ...state.userAndregister,
    submitting: state.loading.effects['login/login']
  };
}

type KeyMap = keyof RegisterModelType['effects'] | keyof RegisterModelType['reducers'];

export interface LoginPayloadForDispatch {
  autoLogin: boolean;
  type: string;
  // NOTE: 应该是 枚举
  password?: string;
  account_name?: string;
  mobile_number?: number;
  verification_code?: number;
}

export interface GetCaptchasPayload {
  mobile_number: number;
  usage_type: string;
  country_code: string | number;
}

interface DispatchHandlerPayload {
  login: LoginPayloadForDispatch;
  getCaptchas: GetCaptchasPayload;
  checkMobiles: {
    mobile_number: number;
  };
  checkAccounts: {
    account_name: string;
  };
  submit: { [key: string]: any };
}

interface DispatchHandlerResult { }

export type RegisterPageDispatchProps = DispatchProps<KeyMap, DispatchHandlerPayload, DispatchHandlerResult>;

export function mapDispatchToProps(dispatch: Function): Partial<RegisterPageDispatchProps> {
  return {
    getCaptchas: (args) => {
      return dispatchWrap(dispatch, 'userAndregister/getCaptchas', args);
    },
    checkMobiles: (args) => {
      return dispatchWrap(dispatch, 'userAndregister/checkMobiles', args);
    },
    checkAccounts: (args) => {
      return dispatchWrap(dispatch, 'userAndregister/checkAccounts', args);
    },
    submit: (args) => {
      return dispatchWrap(dispatch, 'userAndregister/submit', args);
    },
  };
}
