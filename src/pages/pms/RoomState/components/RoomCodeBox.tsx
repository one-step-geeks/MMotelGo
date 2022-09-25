// import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import services from '@/services';
import './room-code.less';

interface Props {
  room: ROOM_STATE.StateTableData;
  roomList?: ROOM_STATE.Room[];
}

const RoomCodeBox: React.FC<Props> = (props) => {
  const { room, roomList } = props;

  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const isDirty =
      roomList?.find((item) => item.roomId === room.roomId)?.roomStatus === 14;
    setDirty(isDirty);
  }, [roomList]);

  let className = 'room-code-box';
  let hoverText = '转为脏房';

  if (dirty) {
    className += ' dirty';
    hoverText = '转为净房';
  }

  return (
    <div
      className={className}
      data-text={room?.roomCode}
      data-hover-text={hoverText}
      onClick={async () => {
        setDirty(!dirty);
        const status = dirty ? 15 : 14;
        await services.RoomStateController.changeRoomStatus({
          roomId: room.roomId,
          status,
        });
      }}
    ></div>
  );
};

export default RoomCodeBox;
