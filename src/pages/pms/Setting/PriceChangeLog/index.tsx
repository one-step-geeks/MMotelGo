import React from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import { useIntl } from 'umi';
import services from '@/services';

const SettingPriceChangeLog: React.FC = () => {
  const intl = useIntl();

  const columns: ProColumns<SETTING.PriceLog>[] = [
    {
      title: intl.formatMessage({ id: '本地房型' }),
      width: 120,
      dataIndex: 'roomTypeName',
      ellipsis: true,
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
      valueType: 'date',
    },
    {
      title: intl.formatMessage({ id: '修改前价格' }),
      width: 120,
      dataIndex: 'beforePrice',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: '修改后价格' }),
      width: 120,
      dataIndex: 'afterPrice',
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
      ellipsis: true,
      valueEnum: {
        1: intl.formatMessage({ id: '成功' }),
        0: intl.formatMessage({ id: '失败' }),
      },
    },
    {
      title: intl.formatMessage({ id: '操作时间' }),
      width: 180,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
  ];
  return (
    <ProTable
      scroll={{ x: 'scroll' }}
      columns={columns}
      options={false}
      search={false}
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
          导出
        </Button>,
      ]}
    ></ProTable>
  );
};

export default SettingPriceChangeLog;
