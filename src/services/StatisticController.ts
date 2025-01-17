import { bufferDownload } from '@/utils';
import { message } from 'antd';
import moment from 'moment';
import { request } from 'umi';
import Big from 'big.js';

interface DateRangeData {
  startTime: number;
  endTime: number;
}
export interface PaymentSurveyType {
  netReceipts: number;
  totalAmount: number;
  totalRefund: number;
}
export async function fetchPaymentSurvey(data: DateRangeData) {
  return request<API.Result<PaymentSurveyType>>(
    '/motel/summary/payment/paymentSurvey',
    {
      method: 'POST',
      data,
    },
  );
}
export interface PaymentAmountItemType {
  paymentName: string;
  amount: number;
  percentage: string;
}
export interface TotalPaymentType {
  totalAmount: number;
  paymentAmountList: PaymentAmountItemType[];
}
export async function fetchTotalPayment(data: DateRangeData) {
  return request<API.Result<TotalPaymentType>>(
    '/motel/summary/payment/totalPayment',
    {
      method: 'POST',
      data,
    },
  );
}
export async function fetchTotalRefund(data: DateRangeData) {
  return request<API.Result<TotalPaymentType>>(
    '/motel/summary/payment/totalRefund',
    {
      method: 'POST',
      data,
    },
  );
}
export enum PaymentDetailTypeEnum {
  RECEIPTS = 1,
  RECEIPTS_CASH_PLEDGE = 2,
  REFUND = 3,
  REFUND_CASH_PLEDGE = 4,
  NET_RECEIPTS = 5,
}
export const paymentDetailTrans = {
  [PaymentDetailTypeEnum.RECEIPTS]: '收款',
  [PaymentDetailTypeEnum.RECEIPTS_CASH_PLEDGE]: '收押金',
  [PaymentDetailTypeEnum.REFUND]: '退款',
  [PaymentDetailTypeEnum.REFUND_CASH_PLEDGE]: '退押金',
  [PaymentDetailTypeEnum.NET_RECEIPTS]: '净收款',
};

export enum RoomTradeManageEnum {
  ROOM_COST = '房费报表',
  JIAN_YE = '间夜报表',
  OCCUPANCY = '入住率报表',
  AVERAGE_ROOM_REVENUE = '平均客房收益',
}
interface SelectPaymentRecordParams extends DateRangeData {
  type: PaymentDetailTypeEnum; // --1 收款 2 收押金 3 退款 4 退押金 5 净收款
  paymentIds: number[]; // --收款设置表主键id集合, 下拉框查询收款设置列表 二期接口里面有
  pageNum?: number;
  pageSize?: number;
}
export interface SelectPaymentRecordItemType {
  project: string;
  paymentDate: string; // --付款时间
  paymentName: string;
  amount: number; // --收款金额
  checkInDate: number; // -- 入住时间
  operator: string;
  updateTime: number; // --更新时间
  orderNo: string; // --关联订单
  orderId: number; // --关联订单
  contacts: string;
  phone: number;
}
// 收款记录列表
export async function fetchSelectPaymentRecord(
  data: SelectPaymentRecordParams,
) {
  return request<API.Result_List_<SelectPaymentRecordItemType>>(
    '/motel/summary/payment/selectPaymentRecord',
    {
      method: 'POST',
      data,
    },
  ).then((res) => {
    return {
      data: res.data?.list || [],
      total: res.data?.total || 0,
    };
  });
}
interface FetchPaymentDetailParams extends DateRangeData {
  type: PaymentDetailTypeEnum; // --1 收款 2 收押金 3 退款 4 退押金 5 净收款
}

export interface PaymentDateItemType {
  date: string;
  price: number;
}
export interface PaymentNightDateItemType {
  date: string;
  num: number;
}

