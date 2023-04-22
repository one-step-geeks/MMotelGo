import { Typography } from 'antd';
import React, { useState } from 'react';
import classnames from 'classnames';
import './style.less';
import { useIntl } from 'umi';

const Text = Typography.Text;

interface Props {
  record?: ROOM_STATE.StateTableData;
  order?: ORDER.OrderData;
  dateItem?: any;
  onOrder?: () => void;
}

const OrderBox: React.FC<Props> = (props) => {
  const { order, record, dateItem, onOrder } = props;
  const intl = useIntl();
  return (
    <div
      className={classnames(
        'room-order-box',
        `status-${order?.roomStatus || dateItem.status || 1}`,
      )}
      onClick={onOrder}
    >
      <div>{order?.reserveName || 'none'}</div>
      <div className="orgin-source">
        {order?.channelTypeName || intl.formatMessage({ id: '自来客' })}
      </div>
    </div>
  );
};

export default OrderBox;
