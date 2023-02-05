import React, { useContext } from 'react';
import { TradeStatisticContext } from '../../context';
import PaymentDetailTable from '@/components/PaymentDetail';
import './style.less';

const PaymentDetail: React.FC = () => {
  const { store, paymentDetailActionRef } = useContext(TradeStatisticContext);
  const { collectDateRange } = store;
  return (
    <PaymentDetailTable
      paymentDetailActionRef={paymentDetailActionRef}
      collectDateRange={collectDateRange}
    />
  );
};

export default PaymentDetail;
