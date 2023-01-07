import { Alert, DatePicker, PageHeader, Tooltip, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import paymentCollectContextHoc from './context';
import moment from 'moment';
import { PaymentCollectContextType } from './interface';
import './style.less';
import PaymentSituationCard from './component/PaymentSituationCard';
import TotalReceipts from './component/TotalReceipts';
import TotalRefund from './component/TotalRefund';
import PaymentDetail from './component/PaymentDetail';

const PaymentCollect: React.FC<PaymentCollectContextType> = (props) => {
  const { store, setStore } = props;
  const { collectDateRange } = store;
  const intl = useIntl();
  return (
    <div className="payment-manage-collect">
      <Alert
        message={intl.formatMessage({ id: '收款记录不含记一笔收款' })}
        type="warning"
      />
      <div className="payment-manage-collect-data-piker">
        <DatePicker.RangePicker
          value={collectDateRange}
          onChange={(date) => setStore({ collectDateRange: date })}
          disabledDate={(date) => {
            return date.isAfter(moment(), 'day');
          }}
        />
      </div>
      <PaymentSituationCard />
      <div className="payment-manage-collect-receipts">
        <TotalReceipts />
        <TotalRefund />
      </div>
      <PaymentDetail />
    </div>
  );
};

export default paymentCollectContextHoc(PaymentCollect);
