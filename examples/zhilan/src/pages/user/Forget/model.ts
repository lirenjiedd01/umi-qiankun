import { fakeForget, getCaptcha } from './service';
import { Effect } from 'dva';
import { Reducer } from 'redux';

export interface ForgetStateType {
  status: 'ok' | 'error';
}

export interface ForgetModelType {
  namespace: string;
  state: ForgetStateType;
  effects: {
    submit: Effect;
    getCaptchas: Effect;
  };
  reducers: {
    forgetHandle: Reducer<ForgetStateType>;
  };
}


const ForgetModel = {
  namespace: 'forget',
  state: {
    status: 'ok',
  },

  effects: {
    *submit({ payload, callback }, { call, put }) {
      let copyData = Object.assign({}, payload)
      delete copyData.confirm

      const response = yield call(fakeForget, copyData);
      yield put({
        type: 'forgetHandle',
        payload: response,
      });
      if (callback) callback(response)
      return response
    },

    *getCaptchas({ payload, callback }, { call }) {
      const response = yield call(getCaptcha, payload);
      if (callback) callback(response)
      return response
    },
  },

  reducers: {
    forgetHandle(state, { payload }) {
      return { ...state, status: payload.status };
    },
  },
};

export default ForgetModel;
