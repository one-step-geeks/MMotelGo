import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useIntl } from 'umi';
import { Line } from '@ant-design/plots';
import CommonCard from '@/components/CommonCard';
import { getTradeDaily } from '@/services/StatisticController';
import type { TradeDaily } from '@/services/StatisticController';
import { TradeStatisticContext } from '../../context';

import './style.less';

const TotalReceipts: React.FC = () => {
  const intl = useIntl();
  const [activeType, setActiveType] = useState(1);
  const { store } = useContext(TradeStatisticContext);
  const { collectDateRange } = store;
  const [state, setState] = useState<Array<TradeDaily>>([]);

  useEffect(() => {
    const couples = collectDateRange!.map((m) => m?.format('YYYY-MM-DD'));
    getTradeDaily({
      type: activeType,
      startTime: couples[0] as string,
      endTime: couples[1] as string,
    }).then((res) => {
      setState(res.data);
    });
  }, [collectDateRange, activeType]);

  return (
    <div className="trade-statistic-daily">
      <CommonCard title={intl.formatMessage({ id: '每日营业统计' })}>
        <Tabs
          onChange={(e) => {
            setActiveType(Number(e));
          }}
        >
          <Tabs.TabPane
            style={{
              padding: '0 24px',
            }}
            tab={intl.formatMessage({ id: '住宿总营业额' })}
            key="1"
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({ id: '违约金' })}
            key="2"
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({ id: '客房消费' })}
            key="3"
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({ id: '房费' })}
            key="4"
          ></Tabs.TabPane>
        </Tabs>
        <Line height={190} data={state} xField="date" yField="value"></Line>
      </CommonCard>
    </div>
  );
};

export default TotalReceipts;
