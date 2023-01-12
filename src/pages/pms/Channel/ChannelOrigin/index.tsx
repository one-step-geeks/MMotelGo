import React, { useMemo } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { useIntl } from 'umi';
import { getChannelOrderList } from '@/services/ChannelController';

const TradeManage: React.FC = () => {
  const intl = useIntl();
  const columns = useMemo<ProColumns[]>(() => {
    return [
      {
        title: intl.formatMessage({ id: '渠道订单号' }),
        dataIndex: 'channelOrderNo',
        hideInTable: true,
      },
      {
        title: intl.formatMessage({ id: '获取时间' }),
        hideInTable: true,
        valueType: 'dateRange',
        dataIndex: 'date',
      },
      // {
      //   title: intl.formatMessage({ id: '渠道来源' }),
      //   hideInTable: true,
      //   dataIndex: 'channelOrigin',
      //   valueType: 'select',
      // },
      // {
      //   title: intl.formatMessage({ id: '邮箱' }),
      //   hideInTable: true,
      //   dataIndex: 'channelMail',
      //   valueType: 'select',
      // },
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
  return (
    <ProTable
      scroll={{ x: 'max-content' }}
      columns={columns}
      request={async (params, sort, filter) => {
        const { date = [], current, pageSize, channelOrderNo } = params;
        const [startDate, endDate] = date;
        return getChannelOrderList({
          pageNum: current!,
          channelOrderNo,
          pageSize: pageSize!,
          startDate,
          endDate,
        });
      }}
    />
  );
};

export default TradeManage;
