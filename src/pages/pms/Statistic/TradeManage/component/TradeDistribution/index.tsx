import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';
import CommonPie from '@/components/CommonPie';
import { getTradeDistributions } from '@/services/StatisticController';
import { TradeStatisticContext } from '../../context';

import './style.less';

const TotalReceipts: React.FC = () => {
  const intl = useIntl();
  const { store } = useContext(TradeStatisticContext);
  const { collectDateRange } = store;
  const [state, setState] = useState<
    Array<{
      type: string;
      value: number;
    }>
  >([]);

  useEffect(() => {
    const couples = collectDateRange!.map((m) => m?.format('YYYY-MM-DD'));
    getTradeDistributions({
      startTime: couples[0] as string,
      endTime: couples[1] as string,
    }).then((res) => {
      setState(
        res.data?.list?.map(({ name, amount }) => ({
          type: name,
          value: amount,
        })),
      );
    });
  }, [collectDateRange]);

  return (
    <div className="trade-statistic-disribution">
      <CommonCard title={intl.formatMessage({ id: '营业汇总统计' })}>
        <CommonPie dataSource={state} />
      </CommonCard>
    </div>
  );
};

export default TotalReceipts;
