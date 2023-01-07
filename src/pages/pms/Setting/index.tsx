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
      <Sider width={240} collapsed={false} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={[
            pathname?.split('/pms/setting/')?.[1]?.split('-')?.[0],
          ]}
          onClick={(info) => {
            const { key } = info;
            history.push(key);
          }}
        >
          {access.canSeeRouter({ mainMenuId: 6 }) ? (
            <SubMenu
              key="channel"
              icon={<AppstoreAddOutlined />}
              title={intl.formatMessage({ id: '渠道管理' })}
            >
              {access.canSeeSubMenu(18) ? (
                <Menu.Item key="/pms/setting/channel-manage">
                  {intl.formatMessage({ id: '渠道设置' })}
                </Menu.Item>
              ) : null}
              {access.canSeeSubMenu(18) ? (
                <Menu.Item key="/pms/setting/channel-mail-manage">
                  {intl.formatMessage({ id: '渠道邮箱配置' })}
                </Menu.Item>
              ) : null}
            </SubMenu>
          ) : null}
          {access.canSeeRouter({ mainMenuId: 7 }) ? (
            <SubMenu
              key="rooms"
              icon={<UserOutlined />}
              title={intl.formatMessage({ id: '住宿设置' })}
            >
              {access.canSeeSubMenu(19) ? (
                <Menu.Item key="/pms/setting/rooms-manage">
                  {intl.formatMessage({ id: '房型房间设置' })}
                </Menu.Item>
              ) : null}
              {access.canSeeSubMenu(20) ? (
                <Menu.Item key="/pms/setting/rooms-group">
                  {intl.formatMessage({ id: '房间分组设置' })}
                </Menu.Item>
              ) : null}
              {access.canSeeSubMenu(21) ? (
                <Menu.Item key="/pms/setting/rooms-sort">
                  {intl.formatMessage({ id: '排序设置' })}
                </Menu.Item>
              ) : null}
              {access.canSeeSubMenu(22) ? (
                <Menu.Item key="/pms/setting/consumer-item">
                  {intl.formatMessage({ id: '消费项设置' })}
                </Menu.Item>
              ) : null}
              {/* <Menu.Item key="/pms/setting/rooms-hour">钟点房设置</Menu.Item> */}
            </SubMenu>
          ) : null}
          {access.canSeeRouter({ mainMenuId: 8 }) ? (
            <SubMenu
              key="price"
              icon={<LaptopOutlined />}
              title={intl.formatMessage({ id: '房价设置' })}
            >
              {access.canSeeSubMenu(23) ? (
                <Menu.Item key="/pms/setting/price-manage">
                  {intl.formatMessage({ id: '房价管理' })}
                </Menu.Item>
              ) : null}
              {access.canSeeSubMenu(24) ? (
                <Menu.Item key="/pms/setting/price-batch">
                  {intl.formatMessage({ id: '批量改价' })}
                </Menu.Item>
              ) : null}
              {access.canSeeSubMenu(25) ? (
                <Menu.Item key="/pms/setting/price-log">
                  {intl.formatMessage({ id: '改价记录' })}
                </Menu.Item>
              ) : null}
            </SubMenu>
          ) : null}
          {access.canSeeRouter({ mainMenuId: 12 }) ? (
            <SubMenu
              key="shop"
              icon={<NotificationOutlined />}
              title={intl.formatMessage({ id: '门店设置' })}
            >
              {access.canSeeSubMenu(30) ? (
                <Menu.Item key="/pms/setting/shop-manage">
                  {intl.formatMessage({ id: '门店设置' })}
                </Menu.Item>
              ) : null}
            </SubMenu>
          ) : null}
          {access.canSeeRouter({ mainMenuId: 10 }) ? (
            <SubMenu
              key="financial"
              icon={<MoneyCollectOutlined />}
              title={intl.formatMessage({ id: '财务设置' })}
            >
              {access.canSeeSubMenu(27) ? (
                <Menu.Item key="/pms/setting/financial-payment">
                  {intl.formatMessage({ id: '收款方式设置' })}
                </Menu.Item>
              ) : null}
              {access.canSeeSubMenu(28) ? (
                <Menu.Item key="/pms/setting/financial-note">
                  {intl.formatMessage({ id: '记一笔设置' })}
                </Menu.Item>
              ) : null}
            </SubMenu>
          ) : null}
          {access.canSeeRouter({ mainMenuId: 9 }) ? (
            <SubMenu
              key="account"
              icon={<MoneyCollectOutlined />}
              title={intl.formatMessage({ id: '账号管理' })}
            >
              {access.canSeeSubMenu(26) ? (
                <Menu.Item key="/pms/setting/account-list">
                  {intl.formatMessage({ id: '账号列表' })}
                </Menu.Item>
              ) : null}
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
