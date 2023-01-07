import React, { createContext } from 'react';
import {
  ChannelStatisticContextType,
  ChannelStatisticPropsType,
  ChannelStatisticStateType,
} from './interface';
import { ActionType } from '@ant-design/pro-table';
export const ChannelStatisticContext =
  createContext<ChannelStatisticContextType>({} as any);

const channelStatisticContextHoc = (Comp: React.ComponentType<any>) => {
  return class extends React.PureComponent<
    ChannelStatisticPropsType,
    ChannelStatisticStateType
  > {
    state: ChannelStatisticStateType = {
      collectDateRange: [] as any,
    };
    paymentDetailActionRef = React.createRef<ActionType>();
    componentDidMount = () => {
      this.init();
    };
    setStore: ChannelStatisticContextType['setStore'] = (newState, cb) => {
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
        <ChannelStatisticContext.Provider value={contextValue}>
          <Comp {...contextValue} />
        </ChannelStatisticContext.Provider>
      );
    }
  };
};

export default channelStatisticContextHoc;