export interface PaymentDetailItemType {
  paymentName: string;
  paymentId: number;
  totalAmount: number;
  paymentDateList: PaymentDateItemType[];
}
export interface PaymentDetailType {
  paymentDetailList: PaymentDetailItemType[];
  totalAmountList: number[];
}
export interface PaymentDetailItem {
  paymentName: string;
  total: number;
  paymentId: number;
  [x: string]: any;
}
// 支付方式明细列表, 已格式化可做Protable的dateSource
export async function fetchPaymentDetail(data: FetchPaymentDetailParams) {
  return request<API.Result<PaymentDetailType>>(
    '/motel/summary/payment/paymentDetail',
    {
      method: 'POST',
      data,
    },
  ).then((res) => {
    console.log(res);
    const { paymentDetailList, totalAmountList } = res.data || {};
    const paymentDaySet = new Set<string>();
    const newPaymentDetailList: PaymentDetailItem[] =
      paymentDetailList?.map((paymentDetail) => {
        const { paymentDateList, paymentName, paymentId } = paymentDetail;
        const paymentDetailItem: PaymentDetailItem = {
          paymentName,
          paymentId,
          total: 0,
        };
        paymentDateList.forEach((paymentDate) => {
          const { date, price } = paymentDate;
          paymentDetailItem[date] = price;
          paymentDetailItem.total += price;
          paymentDaySet.add(date);
        });
        return paymentDetailItem;
      }) || [];

    const totalItem: PaymentDetailItem = {
      paymentName: '合计',
      paymentId: Math.random(),
      total: totalAmountList?.[0] || 0,
    };
    [...paymentDaySet.values()].forEach((dateString, index) => {
      if (totalAmountList) {
        totalItem[dateString] = totalAmountList[index + 1];
      }
    });
    if (newPaymentDetailList.length > 0) {
      newPaymentDetailList.push(totalItem);
    }
    return {
      list: newPaymentDetailList,
      paymentDayList: [...paymentDaySet.values()],
    };
  });
}

// 收支明细列表导出
export async function paymentDetailExport(data: FetchPaymentDetailParams) {
  return request<ArrayBuffer>('/motel/summary/payment/paymentDetailExport', {
    method: 'POST',
    data,
    responseType: 'arrayBuffer',
  }).then((buffer) => {
    bufferDownload(
      buffer,
      `收支明细列表${moment(data.startTime).format('YYYY-MM-DD')} ~ ${moment(
        data.endTime,
      ).format('YYYY-MM-DD')}.xlsx`,
    );
    message.success('下载成功');
  });
}
export interface SumFormDataDetailType {
  allTotalAmount: number;
  dailyAllAmounts: number[];
  dates: string[];
  list: {
    name: string; //名字
    list: {
      name: string; //名字
      itemId: number;
      totalAmount: number; //总额
      dailyAmounts: number[];
    }[];
  }[];
}
export interface PaymentItem {
  project: string;
  detail: string;
  total: number;
  [x: string]: any;
}
// 营业明细列表, 已格式化可做Protable的dateSource
export async function fetchSumFormData(data: DateRangeData) {
  return request<API.Result<SumFormDataDetailType>>(
    '/motel/summary/business/sumFormData',
    {
      method: 'POST',
      data,
    },
  ).then((res) => {
    const { allTotalAmount, dailyAllAmounts, dates, list } = res.data || {};

    const targetList: PaymentItem[] = [];
    list?.forEach((paymentDetail) => {
      const { name, list: subList } = paymentDetail;
      subList.forEach((item) => {
        const { dailyAmounts, totalAmount, name: subName } = item;
        const paymentItem: PaymentItem = {
          project: name,
          detail: subName,
          total: totalAmount,
        };
        dates.forEach((dateString, index) => {
          paymentItem[dateString] = dailyAmounts[index];
        });
        targetList.push(paymentItem);
      });
    });

    const totalItem: PaymentItem = {
      project: '合计',
      detail: '',
      total: allTotalAmount,
    };
    dates?.forEach((dateString, index) => {
      totalItem[dateString] = dailyAllAmounts[index];
    });
    if (targetList.length > 0) {
      targetList.push(totalItem);
    }
    return targetList;
  });
}

