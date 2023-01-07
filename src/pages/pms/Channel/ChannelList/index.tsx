import React from 'react';
import { Button, Result } from 'antd';
import CommonCard from '@/components/CommonCard';
import { useIntl } from 'umi';
import { ProList } from '@ant-design/pro-components';

const TradeManage: React.FC = () => {
  const intl = useIntl();
  const data = [
    '语雀的天空',
    'Ant Design',
    '蚂蚁金服体验科技',
    'TechUI',
    'TechUI 2.0',
    'Bigfish',
    'Umi',
    'Ant Design Pro',
  ].map((item) => ({
    title: item,
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
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
          <div>发布中</div>
        </div>
      </div>
    ),
  }));
  return (
    <CommonCard
      title={intl.formatMessage({ id: '订单自动化支持' })}
      titleTool={
        <>
          <Button style={{ marginRight: 8 }} type="primary">
            {intl.formatMessage({ id: '同步邮件渠道' })}
          </Button>
          <Button type="primary">
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
        grid={{ gutter: 16, column: 4 }}
        onItem={(record: any) => {
          return {
            onMouseEnter: () => {
              console.log(record);
            },
            onClick: () => {
              console.log(record);
            },
          };
        }}
        metas={{
          title: {},
          subTitle: {},
          type: {},
          avatar: {},
          content: {},
          actions: {},
        }}
        dataSource={data}
      />
    </CommonCard>
  );
};

export default TradeManage;
