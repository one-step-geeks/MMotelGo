import React from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';

import './style.less';
import CommonPie from '@/components/CommonPie';

const TotalReceipts: React.FC = () => {
  const intl = useIntl();

  return (
    <div className="channel-statistic-total-receipts">
      <CommonCard title={intl.formatMessage({ id: '总收款' })}>
        <div className="channel-statistic-total-receipts-card-warp">
          <CommonPie dataSource={[{ type: '支付宝', value: 100 }]} />
        </div>
      </CommonCard>
    </div>
  );
};

export default TotalReceipts;
