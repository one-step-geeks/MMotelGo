import { MailOutlined, KeyOutlined, TagOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Form, Button, Typography } from 'antd';
import { emailPattern } from '@/constants';
import { useHistory, useIntl } from 'umi';
// import { useState } from 'react';
import services from '@/services';
import logo from '@/assets/images/logohome.png';

const { Link } = Typography;

export default () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const intl = useIntl();

  return (
    <div style={{ backgroundColor: '#fff' }} className="mmotel-login-form">
      <div className="reset-step-wrap">
        <LoginForm
          form={form}
          preserve={true}
          size="large"
          logo={logo}
          subTitle={intl.formatMessage({ id: '重置密码' })}
          submitter={{
            render: () => {
              return (
                <>
                  <Button
                    type="primary"
                    block
                    style={{ marginBottom: 24 }}
                    onClick={async () => {
                      try {
                        const values = await form.validateFields();
                        if (values?.password !== values?.confirmPassword) {
                          return message.error(
                            intl.formatMessage({ id: '两次输入密码不一致' }),
                          );
                        }
                        await services.UserController.accountResetPassword(
                          values,
                        );
                        message.success(
                          intl.formatMessage({
                            id: '密码重置成功，请重新登录！',
                          }),
                        );
                        history.push('/user/login');
                      } catch (error) {}
                    }}
                  >
                    {intl.formatMessage({ id: '重置密码' })}
                  </Button>
                  <Link href="#/user/login">
                    {intl.formatMessage({ id: '返回' })}
                  </Link>
                </>
              );
            },
          }}
        >
          <ProFormCaptcha
            fieldProps={{
              prefix: <MailOutlined />,
            }}
            captchaProps={{
              type: 'primary',
            }}
            placeholder={intl.formatMessage({ id: '请输入邮箱账号' })}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${intl.formatMessage({ id: '获取验证码' })}`;
              }
              return intl.formatMessage({ id: '验证邮箱' });
            }}
            name="emailAddress"
            phoneName="emailAddress"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: '请输入邮箱账号' }),
              },
              {
                pattern: emailPattern,
                message: intl.formatMessage({ id: '邮箱账号格式不正确' }),
                validateTrigger: 'blur',
              },
            ]}
            onGetCaptcha={async (value) => {
              if (!emailPattern.test(value)) {
                return Promise.reject(
                  intl.formatMessage({ id: '邮箱账号格式不正确' }),
                );
              }
              await services.UserController.accountForgotEmail({
                emailAddress: value,
              });
              message.success(
                intl.formatMessage({ id: '邮箱验证码发送成功！' }),
              );
              return Promise.resolve();
            }}
          />
          <ProFormText
            name="confirmCode"
            fieldProps={{
              prefix: <TagOutlined />,
            }}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: '请输入邮箱验证码' }),
              },
            ]}
            placeholder={intl.formatMessage({ id: '请输入邮箱验证码' })}
          />
          <ProFormText
            name="password"
            fieldProps={{
              type: 'password',
              prefix: <KeyOutlined />,
            }}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: '请输入新用户密码' }),
              },
            ]}
            placeholder={intl.formatMessage({ id: '请输入新用户密码' })}
          />
          <ProFormText
            name="confirmPassword"
            fieldProps={{
              type: 'password',
              prefix: <KeyOutlined />,
            }}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: '请确认新用户密码' }),
              },
            ]}
            placeholder={intl.formatMessage({ id: '请确认新用户密码' })}
          />
        </LoginForm>
      </div>
    </div>
  );
};
