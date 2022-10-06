// import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import services from '@/services';
import './room-code.less';

interface Props {
  room: ROOM_STATE.StateTableData;
  roomList?: ROOM_STATE.Room[];
}

const RoomCodeBox: React.FC<Props> = (props) => {
  const { room, roomList } = props;
  const [selected, setSelected] = useState(false);
  const [dirty, setDirty] = useState(false);

  let className = 'room-single-box';
  let hoverText = '转为脏房';

  useEffect(() => {
    const isDirty =
      roomList?.find((item) => item.roomId === room.roomId)?.roomStatus === 14;
    setDirty(isDirty);
  }, [roomList]);

  if (dirty) {
    className += ' dirty';
    hoverText = '转为净房';
  }

  if (selected) {
    className += ' selected';
  }

  async function changeRoomStatus() {
    setDirty(!dirty);
    const status = dirty ? 15 : 14;
    await services.RoomStateController.changeRoomStatus({
      roomId: room.roomId,
      status,
    });
  }

  return (
    <div
      className={className}
      data-text={room.roomCode}
      data-hover-text={hoverText}
      onClick={() => {
        setSelected(!selected);
      }}
    >
      <CheckOutlined className="icon" />
    </div>
  );
};

export default RoomCodeBox;
