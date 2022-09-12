import { useState } from 'react';
import { useRequest, useIntl } from 'umi';
import { Button, message } from 'antd';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import services from '@/services';
import SortableList from '@/components/SortableList';
import ChannelCard from './components/ChannelCard';

export default () => {
  const intl = useIntl();
  const [newType, setNewType] = useState<SETTING.Channel | undefined>();

  const {
    data: types,
    loading,
    run: executeReq,
  } = useRequest(services.ChannelController.queryChannels);

  return (
    <PageContainer pageHeaderRender={() => <></>} ghost>
      <ProCard
        ghost
        title={intl.formatMessage({ id: '渠道设置' })}
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
              await services.ChannelController.sortChannels(
                list.map((d) => d.id) as Array<number>,
              );
              message.success('排序成功');
            }}
            renderItem={(item) => {
              return <ChannelCard onChange={executeReq} value={item} />;
            }}
          />
          {newType ? (
            <div style={{ display: 'inline' }}>
              <ChannelCard
                onChange={() => {
                  setNewType(undefined);
                  executeReq();
                }}
                value={newType}
              />
            </div>
          ) : null}
        </>
      </ProCard>
    </PageContainer>
  );
};
