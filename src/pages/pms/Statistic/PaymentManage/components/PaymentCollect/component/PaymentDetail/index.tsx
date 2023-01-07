import React, { useContext, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import CommonCard from '@/components/CommonCard';

import './style.less';
import { PaymentCollectContext } from '../../context';
import { Button } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getRangeDate, transformRangeDate } from '@/utils';
import { fetchSumFormData } from '@/services/StatisticController';

const PaymentDetail: React.FC = () => {
  const intl = useIntl();

  const { store, paymentDetailActionRef } = useContext(PaymentCollectContext);
  const { collectDateRange } = store;
  const columns = useMemo<ProColumns[]>(() => {
    const rangeDayList = transformRangeDate(collectDateRange);
    return [
      {
        title: intl.formatMessage({ id: '项目' }),
        fixed: 'left',
        dataIndex: 'project',
        width: 100,
        render: (_, index, ...args) => {
          console.log(...args);
          return (index as number) < 4 ? _ : intl.formatMessage({ id: '合计' });
        },
        onCell: (_, index) => ({
          colSpan: (index as number) < 4 ? 1 : 2,
        }),
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
  }, [collectDateRange]);
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
          <Button type="primary">
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
              return fetchSumFormData({
                ...timeParams,
              }).then((res) => {
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

export default PaymentDetail;
