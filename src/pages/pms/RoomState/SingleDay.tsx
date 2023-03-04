import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Typography,
  Skeleton,
  Space,
  Row,
  Col,
  DatePicker,
  Select,
  Checkbox,
} from 'antd';
import { useRequest, useIntl, useModel } from 'umi';
import { useOrderDetailDrawer } from '../Order/components/OrderDetailDrawer';
import CloseRoomModal from './components/CloseRoomModal';
import SingleDayBox from './components/SingleDayBox';
import { selectService } from './components/service';
import { processOpenAndClose, processOrderRoom } from './index';
import OrderFormDrawer from '../Order/components/OrderFormDrawer';
import moment from 'moment';
import services from '@/services';
import './single.less';

const CheckboxGroup = Checkbox.Group;

const { Text } = Typography;
const { Option } = Select;

const SingleDay: React.FC = () => {
  const intl = useIntl();
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const [sortType, setSortType] = useState(1);
  const [statusList, setStatusList] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { selectedRooms, setSelectedRooms } = useModel('state');
  const [closeVisible, setCloseVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);

  const { OrderDetailDrawer, openOrderDetailDrawer } =
    useOrderDetailDrawer();
    // () => {
    //   // TODO
    // },
    // () => {
    //   // TODO
    // },

  const openOrCloseList = useMemo(
    () => processOpenAndClose(selectedRooms),
    [selectedRooms],
  );

  useEffect(() => {
    const subs = selectService.getSelectedInfo().subscribe((info: any) => {
      switch (info.type) {
        case 'ADD_ORDER':
          setAddVisible(true);
          break;
        case 'SHOW_ORDER':
          openOrderDetailDrawer(info.orderId);
          break;
        case 'CLOSE_ROOM':
          setCloseVisible(true);
          break;
        case 'OPEN_ROOM':
          services.RoomStateController.batchOpenRooms({
            stateList: openOrCloseList,
          });
          setSelectedRooms([]);
          selectService.sendCancelInfo();
          refreshAllState();
          break;
        default:
          break;
      }
    });

    return () => {
      subs.unsubscribe();
    };
  }, [openOrCloseList]);

  const { data: enumData, loading: enumLoading } = useRequest(() => {
    return services.RoomStateController.getRoomStatusEnum().then((res) => {
      setStatusList(res.data?.list?.map((item) => item.code) || []);
      setIsReady(true);
      return res;
    });
  });

  // 获取房间订单-渲染订单单元格
  const {
    data: orderData,
    loading: orderLoading,
    run: refreshAllOrder,
  } = useRequest(
    async () => {
      return services.RoomStateController.getAllRoomOrder({
        startDate: selectedDate.clone().format('YYYY-MM-DD'),
        endDate: selectedDate.clone().add(1, 'day').format('YYYY-MM-DD'),
      });
    },
    {
      refreshDeps: [selectedDate],
    },
  );

  // 获取房态列表
  const { data: statusData, loading: statusLoading } = useRequest(async () => {
    return services.RoomStateController.getRoomStatusList({
      roomTypeIdList: [],
    });
  });

  const {
    data,
    loading,
    run: refreshAllState,
  } = useRequest(
    () => {
      return services.RoomStateController.getSingleDayRoomState({
        stateDate: selectedDate.format('YYYY-MM-DD'),
        sortType,
        statusList,
      });
    },
    {
      refreshDeps: [selectedDate, sortType, statusList],
      ready: isReady,
    },
  );

  function findOrderByRecord(roomId: number) {
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

    return splitOrders?.find((o) => {
      if (o.roomId !== roomId || !o.startDate || !o.endDate) {
        return false;
      }
      const checkinTime = moment(o.startDate);
      const checkoutTime = moment(o.endDate);
      if (selectedDate.isBetween(checkinTime, checkoutTime, null, '[]')) {
        return true;
      }
      return false;
    });
  }

  return (
    <div className="single-day-container">
      <Row gutter={24}>
        <Col span={18}>
          <Skeleton
            loading={orderLoading || statusLoading || enumLoading || loading}
          >
            {data?.list?.map?.((item) => {
              return (
                <div className="single-day-card" key={item.roomTypeId}>
                  <Space>
                    <Text className="title">{item.roomTypeName}</Text>
                    <Text type="secondary">
                      (共{item?.roomList?.length || 0}间)
                    </Text>
                  </Space>
                  <Space wrap size={[12, 12]} className="box-wrap">
                    {item?.roomList?.map((room) => {
                      const order = findOrderByRecord(room.roomId);
                      return (
                        <SingleDayBox
                          key={room.roomId}
                          room={
                            {
                              ...room,
                              roomTypeId: item.roomTypeId,
                              roomTypeName: item.roomTypeName,
                            } as any
                          }
                          order={order as any}
                          date={selectedDate.format('YYYY-MM-DD')}
                          roomList={statusData?.roomTypeList?.reduce(
                            (all, rt) => [...all, ...rt.roomList!],
                            [] as ROOM_STATE.Room[],
                          )}
                        />
                      );
                    })}
                  </Space>
                </div>
              );
            }) || null}
          </Skeleton>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            bordered={false}
            title={intl.formatMessage({ id: '日期筛选' })}
          >
            <DatePicker
              inputReadOnly
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date || moment());
              }}
              disabledDate={(d) => d.isBefore(moment(), 'day')}
              allowClear={false}
              style={{ width: '100%' }}
            />
          </Card>
          <Card
            size="small"
            bordered={false}
            title={intl.formatMessage({ id: '房型筛选' })}
          >
            <Select
              style={{ width: '100%' }}
              value={sortType}
              onChange={(type) => setSortType(type)}
            >
              <Option value={1}>
                {intl.formatMessage({ id: '按房型排序' })}
              </Option>
              <Option value={2}>
                {intl.formatMessage({ id: '按房间排序' })}
              </Option>
              <Option value={3}>
                {intl.formatMessage({ id: '按房间分组排序' })}
              </Option>
            </Select>
          </Card>
          <Card
            size="small"
            bordered={false}
            title={intl.formatMessage({ id: '房态筛选' })}
          >
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Checkbox
                  checked={statusList?.length === enumData?.list?.length}
                  indeterminate={
                    !!enumData?.list?.length &&
                    statusList?.length > 0 &&
                    statusList?.length < enumData?.list?.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setStatusList(
                        enumData?.list?.map((item) => item.code) || [],
                      );
                    } else {
                      setStatusList([]);
                    }
                  }}
                >
                  {intl.formatMessage({ id: '全部' })}
                </Checkbox>
              </Col>
              <CheckboxGroup
                onChange={(l) => {
                  setStatusList(l as number[]);
                }}
                value={statusList}
              >
                <Row gutter={[16, 8]}>
                  {enumData?.list?.map((item) => (
                    <Col span={8} key={item.code}>
                      <Checkbox value={item.code}>
                        {intl.formatMessage({ id: item.desc })}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </CheckboxGroup>
            </Row>
          </Card>
        </Col>
      </Row>
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
          setSelectedRooms([]);
          selectService.sendCancelInfo();
          setCloseVisible(false);
          refreshAllState();
        }}
        onClose={() => {
          setCloseVisible(false);
        }}
      />
      {OrderDetailDrawer}
    </div>
  );
};

export default SingleDay;
