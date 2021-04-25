import { DefaultRootState } from '@/typings/connect';
import { dispatchWrap } from '@/utils/dispatchUtil';
import { RouteComponentProps } from 'dva/router';
import { SSOModelState } from './model';
import { LoginResDTO } from './service';
import {ISpaceItem} from "@/models/globalModel";

export type SelectNamespace = 'loading' | 'user' | 'global';
export type StateMap = Pick<DefaultRootState, SelectNamespace>;

export type DynamicModelStateType = {
  sso: SSOModelState;
};

export interface IDynamicConnectStateType extends MapStateToSSOProps, DynamicModelStateType {}

export type MapStateToSSOProps<T extends keyof DefaultRootState = SelectNamespace> = {
  [key in T]: DefaultRootState[key];
} &
  DynamicModelStateType;

export interface MapDispatchToSSOProps {
  save: (args: any) => Promise<void>;
  login: (loginParam: { token: string; appId: string | number }) => Promise<ResponseDTO<LoginResDTO>>;
  saveInfo: (info: LoginResDTO) => Promise<void>;
  selectSpace: (spaceDTO: ISpaceItem) => Promise<void>;
}

export interface ISSOState {
  errorMsg: string;
}
export interface ISSOParams {
  token?: string;
  backUrl?: string;
}
export interface ISSOProps extends MapStateToSSOProps, MapDispatchToSSOProps, RouteComponentProps<any> {}

export function mapStateToSSO({ loading, sso, user, global }: IDynamicConnectStateType): MapStateToSSOProps {
  return {
    loading,
    sso,
    user,
    global,
  };
}

export function mapDispatchToSSO(dispatch: Function): MapDispatchToSSOProps {
  return {
    save: async args => {
      return await dispatchWrap(dispatch, 'sso/save', args);
    },
    login: async loginParam => {
      return await dispatchWrap(dispatch, 'sso/login', loginParam);
    },
    saveInfo: async loginResDTO => {
      return await dispatchWrap(dispatch, 'user/saveInfo', loginResDTO);
    },
    selectSpace: async spaceDTO => {
      return await dispatchWrap(dispatch, 'global/saveSelectedSpace', spaceDTO);
    }
  };
}
