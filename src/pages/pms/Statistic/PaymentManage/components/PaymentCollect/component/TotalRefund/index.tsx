import React, { useContext } from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';

import './style.less';
import CommonPie from '@/components/CommonPie';
import { PaymentCollectContext } from '../../context';

const TotalRefund: React.FC = () => {
  const intl = useIntl();
  const { store } = useContext(PaymentCollectContext);
  const { totalRefundInfo, totalRefundLoading } = store;
  return (
    <div className="total-refund">
      <CommonCard
        loading={totalRefundLoading}
        title={intl.formatMessage({ id: '总退款' })}
      >
        <div className="total-refund-card-warp">
          <CommonPie />
        </div>
      </CommonCard>
    </div>
  );
};

export default TotalRefund;
