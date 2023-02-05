import { DatePicker } from 'antd';
import React from 'react';
import moment from 'moment';
import tradeStatisticContextHoc from './context';
import { TradeStatisticContextType } from './interface';
import TradeOverview from './component/TradeOverview';
import TradeDistribution from './component/TradeDistribution';
import TradeDaily from './component/TradeDaily';
import PaymentDetail from './component/PaymentDetail';

import './style.less';

const RangePicker: any = DatePicker.RangePicker;

const TradeStatistic: React.FC<TradeStatisticContextType> = (props) => {
  const { store, setCollectDateRange } = props;
  const { collectDateRange } = store;

  return (
    <div className="trade-statistic">
      <div className="trade-statistic-date-piker">
        <RangePicker
          value={collectDateRange}
          onChange={setCollectDateRange}
          disabledDate={(date: moment.Moment) => {
            return date.isAfter(moment(), 'day');
          }}
          allowClear={false}
        />
      </div>

      <TradeOverview />

      <div className="trade-statistic-columns">
        <TradeDistribution />
        <TradeDaily />
      </div>

      <PaymentDetail />
    </div>
  );
};

export default tradeStatisticContextHoc(TradeStatistic);
