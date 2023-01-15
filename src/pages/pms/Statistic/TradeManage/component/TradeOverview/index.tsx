import { useContext, useState, useEffect } from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';
import { TradeStatisticContext } from '../../context';
import { getTradeStatistics } from '@/services/StatisticController';
import {
  HomeOutlined,
  StrikethroughOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import { Divider } from 'antd';
import type { TradeStatistics } from '@/services/StatisticController';

import './style.less';

const TradeOverview: React.FC = () => {
  const intl = useIntl();
  const { store } = useContext(TradeStatisticContext);
  const { collectDateRange } = store;
  const [state, setState] = useState<TradeStatistics>();

  useEffect(() => {
    const couples = collectDateRange!.map((m) => m?.format('YYYY-MM-DD'));
    getTradeStatistics({
      startTime: couples[0] as string,
      endTime: couples[1] as string,
    }).then((res) => {
      setState(res.data);
    });
  }, [collectDateRange]);

  const styledDivider = (
    <Divider
      style={{
        height: '60px',
        top: '30px',
      }}
      type="vertical"
    />
  );

  return (
    <div className="trade-overview">
      <CommonCard title={intl.formatMessage({ id: '营业额概况' })}>
        <div className="overview-columns">
          <div className="overview-column">
            <div className="overview-column-type">
              {intl.formatMessage({ id: '住宿总营业额' })}
            </div>
            <div className="overview-column-fee">
              {intl.formatMessage({ id: '¥' })}
              {state?.total}
            </div>
            <div className="overview-column-rate">
              {intl.formatMessage({ id: '日环比' })}&nbsp;
              {(state?.dayPercent || 0) * 100}%
            </div>
          </div>
          {styledDivider}
          <div className="overview-column">
            <HomeOutlined></HomeOutlined>
            <div className="overview-column-stack">
              <div className="overview-column-type">
                {intl.formatMessage({ id: '房费' })}
              </div>
              <div className="overview-column-fee">
                {intl.formatMessage({ id: '¥' })}
                {state?.roomFees}
              </div>
              <div className="overview-column-rate">
                {intl.formatMessage({ id: '占比' })}&nbsp;
                {(state?.roomFeesPercent || 0) * 100}%
              </div>
            </div>
          </div>
          {styledDivider}
          <div className="overview-column">
            <StrikethroughOutlined />
            <div className="overview-column-stack">
              <div className="overview-column-type">
                {intl.formatMessage({ id: '违约金' })}
              </div>
              <div className="overview-column-fee">
                {intl.formatMessage({ id: '¥' })}
                {state?.penalSum}
              </div>
              <div className="overview-column-rate">
                {intl.formatMessage({ id: '占比' })}&nbsp;
                {(state?.penalSumPercent || 0) * 100}%
              </div>
            </div>
          </div>
          {styledDivider}
          <div className="overview-column">
            <FileDoneOutlined />
            <div className="overview-column-stack">
              <div className="overview-column-type">
                {intl.formatMessage({ id: '客房消费' })}
              </div>
              <div className="overview-column-fee">
                {intl.formatMessage({ id: '¥' })}
                {state?.consume}
              </div>
              <div className="overview-column-rate">
                {intl.formatMessage({ id: '占比' })}&nbsp;
                {(state?.consumePercent || 0) * 100}%
              </div>
            </div>
          </div>
        </div>
      </CommonCard>
    </div>
  );
};

export default TradeOverview;
