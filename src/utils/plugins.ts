import { history } from 'umi';
import envConfig from '@/utils/env';
import { message } from 'antd';
import Cookie from 'js-cookie';
import { isLoginPath } from '@/utils';
import { getLocale } from 'umi';

const { APP_BASE_URL } = envConfig;

export const notLoginResponseInterceptor = (response: Response) => {
  response
    .clone()
    .json()
    .then((result) => {
      // 用户未登录
      if (result.errorCode === '0403') {
        message.destroy();
        if (isLoginPath()) {
          return;
        }
        history.push(
          `/user/login?redirectTo=${encodeURIComponent(window.location.href)}`,
        );
      }
      // 未选择门店
      if (result.errorCode === '0017') {
        message.destroy();
        history.push(`/pms/store`);
      }
    });
  return response;
};

export const commonRequestInterceptor = (
  url: string,
  options: Record<string, any>,
) => {
  if (url.indexOf('/api') > -1) {
    /**
     * 如果是/api开头（约定），走本地mock/api.ts；
     * 不修改options配置，否则会影响proxy；
     */
    return {};
  }
  return {
    url: `${APP_BASE_URL}${url}`,
    options: {
      ...options,
      headers: {
        ...(options?.headers || null),
        'x-auth': Cookie.get('token'),
        locale: getLocale(),
        ...(Cookie.get('offsetTimezone')
          ? {
              'X-Timezone-Offset': Number(Cookie.get('offsetTimezone')),
            }
          : {}),
      },
    },
  };
};
