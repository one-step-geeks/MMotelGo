import { request } from 'umi';
import Cookie from 'js-cookie';

/** 获取渠道 */
export async function queryChannels() {
  return request<API.Result_List_ALL_<SETTING.Channel>>(
    '/motel/config/channelSet/list',
    {
      method: 'POST',
      data: { storeId: Cookie.get('storeId') as number },
    },
  );
}

/** 新增渠道 */
export async function addChannel(name: string, type = 0) {
  return request<API.Result>('/motel/config/channelSet/save', {
    method: 'POST',
    data: {
      name,
      storeId: Cookie.get('storeId') as number,
      type,
      color: '#000',
    },
  });
}

/** 更新渠道 */
export async function updateChannel(id: number, name: string, color: string) {
  return request<API.Result>('/motel/config/channelSet/update', {
    method: 'POST',
    data: {
      id,
      name,
      color,
    },
  });
}

/** 删除 渠道 */
export async function deleteChannel(id: number) {
  return request<API.Result>('/motel/config/channelSet/delete', {
    method: 'POST',
    data: {
      id,
    },
  });
}

/** 排序渠道 */
export async function sortChannels(orderIds: Array<number>) {
  return request<API.Result>('/motel/config/channelSet/sort', {
    method: 'POST',
    data: {
      idList: orderIds,
    },
  });
}
