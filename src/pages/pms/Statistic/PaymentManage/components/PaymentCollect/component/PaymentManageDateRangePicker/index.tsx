import { Alert, DatePicker, PageHeader, Tooltip, Typography } from 'antd';
import React, { useContext } from 'react';
import { useIntl } from 'umi';
import moment from 'moment';
import { PaymentCollectContext } from '../../context';

const PaymentManageDateRangePicker: React.FC = () => {
  const { store, setCollectDateRange } = useContext(PaymentCollectContext);
  const { collectDateRange } = store;
  return (
    <div className="payment-manage-collect-data-piker">
      <DatePicker.RangePicker
        allowClear={false}
        value={collectDateRange}
        onChange={setCollectDateRange}
        disabledDate={(date) => {
          return date.isAfter(moment(), 'day');
        }}
      />
    </div>
  );
};

export default PaymentManageDateRangePicker;
