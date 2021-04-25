import request from '@/utils/request';

export async function fakeRegister(params) {
  return request('/admin/v1/account/registry', {
    method: 'POST',
    data: params,
  });
}

export async function checkAccount(params) {
  return request('/admin/v1/account/account_name/verification', {
    params,
  });
}

export async function getCaptcha(params) {
  return request('/admin/v1/account/mobile_number', {
    params,
  });
}

export async function checkMobile(params) {
  return request('/admin/v1/account/mobile_number/verification', {
    params,
  });
}

