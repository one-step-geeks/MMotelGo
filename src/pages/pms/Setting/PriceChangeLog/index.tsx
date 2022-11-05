import React from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';
import services from '@/services';

const SettingPriceChangeLog: React.FC = () => {
  const intl = useIntl();

  const columns: ProColumns<SETTING.PriceLog>[] = [
    {
      title: intl.formatMessage({ id: '本地房型' }),
      width: 120,
      dataIndex: 'roomTypeId',
      ellipsis: true,
      request: async () => {
        const { data } = await services.SettingController.getRoomTypeList({
          current: 1,
          pageSize: 999,
        });
        const { list } = data;
        return (
          list?.map((item) => ({
            label: item.roomTypeName,
            value: item.id,
          })) || []
        );
      },
      render: (_, record) => {
        return record.roomTypeName;
      },
    },
    {
      title: intl.formatMessage({ id: '价格渠道' }),
      width: 120,
      dataIndex: 'priceType',
      ellipsis: true,
      valueEnum: {
        1: intl.formatMessage({ id: '门市价' }),
      },
    },
    {
      title: intl.formatMessage({ id: '价格日期' }),
      width: 120,
      dataIndex: 'priceDate',
      ellipsis: true,
      valueType: 'dateRange',
      render: (_, record) => {
        return moment(record.priceDate).format('YYYY-MM-DD');
      },
    },
    {
      title: intl.formatMessage({ id: '修改前价格' }),
      width: 120,
      dataIndex: 'beforePrice',
      search: false,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: '修改后价格' }),
      width: 120,
      dataIndex: 'afterPrice',
      search: false,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: '操作人' }),
      width: 100,
      dataIndex: 'operator',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: '改价状态' }),
      width: 100,
      dataIndex: 'status',
      search: false,
      ellipsis: true,
      valueEnum: {
        1: { text: intl.formatMessage({ id: '成功' }), status: 'success' },
        0: { text: intl.formatMessage({ id: '失败' }), status: 'error' },
      },
    },
    {
      title: intl.formatMessage({ id: '操作时间' }),
      width: 180,
      dataIndex: 'updateTime',
      valueType: 'dateTimeRange',
      render: (_, record) => {
        return moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];
  return (
    <ProTable
      scroll={{ x: 'scroll' }}
      columns={columns}
      options={false}
      request={async (params) => {
        const { data } = await services.SettingController.getPriceChangeLog(
          params,
        );
        const { list, totalCount } = data;
        return {
          data: list,
          total: totalCount,
        };
      }}
      rowKey="id"
      toolBarRender={(action) => [
        <Button type="primary" onClick={() => {}}>
          {intl.formatMessage({ id: '导出' })}
        </Button>,
      ]}
    ></ProTable>
  );
};

export default SettingPriceChangeLog;
