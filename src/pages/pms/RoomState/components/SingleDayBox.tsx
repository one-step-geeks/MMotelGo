// import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { Popover, Space, Typography } from 'antd';
import { selectService } from './service';
import { useModel, useIntl } from 'umi';
import services from '@/services';
import './room-code.less';

const { Text } = Typography;

interface Props {
  room: ROOM_STATE.StateTableData;
  roomList?: ROOM_STATE.Room[];
  order?: ORDER.OrderData;
}

const RoomCodeBox: React.FC<Props> = (props) => {
  const { room, roomList, order } = props;
  const intl = useIntl();
  const [selected, setSelected] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dirty, setDirty] = useState(false);
  const { selectedRooms, setSelectedRooms } = useModel('state');

  useEffect(() => {
    const subs = selectService.getSelectedInfo().subscribe((info: any) => {
      switch (info.type) {
        case 'SELECTED':
          if (info?.roomId === room.roomId) {
          } else {
            setVisible(false);
          }
          break;
        case 'CANCEL_SELECTED':
          setVisible(false);
          setSelected(false);
          break;
        default:
          break;
      }
    });

    return () => {
      subs.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const isDirty =
      roomList?.find((item) => item.roomId === room.roomId)?.roomStatus === 14;
    setDirty(isDirty);
  }, [roomList]);

  const className = `room-single-box${dirty ? ' dirty' : ''}${
    selected ? ' selected' : ''
  }${order ? ' ordered' : ''}`;

  async function changeRoomStatus() {
    setDirty(!dirty);
    const status = dirty ? 15 : 14;
    await services.RoomStateController.changeRoomStatus({
      roomId: room.roomId,
      status,
    });
  }

  return order ? (
    <div className={className} onClick={() => {}}>
      <div className="room-code">{room.roomCode}</div>
      <div className="reserve-name">{order.reserveName}</div>
    </div>
  ) : (
    <Popover
      content={
        <Space direction="vertical" size={12}>
          <Text
            type="secondary"
            className="btn"
            onClick={() => {
              setSelectedRooms([]);
              selectService.sendCancelInfo();
            }}
          >
            {intl.formatMessage({ id: '取消' })}
          </Text>
          <Text
            type="secondary"
            className="btn"
            onClick={selectService.sendCloseRoom}
          >
            {intl.formatMessage({ id: '关房' })}
          </Text>
          <Text
            type="secondary"
            className="btn"
            onClick={selectService.sendAddOrder}
          >
            {intl.formatMessage({ id: '预订' })}
          </Text>
        </Space>
      }
      overlayClassName="room-box-action-popover"
      placement="rightTop"
      getPopupContainer={(p) => p}
      visible={visible}
    >
      <div
        className={className}
        onClick={() => {
          const info = {
            roomId: room.roomId,
          };
          setVisible(true);
          setSelected(!selected);
          selectService.sendSelectedInfo(info);
        }}
      >
        <div className="room-code">{room.roomCode}</div>
        <CheckOutlined className="icon" />
      </div>
    </Popover>
  );
};

export default RoomCodeBox;
