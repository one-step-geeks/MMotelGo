import React, { useMemo } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { useIntl } from 'umi';

const TradeManage: React.FC = () => {
  const intl = useIntl();
  const columns = useMemo<ProColumns[]>(() => {
    return [
      {
        title: intl.formatMessage({ id: '序号' }),
      },
      {
        title: intl.formatMessage({ id: '渠道来源' }),
      },
      {
        title: intl.formatMessage({ id: '获取时间' }),
      },
      {
        title: intl.formatMessage({ id: '获取邮箱' }),
      },
      {
        title: intl.formatMessage({ id: '渠道订单号' }),
      },
      {
        title: intl.formatMessage({ id: '邮件标题' }),
      },
    ];
  }, []);
  return <ProTable columns={columns} />;
};

export default TradeManage;
