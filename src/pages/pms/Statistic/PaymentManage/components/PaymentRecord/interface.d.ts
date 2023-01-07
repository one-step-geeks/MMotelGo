import { ActionType, ProFormInstance } from '@ant-design/pro-components';
import React from 'react';
export interface PaymentRecordStateType {}
export interface PaymentRecordPropsType {}

export interface PaymentRecordContextType extends PaymentRecordPropsType {
  setStore: (newState: Partial<PaymentRecordStateType>, cb?: () => any) => any;
  store: PaymentRecordStateType;
  tableActionRef: React.RefObject<ActionType>;
  tableFormRef: React.MutableRefObject<ProFormInstance>;
  drawerFormRef: React.RefObject<ProFormInstance>;
}
