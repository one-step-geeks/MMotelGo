import React, { useState } from 'react';
import { message, Space, Form } from 'antd';
import OrderDetailDrawer from '../../../Order/components/OrderDetailDrawer';
import OrderBox from './OrderBox';

const FormItem = Form.Item;

interface Props {
  record?: ROOM_STATE.StateTableData;
  order?: ORDER.OrderData;
}

const OrderDrawer: React.FC<Props> = (props) => {
  const { order, record } = props;

  const [visible, setVisible] = useState(false);

  return (
    <>
      <OrderBox
        order={order}
        record={record}
        onOrder={() => {
          setVisible(true);
        }}
      />
      <OrderDetailDrawer
        id={order?.orderId!}
        visible={visible}
        onVisibleChange={(value) => {
          setVisible(value);
        }}
        gotoEdit={() => {}}
        gotoOperate={() => {}}
      />
    </>
  );
};

export default OrderDrawer;
