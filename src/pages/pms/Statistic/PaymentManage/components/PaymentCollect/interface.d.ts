import {
  PaymentSurveyType,
  TotalPaymentType,
} from '@/services/StatisticController';
import { ActionType } from '@ant-design/pro-components';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import React from 'react';
export interface PaymentCollectStateType {
  collectDateRange: RangeValue<moment.Moment>;
  paymentSurvey: PaymentSurveyType;
  paymentSurveyLoading: boolean;
  totalReceiptsInfo: TotalPaymentType;
  totalRefundInfo: TotalPaymentType;
  totalReceiptsLoading: boolean;
  totalRefundLoading: boolean;
}
export interface PaymentCollectPropsType {}

export interface PaymentCollectContextType extends PaymentCollectPropsType {
  setStore: (newState: Partial<PaymentCollectStateType>, cb?: () => any) => any;
  setCollectDateRange: (
    collectDateRange: PaymentCollectStateType['collectDateRange'],
  ) => any;
  store: PaymentCollectStateType;
  paymentDetailActionRef: React.RefObject<ActionType>;
}
