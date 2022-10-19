import { MailOutlined, KeyOutlined, TagOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Form, Button, Typography } from 'antd';
import { emailPattern } from '@/constants';
import { useState } from 'react';

const { Link } = Typography;

export default () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  return (
    <div style={{ backgroundColor: '#fff' }}>
      <div className="reset-step-wrap">
        {step === 0 ? (
          <LoginForm
            form={form}
            preserve={true}
            size="large"
            logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
            title="MotelGo"
            subTitle="重置密码"
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
                        console.log(values);
                        setStep(1);
                      }}
                    >
                      重置密码
                    </Button>
                    <Link href="#/user/login">返回</Link>
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
              placeholder={'请输入邮箱账号'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`;
                }
                return '验证邮箱';
              }}
              name="email"
              phoneName="email"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱账号',
                },
                {
                  pattern: emailPattern,
                  message: '邮箱账号格式不正确',
                  validateTrigger: 'blur',
                },
              ]}
              onGetCaptcha={async (value) => {
                if (!emailPattern.test(value)) {
                  return Promise.reject('邮箱账号格式不正确');
                }
                message.success('邮箱验证码发送成功！');
                return Promise.resolve();
              }}
            />
            <ProFormText
              name="validCode"
              fieldProps={{
                prefix: <TagOutlined />,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入邮箱验证码',
                },
              ]}
              placeholder="请输入邮箱验证码"
            />
          </LoginForm>
        ) : null}
        {step === 1 ? (
          <LoginForm
            form={form}
            size="large"
            logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
            title="MotelGo"
            subTitle="全球最大酒店管理平台"
            submitter={{
              render: () => {
                return (
                  <Button
                    type="primary"
                    block
                    onClick={async () => {
                      const values = await form.validateFields();
                      console.log(values);
                    }}
                  >
                    确定
                  </Button>
                );
              },
            }}
          >
            <ProFormText
              name="password"
              fieldProps={{
                type: 'password',
                prefix: <KeyOutlined />,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入用户密码',
                },
              ]}
              placeholder="请输入用户密码"
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
                  message: '请再次输入用户密码',
                },
              ]}
              placeholder="请再次输入用户密码"
            />
          </LoginForm>
        ) : null}
      </div>
    </div>
  );
};
