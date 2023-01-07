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

const SettingContainer: React.FC = (props) => {
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
            pathname?.split('/pms/statistic/')?.[1]?.split('-')?.[0],
          ]}
          onClick={(info) => {
            const { key } = info;
            history.push(key);
          }}
        >
          <Menu.Item key="/pms/statistic/payment-manage">
            {intl.formatMessage({ id: '收款汇总' })}
          </Menu.Item>
          <Menu.Item key="/pms/statistic/trade-manage">
            {intl.formatMessage({ id: '营业汇总' })}
          </Menu.Item>
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

export default SettingContainer;
