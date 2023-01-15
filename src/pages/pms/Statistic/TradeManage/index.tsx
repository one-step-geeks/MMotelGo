import {
  Alert,
  Space,
  DatePicker,
  PageHeader,
  Tooltip,
  Typography,
} from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import tradeStatisticContextHoc from './context';
import moment from 'moment';
import { TradeStatisticContextType } from './interface';
import TradeOverview from './component/TradeOverview';
import TradeDistribution from './component/TradeDistribution';
import TradeDaily from './component/TradeDaily';
import PaymentDetail from './component/PaymentDetail';
import './style.less';

const TradeStatistic: React.FC<TradeStatisticContextType> = (props) => {
  const { store, setCollectDateRange } = props;
  const { collectDateRange } = store;
  const intl = useIntl();
  return (
    <div className="trade-statistic">
      <div className="trade-statistic-data-piker">
        <DatePicker.RangePicker
          value={collectDateRange}
          onChange={setCollectDateRange}
          disabledDate={(date) => {
            return date.isAfter(moment(), 'day');
          }}
        />
      </div>
      <div className="trade-statistic-receipts">
        <TradeOverview />
        <div className="trade-two-columns">
          <TradeDistribution />
          <TradeDaily />
        </div>
      </div>
      <PaymentDetail />
    </div>
  );
};

export default tradeStatisticContextHoc(TradeStatistic);
