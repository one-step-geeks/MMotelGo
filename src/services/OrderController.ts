import { request } from 'umi';
import moment from 'moment';

export enum OrderState {
  IS_ORDERED = 1,
  IS_CHECKED,
  IS_CHECKOUT,
  IS_CANCELED,
}

export const OrderStateText = {
  [OrderState.IS_ORDERED]: '已预定',
  [OrderState.IS_CHECKED]: '已入住',
  [OrderState.IS_CANCELED]: '已取消',
  [OrderState.IS_CHECKOUT]: '已退房',
};

export const OrderStateOptions = [
  {
    value: OrderState.IS_ORDERED,
    label: OrderStateText[OrderState.IS_ORDERED],
  },
  {
    value: OrderState.IS_CHECKED,
    label: OrderStateText[OrderState.IS_CHECKED],
  },
  {
    value: OrderState.IS_CANCELED,
    label: OrderStateText[OrderState.IS_CANCELED],
  },
  {
    value: OrderState.IS_CHECKOUT,
    label: OrderStateText[OrderState.IS_CHECKOUT],
  },
];

export const OrderPayOptions = [
  {
    value: 1,
    label: '未付清',
  },
  {
    value: 2,
    label: '部分付清',
  },
  {
    value: 3,
    label: '已付清',
  },
];

/** 创建订单 */
export async function add(data: any) {
  return request<API.Result>('/motel/order/createOrder', {
    method: 'POST',
    data,
  });
}

/** 修改订单 */
export async function update(data: any) {
  return request<API.Result>('/motel/order/updateOrder', {
    method: 'POST',
    data,
  });
}
/** 查询订单详情 */
export async function queryDetail(orderId: number) {
  return request<API.Result_OrderDetailInfo_>('/motel/order/getOrderDetail', {
    method: 'GET',
    params: { orderId },
  });
}

/** 查询订单列表 */
export async function queryList(params: Record<string, any>) {
  return request<API.Result_OrderListInfo_>('/motel/order/listOrders', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/** 查询可预定的房间 */
export async function queryObservableRooms(startDate: string) {
  return request<API.Result_RoomTypeInfo_>(
    '/motel/order/checkOrderRoomByDate',
    {
      method: 'GET',
      params: {
        startDate,
      },
    },
  );
}
