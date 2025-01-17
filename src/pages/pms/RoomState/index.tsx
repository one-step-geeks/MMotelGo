import React, { ReactNode, useState, useEffect, useMemo } from 'react';
import {
  useIntl,
  useRequest,
  useHistory,
  useModel,
  useLocation,
  useRouteMatch,
} from 'umi';
import { ColumnsType } from 'antd/lib/table';
import { Space, Typography, Table, DatePicker, Radio, Button, Tag } from 'antd';
import { getWeekDay, getCalendarDate } from '@/utils';
import OrderDrawer from './components/OrderDrawer';
import EmptyDrawer from './components/EmptyDrawer';
import CloseRoomModal from './components/CloseRoomModal';
import RoomCodeBox from './components/RoomCodeBox';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
// import TodayOverviewModal from './components/TodayOverviewModal';
// import ChangeLogModal from './components/ChangeLogModal';
// import RoomSituationModal from './components/RoomSituationModal';
import SingleDay from './SingleDay';
import OrderFormDrawer from '../Order/components/OrderFormDrawer';
import { selectService } from './components/service';
import services from '@/services';
import moment from 'moment';
import querystring from 'querystring';
import './style.less';
import { OrderState } from '@/services/OrderController';

export function processOpenAndClose(list: ROOM_STATE.SelectTableData[]) {
  const result: ROOM_STATE.CloseRoomInfo[] = [];
  for (let i = 0; i < list.length; i++) {
    const state = list[i];
    const finded = result.find((item) => item.roomId === state.roomId);
    if (finded) {
      finded.dateList.push(state.date!);
    } else {
      result.push({
        roomId: state.roomId!,
        dateList: [state.date!],
      });
    }
  }
  return result;
}

export function processOrderRoom(list: ROOM_STATE.SelectTableData[]) {
  const result: (Partial<Omit<ORDER.OrderRoom, 'roomDesc' | 'key'>> & {
    dateList: string[];
    priceList: number[];
  })[] = [];
  for (let i = 0; i < list.length; i++) {
    const state = list[i];
    const finded = result.find((item) => item.roomId === state.roomId);
    if (finded) {
      finded.dateList = [...finded.dateList, state.date!].sort();
      finded.priceList = [...finded.priceList, state.price!];
    } else {
      result.push({
        dateList: [state.date!],
        roomId: state.roomId as number,
        roomTypeName: state.roomTypeName,
        roomCode: state.roomCode,
        priceList: [state.price!],
      });
    }
  }

  const trueResult: Omit<ORDER.OrderRoom, 'roomDesc' | 'key'>[] = [];
  // 循环遍历房间
  for (let i = 0; i < result.length; i++) {
    const ele = result[i];
    const { dateList, ...rest } = ele;
    // 循环遍历房间的日期
    for (let j = 0; j < dateList.length; j++) {
      // 如果是日期的开始，或是间断日期第一个，例如[2/3,2/5,2/6] 应该被拆分成两条数据 [2/3, 2/5-2/6]
      if (j === 0 || moment(dateList[j]).diff(dateList[j - 1], 'days') !== 1) {
        trueResult.push({
          ...rest,
          startDate: moment(dateList[j]),
          checkInDays: 1,
          totalAmount: rest.priceList[j],
          roomPrice: rest.priceList[j],
          priceList: [rest.priceList[j]],
        });
      } else {
        trueResult[trueResult.length - 1].checkInDays! += 1;
        trueResult[trueResult.length - 1].priceList.push(rest.priceList[j]);
        trueResult[trueResult.length - 1].totalAmount! +=
          rest.priceList[j] || 0;
      }
    }
  }
  return trueResult;
}

type AlignType = 'left' | 'center' | 'right';

