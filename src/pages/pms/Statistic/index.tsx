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
  console.log(pathname);
  return (
    <Layout>
      <Sider width={200} collapsed={false} theme="light">
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
          {access.canSeeRouter({ mainMenuId: 5 }) ? (
            <SubMenu
              key="statistic"
              icon={<AppstoreAddOutlined />}
              title={intl.formatMessage({ id: '数据汇总' })}
            >
              {access.canSeeSubMenu(18) ? (
                <Menu.Item key="/pms/statistic/statistic-payment">
                  {intl.formatMessage({ id: '收款汇总' })}
                </Menu.Item>
              ) : null}
              {access.canSeeSubMenu(17) ? (
                <Menu.Item key="/pms/statistic/statistic-trade">
                  {intl.formatMessage({ id: '营业汇总' })}
                </Menu.Item>
              ) : null}
              {/* {access.canSeeSubMenu(20) ? (
                <Menu.Item key="/pms/statistic/statistic-trade-room">
                  {intl.formatMessage({ id: '客房营业汇总' })}
                </Menu.Item>
              ) : null} */}
              {/* {access.canSeeSubMenu(19) ? (
                <Menu.Item key="/pms/statistic/statistic-channel">
                  {intl.formatMessage({ id: '渠道汇总' })}
                </Menu.Item>
              ) : null} */}
            </SubMenu>
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

export default SettingContainer;
