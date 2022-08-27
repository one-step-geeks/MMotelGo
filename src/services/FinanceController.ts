import { request } from 'umi';
import Cookie from 'js-cookie';

/** 获取支付方式 */
export async function queryPaymentTypes() {
  return request<API.Result_List_ALL_<SETTING.PaymentType>>(
    '/motel/config/payment/list',
    {
      method: 'POST',
      data: { storeId: Cookie.get('storeId') as number },
    },
  );
}

/** 新增支付方式 */
export async function addPaymentType(name: string, type = 0) {
  return request<API.Result>('/motel/config/payment/save', {
    method: 'POST',
    data: {
      name,
      storeId: Cookie.get('storeId') as number,
      type,
    },
  });
}

/** 更新支付方式 */
export async function updatePaymentType(id: number, name: string) {
  return request<API.Result>('/motel/config/payment/update', {
    method: 'POST',
    data: {
      id,
      name,
    },
  });
}

/** 删除 支付方式 */
export async function deletePaymentType(id: number) {
  return request<API.Result>('/motel/config/payment/delete', {
    method: 'POST',
    data: {
      id,
    },
  });
}

/** 排序支付方式 */
export async function sortPaymentTypes(orderIds: Array<number>) {
  return request<API.Result>('/motel/config/payment/sort', {
    method: 'POST',
    data: {
      idList: orderIds,
    },
  });
}
