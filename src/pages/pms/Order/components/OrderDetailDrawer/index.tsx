import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Drawer, Table, message, Space, Tabs } from 'antd';
import services from '@/services';
import { useRequest } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import { ProCard } from '@ant-design/pro-components';
import './style.less';
import type { OperateData } from '@/services/OrderController';
import {
  OrderState,
  OperationType,
  OrderStateText,
} from '@/services/OrderController';
import moment from 'moment';
import { OrderStateOptions } from '@/services/OrderController';
import { useNoticeDrawer } from '../NoticeDrawer';
import { useConsumeDrawer } from '../ConsumeDrawer';
import { useOccupantDrawer } from '../PersonDrawer';
import { usePayOrRefundDrawer, payOrRefundOptions } from '../PayDrawer';
import { useOperateDrawer } from '../OperateDrawer';
import OperatinoLog from './OperationLog';

export function useOrderDetailDrawer(
  gotoEdit?: (data: ORDER.OrderBase) => void,
) {
  const [orderId, setOrderId] = useState<number | undefined>();
  const [visible, setVisible] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('orderDetail');

  const openOrderDetailDrawer = (orderId: number) => {
    setOrderId(orderId);
    setVisible(true);
    setActiveTabKey('orderDetail');
  };

  const { data: noticeList, run: queryNoticeList } = useRequest(
    () => {
      if (orderId) {
        return services.OrderController.queryNoticeList(orderId);
      }
      return Promise.resolve([]);
    },
    { refreshDeps: [orderId] },
  );
  const { data: consumeList, run: queryConsumeList } = useRequest(
    () => {
      if (orderId) {
        return services.OrderController.queryConsumeList(orderId);
      }
      return Promise.resolve({ data: [] });
    },
    { refreshDeps: [orderId] },
  );

  const { data: payOrRefundList, run: queryPayOrRefundList } = useRequest(
    () => {
      if (orderId) {
        return services.OrderController.queryPayOrRefundList(orderId);
      }
      return Promise.resolve({ data: [] });
    },
    { refreshDeps: [orderId] },
  );
  const { NoticeDrawer, openNoticeDrawer } = useNoticeDrawer(() => {
    queryNoticeList();
  });

  const { ConsumeDrawer, openConsumeDrawer } = useConsumeDrawer(() => {
    queryConsumeList();
    executeQuery();
  });

  const { OccupantDrawer, openOccupantDrawer } = useOccupantDrawer(() => {
    executeQuery();
  });

  const { PayOrRefundDrawer, openPayOrRefundDrawer } = usePayOrRefundDrawer(
    () => {
      queryPayOrRefundList();
      executeQuery();
    },
  );

  const { OperateDrawer, openOperateDrawer } = useOperateDrawer(() => {
    executeQuery();
  });

  const { data: channelList } = useRequest(() => {
    return services.ChannelController.queryChannels();
  });

  const { data, run: executeQuery } = useRequest(
    () => {
      if (orderId) {
        return services.OrderController.queryDetail(orderId);
      }
      return Promise.resolve();
    },
    {
      refreshDeps: [orderId],
    },
  );

  if (data && data.orderRoomList) {
    data.orderRoomList.forEach((d) => (d.key = d.roomId!));
  }

  const noticeColumns: ColumnsType<ORDER.OrderNotice> = [
    {
      title: '提醒时间',
      dataIndex: 'remindTime',
      align: 'center',
      key: 'remindTime',
      width: 185,
      render(value, record, index) {
        return moment(value).format('MM/DD/YYYY HH:mm');
      },
    },
    {
      title: '提醒内容',
      dataIndex: 'remark',
      key: 'remark',
      render(value) {
        return <div style={{ wordBreak: 'break-all' }}>{value}</div>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => {
              openNoticeDrawer(orderId as number, record);
            }}
          />
          <DeleteOutlined
            type="link"
            onClick={async () => {
              await services.OrderController.deleteNotice(record.id);
              queryNoticeList();
              message.success('删除成功');
            }}
          />
        </Space>
      ),
    },
  ];

  const consumeColumns: ColumnsType<ORDER.OrderConsume> = [
    {
      title: '消费项目',
      dataIndex: 'consumptionSetName',
      align: 'center',
      key: 'consumptionSetName',
    },
    {
      title: '消费金额',
      dataIndex: 'price',
      align: 'center',
      key: 'price',
      render(value, record, index) {
        return `A$ ${record.price * record.count}`;
      },
    },
    {
      title: '录入人',
      dataIndex: 'creator',
      align: 'center',
      key: 'creator',
    },
    {
      title: '消费日期',
      dataIndex: 'consumeDate',
      align: 'center',
      key: 'consumeDate',
      render(value, record, index) {
        return moment(value).format('MM/DD');
      },
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={async () => {
              await services.OrderController.deleteConsume(record.id);
              queryConsumeList();
              executeQuery();
              message.success('删除成功');
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const payOrRefundColumns: ColumnsType<ORDER.OrderPayOrRefund> = [
    {
      title: '项目',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render(value, record, index) {
        const option = payOrRefundOptions.find(
          (option) => option.value === value,
        );
        return option?.label;
      },
    },
    {
      title: '支付方式',
      align: 'center',
      dataIndex: 'feeConfigName',
      key: 'feeConfigName',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      align: 'center',
      key: 'amount',
      render(value, record, index) {
        return `A$ ${value}`;
      },
    },
    {
      title: '日期',
      dataIndex: 'feeDate',
      align: 'center',
      key: 'feeDate',
      render(value, record, index) {
        return moment(value).format('MM-DD');
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={async () => {
              await services.OrderController.deletePayOrRefund(record.id);
              queryPayOrRefundList();
              executeQuery();
              message.success('删除成功');
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const roomColumns: ColumnsType<ORDER.OrderRoom> = [
    {
      title: '入住日期',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      align: 'center',
      width: 112,
      render(value, record, index) {
        return moment(value).format('MM/DD/YYYY');
      },
    },
    {
      title: '房间号',
      width: 80,
      align: 'center',
      dataIndex: 'roomCode',
    },
    // {
    //   title: '间夜',
    //   width: 62,
    //   align: 'center',
    //   dataIndex: 'checkInDays',
    //   key: 'checkInDays',
    //   render: (value) => `${value}夜`,
    // },
    {
      title: '房价',
      width: 82,
      align: 'center',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => {
        return `A$ ${value}`;
      },
    },
    {
      title: '入住人数',
      width: 82,
      align: 'center',
      dataIndex: 'checkInPersonCount',
      key: 'checkInPersonCount',
    },
    {
      title: '客房状态',
      dataIndex: 'status',
      width: 82,
      align: 'center',
      key: 'status',
      render(value, record, index) {
        const option = OrderStateOptions.find(
          (option) => option.value === value,
        );
        return option && option.label;
      },
    },
    {
      title: '入住人',
      width: 82,
      align: 'center',
      dataIndex: 'checkInPersonName',
      key: 'checkInPersonName',
    },
    {
      title: '联系方式',
      ellipsis: true,
      width: 120,
      align: 'center',
      dataIndex: 'checkInPersonPhoneNo',
      key: 'checkInPersonPhoneNo',
    },
    {
      title: '操作',
      width: 125,
      align: 'center',
      fixed: 'right',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              openOccupantDrawer(orderId as number, record);
            }}
          >
            {/* <PlusOutlined /> */}+ 新增入住人
          </Button>
        </>
      ),
    },
  ];

  const mapChannelText = (value: number, attribute: keyof SETTING.Channel) => {
    if (value && channelList && channelList.length) {
      const channel = channelList.find((c) => c.id === value);
      return channel && channel[attribute];
    }
    return value;
  };

  let footerOperations;
  const orderStatus = data?.order.status;
  const roomStatusList = data?.orderRoomList.map(({ status }) => status);
  // const roomStatusSet = new Set(roomStatusList);

  const modifyOrder = () => {
    setVisible(false);
    gotoEdit?.(data?.order as ORDER.OrderBase);
  };

  const operateOrder = (operationType: OperationType) => {
    const { orderRoomList, ...rest } = data!;
    let filteredRoomList = [...orderRoomList];

    const isOrdered = [
      OperationType.CANCEL_OBSERVE,
      OperationType.CONFIRM_CHECKIN,
    ].includes(operationType);
    const isChecked = [
      OperationType.CANCEL_CHECKIN,
      OperationType.CHECK_OUT,
    ].includes(operationType);
    if (isOrdered) {
      filteredRoomList = orderRoomList.filter(
        (room) => room.status === OrderState.IS_ORDERED,
      );
    } else if (isChecked) {
      filteredRoomList = orderRoomList.filter(
        (room) => room.status === OrderState.IS_CHECKED,
      );
    }

    openOperateDrawer({
      operationType,
      orderRoomList: filteredRoomList,
      ...rest,
    } as OperateData);
  };

  const sideButtons = [];
  const mainButtons = [];

  console.log('roomStatusList', roomStatusList);

  if (activeTabKey === 'operationLog') {
    footerOperations = null;
  }
  if (roomStatusList?.includes(OrderState.IS_ORDERED)) {
    sideButtons.push({ value: OperationType.CANCEL_OBSERVE, text: '取消预定' });
    mainButtons.push({
      value: OperationType.CONFIRM_CHECKIN,
      text: '办理入住',
    });
  }
  if (roomStatusList?.includes(OrderState.IS_CHECKED)) {
    sideButtons.push({ value: OperationType.CANCEL_CHECKIN, text: '撤销入住' });
    mainButtons.push({ value: OperationType.CHECK_OUT, text: '办理退房' });
  }
  const OrderDetailDrawer = (
    <>
      <Drawer
        width={640}
        destroyOnClose
        maskClosable={false}
        title="订单详情"
        placement="right"
        className="order-detail-drawer"
        onClose={() => {
          console.log('onClose');
          setVisible(false);
        }}
        visible={visible}
        footerStyle={{
          display: 'flex',
        }}
        footer={
          <>
            {[...sideButtons, ...mainButtons].length > 0 ? (
              <>
                {
                  <Space
                    style={{
                      justifyContent: 'flex-start',
                    }}
                  >
                    {sideButtons.map((btn) => (
                      <Button
                        onClick={() => operateOrder(btn.value)}
                        key={btn.text}
                      >
                        {btn.text}
                      </Button>
                    ))}
                  </Space>
                }
                <Space>
                  <Button
                    onClick={() => {
                      message.info('打印暂未实现...');
                    }}
                    key="打印"
                  >
                    打印
                  </Button>
                  <Button onClick={modifyOrder} type="primary" key="修改订单">
                    修改订单
                  </Button>
                  {mainButtons.map((btn) => (
                    <Button
                      type="primary"
                      onClick={() => operateOrder(btn.value)}
                      key={btn.text}
                    >
                      {btn.text}
                    </Button>
                  ))}
                </Space>
              </>
            ) : null}
          </>
        }
      >
        <Tabs
          activeKey={activeTabKey}
          onChange={(value) => {
            setActiveTabKey(value);
          }}
        >
          <Tabs.TabPane tab="订单详情" key="orderDetail">
            <div className="basic-section">
              <div className="reserve-row">
                <div>
                  <div className="reserver">
                    {data?.order.reserveName} {data?.order.reservePhone}
                  </div>
                  <div className="check-in">
                    <span>
                      {data?.order.status && OrderStateText[data?.order.status]}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="channel-tag">
                    <i
                      style={{
                        background:
                          data?.order.channelType &&
                          mapChannelText(data?.order.channelType, 'color'),
                      }}
                    ></i>
                    {data?.order.channelType &&
                      mapChannelText(data?.order.channelType, 'name')}
                  </span>
                </div>
              </div>
              <div className="fee-row">
                <div>
                  订单金额
                  <br />
                  <span className="fee">A$ {data?.order.totalAmount}</span>
                </div>
                <div>
                  已付金额
                  <br />
                  <span className="fee">A$ {data?.order.paidAmount}</span>
                </div>
                <div>
                  还需付款
                  <br />
                  <span className="fee">A$ {data?.order.remainAmount}</span>
                </div>
              </div>
            </div>

            <ProCard
              title="房间信息"
              extra={`共${data?.orderRoomList?.length}间房`}
            >
              <Table
                bordered
                row-key="roomId"
                scroll={{ x: 'scroll' }}
                size="small"
                columns={roomColumns}
                dataSource={data?.orderRoomList || []}
                pagination={false}
              />
            </ProCard>
            <ProCard
              title={
                <>
                  消费信息：
                  <span
                    style={{
                      color: 'red',
                      fontWeight: 'normal',
                      fontSize: '12px',
                    }}
                  >
                    A${' '}
                    {consumeList?.reduce(
                      (acc: number, cur: ORDER.OrderConsume) => {
                        return acc + cur.price * cur.count;
                      },
                      0,
                    )}
                  </span>
                </>
              }
              extra={
                <>
                  <Button
                    type="link"
                    onClick={() => {
                      openConsumeDrawer(orderId as number);
                    }}
                  >
                    + 添加消费
                  </Button>
                </>
              }
            >
              <Table
                bordered
                size="small"
                row-key="roomId"
                columns={consumeColumns}
                dataSource={consumeList || []}
                pagination={false}
              />
            </ProCard>
            <ProCard
              title={
                <>
                  收退款信息：
                  <Space>
                    <span
                      style={{
                        color: 'green',
                        fontWeight: 'normal',
                        fontSize: '12px',
                      }}
                    >
                      收款：A$
                      {payOrRefundList
                        ?.filter(
                          (c: ORDER.OrderPayOrRefund) =>
                            c.type === 1 || c.type === 2,
                        )
                        .reduce((acc: number, cur: ORDER.OrderPayOrRefund) => {
                          return acc + cur.amount;
                        }, 0)}
                    </span>

                    <span
                      style={{
                        color: 'red',
                        fontWeight: 'normal',
                        fontSize: '12px',
                      }}
                    >
                      退款：A$
                      {payOrRefundList
                        ?.filter(
                          (c: ORDER.OrderPayOrRefund) =>
                            c.type === 3 || c.type === 4,
                        )
                        .reduce((acc: number, cur: ORDER.OrderPayOrRefund) => {
                          return acc + cur.amount;
                        }, 0)}
                    </span>
                  </Space>
                </>
              }
              extra={
                <>
                  <Button
                    type="link"
                    onClick={() => {
                      openPayOrRefundDrawer(orderId as number);
                    }}
                  >
                    + 添加收退款
                  </Button>
                </>
              }
            >
              <Table
                bordered
                size="small"
                row-key="roomId"
                columns={payOrRefundColumns}
                dataSource={payOrRefundList || []}
                pagination={false}
              />
            </ProCard>
            <ProCard
              title="提醒信息"
              extra={
                <>
                  <Button
                    type="link"
                    onClick={() => {
                      openNoticeDrawer(orderId as number);
                    }}
                  >
                    + 添加提醒
                  </Button>
                </>
              }
            >
              <Table
                bordered
                row-key="roomId"
                size="small"
                columns={noticeColumns}
                dataSource={noticeList || []}
                pagination={false}
                showHeader={false}
              />
            </ProCard>
            <ProCard>
              <div className="custom-form-item">
                <label>备注：</label>
                <div>{data?.order.remark}</div>
              </div>
              <div className="custom-form-item">
                <label>订单编号：</label>
                {data?.order.channelOrderNo}
              </div>
            </ProCard>
          </Tabs.TabPane>
          <Tabs.TabPane tab="操作日志" key="operationLog">
            <OperatinoLog orderId={orderId as number} />
          </Tabs.TabPane>
        </Tabs>
      </Drawer>

      {NoticeDrawer}
      {ConsumeDrawer}
      {PayOrRefundDrawer}
      {OccupantDrawer}
      {OperateDrawer}
    </>
  );
  return {
    OrderDetailDrawer,
    openOrderDetailDrawer,
  };
}
