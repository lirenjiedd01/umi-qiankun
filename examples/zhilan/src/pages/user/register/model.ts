import Cookies from "js-cookie";
import { Effect } from "dva";
import { Reducer } from "redux";
import { fakeRegister, checkAccount, getCaptcha, checkMobile } from "./service";

export interface RegisterStateType {
  status: object;
}

export interface RegisterModelType {
  namespace: string;
  state: RegisterStateType;
  effects: {
    submit: Effect;
    getCaptchas: Effect;
    checkAccounts: Effect;
    checkMobiles: Effect;
  };
  reducers: {
    registerHandle: Reducer<RegisterStateType>;
  };
}

const Model: RegisterModelType = {
  namespace: "userAndregister",
  state: {
    status: {}
  },

  effects: {
    *submit({ payload, callback }, { call, put }) {
      let copyData = Object.assign({}, payload);
      delete copyData.confirm;
      const response = yield call(fakeRegister, copyData);

      if (response.status === 1) {
        yield put({
          type: "registerHandle",
          payload: response
        });
      }

      if (callback) callback(response);
      return response;
    },
    *checkAccounts({ payload, callback }, { call }) {
      const response = yield call(checkAccount, payload);
      if (callback) callback(response);
      return response;
    },

    *getCaptchas({ payload, callback }, { call }) {
      const response = yield call(getCaptcha, payload);
      if (callback) callback(response);
      return response;
    },

    *checkMobiles({ payload, callback }, { call }) {
      const response = yield call(checkMobile, payload);
      if (callback) callback(response);
      return response;
    }
  },
  reducers: {
    registerHandle(state, { payload }) {
      Cookies.set("currentAuthority", payload.data);
      return { ...state, status: payload };
    }
  }
};
export default Model;
