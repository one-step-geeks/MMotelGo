import React from 'react';
import { useIntl } from 'umi';
import { Alert } from 'antd';
import PaymentRecordTable from './component/PaymentRecordTable';
import paymentRecordContextHoc from './context';

const PaymentRecord: React.FC = () => {
  const intl = useIntl();

  return (
    <div className="payment-manage-record">
      <Alert
        message={intl.formatMessage({ id: '收款记录不含记一笔收款' })}
        type="warning"
      />
      <PaymentRecordTable />
    </div>
  );
};

export default paymentRecordContextHoc(PaymentRecord);
