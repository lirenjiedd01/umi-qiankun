import request from '@/utils/request';
// import { underlize } from '@/utils/utils';

export async function getAuthorities(params: any) {
  // 如不使用本地文件可以把这变量设为false
  const isUseLocalData = true

  // 在开发模式下自动使用本地文件
  if (isUseLocalData && process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      // import('./jp').then(res => {
      //   resolve(res.fetchQAuth)
      // })
      import('./response_data').then(res => {
        resolve(res.fetchQAuth)
      })
    })
  }
    // 在生产模式下自动使用调用接口
    return request('/admin/v1/domain/account/authorities', {
      params,
    });

}

export async function getRoleSpaces(params: any) {
  return request('/admin/v1/space/role_spaces', {
    params,
  });
}

export async function spaceSelect(params: any) {
  return request('/admin/v1/space/select', {
    params
  });
}
