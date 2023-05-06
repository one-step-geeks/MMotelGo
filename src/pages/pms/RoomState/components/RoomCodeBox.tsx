// import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import services from '@/services';
import './room-code.less';
import { useIntl } from 'umi';

interface Props {
  room: ROOM_STATE.StateTableData;
  roomList?: ROOM_STATE.Room[];
  onStatusChange: (status: number) => void;
}

const RoomCodeBox: React.FC<Props> = (props) => {
  const { room, roomList, onStatusChange } = props;
  const intl = useIntl();
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const isDirty =
      roomList?.find((item) => item.roomId === room.roomId)?.roomStatus === 14;
    setDirty(isDirty);
  }, [roomList]);

  let className = 'room-code-box';
  let hoverText = intl.formatMessage({ id: '转为脏房' });

  if (dirty) {
    className += ' dirty';
    hoverText = intl.formatMessage({ id: '转为净房' });
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
        onStatusChange(status);
      }}
    ></div>
  );
};

export default RoomCodeBox;
