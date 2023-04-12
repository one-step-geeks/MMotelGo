import React from 'react';
import { useHistory, useIntl } from 'umi';
import { Typography, Layout, Menu } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const OrderContainer: React.FC = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const pathname = history.location.pathname;

  return (
    <Layout>
      <Sider width={200} collapsed={false} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={['order']}
          onSelect={(info) => {
            const { key } = info;
            history.push(key);
          }}
        >
          <SubMenu
            key="order"
            icon={<FileDoneOutlined />}
            title={intl.formatMessage({ id: '订单管理' })}
          >
            <Menu.Item key="/pms/order/all">
              {intl.formatMessage({ id: '所有订单' })}
            </Menu.Item>
            {/* <Menu.Item key="/pms/order/unarrange">
              {intl.formatMessage({ id: '未排房' })}
            </Menu.Item> */}
            {/* <Menu.Item key="/pms/order/unhandle">未处理</Menu.Item> */}
          </SubMenu>
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

export default OrderContainer;
