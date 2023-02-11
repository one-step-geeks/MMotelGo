import { ActionType } from '@ant-design/pro-components';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import React from 'react';
export interface TradeStatisticStateType {
  collectDateRange: RangeValue<moment.Moment>;
}
export interface TradeStatisticPropsType {}

export interface TradeStatisticContextType extends TradeStatisticPropsType {
  setStore: (newState: Partial<TradeStatisticStateType>, cb?: () => any) => any;
  setCollectDateRange: (
    collectDateRange: TradeStatisticStateType['collectDateRange'],
  ) => any;
  store: TradeStatisticStateType;
  paymentDetailActionRef: React.Ref<ActionType>;
}
