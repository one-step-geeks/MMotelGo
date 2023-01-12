import React from 'react';
import { Button, Result } from 'antd';
import CommonCard from '@/components/CommonCard';
import { useIntl } from 'umi';
import { ProForm, ProList } from '@ant-design/pro-components';
import EditChannelMailDrawerForm from './EditChannelMailDrawerForm';
import {
  deleteChannelMail,
  getChannelMailList,
} from '@/services/ChannelController';

const TradeManage: React.FC = () => {
  const intl = useIntl();
  return (
    <div className="channel-mail-manage">
      <CommonCard
        title={intl.formatMessage({ id: '渠道邮箱配置' })}
        titleTool={
          <>
            <EditChannelMailDrawerForm
              trigger={
                <Button type="primary">
                  {' '}
                  + {intl.formatMessage({ id: '新增渠道邮箱' })}
                </Button>
              }
            />
          </>
        }
      >
        <ProList<any>
          itemCardProps={{
            bodyStyle: { paddingBottom: 0, paddingTop: 16 },
          }}
          pagination={false}
          showActions="always"
          rowSelection={{}}
          grid={{ gutter: 16, column: 2 }}
          metas={{
            title: {},
            subTitle: {},
            type: {},
            actions: {},
          }}
          request={async () => {
            return getChannelMailList(1).then((res) => {
              (res as any).data = (res.data || []).map((item) => {
                return {
                  title: item.emailAddr,
                  actions: [
                    <EditChannelMailDrawerForm
                      id={item.id}
                      trigger={<a>编辑</a>}
                    />,
                    <a onClick={() => deleteChannelMail(item.id)}>删除</a>,
                  ],
                };
              });
              return res;
            });
          }}
        />
      </CommonCard>
    </div>
  );
};

export default TradeManage;
