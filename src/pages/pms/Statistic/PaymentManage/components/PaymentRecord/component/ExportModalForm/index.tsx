import React from 'react';
import { useIntl } from 'umi';
import { Alert, Button } from 'antd';
import { DrawerForm } from '@ant-design/pro-form';

const PaymentRecordExportModalForm: React.FC = () => {
  const intl = useIntl();

  return (
    <DrawerForm
      trigger={
        <Button type="primary">{intl.formatMessage({ id: '报表导出' })}</Button>
      }
    ></DrawerForm>
  );
};

export default PaymentRecordExportModalForm;
