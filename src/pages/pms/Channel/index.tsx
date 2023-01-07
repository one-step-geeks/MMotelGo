import React from 'react';
import { useHistory, useIntl, useAccess } from 'umi';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  MoneyCollectOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const ChannelContainer: React.FC = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const access = useAccess();
  const pathname = history.location.pathname;
  return (
    <Layout>
      <Sider width={160} collapsed={false} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={[
            pathname?.split('/pms/channel/')?.[1]?.split('-')?.[0],
          ]}
          onClick={(info) => {
            const { key } = info;
            history.push(key);
          }}
        >
          {access.canSeeSubMenu(18) ? (
            <Menu.Item key="/pms/channel/channel-list">
              {intl.formatMessage({ id: '渠道列表' })}
            </Menu.Item>
          ) : null}
          {access.canSeeSubMenu(17) ? (
            <Menu.Item key="/pms/channel/channel-origin">
              {intl.formatMessage({ id: '渠道单来源' })}
            </Menu.Item>
          ) : null}
        </Menu>
      </Sider>
      <Layout>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 'calc(100vh - 48px)',
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChannelContainer;
