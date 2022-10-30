import React, { useState } from 'react';
import { useOrderDetailDrawer } from '../../../Order/components/OrderDetailDrawer';
import OrderFormDrawer from '../../../Order/components/OrderFormDrawer';
import OrderBox from './OrderBox';

interface Props {
  record?: ROOM_STATE.StateTableData;
  order?: ORDER.OrderData;
}

const OrderDrawer: React.FC<Props> = (props) => {
  const { order, record } = props;
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const { OrderDetailDrawer, openOrderDetailDrawer } = useOrderDetailDrawer(
    () => {
      setEditDrawerVisible(true);
    },
  );

  return (
    <>
      <OrderBox
        order={order}
        record={record}
        onOrder={() => {
          openOrderDetailDrawer(order?.orderId!);
        }}
      />
      {OrderDetailDrawer}
      <OrderFormDrawer
        visible={editDrawerVisible}
        onVisibleChange={(value) => setEditDrawerVisible(value)}
        id={order?.orderId}
        onSubmited={() => {
          setEditDrawerVisible(false);
        }}
      />
    </>
  );
};

export default OrderDrawer;
