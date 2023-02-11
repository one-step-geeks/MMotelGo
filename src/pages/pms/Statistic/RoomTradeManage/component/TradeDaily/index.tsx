import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useIntl } from 'umi';
import { Line } from '@ant-design/plots';
import CommonCard from '@/components/CommonCard';
import { getRoomBusinessLineChart } from '@/services/StatisticController';
import type { TradeDaily } from '@/services/StatisticController';
import { TradeStatisticContext } from '../../context';
import { getRangeDate } from '@/utils';
import './style.less';

const TotalReceipts: React.FC = () => {
  const intl = useIntl();
  const [activeType, setActiveType] = useState(1);
  const { store } = useContext(TradeStatisticContext);
  const { collectDateRange } = store;
  const [state, setState] = useState<Array<TradeDaily>>([]);

  useEffect(() => {
    getRoomBusinessLineChart({
      type: activeType,
      ...getRangeDate(collectDateRange),
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
            tab={intl.formatMessage({ id: '平均房价' })}
            key="1"
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({ id: '入住率' })}
            key="2"
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({ id: '平均客房收益' })}
            key="3"
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({ id: '间夜数' })}
            key="4"
          ></Tabs.TabPane>
        </Tabs>
        <div className="trade-statistic-chart-wrapper">
          <Line data={state} xField="date" smooth={true} yField="value"></Line>
        </div>
      </CommonCard>
    </div>
  );
};

export default TotalReceipts;
