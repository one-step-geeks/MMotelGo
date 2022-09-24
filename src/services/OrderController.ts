import { request } from 'umi';
import moment from 'moment';
import Cookie from 'js-cookie';

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

export enum OperationType {
  CONFIRM_CHECKIN = 1,
  CANCEL_OBSERVE = 2,
  CANCEL_CHECKIN = 3,
  CHECK_OUT = 4,
}
// 】1-办理入住 2-取消预订 3-取消入住 4-办理退房 5-恢复预订 6-撤销退房
export const OperationTypeText = {
  [OperationType.CONFIRM_CHECKIN]: '办理入住',
  [OperationType.CANCEL_OBSERVE]: '取消预定',
  [OperationType.CANCEL_CHECKIN]: '取消入住',
  [OperationType.CHECK_OUT]: '办理退房',
};
export interface OperateData extends ORDER.OrderDetail {
  operationType: OperationType;
}

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

/** 导出订单列表 */
export async function exportList(params: Record<string, any>) {
  return request<ArrayBuffer>('/motel/order/exportOrders', {
    method: 'GET',
    params,
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

/** 操作订单状态 */
export async function operateOrder(params: Record<string, any>) {
  return request<API.Result_RoomTypeInfo_>('/motel/order/operate', {
    method: 'POST',
    data: params,
  });
}

/** 新增订单提醒 */
export async function addNotice(params: Record<string, any>) {
  return request<API.Result>('/motel/order/remind/add', {
    method: 'POST',
    data: params,
  });
}

/** 修改订单提醒 */
export async function updateNotice(params: Record<string, any>) {
  return request<API.Result>('/motel/order/remind/update', {
    method: 'POST',
    data: params,
  });
}

/** 查询订单提醒 */
export async function queryNoticeList(orderId: number) {
  return request<API.Result_List_ALL_<ORDER.OrderNotice>>(
    '/motel/order/remind/list',
    {
      method: 'GET',
      params: { orderId },
    },
  );
}

/** 删除订单提醒 */
export async function deleteNotice(id: number) {
  return request<API.Result>('/motel/order/remind/delete', {
    method: 'GET',
    params: { id },
  });
}

/**************************  消费项  **************************/

/** 新增订单消费项 */
export async function addConsume(params: Record<string, any>) {
  return request<API.Result>('/motel/orderConsumeItem/save', {
    method: 'POST',
    data: {
      storeId: Cookie.get('storeId') as number,
      ...params,
    },
  });
}

/** 修改订单消费项 */
// export async function updateConsume(params: Record<string, any>) {
//   return request<API.Result>('/motel/orderConsumeItem/save', {
//     method: 'POST',
//     data: params,
//   });
// }

/** 查询订单消费项 */
export async function queryConsumeList(orderId: number) {
  return request<API.Result_List_ALL_<ORDER.OrderConsume>>(
    '/motel/orderConsumeItem/list',
    {
      method: 'POST',
      data: {
        orderId,
        storeId: Cookie.get('storeId') as number,
      },
    },
  );
}

/** 删除订单消费项 */
export async function deleteConsume(id: number) {
  return request<API.Result>('/motel/orderConsumeItem/delete', {
    method: 'POST',
    data: { id },
  });
}

/**************************  收退款  **************************/

/** 新增订单收退款 */
export async function addPayOrRefund(params: Record<string, any>) {
  return request<API.Result>('/motel/orderFeeItem/save', {
    method: 'POST',
    data: {
      storeId: Cookie.get('storeId') as number,
      ...params,
    },
  });
}

/** 查询订单收退款 */
export async function queryPayOrRefundList(orderId: number) {
  return request<API.Result_List_ALL_<ORDER.OrderPayOrRefund>>(
    '/motel/orderFeeItem/list',
    {
      method: 'POST',
      data: {
        orderId,
        storeId: Cookie.get('storeId') as number,
      },
    },
  );
}

/** 删除订单收退款 */
export async function deletePayOrRefund(id: number) {
  return request<API.Result>('/motel/orderFeeItem/delete', {
    method: 'POST',
    data: { feeItemId: id },
  });
}