// 营业明细列表导出
export async function exportSummary(data: DateRangeData) {
  return request<ArrayBuffer>('/motel/summary/business/exportSummary', {
    method: 'POST',
    data,
    responseType: 'arrayBuffer',
  }).then((buffer) => {
    bufferDownload(
      buffer,
      `营业明细列表${moment(data.startTime).format('YYYY-MM-DD')} ~ ${moment(
        data.endTime,
      ).format('YYYY-MM-DD')}.xlsx`,
    );
    message.success('下载成功');
  });
}

// 收款记录报表导出
export async function paymentRecordExport(data: SelectPaymentRecordParams) {
  return request<ArrayBuffer>('/motel/summary/payment/paymentRecordExport', {
    method: 'POST',
    data,
    responseType: 'arrayBuffer',
  }).then((buffer) => {
    bufferDownload(buffer, `收款记录报表.xlsx`);
    message.success('下载成功');
  });
}

/**
 * 营业汇总页面
 */
export interface TradeStatistics {
  total: number; //总营业额
  dayPercent: number; //日环比
  list: Array<{
    date: string; // 日期
    value: number; // 值
  }>;
  consume: number; //客房消费
  consumePercent: number; //客房消费占比
  penalSum: number; //违约金
  penalSumPercent: number; //违约金占比
  roomFees: number; // 房费
  roomFeesPercent: number; // 房费占比
}

// 营业汇总概括
export async function getTradeStatistics(params: {
  startTime: string;
  endTime: string;
}) {
  return request<API.Result<TradeStatistics>>(
    '/motel/summary/business/getStatistics',
    {
      method: 'POST',
      data: params,
    },
  );
}

