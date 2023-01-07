import React, { useContext } from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';

import './style.less';
import CommonPie from '@/components/CommonPie';
import { PaymentCollectContext } from '../../context';

const TotalReceipts: React.FC = () => {
  const intl = useIntl();
  const { store } = useContext(PaymentCollectContext);
  const { totalReceiptsInfo, totalReceiptsLoading } = store;
  const { totalAmount, paymentAmountList = [] } = totalReceiptsInfo || {};
  return (
    <div className="total-receipts">
      <CommonCard
        loading={totalReceiptsLoading}
        title={intl.formatMessage({ id: '总收款' })}
      >
        <div className="total-receipts-card-warp">
          <CommonPie
            dataSource={paymentAmountList.map((item) => {
              return {
                type: item.paymentName,
                value: item.amount,
              };
            })}
          />
        </div>
      </CommonCard>
    </div>
  );
};

export default TotalReceipts;
