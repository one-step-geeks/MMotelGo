import { bufferDownload } from '@/utils';
import { message } from 'antd';
import moment from 'moment';
import { request } from 'umi';

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
      total: totalAmountList[0] || 0,
    };
    [...paymentDaySet.values()].forEach((dateString, index) => {
      totalItem[dateString] = totalAmountList[index + 1];
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
    list.forEach((paymentDetail) => {
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
    dates.forEach((dateString, index) => {
      totalItem[dateString] = dailyAllAmounts[index];
      totalItem.total += dailyAllAmounts[index];
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
