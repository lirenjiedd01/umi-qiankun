import request from '@/utils/request';
import { LoginPayload } from '@/pages/Login/dispatchAction';
import { underlize } from '@/utils/utils';

export async function accountLogin(params: LoginPayload) {
  return request('/admin/v1/account/login', {
    method: 'POST',
    data: underlize(params),
  });
}

export async function getCaptcha(params: any) {
  return request('/admin/v1/account/mobile_number', {
    params: underlize(params) || {},
  });
}

export async function accountLogout(params: any) {
  return request('/admin/v1/domain/account/logout', {
    method: 'POST',
    data: underlize(params),
  });
}

export async function getLangs() {
  return request('/admin/v1/i18n_code');
}
