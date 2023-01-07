import React, { useMemo, useState } from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';
import { RangeValue } from 'rc-picker/lib/interface';

import './style.less';
import { Button } from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getRangeDate, transformRangeDate } from '@/utils';
import {
  exportSummary,
  fetchSumFormData,
  PaymentItem,
} from '@/services/StatisticController';

export interface PaymentDetailProps {
  collectDateRange: RangeValue<moment.Moment>;
  paymentDetailActionRef: React.Ref<ActionType>;
}

const PaymentDetailTable: React.FC<PaymentDetailProps> = (props) => {
  const intl = useIntl();
  const { collectDateRange, paymentDetailActionRef } = props;
  const [dataSource, setDataSource] = useState<PaymentItem[]>([]);
  const columns = useMemo<ProColumns[]>(() => {
    const rangeDayList = transformRangeDate(collectDateRange);
    return [
      {
        title: intl.formatMessage({ id: '项目' }),
        fixed: 'left',
        dataIndex: 'project',
        width: 100,
        render: (_, index, ...args) => {
          return (index as number) < dataSource.length - 1
            ? _
            : intl.formatMessage({ id: '合计' });
        },
        onCell: (_, index) => {
          return {
            colSpan: (index as number) < dataSource.length - 1 ? 1 : 2,
          };
        },
      },
      {
        title: intl.formatMessage({ id: '明细' }),
        fixed: 'left',
        dataIndex: 'detail',
        width: 100,
      },
      {
        title: intl.formatMessage({ id: '合计' }),
        fixed: 'left',
        width: 100,
        dataIndex: 'total',
      },
      ...rangeDayList.map((item) => {
        return {
          title: item,
          width: 150,
          dataIndex: item,
        } as ProColumns;
      }),
    ];
  }, [collectDateRange, dataSource]);
  return (
    <div className="payment-detail">
      <CommonCard
        title={intl.formatMessage({ id: '营业明细' })}
        subTitle={
          collectDateRange?.length
            ? collectDateRange
                ?.map((item) => item?.format('YYYY-MM-DD'))
                .join(' ~ ')
            : ''
        }
        titleTool={
          <Button
            onClick={() => {
              const timeParams = getRangeDate(collectDateRange);
              exportSummary(timeParams);
            }}
            type="primary"
          >
            {intl.formatMessage({ id: '报表导出' })}
          </Button>
        }
      >
        <div className="payment-detail-card-warp">
          <ProTable
            actionRef={paymentDetailActionRef}
            columns={columns}
            scroll={{
              x: 'max-content',
            }}
            toolBarRender={false}
            search={false}
            request={async (params) => {
              const timeParams = getRangeDate(collectDateRange);
              return fetchSumFormData(timeParams).then((res) => {
                setDataSource(res);
                return {
                  data: res,
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
