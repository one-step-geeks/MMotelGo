import { useEffect, useState } from 'react';
import { useIntl, useRequest } from 'umi';
import { Button, message } from 'antd';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import services from '@/services';
import SortableList from '@/components/SortableList';
import PaymentCard from './components/PaymentCard';

export default () => {
  const intl = useIntl();
  const [newType, setNewType] = useState<SETTING.PaymentType | undefined>();

  const {
    data: types,
    loading,
    run: executeReq,
  } = useRequest(services.FinanceController.queryPaymentTypes);

  return (
    <PageContainer pageHeaderRender={() => <></>} ghost>
      <ProCard
        ghost
        title={intl.formatMessage({ id: '收款方式设置' })}
        bordered
        extra={[
          <Button
            type="primary"
            disabled={loading || !!newType}
            onClick={() => {
              setNewType({ name: '' });
            }}
          >
            {intl.formatMessage({ id: '添加' })}
          </Button>,
        ]}
      >
        <>
          <SortableList
            dataSource={(types || []).sort((a, b) => a.sort! - b.sort!)}
            style={{
              display: 'inline',
            }}
            onChange={async (list) => {
              await services.FinanceController.sortPaymentTypes(
                list.map((d) => d.id) as Array<number>,
              );
              message.success('排序成功');
            }}
            renderItem={(item) => {
              return <PaymentCard onChange={executeReq} value={item} />;
            }}
          />
          {newType ? (
            <PaymentCard
              onChange={() => {
                setNewType(undefined);
                executeReq();
              }}
              value={newType}
            />
          ) : null}
        </>
      </ProCard>
    </PageContainer>
  );
};
