import { dispatchWrap } from '@/utils/dispatchUtil';
import { ForgetModelType, ForgetStateType } from './model';
import { ConnectState } from '@/typings/connect';

export interface ForgetPageModelState extends ForgetStateType {
  submitting: any
}


export function mapStateToProps(state: ConnectState<ForgetStateType>): ForgetPageModelState {
  return {
    ...state.forget,
    submitting: state.loading.effects['forget/submit'],
  }
}

type KeyMap = keyof ForgetModelType['effects'] | keyof ForgetModelType['reducers'];

export interface GetCaptchasPayload {
  mobile_number: number;
  usage_type: string;
  country_code: number | string;
}

export interface SubmitPayload {
  mobile_number: string;
  password: string;
  verification_code: string;
  confirm: string;
  prefix: string
}

interface DispatchHandlerPayload {
  getCaptchas: GetCaptchasPayload;
  submit: SubmitPayload
}

interface DispatchHandlerResult { }

export type ForgetPageDispatchProps = DispatchProps<KeyMap, DispatchHandlerPayload, DispatchHandlerResult>;

export function mapDispatchToProps(dispatch: Function): Partial<ForgetPageDispatchProps> {
  return {
    submit: (args) => {
      return dispatchWrap(dispatch, 'forget/submit', args);
    },
    getCaptchas: (args) => {
      return dispatchWrap(dispatch, 'forget/getCaptchas', args);
    },
  };
}
