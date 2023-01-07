import { bufferDownload } from '@/utils';
import { message } from 'antd';
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
  contacts: string;
  phone: number;
}
// 收款记录列表
export async function fetchSelectPaymentRecord(
  data: SelectPaymentRecordParams,
) {
  return request<API.Result_List_<SelectPaymentRecordItemType>>(
    '/summary/payment/selectPaymentRecord',
    {
      method: 'POST',
      data,
    },
  );
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
  totalAmount: number;
  paymentDateList: PaymentDateItemType[];
}
export interface PaymentDetailType {
  paymentDetailList: PaymentDetailItemType[];
  totalAmountList: number[];
}
export interface PaymentDetailItem {
  paymentName: string;
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
        const { paymentDateList, paymentName } = paymentDetail;
        const paymentDetailItem: Record<string, any> = {};
        paymentDateList.forEach((paymentDate) => {
          const { date, price } = paymentDate;
          paymentDetailItem[date] = price;
          paymentDaySet.add(date);
        });
        return {
          paymentName,
          ...paymentDetailItem,
        };
      }) || [];

    const totalItem: PaymentDetailItem = {
      paymentName: '合计',
    };
    [...paymentDaySet.values()].forEach((dateString, index) => {
      totalItem[dateString] = totalAmountList[index];
    });
    if (newPaymentDetailList.length > 0) {
      newPaymentDetailList.push(totalItem);
    }
    newPaymentDetailList.push(totalItem);
    return newPaymentDetailList;
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
      `营业明细列表${data.startTime} ~ ${data.endTime}.xlsx`,
    );
    message.success('下载成功');
  });
}
