import { MailOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, Button, Typography } from 'antd';
import { emailPattern } from '@/constants';
import services from '@/services';
import { useHistory, useIntl, setLocale } from 'umi';
import logo from '@/assets/images/logohome.png';

const { Link } = Typography;

export default () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const intl = useIntl();
  return (
    <div style={{ backgroundColor: 'white' }} className="mmotel-login-form">
      <LoginForm
        form={form}
        size="large"
        logo={logo}
        subTitle={intl.formatMessage({ id: '账号注册' })}
        submitter={{
          render: () => {
            return (
              <>
                <Button
                  type="primary"
                  block
                  style={{ marginBottom: 24 }}
                  onClick={async () => {
                    const values = await form.validateFields();
                    await services.UserController.accountRegister(values);
                    history.push('/user/regist-success?type=email');
                  }}
                >
                  {intl.formatMessage({ id: '注册' })}
                </Button>
                <Link href="#/user/login">
                  {intl.formatMessage({ id: '返回' })}
                </Link>
              </>
            );
          },
        }}
      >
        <ProFormText
          fieldProps={{
            prefix: <UserOutlined />,
            maxLength: 50,
          }}
          name="nickName"
          placeholder={intl.formatMessage({ id: '请输入用户昵称' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: '请输入用户昵称' }),
            },
          ]}
        />
        <ProFormText
          fieldProps={{
            prefix: <MailOutlined />,
            maxLength: 50,
          }}
          name="emailAddress"
          placeholder={intl.formatMessage({ id: '请输入邮箱账号' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: '请输入邮箱账号' }),
            },
            {
              pattern: emailPattern,
              message: intl.formatMessage({ id: '邮箱账号格式不正确' }),
            },
          ]}
        />
        <ProFormText
          name="password"
          fieldProps={{
            type: 'password',
            prefix: <KeyOutlined />,
            maxLength: 50,
          }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: '请输入密码' }),
            },
          ]}
          placeholder={intl.formatMessage({ id: '请输入密码' })}
        />
        {/* <ProFormText
          name="confirmPassword"
          fieldProps={{
            type: 'password',
            prefix: <KeyOutlined />,
          }}
          rules={[
            {
              required: true,
              message: '请确认用户密码',
            },
          ]}
          placeholder="请确认用户密码"
        /> */}
      </LoginForm>
    </div>
  );
};
