import React, { useMemo } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { useIntl } from 'umi';

const TradeManage: React.FC = () => {
  const intl = useIntl();
  const columns = useMemo<ProColumns[]>(() => {
    return [
      {
        title: intl.formatMessage({ id: '渠道订单号' }),
        hideInTable: true,
      },
      {
        title: intl.formatMessage({ id: '获取时间' }),
        hideInTable: true,
        valueType: 'dateRange',
        dataIndex: 'date',
      },
      {
        title: intl.formatMessage({ id: '渠道来源' }),
        hideInTable: true,
        valueType: 'select',
      },
      {
        title: intl.formatMessage({ id: '邮箱' }),
        hideInTable: true,
        valueType: 'select',
      },
      {
        title: intl.formatMessage({ id: '序号' }),
        search: false,
      },
      {
        title: intl.formatMessage({ id: '渠道来源' }),
        search: false,
      },
      {
        title: intl.formatMessage({ id: '获取时间' }),
        search: false,
      },
      {
        title: intl.formatMessage({ id: '获取邮箱' }),
        search: false,
      },
      {
        title: intl.formatMessage({ id: '渠道订单号' }),
        search: false,
      },
      {
        title: intl.formatMessage({ id: '邮件标题' }),
        search: false,
      },
    ];
  }, []);
  return <ProTable scroll={{ x: 'max-content' }} columns={columns} />;
};

export default TradeManage;