export interface TradeDistributions {
  total: number;
  list: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

// 营业汇总统计
export async function getTradeDistributions(params: {
  startTime: string;
  endTime: string;
}) {
  return request<API.Result<TradeDistributions>>(
    '/motel/summary/business/getPieChart',
    {
      method: 'POST',
      data: params,
    },
  );
}

export interface TradeDaily {
  date: string;
  value: any;
}

// 美日汇总统计
export async function getTradeDaily(params: {
  type: number;
  startTime: string;
  endTime: string;
}) {
  return request<API.Result<TradeDaily[]>>(
    '/motel/summary/business/getLineChart',
    {
      method: 'POST',
      data: params,
    },
  );
}

export interface RoomBusinessSurvey {
  averageRoomPrice: string; // "平均房价",
  occupancy: string; // "入住率",
  averageRoomRevenue: string; // "平均客房收益",
  averageOvernight: string; // "平均间夜数"
}
// 营业额概况
export function getRoomBusinessSurvey(params: {
  startTime: string;
  endTime: string;
}) {
  return request<API.Result<RoomBusinessSurvey>>(
    '/motel/summary/roomBusiness/survey',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 概况折线图
export function getRoomBusinessLineChart(params: {
  type: string;
  startTime: string;
  endTime: string;
}) {
  return request<API.Result<TradeDaily[]>>(
    '/motel/summary/roomBusiness/lineChart',
    {
      method: 'POST',
      data: params,
    },
  );
}
export interface RoomPaymentDateItemType {
  roomCode: string;
  roomId: number;
  total: number;
  rentDateDtoList: PaymentDateItemType[];
}
export interface RoomPaymentDetailItemType {
  roomTypeName: string;
  roomTypeId: number;
  totalList: number[];
  roomRentInfoList: RoomPaymentDateItemType[];
}
export interface RoomPaymentDetailType {
  detailList: RoomPaymentDetailItemType[];
  totalAmountList: number[];
}
export interface RoomPaymentDetailItem {
  roomTypeName: string;
  total: number;
  roomTypeId: number;
  [x: string]: any;
}
// 房费报表, 已格式化可做Protable的dateSource
export async function fetchRoomRentDetail(data: FetchPaymentDetailParams) {
  return request<API.Result<RoomPaymentDetailType>>(
    '/motel/summary/roomBusiness/roomRentDetail',
    {
      method: 'POST',
      data,
    },
  ).then((res) => {
    const { detailList, totalAmountList } = res.data || {};
    const paymentDaySet = new Set<string>();
    let totalRowSpanList: number[] = [];
    const newPaymentDetailList: RoomPaymentDetailItem[] = [];

    detailList?.map((detail, index) => {
      const { roomTypeId, roomTypeName, roomRentInfoList } = detail;
      const indexList: number[] = [];
      const allAmountDetail: RoomPaymentDetailItem = {
        roomTypeName,
        roomTypeId,
        roomCode: '总计',
        roomId: Math.random(),
        total: 0,
      };

      roomRentInfoList.forEach((roomRentInfo, i) => {
        if (i === 0) {
          indexList[i] = roomRentInfoList.length + 1;
        } else {
          indexList[i] = 0;
        }
        const { rentDateDtoList, roomCode, roomId, total } = roomRentInfo;
        const detailItem: RoomPaymentDetailItem = {
          roomTypeName,
          roomTypeId,
          roomCode,
          roomId,
          total: total,
        };
        allAmountDetail.total += total;
        rentDateDtoList.forEach((dateInfo) => {
          const { date, price } = dateInfo;
          detailItem[date] = price;
          if (allAmountDetail[date]) {
            allAmountDetail[date] += price;
          } else {
            allAmountDetail[date] = price;
          }
          paymentDaySet.add(date);
        });
        newPaymentDetailList.push(detailItem);
      });
      if (roomRentInfoList.length > 0) {
        newPaymentDetailList.push(allAmountDetail);
        indexList[roomRentInfoList.length] = 0;
      }
      totalRowSpanList = totalRowSpanList.concat(indexList);
    }) || [];
    const totalItem: RoomPaymentDetailItem = {
      roomTypeName: '合计',
      roomTypeId: Math.random(),
      total: totalAmountList?.[0] || 0,
    };
    [...paymentDaySet.values()].forEach((dateString, index) => {
      if (totalAmountList) {
        totalItem[dateString] = totalAmountList[index + 1];
      }
    });
    if (newPaymentDetailList.length > 0) {
      newPaymentDetailList.push(totalItem);
    }
    console.log(totalRowSpanList);
    return {
      list: newPaymentDetailList,
      dayList: [...paymentDaySet.values()],
      totalRowSpanList,
    };
  });
}

export interface RoomPaymentNightDateItemType {
  roomCode: string;
  roomId: number;
  total: number;
  nightDateDtoList: PaymentNightDateItemType[];
}
export interface RoomPaymentNightDetailItemType {
  roomTypeName: string;
  roomTypeId: number;
  totalList: number[];
  roomNightInfoList: RoomPaymentNightDateItemType[];
}
export interface RoomPaymentNightDetailType {
  detailList: RoomPaymentNightDetailItemType[];
  totalNum: number[];
}
export interface RoomPaymentNightDetailItem {
  roomTypeName: string;
  total: number;
  roomTypeId: number;
  [x: string]: any;
}
// 间夜报表, 已格式化可做Protable的dateSource
export async function fetchRoomNightDetail(data: FetchPaymentDetailParams) {
  return request<API.Result<RoomPaymentNightDetailType>>(
    '/motel/summary/roomBusiness/roomNightDetail',
    {
      method: 'POST',
      data,
    },
  ).then((res) => {
    const { detailList, totalNum } = res.data || {};
    const paymentDaySet = new Set<string>();
    let totalRowSpanList: number[] = [];
    const newPaymentDetailList: RoomPaymentDetailItem[] = [];

    detailList?.map((detail, index) => {
      const { roomTypeId, roomTypeName, roomNightInfoList } = detail;
      const indexList: number[] = [];
      const allAmountDetail: RoomPaymentDetailItem = {
        roomTypeName,
        roomTypeId,
        roomCode: '总计',
        roomId: Math.random(),
        total: 0,
      };

      roomNightInfoList.forEach((roomRentInfo, i) => {
        if (i === 0) {
          indexList[i] = roomNightInfoList.length + 1;
        } else {
          indexList[i] = 0;
        }
        const { nightDateDtoList, roomCode, roomId, total } = roomRentInfo;
        const detailItem: RoomPaymentDetailItem = {
          roomTypeName,
          roomTypeId,
          roomCode,
          roomId,
          total: total,
        };
        allAmountDetail.total += total;
        nightDateDtoList.forEach((dateInfo) => {
          const { date, num } = dateInfo;
          detailItem[date] = num;
          if (allAmountDetail[date]) {
            allAmountDetail[date] += num;
          } else {
            allAmountDetail[date] = num;
          }
          paymentDaySet.add(date);
        });
        newPaymentDetailList.push(detailItem);
      });
      if (roomNightInfoList.length > 0) {
        newPaymentDetailList.push(allAmountDetail);
        indexList[roomNightInfoList.length] = 0;
      }
      totalRowSpanList = totalRowSpanList.concat(indexList);
    }) || [];
    const totalItem: RoomPaymentDetailItem = {
      roomTypeName: '合计',
      roomTypeId: Math.random(),
      total: totalNum?.[0] || 0,
    };
    [...paymentDaySet.values()].forEach((dateString, index) => {
      totalItem[dateString] = totalNum[index + 1];
    });
    if (newPaymentDetailList.length > 0) {
      newPaymentDetailList.push(totalItem);
    }
    console.log(totalRowSpanList);
    return {
      list: newPaymentDetailList,
      dayList: [...paymentDaySet.values()],
      totalRowSpanList,
    };
  });
}

// 房费报表导出
export async function roomRentDetailExport(data: DateRangeData) {
  return request<ArrayBuffer>(
    '/motel/summary/roomBusiness/roomRentDetailExport',
    {
      method: 'POST',
      data,
      responseType: 'arrayBuffer',
    },
  ).then((buffer) => {
    bufferDownload(buffer, `房费报表.xlsx`);
    message.success('下载成功');
  });
}

// 间夜报表导出
export async function roomNightDetailExport(data: DateRangeData) {
  return request<ArrayBuffer>(
    '/motel/summary/roomBusiness/roomNightDetailExport',
    {
      method: 'POST',
      data,
      responseType: 'arrayBuffer',
    },
  ).then((buffer) => {
    bufferDownload(buffer, `间夜报表.xlsx`);
    message.success('下载成功');
  });
}

export interface OccupancyDetailItemType {
  date: string;
  occupancy: string;
}
export interface OccupancyDetailType {
  roomTypeId: number;
  roomTypeName: string;
  totalOccupancy: string;
  occupancyDateDtoList: OccupancyDetailItemType[];
}
export interface OccupancyDetailItem {
  roomTypeName: string;
  total: string;
  roomTypeId: number;
  [x: string]: any;
}

// 入住率报表, 已格式化可做Protable的dateSource
export async function fetchOccupancyDetail(data: FetchPaymentDetailParams) {
  return request<API.Result<OccupancyDetailType[]>>(
    '/motel/summary/roomBusiness/occupancyDetail',
    {
      method: 'POST',
      data,
    },
  ).then((res) => {
    const { data } = res || {};
    const paymentDaySet = new Set<string>();
    const newPaymentDetailList: OccupancyDetailItem[] = [];
    let totalRowSpanList: number[] = [];
    // const totalItem: OccupancyDetailItem = {
    //   roomTypeName: '合计',
    //   roomTypeId: Math.random(),
    //   total: '0.00%',
    // };
    data?.forEach((item) => {
      const { roomTypeId, roomTypeName, totalOccupancy, occupancyDateDtoList } =
        item || {};
      const indexList: number[] = [];
      // totalItem.total =
      //   new Big(totalItem.total.replace('%', ''))
      //     .add(new Big(totalOccupancy.replace('%', '')))
      //     .toFixed(2) + '%';
      const detailItem: OccupancyDetailItem = {
        roomTypeName,
        roomTypeId,
        roomId: Math.random(),
        total: totalOccupancy,
      };
      occupancyDateDtoList?.forEach((occupancyDate, i) => {
        const { date, occupancy } = occupancyDate;

        // if (totalItem[date]) {
        //   totalItem[date] =
        //     new Big(totalItem[date].replace('%', ''))
        //       .add(new Big(occupancy.replace('%', '')))
        //       .toFixed(2) + '%';
        // } else {
        //   totalItem[date] =
        //     new Big(occupancy.replace('%', '')).toFixed(2) + '%';
        // }

        detailItem[date] = occupancy;
        paymentDaySet.add(date);
      });
      newPaymentDetailList.push(detailItem);

      if (occupancyDateDtoList.length > 0) {
        indexList[occupancyDateDtoList.length] = 1;
      }
    });
    // if (newPaymentDetailList.length > 0) {
    //   newPaymentDetailList.push(totalItem);
    // }
    return {
      list: newPaymentDetailList,
      dayList: [...paymentDaySet.values()],
      totalRowSpanList,
    };
  });
}

// 入住率报表导出
export async function occupancyDetailExport(data: DateRangeData) {
  return request<ArrayBuffer>(
    '/motel/summary/roomBusiness/occupancyDetailExport',
    {
      method: 'POST',
      data,
      responseType: 'arrayBuffer',
    },
  ).then((buffer) => {
    bufferDownload(buffer, `入住率报表.xlsx`);
    message.success('下载成功');
  });
}

export interface AverageRoomRevenueDetailItemType {
  date: string;
  averageRoomRevenue: string;
}
export interface AverageRoomRevenueDetailType {
  roomTypeId: number;
  roomTypeName: string;
  totalRevenue: string;
  averageRoomRevenueDateDtoList: AverageRoomRevenueDetailItemType[];
}
export interface AverageRoomRevenueDetailItem {
  roomTypeName: string;
  total: string;
  roomTypeId: number;
  [x: string]: any;
}

// 入住率报表, 已格式化可做Protable的dateSource
export async function fetchAverageRoomRevenueDetail(
  data: FetchPaymentDetailParams,
) {
  return request<API.Result<AverageRoomRevenueDetailType[]>>(
    '/motel/summary/roomBusiness/averageRoomRevenueDetail',
    {
      method: 'POST',
      data,
    },
  ).then((res) => {
    const { data } = res || {};
    const paymentDaySet = new Set<string>();
    const newPaymentDetailList: AverageRoomRevenueDetailItem[] = [];
    let totalRowSpanList: number[] = [];
    // const totalItem: AverageRoomRevenueDetailItem = {
    //   roomTypeName: '合计',
    //   roomTypeId: Math.random(),
    //   total: '0',
    // };
    data?.forEach((item) => {
      const {
        roomTypeId,
        roomTypeName,
        totalRevenue,
        averageRoomRevenueDateDtoList,
      } = item || {};
      const indexList: number[] = [];
      // totalItem.total = new Big(totalItem.total).add(totalRevenue).toString();
      const detailItem: OccupancyDetailItem = {
        roomTypeName,
        roomTypeId,
        roomId: Math.random(),
        total: totalRevenue,
      };
      averageRoomRevenueDateDtoList?.forEach((averageRoomRevenueDate, i) => {
        const { date, averageRoomRevenue } = averageRoomRevenueDate;

        // if (totalItem[date]) {
        //   totalItem[date] = new Big(totalItem[date])
        //     .add(averageRoomRevenue)
        //     .toString();
        // } else {
        //   totalItem[date] = averageRoomRevenue;
        // }

        detailItem[date] = averageRoomRevenue;
        paymentDaySet.add(date);
      });
      newPaymentDetailList.push(detailItem);

      if (averageRoomRevenueDateDtoList.length > 0) {
        indexList[averageRoomRevenueDateDtoList.length] = 1;
      }
    });
    // if (newPaymentDetailList.length > 0) {
    //   newPaymentDetailList.push(totalItem);
    // }
    return {
      list: newPaymentDetailList,
      dayList: [...paymentDaySet.values()],
      totalRowSpanList,
    };
  });
}

// 平均客房收益报表导出
export async function averageRoomRevenueDetailExport(data: DateRangeData) {
  return request<ArrayBuffer>(
    '/motel/summary/roomBusiness/averageRoomRevenueDetailExport',
    {
      method: 'POST',
      data,
      responseType: 'arrayBuffer',
    },
  ).then((buffer) => {
    bufferDownload(buffer, `平均客房收益报表.xlsx`);
    message.success('下载成功');
  });
}
