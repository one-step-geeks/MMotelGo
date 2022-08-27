import { useState } from 'react';
import { useRequest } from 'umi';
import { Button, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import services from '@/services';
import SortableList from '@/components/SortableList';
import PaymentCard from './components/PaymentCard';

export default () => {
  const [newType, setNewType] = useState<SETTING.PaymentType | undefined>();

  const { data: types, loading, run: executeReq } = useRequest(
    () => {
      return services.FinanceController.queryPaymentTypes();
    },
    {
      refreshDeps: [],
    },
  );

  return (
    <PageContainer ghost title={false} style={{ display: 'flex' }}>
      <div style={{ textAlign: 'right', paddingBottom: '12px' }}>
        <Button
          type="primary"
          disabled={loading || !!newType}
          onClick={() => {
            setNewType({ name: '' });
          }}
        >
          新增收款方式
        </Button>
      </div>
      {
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
      }
      {newType ? (
        <PaymentCard
          onChange={() => {
            setNewType(undefined);
            executeReq();
          }}
          value={newType}
        />
      ) : null}
    </PageContainer>
  );
};