import React, { useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';
import services from '@/services';
import { bufferDownload } from '@/utils';

const SettingPriceChangeLog: React.FC = () => {
  const intl = useIntl();
  const ref = useRef<ProFormInstance>();

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
      request: async () => {
        const { data } = await services.AccountController.getStoreAccountList();
        return (
          data?.map((item) => ({
            label: item.nickName,
            value: item.id,
          })) || []
        );
      },
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
      valueType: 'dateRange',
      render: (_, record) => {
        return moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  const handleExport = async () => {
    const params = await ref.current?.getFieldsValue();
    const buffer = await services.SettingController.exportRoomPriceModifyRecord(
      {
        roomTypeId: params.roomTypeId,
        operatorId: params.operator,
        priceStartDate: params?.priceDate?.[0],
        priceEndDate: params?.priceDate?.[1],
        updateStartDate: params?.updateTime?.[0],
        updateEndDate: params?.updateTime?.[1],
      },
    );
    bufferDownload(buffer, `改价记录.xlsx`);
    message.success('下载成功');
  };

  return (
    <ProTable
      scroll={{ x: 'scroll' }}
      formRef={ref}
      columns={columns}
      options={false}
      request={async (params) => {
        const { data } = await services.SettingController.getPriceChangeLog({
          current: params.current,
          pageSize: params.pageSize,
          roomTypeId: params.roomTypeId,
          operatorId: params.operator,
          priceStartDate: params?.priceDate?.[0],
          priceEndDate: params?.priceDate?.[1],
          updateStartDate: params?.updateTime?.[0],
          updateEndDate: params?.updateTime?.[1],
        });
        const { list, totalCount } = data;
        return {
          data: list,
          total: totalCount,
        };
      }}
      rowKey="id"
      toolBarRender={(action) => [
        <Button type="primary" onClick={handleExport}>
          {intl.formatMessage({ id: '导出' })}
        </Button>,
      ]}
    ></ProTable>
  );
};

export default SettingPriceChangeLog;