const RoomStatePage: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { defaultDuration } = querystring.parse(
    location.search.replace('?', ''),
  );
  const [expand, setExpand] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [closeVisible, setCloseVisible] = useState(false);
  const [duration, setDuration] = useState(Number(defaultDuration) || 7);
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const { selectedRooms, setSelectedRooms } = useModel('state');
  const [roomTypeList, setRoomTypeList] = useState<ROOM_STATE.RoomType[]>([]);

  const openOrCloseList = useMemo(
    () => processOpenAndClose(selectedRooms),
    [selectedRooms],
  );

  useEffect(() => {
    setSelectedRooms([]);
  }, [location]);

  // 生成房态日历-columns
  const [calendarList, setCalendarList] = useState(() => {
    return getCalendarDate(duration);
  });

  // 获取房态房间列表-rows
  const {
    data: rowData,
    loading: rowLoading,
    run: refreshAllState,
  } = useRequest(
    async () => {
      if (duration === -1) {
        return {
          data: {
            list: [],
          },
        };
      }
      return services.RoomStateController.getAllRoomType({
        startDate: selectedDate.clone().format('YYYY-MM-DD'),
        endDate: selectedDate.clone().add(duration, 'day').format('YYYY-MM-DD'),
        list: [],
      });
    },
    {
      refreshDeps: [selectedDate, duration],
    },
  );

  // 获取房态列表
  const { loading: statusLoading } = useRequest(
    async () => {
      return services.RoomStateController.getRoomStatusList({
        roomTypeIdList: [],
      }).then((res) => {
        setRoomTypeList(res.data.roomTypeList);
      });
    },
    {
      refreshDeps: [selectedDate, duration],
    },
  );

  // 获取房态剩余房间-rows
  const {
    data: stockData,
    loading: stockLoading,
    run: refreshRoomStateStock,
  } = useRequest(
    async () => {
      if (duration !== -1) {
        return services.RoomStateController.getRoomStateStock({
          startDate: selectedDate.clone().format('YYYY-MM-DD'),
          endDate: selectedDate
            .clone()
            .add(duration, 'day')
            .format('YYYY-MM-DD'),
          list: [],
        });
      } else {
        return {
          data: {
            list: [],
          },
        };
      }
    },
    {
      refreshDeps: [selectedDate, duration],
    },
  );
  useEffect(() => {
    const subs = selectService.getSelectedInfo().subscribe((info: any) => {
      switch (info.type) {
        case 'ADD_ORDER':
          if (duration === -1) {
            return;
          }
          setAddVisible(true);
          break;
        case 'CLOSE_ROOM':
          if (duration === -1) {
            return;
          }
          setCloseVisible(true);
          break;
        case 'OPEN_ROOM':
          services.RoomStateController.batchOpenRooms({
            stateList: openOrCloseList,
          }).then(() => {
            refreshRoomStateStock().then(() => {
              setSelectedRooms([]);
              selectService.sendCancelInfo();
              refreshAllState();
            });
          });

          break;
        default:
          break;
      }
    });

    return () => {
      subs.unsubscribe();
    };
  }, [openOrCloseList, duration, selectedDate]);
  // 获取房间订单-渲染订单单元格
  const {
    data: orderData,
    loading: orderLoading,
    run: refreshAllOrder,
  } = useRequest(
    async () => {
      return services.RoomStateController.getAllRoomOrder({
        startDate: selectedDate.clone().format('YYYY-MM-DD'),
        endDate: selectedDate.clone().add(duration, 'day').format('YYYY-MM-DD'),
      });
    },
    {
      refreshDeps: [selectedDate, duration],
    },
  );

  function findOrderByRecord(record: ROOM_STATE.StateTableData, date?: string) {
    const splitOrders = [];
    const orderList = orderData?.orderList || [];
    for (let i = 0; i < orderList.length; i++) {
      const curOrder = orderList[i];
      const roomList = curOrder?.roomList || [];
      for (let j = 0; j < roomList.length; j++) {
        splitOrders.push({
          ...curOrder,
          ...roomList[j],
        });
      }
    }

    const recDate = moment(date);
    return splitOrders?.find((o) => {
      if (o.roomId !== record.roomId || !o.startDate || !o.endDate) {
        return false;
      }
      const checkinTime = moment(o.startDate);
      const checkoutTime = moment(o.endDate);
      if (recDate.isBetween(checkinTime, checkoutTime, null, '[)')) {
        return true;
      }
      return false;
    });
  }

  function getLeftRoomCount(date: moment.Moment) {
    return stockData?.list?.find((s) => moment(s.date).isSame(date, 'day'))
      ?.roomCount;
  }
  function getCalendarColumns() {
    return (
      calendarList?.map?.((item) => {
        const d = moment(item.date);
        const isWeekend = [0, 6].includes(d.day());
        const dateIsToday = d.isSame(moment(), 'day');
        const dateText = dateIsToday
          ? intl.formatMessage({ id: '今天' })
          : d.format('MM-DD');
        const textType = isWeekend ? 'danger' : undefined;
        return {
          title: (
            <div className={dateIsToday ? 'table-header-today' : ''}>
              <Space size={[10, 0]} style={{ padding: '10px 0' }}>
                <Typography.Text type={textType}>{dateText}</Typography.Text>
                <Typography.Text type={textType || 'secondary'}>
                  {getWeekDay(d)}
                </Typography.Text>
              </Space>
            </div>
          ),
          align: 'center' as AlignType,
          children: [
            {
              align: 'center' as AlignType,
              width: 80,
              title: (
                <div className={dateIsToday ? 'table-header-today' : ''}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, padding: '6px 0', display: 'block' }}
                  >
                    {intl.formatMessage(
                      { id: 'ROOM_LEFT' },
                      { count: getLeftRoomCount(d) || 0 },
                    )}
                  </Typography.Text>
                </div>
              ),
              onCell: (record: ROOM_STATE.StateTableData) => {
                const order = findOrderByRecord(record, item.date);
                if (order) {
                  const checkinTime = moment(order.startDate);
                  const checkoutTime = moment(order.endDate);

                  if (checkinTime.isSame(d)) {
                    const days = checkoutTime.diff(checkinTime, 'days');
                    return {
                      colSpan: Math.abs(days),
                    };
                  } else if (d.isSame(calendarList?.[0]?.date, 'day')) {
                    const days = checkoutTime.diff(d, 'days');
                    return {
                      colSpan: Math.abs(days),
                    };
                  } else {
                    return {
                      colSpan: 0,
                    };
                  }
                }
                return {
                  colSpan: 1,
                };
              },
              render: (_: ReactNode, record: ROOM_STATE.StateTableData) => {
                if (expand) {
                  return (
                    <div className="left-room-box">
                      {record.roomCount}
                      {intl.formatMessage({ id: '间' })}
                    </div>
                  );
                }
                const order = findOrderByRecord(record, item.date);

                if (order) {
                  const dateItem = record.dateList?.find((_item) => {
                    return _item.date === item.date;
                  });
                  return (
                    <OrderDrawer
                      dateItem={dateItem as any}
                      record={record}
                      order={order}
                    />
                  );
                }
                return <EmptyDrawer record={record} date={item.date} />;
              },
            },
          ],
        };
      }) || []
    );
  }

  function getCalendarRows(list: ROOM_STATE.RoomType[] = []) {
    const result = [];
    if (expand) {
      return list;
    }
    for (let i = 0; i < list?.length; i++) {
      const rowOrigin = list[i];
      const roomList = rowOrigin?.roomList;
      if (roomList) {
        for (let j = 0; j < roomList.length; j++) {
          const roomData = roomList[j];
          result.push({
            ...rowOrigin,
            ...roomData,
            rowSpan: j === 0 ? roomList.length : 0,
            id: roomData.roomId,
          });
        }
      }
    }
    return result;
  }

  const columns: ColumnsType<ROOM_STATE.StateTableData> = [
    {
      title: (
        <DatePicker
          bordered={false}
          value={selectedDate}
          onChange={(value) => {
            const selctDate = value || moment();
            setCalendarList(getCalendarDate(duration, selctDate));
            setSelectedDate(selctDate);
            selectService.sendCancelInfo();
          }}
          inputReadOnly
          autoFocus={false}
          allowClear={false}
        />
      ),
      children: [
        {
          title: intl.formatMessage({ id: '房型' }),
          width: 100,
          dataIndex: 'roomTypeName',
          fixed: 'left',
          align: 'center',
          onCell: (record) => {
            return {
              rowSpan: record.rowSpan,
            };
          },
        },
        {
          title: (
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setExpand(!expand);
              }}
            >
              {!expand ? (
                <Space>
                  <span>{intl.formatMessage({ id: '收起' })}</span>
                  <UpOutlined />
                </Space>
              ) : (
                <Space>
                  <span>{intl.formatMessage({ id: '展开' })}</span>
                  <DownOutlined />
                </Space>
              )}
            </div>
          ),
          width: 100,
          dataIndex: 'roomCode',
          fixed: 'left',
          align: 'center',
          render: (_, record) => {
            if (expand) {
              return intl.formatMessage({ id: '剩余' });
            }
            return (
              <RoomCodeBox
                room={record}
                roomList={roomTypeList.reduce(
                  (all, rt) => [...all, ...rt.roomList!],
                  [] as ROOM_STATE.Room[],
                )}
                onStatusChange={(status) => {
                  const copiedRoomTypeList = [...roomTypeList];
                  const room = copiedRoomTypeList
                    ?.find(
                      (roomType) => roomType.roomTypeId === record.roomTypeId,
                    )
                    ?.roomList?.find((room) => room.roomId === record.roomId);
                  if (room) {
                    room.roomStatus = status;
                    setRoomTypeList(copiedRoomTypeList);
                  }
                }}
              />
            );
          },
        },
      ],
    },
    ...getCalendarColumns(),
  ];

  const dataSource = getCalendarRows(rowData?.list);

  return (
    <div className="roome-state-container">
      <Space className="roome-state-calendar-header">
        <Space>
          <Radio.Group
            value={duration}
            buttonStyle="solid"
            onChange={(e) => {
              const dur = e.target.value;
              setCalendarList(getCalendarDate(dur, selectedDate));
              history.replace(
                `/pms/room-state/calendar?defaultDuration=${dur}`,
              );
              setDuration(dur);
              selectService.sendCancelInfo();
            }}
          >
            <Radio.Button value={30}>
              {intl.formatMessage({ id: '30天' })}
            </Radio.Button>
            <Radio.Button value={15}>
              {intl.formatMessage({ id: '15天' })}
            </Radio.Button>
            <Radio.Button value={7}>
              {intl.formatMessage({ id: '7天' })}
            </Radio.Button>
            <Radio.Button value={-1}>
              {intl.formatMessage({ id: '单日房态' })}
            </Radio.Button>
          </Radio.Group>
        </Space>
        <Space>
          <div>{intl.formatMessage({ id: '图例' })}: </div>
          <Tag color="green">{intl.formatMessage({ id: '已预定' })}</Tag>
          <Tag color="rgba(99,151,207, 0.4)">
            {intl.formatMessage({ id: '已入住' })}
          </Tag>
          <Tag color="orange">{intl.formatMessage({ id: '已退房' })}</Tag>
          <Tag color="warning">{intl.formatMessage({ id: '停用房' })}</Tag>
          <Tag color="error">{intl.formatMessage({ id: '维修房' })}</Tag>
          <Tag color="processing">{intl.formatMessage({ id: '保留房' })}</Tag>
          <Tag color="#ccc">{intl.formatMessage({ id: '脏房' })}</Tag>
        </Space>
        {/* <Space>
          <TodayOverviewModal />
          <RoomSituationModal />
          <ChangeLogModal />
        </Space> */}
      </Space>
      {duration === -1 ? (
        <SingleDay />
      ) : (
        <>
          <Table<ROOM_STATE.StateTableData>
            bordered
            size="small"
            sticky={{ offsetHeader: 48 }}
            loading={
              rowLoading || orderLoading || stockLoading || statusLoading
            }
            className="roome-state-calendar-table"
            rowClassName="state-table-row"
            scroll={{ x: 'scroll' }}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowKey="id"
          />

          <OrderFormDrawer
            visible={addVisible}
            onVisibleChange={(v) => {
              if (!v) {
                setSelectedRooms([]);
                selectService.sendCancelInfo();
              }
              setAddVisible(v);
            }}
            rooms={processOrderRoom(selectedRooms)}
            onSubmited={() => {
              setSelectedRooms([]);
              selectService.sendCancelInfo();
              setAddVisible(false);
              refreshAllOrder();
            }}
          />
          <CloseRoomModal
            visible={closeVisible}
            stateList={openOrCloseList}
            onSubmit={() => {
              refreshRoomStateStock().then(() => {
                setSelectedRooms([]);
                selectService.sendCancelInfo();
                setCloseVisible(false);
                refreshAllState();
              });
            }}
            onClose={() => {
              setCloseVisible(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default RoomStatePage;
