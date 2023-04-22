import React, { useMemo } from 'react';
import { PaymentTabEnum } from './constants';
import PaymentCollect from './components/PaymentCollect';
import PaymentRecord from './components/PaymentRecord';
import { Tabs } from 'antd';
import { useIntl } from 'umi';

const PaymentManage: React.FC = () => {
  const intl = useIntl();
  const items = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: '收款汇总' }),
        key: PaymentTabEnum.COLLECT,
        children: <PaymentCollect />,
      },
      {
        label: intl.formatMessage({ id: '收款记录' }),
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
