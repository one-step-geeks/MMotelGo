import { Alert, DatePicker, PageHeader, Tooltip, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import channelStatisticContextHoc from './context';
import moment from 'moment';
import { ChannelStatisticContextType } from './interface';
import './style.less';
import TotalReceipts from './component/TotalReceipts';
import TotalRefund from './component/TotalRefund';
import PaymentDetail from './component/PaymentDetail';

const ChannelStatistic: React.FC<ChannelStatisticContextType> = (props) => {
  const { store, setCollectDateRange } = props;
  const { collectDateRange } = store;
  const intl = useIntl();
  return (
    <div className="channel-statistic">
      {/* <Alert
        message={intl.formatMessage({ id: '收款记录不含记一笔收款' })}
        type="warning"
      /> */}
      <div className="channel-statistic-data-piker">
        <DatePicker.RangePicker
          value={collectDateRange}
          onChange={setCollectDateRange}
          disabledDate={(date) => {
            return date.isAfter(moment(), 'day');
          }}
        />
      </div>
      <div className="channel-statistic-receipts">
        <TotalReceipts />
        <TotalRefund />
      </div>
      <PaymentDetail />
    </div>
  );
};

export default channelStatisticContextHoc(ChannelStatistic);
