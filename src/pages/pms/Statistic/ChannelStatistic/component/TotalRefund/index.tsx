import React from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';

import './style.less';
import CommonPie from '@/components/CommonPie';

const TotalRefund: React.FC = () => {
  const intl = useIntl();

  return (
    <div className="channel-statistic-total-refund">
      <CommonCard title={intl.formatMessage({ id: '总退款' })}>
        <div className="channel-statistic-total-refund-card-warp">
          <CommonPie dataSource={[{ type: '支付宝', value: 100 }]} />
        </div>
      </CommonCard>
    </div>
  );
};

export default TotalRefund;
