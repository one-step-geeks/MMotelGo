/** 订单 */
declare namespace ORDER {
  interface OrderData {
    checkinTime?: string;
    checkinType?: number;
    checkoutTime?: string;
    customer?: string;
    needPayAmount?: number;
    orderId?: string;
    origin?: string;
    phone?: string;
    remark?: string;
    roomId?: string;
    serviceId?: string;
    status?: number;
    totalAmount?: number;
  }

  interface OrderBase {
    id: number;
    channelType: number;
    status: 1 | 2;
    remark: string;
    reserveName: string;
    reservePhone: string;
    channelOrderNo: string; //渠道单号
    orderColour: number; //订单颜色
    totalAmount: number; //订单金额
    paidAmount: number; //已付金额
    remainAmount: number; //还需付款
  }

  interface OrderDetail {
    order: OrderBase;
    orderRoomList: Array<OrderRoom>;
  }
  interface OrderListItem extends Omit<OrderBase, 'id' | 'remark'> {
    orderId: number;
    channelOrderNo: string; //渠道单号
    totalAmount: number; //订单金额
    // 列表衍生出来的字段
    payStatus: 0 | 1 | 2 | 3; //结账状态
    roomDtoList: Array<OrderRoom>;
  }
  interface OrderListItemFlatted
    extends Omit<OrderListItem, 'roomDtoList'>,
      OrderRoom {
    key: string;
    rowSpan: number;
    // id: number; // roomId,冗余出来的值为roomId
  }

  interface TypeAndRoomTree {
    list: Array<{
      roomTypeId: number;
      roomTypeName: string;
      roomList: Array<{
        roomId: number;
        roomCode: string;
        roomPrice: number;
        isOccupy: 0 | 1;
      }>;
    }>;
  }
  interface OrderRoom {
    key: string | number;
    id?: number;
    roomId: number;
    roomTypeName: string;
    roomCode: string;
    roomDesc: string; // 房型-房号
    startDate: moment.Moment | string;
    checkInDays: number;
    roomPrice: number;
    totalAmount: number;
    checkInPersonCount?: number;
    status?: number;
  }

  interface OrderNotice {
    id: number;
    remark: string;
    remindTime: string;
  }

  interface OrderConsume {
    id: number;
    remark: string;
    consumeDate: string;
    consumptionSetId: number;
    consumptionSetName: string;
    count: number;
    price: number;
  }
}
