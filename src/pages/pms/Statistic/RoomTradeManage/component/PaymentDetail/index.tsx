import { TradeStatisticContext } from '../../context';
import React, { useMemo, useState, useContext } from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';
import { RangeValue } from 'rc-picker/lib/interface';

import { Button } from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getRangeDate } from '@/utils';
import {
  paymentDetailExport,
  RoomTradeManageEnum,
  fetchPaymentDetail,
  paymentDetailTrans,
  fetchRoomRentDetail,
  fetchRoomNightDetail,
  roomRentDetailExport,
  roomNightDetailExport,
  fetchOccupancyDetail,
  occupancyDetailExport,
  averageRoomRevenueDetailExport,
  fetchAverageRoomRevenueDetail,
} from '@/services/StatisticController';
import './style.less';

const PaymentDetailTable: React.FC = () => {
  const intl = useIntl();
  const { store, paymentDetailActionRef } = useContext(TradeStatisticContext);
  const { collectDateRange } = store;
  const [activeKey, setActiveKey] = useState<React.Key>(
    String(RoomTradeManageEnum.ROOM_COST),
  );
  const [rangeDayList, setRangeDayList] = useState<string[]>([]);
  const [rowSpanList, setRowSpanList] = useState<number[]>([]);
  const columns = useMemo<ProColumns[]>(() => {
    const priceSymbol = [
      RoomTradeManageEnum.OCCUPANCY,
      RoomTradeManageEnum.JIAN_YE,
    ].includes(activeKey as any)
      ? ''
      : intl.formatMessage({ id: '¥' });
    return (
      [
        {
          title: intl.formatMessage({ id: '房型' }),
          fixed: 'left',
          dataIndex: 'roomTypeName',
          width: 100,
          onCell: (record, index = 0) => {
            return {
              rowSpan:
                typeof rowSpanList[index] === 'number' ? rowSpanList[index] : 1,
            };
          },
        },
        [RoomTradeManageEnum.ROOM_COST, RoomTradeManageEnum.JIAN_YE].includes(
          activeKey as any,
        ) && {
          title: intl.formatMessage({ id: '房间' }),
          fixed: 'left',
          dataIndex: 'roomCode',
          width: 100,
          render: (roomCode) => {
            return roomCode === '-' ? '' : roomCode;
          },
        },
        {
          title: intl.formatMessage({ id: '合计' }),
          fixed: 'left',
          dataIndex: 'total',
          width: 100,
          render: (price) => {
            return `${priceSymbol}${price === '-' ? 0 : price}`;
          },
        },
        ...rangeDayList.map((item) => {
          return {
            title: item,
            width: 150,
            dataIndex: item,
            render: (price) => {
              return `${priceSymbol}${price === '-' ? 0 : price}`;
            },
          } as ProColumns;
        }),
      ] as ProColumns[]
    ).filter(Boolean);
  }, [rangeDayList, rowSpanList]);
  return (
    <div className="payment-detail">
      <CommonCard
        title={intl.formatMessage({ id: '支付方式明细' })}
        subTitle={
          collectDateRange?.length
            ? collectDateRange
                ?.map((item) => item?.format('YYYY-MM-DD'))
                .join(' ~ ')
            : ''
        }
      >
        <div className="payment-detail-card-warp">
          <ProTable
            actionRef={paymentDetailActionRef}
            columns={columns}
            pagination={false}
            toolbar={{
              settings: [],
              actions: [
                <Button
                  onClick={() => {
                    const timeParams = getRangeDate(collectDateRange);
                    let request = roomNightDetailExport;
                    if (activeKey === RoomTradeManageEnum.ROOM_COST) {
                      request = roomRentDetailExport;
                    }
                    if (activeKey === RoomTradeManageEnum.OCCUPANCY) {
                      request = occupancyDetailExport as any;
                    }
                    if (
                      activeKey === RoomTradeManageEnum.AVERAGE_ROOM_REVENUE
                    ) {
                      request = averageRoomRevenueDetailExport as any;
                    }
                    request({
                      ...timeParams,
                    });
                  }}
                  type="primary"
                >
                  {intl.formatMessage({ id: '报表导出' })}
                </Button>,
              ],
              menu: {
                type: 'tab',
                activeKey: activeKey,
                items: [
                  {
                    key: RoomTradeManageEnum.ROOM_COST,
                    label: intl.formatMessage({
                      id: RoomTradeManageEnum.ROOM_COST,
                    }),
                  },
                  {
                    key: RoomTradeManageEnum.JIAN_YE,
                    label: intl.formatMessage({
                      id: RoomTradeManageEnum.JIAN_YE,
                    }),
                  },
                  {
                    key: RoomTradeManageEnum.OCCUPANCY,
                    label: intl.formatMessage({
                      id: RoomTradeManageEnum.OCCUPANCY,
                    }),
                  },
                  {
                    key: RoomTradeManageEnum.AVERAGE_ROOM_REVENUE,
                    label: intl.formatMessage({
                      id: RoomTradeManageEnum.AVERAGE_ROOM_REVENUE,
                    }),
                  },
                ],
                onChange: (key) => {
                  setActiveKey(key as any);
                  setTimeout(() => {
                    paymentDetailActionRef?.current?.reload?.();
                  }, 50);
                },
              },
            }}
            scroll={{
              x: 'max-content',
              y: 500,
            }}
            search={false}
            rowKey="paymentId"
            request={async (params) => {
              const timeParams = getRangeDate(collectDateRange);
              let request = fetchRoomNightDetail;
              if (activeKey === RoomTradeManageEnum.ROOM_COST) {
                request = fetchRoomRentDetail;
              }
              if (activeKey === RoomTradeManageEnum.OCCUPANCY) {
                request = fetchOccupancyDetail as any;
              }
              if (activeKey === RoomTradeManageEnum.AVERAGE_ROOM_REVENUE) {
                request = fetchAverageRoomRevenueDetail as any;
              }
              return request({
                ...timeParams,
              }).then((res) => {
                setRangeDayList(res.dayList);
                setRowSpanList(res.totalRowSpanList);
                return {
                  data: res.list,
                };
              });
            }}
          />
        </div>
      </CommonCard>
    </div>
  );
};

export default PaymentDetailTable;
