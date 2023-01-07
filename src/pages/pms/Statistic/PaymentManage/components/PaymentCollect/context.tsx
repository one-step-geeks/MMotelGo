import React, { createContext } from 'react';
import {
  PaymentCollectContextType,
  PaymentCollectPropsType,
  PaymentCollectStateType,
} from './interface';
import { ActionType } from '@ant-design/pro-table';
export const PaymentCollectContext = createContext<PaymentCollectContextType>(
  {} as any,
);

const paymentCollectContextHoc = (Comp: React.ComponentType<any>) => {
  return class extends React.PureComponent<
    PaymentCollectPropsType,
    PaymentCollectStateType
  > {
    state: PaymentCollectStateType = {
      collectDateRange: [] as any,
    };
    paymentDetailActionRef = React.createRef<ActionType>();
    componentDidMount = () => {
      this.init();
    };
    setStore: PaymentCollectContextType['setStore'] = (newState, cb) => {
      this.setState(newState as any, () => {
        cb && cb();
      });
    };

    init = () => {};
    render() {
      const contextValue = {
        ...this.props,
        store: this.state,
        setStore: this.setStore,
        paymentDetailActionRef: this.paymentDetailActionRef,
      };
      return (
        <PaymentCollectContext.Provider value={contextValue}>
          <Comp {...contextValue} />
        </PaymentCollectContext.Provider>
      );
    }
  };
};

export default paymentCollectContextHoc;
