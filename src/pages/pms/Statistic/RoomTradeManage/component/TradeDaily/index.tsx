import React, { useContext, useEffect, useState } from 'react';
import { Tabs, Spin } from 'antd';
import { useIntl } from 'umi';
import { Line } from '@ant-design/plots';
import CommonCard from '@/components/CommonCard';
import { getRoomBusinessLineChart } from '@/services/StatisticController';
import type { TradeDaily } from '@/services/StatisticController';
import { TradeStatisticContext } from '../../context';
import { getRangeDate } from '@/utils';
import './style.less';
import Big from 'big.js';

const TotalReceipts: React.FC = () => {
  const intl = useIntl();
  const [activeType, setActiveType] = useState('1');
  const { store } = useContext(TradeStatisticContext);
  const { collectDateRange } = store;
  const [state, setState] = useState<Array<TradeDaily>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setState([]);
    getRoomBusinessLineChart({
      type: activeType,
      ...getRangeDate(collectDateRange),
    })
      .then((res) => {
        res.data.forEach((item) => {
          item.value = new Big(item.value.replace('%', '')).toNumber();
        });
        setState(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [collectDateRange, activeType]);

  return (
    <div className="trade-statistic-daily">
      <CommonCard title={intl.formatMessage({ id: '每日营业统计' })}>
        <Tabs
          onChange={(e) => {
            setActiveType(e);
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
        <Spin spinning={loading}>
          <div className="trade-statistic-chart-wrapper">
            <Line
              data={state}
              xField="date"
              meta={{
                value: {
                  formatter: (value) => {
                    if (activeType === '2') {
                      return new Big(value).toFixed(2) + '%';
                    }
                    return new Big(value).toFixed(2);
                  },
                },
              }}
              smooth={true}
              yField="value"
            ></Line>
          </div>
        </Spin>
      </CommonCard>
    </div>
  );
};

export default TotalReceipts;
