import React, { useContext } from 'react';

import { PaymentCollectContext } from '../../context';
import ReceiptAndPaymentDetail from '@/components/ReceiptAndPaymentDetail';
import './style.less';

const PaymentDetail: React.FC = () => {
  const { store, paymentDetailActionRef } = useContext(PaymentCollectContext);
  const { collectDateRange } = store;

  return (
    <ReceiptAndPaymentDetail
      paymentDetailActionRef={paymentDetailActionRef}
      collectDateRange={collectDateRange}
    />
  );
};

export default PaymentDetail;
