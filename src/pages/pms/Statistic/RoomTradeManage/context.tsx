import React, { createContext } from 'react';
import {
  TradeStatisticContextType,
  TradeStatisticPropsType,
  TradeStatisticStateType,
} from './interface';
import { ActionType } from '@ant-design/pro-table';
import moment from 'moment';
export const TradeStatisticContext = createContext<TradeStatisticContextType>(
  {} as any,
);

const tradeStatisticContextHoc = (Comp: React.ComponentType<any>) => {
  return class extends React.PureComponent<
    TradeStatisticPropsType,
    TradeStatisticStateType
  > {
    state: TradeStatisticStateType = {
      collectDateRange: [moment(), moment()] as any,
    };
    paymentDetailActionRef = React.createRef<ActionType>();
    componentDidMount = () => {
      this.init();
    };
    setStore: TradeStatisticContextType['setStore'] = (newState, cb) => {
      this.setState(newState as any, () => {
        cb && cb();
      });
    };
    setCollectDateRange = (
      collectDateRange: TradeStatisticStateType['collectDateRange'],
    ) => {
      this.setStore(
        {
          collectDateRange,
        },
        () => {
          this.init();
        },
      );
    };
    init = () => {
      this.paymentDetailActionRef.current?.reload();
    };
    render() {
      const contextValue = {
        ...this.props,
        store: this.state,
        setStore: this.setStore,
        setCollectDateRange: this.setCollectDateRange,
        paymentDetailActionRef: this.paymentDetailActionRef,
      };
      return (
        <TradeStatisticContext.Provider value={contextValue}>
          <Comp {...contextValue} />
        </TradeStatisticContext.Provider>
      );
    }
  };
};

export default tradeStatisticContextHoc;
