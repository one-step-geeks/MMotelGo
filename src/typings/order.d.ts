/** 订单 */
declare namespace ORDER {
  interface OrderData {
    orderId: number;
    paidAmount?: number;
    remainAmount?: number;
    channelTypeName?: number;
    reserveEmail?: string;
    reserveName?: string;
    totalAmount?: number;
    roomStatus?: number;
    roomList: {
      roomCode: string;
      roomId: number;
      startDate?: string;
      endDate?: string;
    }[];
  }

  interface OrderBase {
    id: number;
    channelSettingId: number;
    status: any;
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
    roomId?: number;
    roomTypeName?: string;
    roomCode?: string;
    roomDesc: string; // 房型-房号
    startDate: moment.Moment;
    endDate?: moment.Moment;
    checkInDays: number;
    roomPrice?: number;
    totalAmount?: number;
    checkInPersonCount?: number;
    status?: any;
    priceList: Array<number>; // 房间价格（跨多天)
  }

  interface OrderNotice {
    id: number;
    remark: string;
    remindTime: string;
  }

  interface OrderConsume {
    id: number;
    orderId: number;
    storeId?: number;
    remark: string;
    consumeDate: string;
    consumptionSetId: number;
    consumptionSetName: string;
    count: number;
    price: number;
  }

  interface OrderPayOrRefund {
    id: number;
    storeId?: number;
    orderId?: number;
    type: 0 | 1 | 2 | 3 | 4; // 1-收款 2-收押金 3-退款 4-退押金
    remark: string;
    // date: string;
    feeDate: string;
    // paymentTypeId: number;
    feeConfigId: number;
    // price: number;
    amount: number;
  }

  interface OrderRoomPerson {
    id?: number;
    nickName: string;
    phoneNo: string;
  }
  interface OrderOperationLog {
    operationType: number;
    createTime: number;
    creator: string;
    remark: string;
  }
}
