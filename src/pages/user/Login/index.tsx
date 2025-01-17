import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import Cookie from 'js-cookie';
import type { CSSProperties } from 'react';
import { useHistory, useIntl, useModel } from 'umi';
import services from '@/services';
import logo from '@/assets/images/logohome.png';
import './style.less';

const { Link, Text } = Typography;

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

export default () => {
  const history = useHistory();
  const intl = useIntl();
  return (
    <div
      style={{
        backgroundColor: '#fff',
        height: '100vh',
      }}
      className="mmotel-login-form"
    >
      <LoginFormPage
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        logo={logo}
        onFinish={async (values) => {
          await services.UserController.accountLogin(values);
          Cookie.set('emailAddress', values?.emailAddress);
          history.push('/pms/store');
        }}
      >
        <ProFormText
          name="emailAddress"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          initialValue={Cookie.get('emailAddress')}
          placeholder={intl.formatMessage({ id: '请输入邮箱账号' })}
          rules={[
            {
              required: true,
              message: `${intl.formatMessage({ id: '请输入邮箱账号' })}!`,
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={intl.formatMessage({ id: '请输入密码' })}
          rules={[
            {
              required: true,
              message: `${intl.formatMessage({ id: '请输入密码' })}!`,
            },
          ]}
        />
        <div
          style={{
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Link
            onClick={() => {
              history.push('/user/regist');
            }}
          >
            {intl.formatMessage({ id: '注册账号' })}
          </Link>
          <Text
            style={{ cursor: 'pointer' }}
            type="secondary"
            onClick={() => {
              history.push('/user/reset_password');
            }}
          >
            {intl.formatMessage({ id: '忘记密码' })}
          </Text>
        </div>
      </LoginFormPage>
    </div>
  );
};
