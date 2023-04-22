// import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  MinusCircleFilled,
  CheckOutlined,
  ToolFilled,
  CarryOutFilled,
} from '@ant-design/icons';
import { Popover, Space, Typography } from 'antd';
import { selectService } from './service';
import { useModel, useIntl } from 'umi';
import services from '@/services';
import moment from 'moment';
import classnames from 'classnames';
import './room-code.less';

const { Text } = Typography;

interface Props {
  room: ROOM_STATE.SingleDayRoom & {
    roomTypeId: number;
    roomTypeName: string;
    roomStateStatus: number;
    roomStateStatusDesc: string;
  };
  roomList?: ROOM_STATE.Room[];
  order?: ORDER.OrderData & { roomStatus: number };
  date?: string;
}

const RoomCodeBox: React.FC<Props> = (props) => {
  const { room, roomList, order, date } = props;
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
  }, [room]);

  useEffect(() => {
    const isDirty =
      roomList?.find((item) => item.roomId === room.roomId)?.roomStatus === 14;
    setDirty(isDirty);
  }, [roomList]);
  console.log(room);
  const isRoomClosed = [9, 10, 11].includes(room.status);

  const className = classnames(
    `room-single-box${dirty ? ' room-single-box-dirty' : ''}${
      selected ? ' selected' : ''
    }`,
    `room-single-box-${order?.roomStatus || room.status}`,
  );

  async function changeRoomStatus() {
    setDirty(!dirty);
    const status = dirty ? 15 : 14;
    await services.RoomStateController.changeRoomStatus({
      roomId: room.roomId,
      status,
    });
  }
  const isBeforeNow = moment(date).isSameOrAfter(moment(), 'day');
  return order ? (
    <div
      className={className}
      onClick={() => {
        selectService.sendShowOrder({ orderId: order.orderId });
      }}
    >
      <div className="room-code">{room.roomCode}</div>
      <div className="reserve-name">{order.reserveName}</div>
      <div className="orgin-source">
        {order.channelTypeName || intl.formatMessage({ id: '自来客' })}
      </div>
    </div>
  ) : (
    <Popover
      content={
        <Space direction="vertical" size={12}>
          <Text
            type="secondary"
            className="btn"
            onClick={() => {
              setVisible(false);
              setSelectedRooms([]);
              selectService.sendCancelInfo();
            }}
          >
            {intl.formatMessage({ id: '取消' })}
          </Text>
          <Text
            type="secondary"
            className="btn"
            onClick={() => {
              if (isRoomClosed) {
                selectService.sendOpenRoom();
              } else {
                selectService.sendCloseRoom();
              }
            }}
          >
            {isRoomClosed
              ? intl.formatMessage({ id: '开房' })
              : intl.formatMessage({ id: '关房' })}
          </Text>

          <Text
            type="secondary"
            className="btn"
            onClick={() => {
              setVisible(false);
              const status = dirty ? 15 : 14;
              const roomId = room.roomId;

              if (dirty) {
                selectService.sendRoomAsClean({ status, roomId });
              } else {
                selectService.sendRoomAsDirty({ status, roomId });
              }
            }}
          >
            {intl.formatMessage({ id: dirty ? '转净房' : '转脏房' })}
          </Text>
          <Text
            type="secondary"
            className="btn"
            onClick={() => {
              setVisible(false);
              selectService.sendAddOrder();
            }}
          >
            {isBeforeNow
              ? intl.formatMessage({ id: '预定' })
              : intl.formatMessage({ id: '补录' })}
          </Text>
        </Space>
      }
      overlayClassName="room-box-action-popover"
      placement="rightTop"
      open={visible}
    >
      <div
        className={className}
        onClick={() => {
          const info = {
            date,
            roomId: room.roomId,
            roomCode: room.roomCode,
            roomTypeId: room.roomTypeId,
            roomTypeName: room.roomTypeName,
            price: room.price,
          };
          if (!selected) {
            setVisible(true);
            setSelected(true);
            setSelectedRooms([...selectedRooms, info]);
            selectService.sendSelectedInfo(info);
          } else {
            const filteredRooms = selectedRooms.filter(
              (item) =>
                !(
                  item.roomId === room.roomId &&
                  moment(item.date).isSame(date, 'day')
                ),
            );
            setSelectedRooms(filteredRooms);
            if (!filteredRooms?.length) {
              selectService.sendCancelInfo();
            }
            setSelected(false);
          }
        }}
      >
        <div className="room-code">{room.roomCode}</div>
        <CheckOutlined className="icon" />

        {room.status === 9 ? <ToolFilled className="close-icon" /> : null}
        {room.status === 10 ? (
          <MinusCircleFilled className="close-icon" />
        ) : null}
        {room.status === 11 ? <CarryOutFilled className="close-icon" /> : null}
      </div>
    </Popover>
  );
};

export default RoomCodeBox;
