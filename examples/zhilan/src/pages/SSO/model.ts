import { Effect } from 'dva';
import { Reducer } from 'redux';
import { ssoLogin } from './service';

export interface SSOModelState {
  token: string | null;
  backUrl: string | null;
}
export interface SSOModelType {
  namespace: 'sso';
  state: SSOModelState;
  effects: {
    login: Effect;
  };
  reducers: {
    save: Reducer<SSOModelState>;
  };
}

const Model: SSOModelType = {
  namespace: 'sso',
  state: {
    token: null,
    backUrl: null,
  },
  effects: {
    *login({ payload }, { call }) {
      const response = yield call(ssoLogin, payload);
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      } as SSOModelState;
    },
  },
};
export default Model;
