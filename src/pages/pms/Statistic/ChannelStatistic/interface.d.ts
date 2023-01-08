import { ActionType } from '@ant-design/pro-components';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import React from 'react';
export interface ChannelStatisticStateType {
  collectDateRange: RangeValue<moment.Moment>;
}
export interface ChannelStatisticPropsType {}

export interface ChannelStatisticContextType extends ChannelStatisticPropsType {
  setStore: (
    newState: Partial<ChannelStatisticStateType>,
    cb?: () => any,
  ) => any;
  setCollectDateRange: (
    collectDateRange: ChannelStatisticStateType['collectDateRange'],
  ) => any;
  store: ChannelStatisticStateType;
  paymentDetailActionRef: React.Ref<ActionType>;
}
