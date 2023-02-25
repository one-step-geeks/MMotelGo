import { Typography } from 'antd';
import React, { useState } from 'react';
import classnames from 'classnames';
import './style.less';

const Text = Typography.Text;

interface Props {
  record?: ROOM_STATE.StateTableData;
  order?: ORDER.OrderData;
  dateItem?: any;
  onOrder?: () => void;
}

const OrderBox: React.FC<Props> = (props) => {
  const { order, record, dateItem, onOrder } = props;
  console.log(order, record, dateItem);
  return (
    <div
      className={classnames('room-order-box', `status-${dateItem.status || 1}`)}
      onClick={onOrder}
    >
      <Text>{order?.reserveName || 'none'}</Text>
      <Text className="orgin-source">{order?.channelTypeName || '自来客'}</Text>
    </div>
  );
};

export default OrderBox;
