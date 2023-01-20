import React from 'react';
import { Button, Result } from 'antd';
import CommonCard from '@/components/CommonCard';
import { useIntl, useHistory } from 'umi';
import { ProList } from '@ant-design/pro-components';
import {
  ChannelStatusEnum,
  channelStatustrans,
  getChannelList,
} from '@/services/ChannelController';

const TradeManage: React.FC = () => {
  const intl = useIntl();
  const reactHistory = useHistory();

  return (
    <CommonCard
      title={intl.formatMessage({ id: '订单自动化支持' })}
      titleTool={
        <>
          {/* <Button style={{ marginRight: 8 }} type="primary">
            {intl.formatMessage({ id: '同步邮件渠道' })}
          </Button> */}
          <Button
            onClick={() =>
              reactHistory.push('/pms/setting/channel-mail-manage')
            }
            type="primary"
          >
            {intl.formatMessage({ id: '渠道邮箱配置' })}
          </Button>
        </>
      }
    >
      <ProList<any>
        itemCardProps={{}}
        pagination={false}
        showActions="always"
        rowSelection={{}}
        grid={{ gutter: 16, column: 5 }}
        metas={{
          title: {},
          subTitle: {},
          type: {},
          avatar: {},
          content: {},
          actions: {},
        }}
        request={async (params) => {
          return getChannelList().then((res) => {
            (res as any).data = (res.data || []).map((item) => {
              return {
                title: item.name,
                avatar: item.picUrl,
                content: (
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: 200,
                      }}
                    >
                      <div>
                        {channelStatustrans[item.status as ChannelStatusEnum]}
                      </div>
                    </div>
                  </div>
                ),
              };
            });
            return res;
          });
        }}
      />
    </CommonCard>
  );
};

export default TradeManage;
