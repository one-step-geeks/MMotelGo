import React, { useMemo, useRef, useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { useIntl } from 'umi';
import {
  getChannelOrderList,
  pullChannelOrder,
  queryChannels,
  syncChannel,
} from '@/services/ChannelController';
import { ProFormInstance } from '@ant-design/pro-form';
import { useOrderDetailDrawer } from '../../Order/components/OrderDetailDrawer';
import OrderFormDrawer from '../../Order/components/OrderFormDrawer';
import { Button, Form } from 'antd';

const TradeManage: React.FC = () => {
  const intl = useIntl();
  const drawerFormRef = useRef<ProFormInstance>();
  const [tableForm] = Form.useForm();
  const [orderId, setOrderId] = useState<number | undefined>();
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const { OrderDetailDrawer, openOrderDetailDrawer } = useOrderDetailDrawer(
    () => {
      setEditDrawerVisible(true);
    },
  );
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
      {
        title: intl.formatMessage({ id: '渠道来源' }),
        hideInTable: true,
        dataIndex: 'channelIds',
        valueType: 'select',
        fieldProps: {
          mode: 'multiple',
        },
        request: () => {
          return queryChannels().then((res) => {
            return res.data.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          });
        },
      },
      {
        title: intl.formatMessage({ id: '邮箱' }),
        hideInTable: true,
        dataIndex: 'emailAddr',
      },
      // {
      //   title: intl.formatMessage({ id: '序号' }),
      //   search: false,
      // },
      {
        title: intl.formatMessage({ id: '渠道订单号' }),
        search: false,
        dataIndex: 'channelOrderNo',
        render: (_, record) => {
          return (
            <Button
              type="link"
              onClick={() => {
                if (record.id) {
                  setOrderId(record.id);
                  openOrderDetailDrawer(record.id);
                }
              }}
            >
              {record.channelOrderNo || intl.formatMessage({ id: '无' })}
            </Button>
          );
        },
      },
      {
        title: intl.formatMessage({ id: '渠道来源' }),
        dataIndex: 'channelName',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '获取时间' }),
        dataIndex: 'createTime',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '邮箱' }),
        dataIndex: 'emailAddr',
        search: false,
      },

      {
        title: intl.formatMessage({ id: '邮件标题' }),
        dataIndex: 'emailSubject',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '操作' }),
        search: false,
        render: (_, record) => {
          return (
            <Button
              type="link"
              onClick={() => {
                syncChannel(record.id);
              }}
            >
              {intl.formatMessage({ id: '同步' })}
            </Button>
          );
        },
      },
      // {
      //   title: intl.formatMessage({ id: '邮件链接' }),
      //   dataIndex: 'emailLink',
      //   search: false,
      // },
    ];
  }, []);
  return (
    <>
      {OrderDetailDrawer}

      <OrderFormDrawer
        visible={editDrawerVisible}
        onVisibleChange={(value) => setEditDrawerVisible(value)}
        id={orderId}
        onSubmited={() => {
          drawerFormRef.current?.submit();
          setEditDrawerVisible(false);
          setOrderId(undefined);
        }}
      />
      <ProTable
        scroll={{ x: 'max-content' }}
        columns={columns}
        toolbar={{
          settings: [],
          actions: [
            <Button
              type="primary"
              onClick={() => {
                const params = tableForm.getFieldsValue();
                const {
                  date = [],
                  current,
                  pageSize,
                  channelOrderNo,
                  channelIds,
                  emailAddr,
                } = params;
                const [startDate, endDate] = date || [];
                const channelIdList = (channelIds || []).map(
                  (channelId: any) => {
                    return {
                      channelId,
                    };
                  },
                );
                return pullChannelOrder({
                  pageNum: current!,
                  emailAddr,
                  channelOrderNo,
                  pageSize: pageSize!,
                  channelIdList,
                  startDate,
                  endDate,
                });
              }}
            >
              手动拉取订单
            </Button>,
          ],
        }}
        request={async (params, sort, filter) => {
          const {
            date = [],
            current,
            pageSize,
            channelOrderNo,
            channelIds,
            emailAddr,
          } = params;
          const [startDate, endDate] = date || [];
          const channelIdList = (channelIds || []).map((channelId: any) => {
            return {
              channelId,
            };
          });
          return getChannelOrderList({
            pageNum: current!,
            emailAddr,
            channelOrderNo,
            pageSize: pageSize!,
            channelIdList,
            startDate,
            endDate,
          });
        }}
      />
    </>
  );
};

export default TradeManage;
