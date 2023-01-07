import React, { useMemo } from 'react';
import { PaymentTabEnum } from './constants';
import PaymentCollect from './components/PaymentCollect';
import PaymentRecord from './components/PaymentRecord';
import { Tabs } from 'antd';

const PaymentManage: React.FC = () => {
  const items = useMemo(
    () => [
      {
        label: '收款汇总',
        key: PaymentTabEnum.COLLECT,
        children: <PaymentCollect />,
      },
      {
        label: '收款记录',
        key: PaymentTabEnum.RECORD,
        children: <PaymentRecord />,
      },
    ],
    [],
  );
  return (
    <div className="payment-manage">
      <Tabs items={items} />
    </div>
  );
};

export default PaymentManage;
