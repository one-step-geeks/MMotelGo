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
import { isEmpty } from 'lodash';
import { getRangeDate } from '@/utils';
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
      this.setStore(
        {
          collectDateRange,
        },
        () => {
          this.getInitData(collectDateRange);
        },
      );
    };

    getPaymentSurvey = async (
      collectDateRange: PaymentCollectStateType['collectDateRange'] = this.state
        .collectDateRange,
    ) => {
      const searchParams = getRangeDate(collectDateRange);
      try {
        if (!isEmpty(searchParams)) {
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
      const searchParams = getRangeDate(collectDateRange);
      try {
        if (!isEmpty(searchParams)) {
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
      const searchParams = getRangeDate(collectDateRange);
      try {
        if (!isEmpty(searchParams)) {
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
      this.getTotalRefund(collectDateRange);
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
        <PaymentCollectContext.Provider value={contextValue}>
          <Comp {...contextValue} />
        </PaymentCollectContext.Provider>
      );
    }
  };
};

export default paymentCollectContextHoc;
