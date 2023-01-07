import { ActionType } from '@ant-design/pro-components';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import React from 'react';
export interface PaymentCollectStateType {
  collectDateRange: RangeValue<moment.Moment>;
}
export interface PaymentCollectPropsType {}

export interface PaymentCollectContextType extends PaymentCollectPropsType {
  setStore: (newState: Partial<PaymentCollectStateType>, cb?: () => any) => any;
  store: PaymentCollectStateType;
  paymentDetailActionRef: React.Ref<ActionType>;
}
