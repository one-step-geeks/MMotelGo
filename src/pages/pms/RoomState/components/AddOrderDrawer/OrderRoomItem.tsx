import React from 'react';
import { Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';
// import './less.less';

interface Props {
  data?: ROOM_STATE.SelectTableData;
}

const OrderRoomItem: React.FC<Props> = (props) => {
  const { data } = props;
  return (
    <Input.Group compact>
      <DatePicker
        style={{ width: 120 }}
        format="MM-DD入住"
        allowClear={false}
        value={moment(data?.date)}
      />
      <InputNumber
        style={{ width: 60 }}
        precision={0}
        step={1}
        defaultValue={1}
        formatter={(value) => {
          return value + '晚';
        }}
        min={1}
      />
      <Input
        readOnly
        value={`${data?.roomCode || ''}/${data?.roomTypeName || ''}`}
        style={{ width: 120 }}
      />
    </Input.Group>
  );
};

export default OrderRoomItem;
