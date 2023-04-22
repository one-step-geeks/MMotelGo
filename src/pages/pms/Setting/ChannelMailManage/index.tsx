import React, { useRef } from 'react';
import { Button, Popconfirm } from 'antd';
import CommonCard from '@/components/CommonCard';
import { useIntl } from 'umi';
import { ActionType, ProForm, ProList } from '@ant-design/pro-components';
import EditChannelMailDrawerForm from './EditChannelMailDrawerForm';
import {
  deleteChannelMail,
  getChannelMailList,
} from '@/services/ChannelController';
import './style.less';

const TradeManage: React.FC = () => {
  const intl = useIntl();
  const mailListActionRef = useRef<ActionType>();
  const refreshList = () => {
    mailListActionRef?.current?.reload?.();
  };
  return (
    <div className="channel-mail-manage">
      <CommonCard
        title={intl.formatMessage({ id: '渠道邮箱配置' })}
        titleTool={
          <>
            <EditChannelMailDrawerForm
              onFinish={refreshList}
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
          actionRef={mailListActionRef}
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
            return getChannelMailList().then((res) => {
              (res as any).data = (res.data || []).map((item) => {
                return {
                  title: item.emailAddr,
                  actions: [
                    <EditChannelMailDrawerForm
                      onFinish={refreshList}
                      id={item.id}
                      emailAddr={item.emailAddr}
                      trigger={<a>编辑</a>}
                    />,
                    <Popconfirm
                      title="确认要删除么"
                      onConfirm={() =>
                        deleteChannelMail(item.id).then(refreshList)
                      }
                    >
                      <a>删除</a>
                    </Popconfirm>,
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
