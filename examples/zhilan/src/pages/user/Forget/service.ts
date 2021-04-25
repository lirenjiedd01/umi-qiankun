import request from '@/utils/request';

export async function fakeForget(params: any) {
  return request('/admin/v1/account', {
    method: 'PUT',
    data: params,
  });
}

export async function getCaptcha(params) {
  return request('/admin/v1/account/mobile_number', {
    params,
  });
}
