import React, { createContext } from 'react';
import {
  PaymentRecordContextType,
  PaymentRecordPropsType,
  PaymentRecordStateType,
} from './interface';
import { ActionType } from '@ant-design/pro-table';
import { ProFormInstance } from '@ant-design/pro-form';
export const PaymentRecordContext = createContext<PaymentRecordContextType>(
  {} as any,
);

const paymentRecordContextHoc = (Comp: React.ComponentType<any>) => {
  return class extends React.PureComponent<
    PaymentRecordPropsType,
    PaymentRecordStateType
  > {
    state: PaymentRecordStateType = {};
    setStore: PaymentRecordContextType['setStore'] = (newState, cb) => {
      this.setState(newState as any, () => {
        cb && cb();
      });
    };

    tableActionRef = React.createRef<ActionType>();
    tableFormRef =
      React.createRef<ProFormInstance>() as React.MutableRefObject<ProFormInstance>;
    drawerFormRef = React.createRef<ProFormInstance>();
    componentDidMount = () => {
      this.init();
    };

    init = () => {};
    render() {
      const contextValue = {
        ...this.props,
        store: this.state,
        setStore: this.setStore,
        tableActionRef: this.tableActionRef,
        tableFormRef: this.tableFormRef,
        drawerFormRef: this.drawerFormRef,
      };
      return (
        <PaymentRecordContext.Provider value={contextValue}>
          <Comp {...contextValue} />
        </PaymentRecordContext.Provider>
      );
    }
  };
};

export default paymentRecordContextHoc;
