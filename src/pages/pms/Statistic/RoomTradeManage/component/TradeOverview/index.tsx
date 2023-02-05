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
      <CommonCard
        title={intl.formatMessage({ id: '营业额概况' })}
        tooltip={
          <div>
            <div>
              {intl.formatMessage({
                id: 'a.数据统计时，按每条消费记录的发生时间进行统计，而不是您操作录入的时间',
              })}
            </div>
            <div>
              {intl.formatMessage({
                id: 'b.统计所有订单内有效的记录，您删除的记录，取消的房费将不被统计',
              })}
            </div>
            <div>
              {intl.formatMessage({
                id: 'c.本统计与收款无关，记一笔数据不统计',
              })}
            </div>
          </div>
        }
      >
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
