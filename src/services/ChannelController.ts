import { request } from 'umi';
import Cookie from 'js-cookie';
import { message } from 'antd';

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

/**  排序渠道 */
export async function sortChannels(orderIds: Array<number>) {
  return request<API.Result>('/motel/config/channelSet/sort', {
    method: 'POST',
    data: {
      idList: orderIds,
    },
  });
}

/** 渠道邮箱列表 */
export async function getChannelMailList() {
  return request<
    API.Result<
      {
        id: number; // 渠道邮箱配置id
        emailAddr: string; // 渠道邮箱地址
      }[]
    >
  >('/motel/channel/mail/list');
}
/** 添加渠道邮箱 */
export async function addChannelMail(data: {
  emailAddr: string; // 渠道邮箱地址
  emailPwd: string; //渠道邮箱密码
}) {
  return request<API.Result<number>>('/motel/channel/mail/add', {
    method: 'POST',
    data,
  }).then((res) => {
    message.success('新增成功');
    return res;
  });
}

/** 修改渠道邮箱 */
export async function editChannelMail(data: {
  mailList: {
    id: number; // 渠道邮箱主键id
    emailPwd: string; //渠道邮箱密码
  }[];
}) {
  return request<API.Result>('/motel/channel/mail/update', {
    method: 'POST',
    data,
  }).then((res) => {
    message.success('编辑成功');
    return res;
  });
}
/** 删除渠道邮箱 */
export async function deleteChannelMail(id: number) {
  return request<API.Result>('/motel/channel/mail/del', {
    method: 'POST',
    data: {
      id,
    },
  }).then((res) => {
    message.success('删除成功');
    return res;
  });
}
export interface ChannelOrderItemType {
  id: number; // 渠道订单主键id
  channelName: string; // 渠道名称
  createTime: string; //创建时间
  emailAddr: string; //邮箱地址
  channelOrderNo: string; //渠道订单号
  emailLink: string; //邮件链接，后期放到oss中，一期先不实现
  emailSubject: string; //邮件主题
}
/** 渠道列表 */
export async function getChannelOrderList(data: {
  pageNum: number; //页码
  pageSize: number; //每页数据量
  channelOrderNo: string; // 渠道订单号
  channelIdList: { channelId: any }[];
  emailAddr: string;
  startDate: string; // 渠道订单生成开始时间
  endDate: string; //渠道订单生成结束时间
}) {
  return request<API.Result<ChannelOrderItemType[]>>(
    '/motel/channel/mail/order/list',
    {
      method: 'POST',
      data,
    },
  );
}
/** 手动拉取邮件订单 */
export async function pullChannelOrder(data: {
  pageNum: number; //页码
  pageSize: number; //每页数据量
  channelOrderNo: string; // 渠道订单号
  channelIdList: { channelId: any }[];
  emailAddr: string;
  startDate: string; // 渠道订单生成开始时间
  endDate: string; //渠道订单生成结束时间
}) {
  return request<API.Result<ChannelOrderItemType[]>>(
    '/motel/channel/mail/order/create',
    {
      method: 'POST',
      data,
    },
  ).then((res) => {
    if (res.errorMessage) {
      message.warn(res.errorMessage);
    } else {
      message.success('拉取成功');
    }
    return res;
  });
}
export enum ChannelTypeEnum {
  OTA = 1,
  MAIL = 0,
}
export enum ChannelStatusEnum {
  UN_ENABLE = 0,
  ENABLED = 1,
  UN_FOUND = 2,
}
export const channelStatustrans = {
  [ChannelStatusEnum.ENABLED]: '已开通',
  [ChannelStatusEnum.UN_ENABLE]: '未开通',
  [ChannelStatusEnum.UN_FOUND]: '未发现',
};
/** 获取渠道列表 */
export async function getChannelList() {
  return request<
    API.Result<
      {
        id: number; // 渠道主键
        name: string; // 渠道名称
        type: ChannelTypeEnum; // 0-邮件直连，1-OTA直连
        status: ChannelStatusEnum; // 0-未开通，1-已开通 2-未发现
        picUrl: string; // 渠道图片展示url
        color: string;
      }[]
    >
  >('/motel/channel/list');
}

/** 同步渠道 */
export async function syncChannel(channelId: number) {
  return request<API.Result>('/motel/channel/sync', { data: { channelId } });
}
