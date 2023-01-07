import React, { useContext, useMemo } from 'react';
import { useIntl } from 'umi';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import PaymentRecordExportModalForm from '../ExportModalForm';
import { PaymentRecordContext } from '../../context';
import './style.less';
import {
  PaymentDetailTypeEnum,
  fetchSelectPaymentRecord,
  paymentDetailTrans,
  paymentRecordExport,
} from '@/services/StatisticController';
import { queryPaymentTypes } from '@/services/FinanceController';
import { Button } from 'antd';

const PaymentRecordTable: React.FC = () => {
  const intl = useIntl();
  const { tableActionRef, tableFormRef } = useContext(PaymentRecordContext);
  const columns = useMemo<ProColumns[]>(() => {
    return [
      {
        title: intl.formatMessage({ id: '收款时间' }),
        valueType: 'dateRange',
        dataIndex: 'date',
        hideInTable: true,
      },
      {
        title: intl.formatMessage({ id: '类型' }),
        valueType: 'select',
        dataIndex: 'type',
        hideInTable: true,
        valueEnum: {
          [PaymentDetailTypeEnum.NET_RECEIPTS]: {
            text: paymentDetailTrans[PaymentDetailTypeEnum.NET_RECEIPTS],
          },
          [PaymentDetailTypeEnum.RECEIPTS]: {
            text: paymentDetailTrans[PaymentDetailTypeEnum.RECEIPTS],
          },
          [PaymentDetailTypeEnum.RECEIPTS_CASH_PLEDGE]: {
            text: paymentDetailTrans[
              PaymentDetailTypeEnum.RECEIPTS_CASH_PLEDGE
            ],
          },
          [PaymentDetailTypeEnum.REFUND]: {
            text: paymentDetailTrans[PaymentDetailTypeEnum.REFUND],
          },
          [PaymentDetailTypeEnum.REFUND_CASH_PLEDGE]: {
            text: paymentDetailTrans[PaymentDetailTypeEnum.REFUND_CASH_PLEDGE],
          },
        },
      },
      {
        title: intl.formatMessage({ id: '收款方式' }),
        valueType: 'select',
        fieldProps: {
          multiple: true,
        },
        dataIndex: 'paymentIds',
        request: () => {
          return queryPaymentTypes().then((res) => {
            return res.data.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          });
        },
        hideInTable: true,
      },
      {
        title: intl.formatMessage({ id: '项目' }),
        dataIndex: 'project',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '收款时间' }),
        dataIndex: 'paymentDate',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '支付方式' }),
        dataIndex: 'paymentName',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '收款金额' }),
        dataIndex: 'amount',
        search: false,
        render: (amount) => {
          return `${intl.formatMessage({ id: '¥' })}${amount}`;
        },
      },
      {
        title: intl.formatMessage({ id: '入住时间' }),
        dataIndex: 'checkInDate',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '操作人' }),
        dataIndex: 'operator',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '操作时间' }),
        dataIndex: 'updateTime',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '关联订单' }),
        dataIndex: 'orderNo',
        search: false,
        render: (orderNo) => {
          return <a>{orderNo}</a>;
        },
      },
      {
        title: intl.formatMessage({ id: '联系人' }),
        dataIndex: 'contacts',
        search: false,
      },
      {
        title: intl.formatMessage({ id: '联系电话' }),
        dataIndex: 'phone',
        search: false,
      },
    ];
  }, []);
  return (
    <div className="payment-manage-record-table">
      <ProTable
        columns={columns}
        actionRef={tableActionRef}
        formRef={tableFormRef}
        toolbar={{
          settings: [],
        }}
        scroll={{
          x: 'max-content',
        }}
        request={async (params) => {
          const { pageSize, current, type, date, paymentIds } = params;
          const [startTime, endTime] = date || [];
          return fetchSelectPaymentRecord({
            pageSize,
            pageNum: current,
            type: Number(type),
            startTime,
            endTime,
            paymentIds,
          });
        }}
        toolBarRender={() => {
          return [
            <Button
              onClick={() => {
                const params = tableFormRef.current.getFieldsValue();
                const { type, date, paymentIds } = params;
                const [startTime, endTime] = date || [];
                paymentRecordExport({
                  type: Number(type),
                  startTime,
                  endTime,
                  paymentIds,
                });
              }}
              type="primary"
            >
              {intl.formatMessage({ id: '报表导出' })}
            </Button>,
          ];
        }}
      />
    </div>
  );
};

export default PaymentRecordTable;
