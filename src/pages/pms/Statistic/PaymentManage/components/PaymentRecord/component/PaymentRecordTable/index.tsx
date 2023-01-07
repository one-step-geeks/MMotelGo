import React, { useContext, useMemo } from 'react';
import { useIntl } from 'umi';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import PaymentRecordExportModalForm from '../ExportModalForm';
import { PaymentRecordContext } from '../../context';
import './style.less';

const PaymentRecordTable: React.FC = () => {
  const intl = useIntl();
  const { tableActionRef, tableFormRef } = useContext(PaymentRecordContext);
  const columns = useMemo<ProColumns[]>(() => {
    return [
      {
        title: intl.formatMessage({ id: '项目' }),
      },
      {
        title: intl.formatMessage({ id: '收款时间' }),
      },
      {
        title: intl.formatMessage({ id: '支付方式' }),
      },
      {
        title: intl.formatMessage({ id: '收款金额' }),
      },
      {
        title: intl.formatMessage({ id: '入住时间' }),
      },
      {
        title: intl.formatMessage({ id: '操作人' }),
      },
      {
        title: intl.formatMessage({ id: '操作时间' }),
      },
      {
        title: intl.formatMessage({ id: '关联订单' }),
        render: () => {
          return <a>123123</a>;
        },
      },
      {
        title: intl.formatMessage({ id: '联系人' }),
      },
      {
        title: intl.formatMessage({ id: '联系电话' }),
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
        toolBarRender={() => {
          return [<PaymentRecordExportModalForm key="1" />];
        }}
      />
    </div>
  );
};

export default PaymentRecordTable;
