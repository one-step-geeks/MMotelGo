import React, { useState } from 'react';
import { useOrderDetailDrawer } from '../../../Order/components/OrderDetailDrawer';
import type { OperateData } from '@/services/OrderController';
import OrderOperateDrawer from '../../../Order/components/OrderOperateDrawer';
import OrderFormDrawer from '../../../Order/components/OrderFormDrawer';
import OrderBox from './OrderBox';

interface Props {
  record?: ROOM_STATE.StateTableData;
  order?: ORDER.OrderData;
}

const OrderDrawer: React.FC<Props> = (props) => {
  const { order, record } = props;
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [operateDrawerVisible, setOperateDrawerVisible] = useState(false);
  const [operateData, setOperateData] = useState<OperateData>();
  const { OrderDetailDrawer, openOrderDetailDrawer } = useOrderDetailDrawer(
    () => {
      setEditDrawerVisible(true);
    },
    (data: any) => {
      setOperateData(data);
      setOperateDrawerVisible(true);
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
      <OrderOperateDrawer
        visible={operateDrawerVisible}
        onVisibleChange={(value) => setOperateDrawerVisible(value)}
        operateData={operateData}
      />
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
