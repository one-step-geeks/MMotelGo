import React, { useState, useEffect } from 'react';
import { Popover, Space, Typography } from 'antd';
import {
  MinusCircleFilled,
  CheckSquareFilled,
  CheckOutlined,
  ToolFilled,
  CarryOutFilled,
} from '@ant-design/icons';
import { useModel, useIntl } from 'umi';
import { selectService } from '../service';
import moment from 'moment';
import classnames from 'classnames';
import './style.less';

const { Text } = Typography;

interface Props {
  record: ROOM_STATE.StateTableData;
  date: string;
}

const EmptyBox: React.FC<Props> = (props) => {
  const { record, date } = props;

  const intl = useIntl();

  const { selectedRooms, setSelectedRooms } = useModel('state');

  const [selected, setSelected] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const subs = selectService.getSelectedInfo().subscribe((info: any) => {
      switch (info.type) {
        case 'SELECTED':
          if (info?.roomId === record.id && info.date === date) {
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
  }, [record, date]);

  const boxData = record?.dateList?.find((d) =>
    moment(d.date).isSame(date, 'day'),
  );
  const { price, status } = boxData || {};

  const isBeforeNow = moment(boxData?.date).isSameOrAfter(moment(), 'day');
  return ![9, 10, 11].includes(status!) ? (
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
              selectService.sendCloseRoom();
            }}
          >
            {intl.formatMessage({ id: '关房' })}
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
      placement="leftBottom"
      getPopupContainer={(p) => p}
      open={visible}
    >
      {!selected ? (
        <div
          className="room-empty-box"
          onClick={() => {
            const info = {
              date,
              roomId: record.id,
              roomCode: record.roomCode,
              roomTypeId: record.roomTypeId,
              roomTypeName: record.roomTypeName,
              price,
            };
            if (!selectedRooms?.length || !selectedRooms[0].closed) {
              setVisible(true);
              setSelected(true);
              setSelectedRooms([...selectedRooms, info]);
              selectService.sendSelectedInfo(info);
            }
          }}
        >
          <Text type="secondary" className="hiden">
            {record?.roomTypeName}
          </Text>
          <Text type="secondary" className="hiden">
            {record?.roomCode}
          </Text>
          <Text type="secondary" className="hiden">
            ￥{price}
          </Text>
        </div>
      ) : (
        <div
          className="room-empty-box-checked"
          onClick={() => {
            const filteredRooms = selectedRooms.filter(
              (item) =>
                !(
                  item.roomId === record.id &&
                  moment(item.date).isSame(date, 'day')
                ),
            );
            setSelectedRooms(filteredRooms);
            if (!filteredRooms?.length) {
              selectService.sendCancelInfo();
            }
            setSelected(false);
          }}
        >
          <CheckOutlined className="icon" />
        </div>
      )}
    </Popover>
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
              selectService.sendOpenRoom();
            }}
          >
            {intl.formatMessage({ id: '开房' })}
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
      placement="leftBottom"
      getPopupContainer={(p) => p}
      open={visible}
    >
      <div
        className={classnames(
          selected ? 'room-closed-box selected' : 'room-closed-box',
          status === 9 && 'room-closed-box-repair',
          status === 10 && 'room-closed-box-stop',
          status === 11 && 'room-closed-box-keep',
        )}
        onClick={() => {
          const info = {
            date,
            roomId: record.id,
            roomCode: record.roomCode,
            roomTypeId: record.roomTypeId,
            roomTypeName: record.roomTypeName,
            closed: true,
            price,
          };
          if (!selected) {
            if (!selectedRooms?.length || selectedRooms[0].closed) {
              setVisible(true);
              setSelected(true);
              setSelectedRooms([...selectedRooms, info]);
              selectService.sendSelectedInfo(info);
            }
          } else {
            const filteredRooms = selectedRooms.filter(
              (item) =>
                !(
                  item.roomId === record.id &&
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
        {status === 9 ? (
          <>
            <ToolFilled className="icon" />
            <Text type="secondary" className="text">
              {intl.formatMessage({ id: '维修' })}
            </Text>
          </>
        ) : null}
        {status === 10 ? (
          <>
            <MinusCircleFilled className="icon" />
            <Text type="secondary" className="text">
              {intl.formatMessage({ id: '停用' })}
            </Text>
          </>
        ) : null}
        {status === 11 ? (
          <>
            <CarryOutFilled className="icon" />
            <Text type="secondary" className="text">
              {intl.formatMessage({ id: '保留' })}
            </Text>
          </>
        ) : null}

        <CheckSquareFilled className="checkbox" />
      </div>
    </Popover>
  );
};

export default EmptyBox;
