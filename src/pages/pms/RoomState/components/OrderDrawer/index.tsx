import React from 'react';
import { useOrderDetailDrawer } from '../../../Order/components/OrderDetailDrawer';
import OrderBox from './OrderBox';

interface Props {
  record?: ROOM_STATE.StateTableData;
  order?: ORDER.OrderData;
}

const OrderDrawer: React.FC<Props> = (props) => {
  const { order, record } = props;
  const { OrderDetailDrawer, openOrderDetailDrawer } = useOrderDetailDrawer(
    () => {
      // TODO
    },
    () => {
      // TODO
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
    </>
  );
};

export default OrderDrawer;
