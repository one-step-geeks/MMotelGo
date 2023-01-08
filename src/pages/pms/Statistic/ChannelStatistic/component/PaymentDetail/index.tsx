import React, { useContext, useMemo } from 'react';
import { useIntl } from 'umi';

import { ChannelStatisticContext } from '../../context';
import { ProColumns } from '@ant-design/pro-table';
import { transformRangeDate } from '@/utils';
import PaymentDetailTable from '@/components/PaymentDetail';
import './style.less';

const PaymentDetail: React.FC = () => {
  // const intl = useIntl();
  const { store, paymentDetailActionRef } = useContext(ChannelStatisticContext);
  const { collectDateRange } = store;
  // const columns = useMemo<ProColumns[]>(() => {
  //   return [
  //     {
  //       title: intl.formatMessage({ id: '渠道' }),
  //       fixed: 'left',
  //       width: 100,
  //     },
  //     {
  //       title: intl.formatMessage({ id: '合计' }),
  //       fixed: 'left',
  //       width: 100,
  //     },
  //   ];
  // }, [collectDateRange]);
  return (
    <PaymentDetailTable
      paymentDetailActionRef={paymentDetailActionRef}
      collectDateRange={collectDateRange}
    />
  );
};

export default PaymentDetail;
