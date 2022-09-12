import React, { useState } from 'react';
import { Button, Drawer, Table, Space, Tag } from 'antd';
import services from '@/services';
import { useRequest } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import { ProCard } from '@ant-design/pro-components';
import './style.less';
import { OrderStateText } from '@/services/OrderController';
import moment from 'moment';

interface Props {
  id: number;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  gotoEdit: (orderBase: ORDER.OrderBase) => void;
  children?: JSX.Element;
}

// const App: React.FC =
export default (props: Props) => {
  const { data: channelList } = useRequest(() => {
    return services.ChannelController.queryChannels();
  });
  const { data, loading } = useRequest(
    () => {
      if (props.id) {
        return services.OrderController.queryDetail(props.id);
      }
      return Promise.resolve();
    },
    {
      refreshDeps: [props.id],
    },
  );

  if (data && data.orderRoomList) {
    data.orderRoomList.forEach((d) => (d.key = d.roomId));
  }

  const columns: ColumnsType<ORDER.OrderRoom> = [
    {
      title: '入住日期',
      dataIndex: 'startDate',
      key: 'startDate',
      render(value, record, index) {
        return moment(value).format('YYYY-MM-DD');
      },
    },
    {
      title: '间夜',
      dataIndex: 'checkInDays',
      key: 'checkInDays',
      render: (value) => `${value}夜`,
    },
    {
      title: '房价',
      dataIndex: 'roomPrice',
      key: 'roomPrice',
      render: (value) => {
        return `A$ ${value}`;
      },
    },
    {
      title: '入住人数',
      dataIndex: 'checkInPersonCount',
      key: 'checkInPersonCount',
    },
  ];

  const mapChannelText = (value: number, attribute: keyof SETTING.Channel) => {
    if (value && channelList && channelList.length) {
      const channel = channelList.find((c) => c.id === value);
      return channel && channel[attribute];
    }
    return value;
  };

  return (
    <>
      {
        <Drawer
          width={540}
          destroyOnClose
          maskClosable={false}
          title="订单详情"
          placement="right"
          onClose={() => {
            console.log('onClose');
            props.onVisibleChange(false);
          }}
          visible={props.visible}
          footer={
            <>
              <Button
                type="primary"
                onClick={() => {
                  props.onVisibleChange(false);
                  props.gotoEdit(data?.order as ORDER.OrderBase);
                }}
              >
                修改订单
              </Button>
            </>
          }
        >
          <div className="basic-section">
            <div className="reserve-row">
              <div>
                <div className="reserver">
                  {data?.order.reserveName} {data?.order.reservePhone}
                </div>
                <div className="check-in">
                  <span>
                    {data?.order.checkInStatus &&
                      OrderStateText[data?.order.checkInStatus]}
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
                已付金额
                <br />
                <span className="fee">A$ {data?.order.paidAmount}</span>
              </div>
              <div>
                还需付款
                <br />
                <span className="fee">A$ {data?.order.remainAmount}</span>
              </div>
              <div>
                订单金额
                <br />
                <span className="fee">A$ {data?.order.totalAmount}</span>
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
              columns={columns}
              dataSource={data?.orderRoomList || []}
              pagination={false}
            />
          </ProCard>
          <ProCard>
            <div className="custom-form-item">
              <label>备注：</label>
              {data?.order.remark}
            </div>
            <div className="custom-form-item">
              <label>订单编号：</label>
              {data?.order.channelOrderNo}
            </div>
          </ProCard>
        </Drawer>
        //  : null
      }
    </>
  );
};
