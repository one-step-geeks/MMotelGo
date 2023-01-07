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
        title: '项目',
      },
      {
        title: '收款时间',
      },
      {
        title: '支付方式',
      },
      {
        title: '收款金额',
      },
      {
        title: '入住时间',
      },
      {
        title: '操作人',
      },
      {
        title: '操作时间',
      },
      {
        title: '关联订单',
        render: () => {
          return <a>123123</a>;
        },
      },
      {
        title: '联系人',
      },
      {
        title: '联系电话',
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
