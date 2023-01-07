import React, { createContext } from 'react';
import {
  PaymentCollectContextType,
  PaymentCollectPropsType,
  PaymentCollectStateType,
} from './interface';
import { ActionType } from '@ant-design/pro-table';
import {
  fetchPaymentSurvey,
  fetchTotalPayment,
  fetchTotalRefund,
} from '@/services/StatisticController';
import moment from 'moment';
export const PaymentCollectContext = createContext<PaymentCollectContextType>(
  {} as any,
);

const paymentCollectContextHoc = (Comp: React.ComponentType<any>) => {
  return class extends React.PureComponent<
    PaymentCollectPropsType,
    PaymentCollectStateType
  > {
    state: PaymentCollectStateType = {
      collectDateRange: [moment(), moment()],
      paymentSurvey: {},
      totalReceiptsInfo: {
        paymentAmountList: [],
      },
      totalRefundInfo: {
        paymentAmountList: [],
      },
      paymentSurveyLoading: true,
      totalReceiptsLoading: true,
      totalRefundLoading: true,
    } as any;
    paymentDetailActionRef = React.createRef<ActionType>();
    componentDidMount = () => {
      this.getInitData();
    };
    setStore: PaymentCollectContextType['setStore'] = (newState, cb) => {
      this.setState(newState as any, () => {
        cb && cb();
      });
    };
    setCollectDateRange = (
      collectDateRange: PaymentCollectStateType['collectDateRange'],
    ) => {
      this.setStore({
        collectDateRange,
      });
      this.getInitData(collectDateRange);
    };
    getRangeDate = (
      collectDateRange: PaymentCollectStateType['collectDateRange'],
    ) => {
      const [start, end] = collectDateRange || [];
      if (start && end) {
        return {
          startTime: start.hour(0).minute(0).second(0).millisecond(0).valueOf(),
          endTime: end
            .hour(23)
            .minute(59)
            .second(59)
            .millisecond(999)
            .valueOf(),
        };
      }
      return null;
    };
    getPaymentSurvey = async (
      collectDateRange: PaymentCollectStateType['collectDateRange'] = this.state
        .collectDateRange,
    ) => {
      const searchParams = this.getRangeDate(collectDateRange);
      try {
        if (searchParams) {
          await fetchPaymentSurvey(searchParams).then((res) => {
            this.setState({
              paymentSurvey: res.data,
            });
          });
        }
      } finally {
        return Promise.resolve().finally(() => {
          this.setStore({
            paymentSurveyLoading: false,
          });
        });
      }
    };
    getTotalPayment = async (
      collectDateRange: PaymentCollectStateType['collectDateRange'] = this.state
        .collectDateRange,
    ) => {
      const searchParams = this.getRangeDate(collectDateRange);
      try {
        if (searchParams) {
          await fetchTotalPayment(searchParams).then((res) => {
            this.setState({
              totalReceiptsInfo: res.data,
            });
          });
        }
      } finally {
        return Promise.resolve().finally(() => {
          this.setStore({
            totalReceiptsLoading: false,
          });
        });
      }
    };
    getTotalRefund = async (
      collectDateRange: PaymentCollectStateType['collectDateRange'] = this.state
        .collectDateRange,
    ) => {
      const searchParams = this.getRangeDate(collectDateRange);
      try {
        if (searchParams) {
          await fetchTotalRefund(searchParams).then((res) => {
            this.setState({
              totalRefundInfo: res.data,
            });
          });
        }
      } finally {
        return Promise.resolve().finally(() => {
          this.setStore({
            totalRefundLoading: false,
          });
        });
      }
    };
    getInitData = (
      collectDateRange: PaymentCollectStateType['collectDateRange'] = this.state
        .collectDateRange,
    ) => {
      this.getPaymentSurvey(collectDateRange);
      this.getTotalPayment(collectDateRange);
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
        <PaymentCollectContext.Provider value={contextValue}>
          <Comp {...contextValue} />
        </PaymentCollectContext.Provider>
      );
    }
  };
};

export default paymentCollectContextHoc;
