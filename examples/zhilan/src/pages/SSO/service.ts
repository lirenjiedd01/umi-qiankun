import request from '@/utils/request';
import { camelize } from '@/utils/utils';
import {ISpaceItem} from "@/models/globalModel";

export interface LoginResDTO {
  domainId: string;
  accountId: string;
  accountName: string;
  domainName: string;
  accessToken: string;
  portraitUrl: string;
  isvLogo: string;
  selectedSpace: ISpaceItem;
  spaceList: ISpaceItem[];
}

export async function ssoLogin(loginParam: { token: string; appId: string | number }) {
  const res = await request('/admin/v1/account/sso/auth', {
    method: 'GET',
    params: {
      app_id: loginParam.appId,
      sso_token: loginParam.token,
    },
  });
  return camelize(res) as Promise<ResponseListDTO<LoginResDTO>>;
}
