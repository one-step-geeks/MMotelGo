import { useState } from 'react';
import { useRequest, useIntl } from 'umi';
import { Button, message, Popover } from 'antd';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import services from '@/services';
import SortableList from '@/components/SortableList';
import ChannelCard from './components/ChannelCard';
import { QuestionCircleOutlined } from '@ant-design/icons';
import channelExample from '@/assets/images/channelExample.png';
import channelExampleEn from '@/assets/images/channelExampleEn.png';
import { getLocale } from 'umi';

export default () => {
  const intl = useIntl();
  const [newType, setNewType] = useState<SETTING.Channel | undefined>();

  const {
    data: types,
    loading,
    run: executeReq,
  } = useRequest(services.ChannelController.queryChannels);

  return (
    <PageContainer pageHeaderRender={() => null} ghost>
      <ProCard
        ghost
        title={
          <>
            {intl.formatMessage({ id: '自定义渠道设置' })}{' '}
            <Popover
              title={intl.formatMessage({ id: '使用场景' })}
              content={
                <img
                  src={
                    getLocale() === 'en-US' ? channelExampleEn : channelExample
                  }
                />
              }
            >
              <QuestionCircleOutlined style={{ marginLeft: 4 }} />
            </Popover>
          </>
        }
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
      </ProCard>
    </PageContainer>
  );
};
