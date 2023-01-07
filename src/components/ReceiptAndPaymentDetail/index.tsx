import React, { useMemo, useState } from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';
import { RangeValue } from 'rc-picker/lib/interface';

import { Button } from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getRangeDate } from '@/utils';
import {
  paymentDetailExport,
  PaymentDetailTypeEnum,
  fetchPaymentDetail,
  paymentDetailTrans,
} from '@/services/StatisticController';
import './style.less';

export interface PaymentDetailProps {
  collectDateRange: RangeValue<moment.Moment>;
  paymentDetailActionRef: React.RefObject<ActionType>;
}

const PaymentDetailTable: React.FC<PaymentDetailProps> = (props) => {
  const intl = useIntl();
  const { collectDateRange, paymentDetailActionRef } = props;
  const [activeKey, setActiveKey] = useState<React.Key>(
    String(PaymentDetailTypeEnum.NET_RECEIPTS),
  );
  const [rangeDayList, setRangeDayList] = useState<string[]>([]);
  const columns = useMemo<ProColumns[]>(() => {
    return [
      {
        title: intl.formatMessage({ id: '支付方式' }),
        fixed: 'left',
        dataIndex: 'paymentName',
        width: 100,
      },
      ...rangeDayList.map((item) => {
        return {
          title: item,
          width: 150,
          dataIndex: item,
        } as ProColumns;
      }),
    ];
  }, [rangeDayList]);
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
            toolbar={{
              settings: [],
              actions: [
                <Button
                  onClick={() => {
                    const timeParams = getRangeDate(collectDateRange);
                    paymentDetailExport(timeParams);
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
                    key: String(PaymentDetailTypeEnum.NET_RECEIPTS),
                    label:
                      paymentDetailTrans[PaymentDetailTypeEnum.NET_RECEIPTS],
                  },
                  {
                    key: String(PaymentDetailTypeEnum.RECEIPTS),
                    label: paymentDetailTrans[PaymentDetailTypeEnum.RECEIPTS],
                  },
                  {
                    key: String(PaymentDetailTypeEnum.RECEIPTS_CASH_PLEDGE),
                    label:
                      paymentDetailTrans[
                        PaymentDetailTypeEnum.RECEIPTS_CASH_PLEDGE
                      ],
                  },
                  {
                    key: String(PaymentDetailTypeEnum.REFUND),
                    label: paymentDetailTrans[PaymentDetailTypeEnum.REFUND],
                  },
                  {
                    key: String(PaymentDetailTypeEnum.REFUND_CASH_PLEDGE),
                    label:
                      paymentDetailTrans[
                        PaymentDetailTypeEnum.REFUND_CASH_PLEDGE
                      ],
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
            }}
            search={false}
            request={async (params) => {
              const timeParams = getRangeDate(collectDateRange);
              return fetchPaymentDetail({
                ...timeParams,
                type: Number(activeKey),
              }).then((res) => {
                setRangeDayList(res.paymentDayList);
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
