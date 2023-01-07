import React, { useContext } from 'react';
import { useIntl } from 'umi';
import { Alert, Button } from 'antd';
import { DrawerForm } from '@ant-design/pro-form';
import { PaymentRecordContext } from '../../context';

const PaymentRecordExportModalForm: React.FC = () => {
  const intl = useIntl();
  const { drawerFormRef } = useContext(PaymentRecordContext);
  return (
    <DrawerForm
      formRef={drawerFormRef}
      trigger={
        <Button type="primary">{intl.formatMessage({ id: '报表导出' })}</Button>
      }
    ></DrawerForm>
  );
};

export default PaymentRecordExportModalForm;
